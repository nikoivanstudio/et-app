import { Prisma } from 'generated/prisma/client';

import { getAllLandings } from '@/entities/landing/lib/landing-registry';
import type { Landing } from '@/entities/landing/model/types';
import { type PlaceEntity } from '@/entities/place/domain';
import {
  placeToPlaceEntity,
  tourToPlaceTourCard
} from '@/entities/place/domain';
import { placeRepositories } from '@/entities/place/repositories/place';
import { PUBLIC_TOUR_STATUS } from '@/entities/tour/domain';

import { dbClient } from '@/shared/lib/db';

import { buildLandingWhere } from '@/kernel/linking/lib/landing-where';

/**
 * Перелинковка по правилам, а не руками (задача E7).
 *
 * На полутора сотнях страниц ручные ссылки не поддерживаются: их забывают
 * проставить у нового объекта, забывают снять у удалённого, и через
 * полгода половина блоков «смотрите также» ведёт в никуда. Поэтому связи
 * строятся из данных: объект ↔ туры, которые сюда заезжают; гео ↔ объекты
 * в радиусе; тур ↔ гид; посадочная ↔ соседние посадочные.
 *
 * Всё, что здесь считается, считается из базы и реестра посадочных.
 * Единственная константа — предположение о скорости, и оно вынесено
 * в именованную величину с объяснением.
 */

/** Радиус Земли, км. */
const EARTH_RADIUS_KM = 6371;

/**
 * Поправка на дорогу: по прямой в горах не ездит никто.
 *
 * Коэффициент к расстоянию по прямой. 1,4 — обычная величина для горной
 * местности с серпантинами; по крымским предгорьям это даёт ошибку в
 * пределах нескольких километров, что для фразы «примерно 18 км»
 * допустимо. Точный километраж считается по маршрутизатору, и если он
 * когда-нибудь появится — заменяется здесь одной функцией.
 */
const ROAD_FACTOR = 1.4;

/**
 * Средняя скорость на смешанном маршруте, км/ч.
 *
 * Не шоссейная: половина пути идёт по грунтовкам и подъёмам, где больше
 * тридцати не едут. Завышенная оценка времени в пути хуже заниженной:
 * человек планирует день по этой цифре.
 */
const AVERAGE_SPEED_KMH = 35;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Расстояние по прямой между двумя точками, км. */
export const haversineKm = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): number => {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
};

export type NearbyPlace = {
  place: PlaceEntity;
  /** Расстояние по дороге, км (оценка). */
  distanceKm: number;
  /** Время в пути, минуты (оценка). */
  driveMinutes: number;
};

const hasCoordinates = (
  place: PlaceEntity
): place is PlaceEntity & { latitude: number; longitude: number } =>
  place.latitude != null && place.longitude != null;

/**
 * Объекты рядом с данным.
 *
 * Без координат объект в подборку не попадает и подборки не получает:
 * выдуманное расстояние на странице хуже отсутствующего блока.
 */
export const getNearbyPlaces = async (
  place: PlaceEntity,
  limit = 6
): Promise<NearbyPlace[]> => {
  if (!hasCoordinates(place)) {
    return [];
  }

  const records = await placeRepositories.getPublishedPlaces();

  return records
    .map(placeToPlaceEntity)
    .filter(hasCoordinates)
    .filter(candidate => candidate.id !== place.id)
    .map(candidate => {
      const distanceKm = haversineKm(place, candidate) * ROAD_FACTOR;

      return {
        place: candidate,
        distanceKm: Math.round(distanceKm),
        driveMinutes: Math.max(
          5,
          Math.round((distanceKm / AVERAGE_SPEED_KMH) * 60)
        )
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
};

/** Объекты посадочной — по слагам из её описания. */
export const getLandingPlaces = async (
  landing: Landing
): Promise<PlaceEntity[]> => {
  if (!landing.placeSlugs?.length) {
    return [];
  }

  const records = await placeRepositories.getPublishedPlaces({
    where: { slug: { in: landing.placeSlugs } }
  });

  const places = records.map(placeToPlaceEntity);

  // Порядок берём из описания посадочной, а не из базы: он осмысленный —
  // сначала то, ради чего в этот город едут.
  return landing.placeSlugs
    .map(slug => places.find(place => place.slug === slug))
    .filter((place): place is PlaceEntity => !!place);
};

/**
 * Туры для посадочной.
 *
 * Два правила и именно в этом порядке: сначала туры, которые выезжают
 * из этого города, затем — заезжающие на перечисленные объекты. Второе
 * нужно для форматных страниц (E5), у которых города нет вовсе.
 *
 * Запрос идёт к турам, а не к `tour_place`, и это исправление, а не
 * перестановка. Раньше подборка строилась обходом связей с объектами,
 * то есть **тур без единого привязанного объекта не попадал на страницу
 * своего города даже при совпадении города выезда**. В Крыму со
 * справочником на 780 объектов это незаметно; в регионе, где объекты ещё
 * не заведены, гео-страницы пустовали бы с первого дня — при том что туры
 * оттуда есть. Теперь условия сложены через `OR`: выезжает отсюда **или**
 * заезжает на объект.
 *
 * Как складываются условия для каждого вида посадочной и почему форматная
 * страница берёт весь регион — в `kernel/linking/lib/landing-where.ts`.
 */
export const getLandingTours = async (landing: Landing) => {
  const placeSlugs = landing.placeSlugs ?? [];

  // Подбор идёт по цели связки, а показ объектов — по всему списку:
  // у «Из Ялты в Большой каньон» в списке стоит ещё и Ай-Петри, через
  // который идёт дорога, и по нему на страницу каньона попадал тур,
  // который в каньон не спускается.
  const matchSlugs = landing.destinationSlugs ?? placeSlugs;

  const byCity: Prisma.TourWhereInput | undefined = landing.citySlug
    ? { startCityRef: { slug: landing.citySlug } }
    : undefined;

  const byPlace: Prisma.TourWhereInput | undefined = matchSlugs.length
    ? { places: { some: { place: { slug: { in: matchSlugs } } } } }
    : undefined;

  const where = buildLandingWhere(landing, byCity, byPlace);

  // Подбирать не по чему: города нет, объектов нет — или связка задана
  // наполовину. Без этой проверки пустое условие вернуло бы вообще все
  // опубликованные туры.
  if (!where) {
    return [];
  }

  const rows = await dbClient.tour.findMany({
    where: { status: PUBLIC_TOUR_STATUS, ...where },
    // Порядок внутри группы задаётся номером остановки, но у форматной
    // страницы объектов нет и все номера равны нулю. Без сортировки
    // в запросе порядок туров на такой странице определяла бы база,
    // то есть он менялся бы от перестройки к перестройке.
    orderBy: { id: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      duration: true,
      mainPhotoId: true,
      photos: { select: { id: true, source: true } },
      startCityRef: { select: { slug: true } },
      // Номер остановки нужен только для порядка внутри второй группы,
      // поэтому берём первый совпавший объект, а не весь маршрут.
      places: {
        where: { place: { slug: { in: matchSlugs } } },
        orderBy: { position: 'asc' },
        take: 1,
        select: { position: true }
      }
    }
  });

  return rows
    .map(tour => ({
      card: tourToPlaceTourCard(tour, tour.places[0]?.position ?? 0),
      // 0 — выезжает отсюда, 1 — только заезжает. Порядок групп тот же,
      // что был: город важнее объекта. У посадочной без города групп нет:
      // сравнение `undefined === undefined` иначе поднимало бы наверх туры
      // вообще без города выезда.
      group:
        landing.citySlug && tour.startCityRef?.slug === landing.citySlug ? 0 : 1
    }))
    .sort((a, b) => a.group - b.group || a.card.position - b.card.position)
    .map(item => item.card);
};

/**
 * Соседние посадочные.
 *
 * Родство определяется данными: общий город выезда либо общий объект.
 * Ручной список «смотрите также» на два десятка страниц прожил бы
 * ровно до первой правки.
 */
export const getRelatedLandings = (landing: Landing, limit = 4): Landing[] => {
  const places = new Set(landing.placeSlugs ?? []);

  return getAllLandings()
    .filter(candidate => candidate.path !== landing.path)
    .map(candidate => {
      const sharedPlaces = (candidate.placeSlugs ?? []).filter(slug =>
        places.has(slug)
      ).length;
      const sameCity =
        !!landing.citySlug && candidate.citySlug === landing.citySlug;

      return { candidate, score: sharedPlaces + (sameCity ? 2 : 0) };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.candidate);
};

export const linkingService = {
  getNearbyPlaces,
  getLandingPlaces,
  getLandingTours,
  getRelatedLandings
};
