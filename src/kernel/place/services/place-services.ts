import {
  type PlaceEntity,
  placeToPlaceEntity,
  type PlaceTourCard,
  tourToPlaceTourCard
} from '@/entities/place/domain';
import { placeRepositories } from '@/entities/place/repositories/place';

import { Either, left, right } from '@/shared/lib/either';
import { buildDescription } from '@/shared/lib/seo/description';
import { PageMetaData } from '@/shared/model/types';

/**
 * Объекты справочника.
 *
 * Ради чего всё: страница объекта — это место, где справочник перестаёт
 * быть энциклопедией и становится воронкой. Человек ищет «Мангуп-Кале»,
 * попадает на описание и видит под ним туры, которые туда заезжают,
 * с ценой и кнопкой. До E1/E2 таких страниц не было вовсе.
 */

export type PlaceView = {
  place: PlaceEntity;
  tours: PlaceTourCard[];
};

const getPlaceBySlug = async (
  slug: string
): Promise<Either<string, PlaceView>> => {
  const record = await placeRepositories.getPlaceBySlug(slug);

  if (!record) {
    return left('Объект с указанным адресом не найден');
  }

  const rows = await placeRepositories.getPlaceTours(record.id);

  return right({
    place: placeToPlaceEntity(record),
    tours: rows.map(row => tourToPlaceTourCard(row.tour, row.position))
  });
};

const getPlaceMetaData = async (
  slug: string
): Promise<Either<string, PageMetaData>> => {
  const record = await placeRepositories.getPlaceBySlug(slug);

  if (!record) {
    return left('Объект с указанным адресом не найден');
  }

  // Тот же фолбэк, что у постов и туров: правило про описание на сайте
  // должно быть одно, а не три.
  return right({
    title: record.title,
    description: buildDescription(record.description, record.content),
    keywords: []
  });
};

const getPublishedPlaces = async (): Promise<PlaceEntity[]> => {
  const records = await placeRepositories.getPublishedPlaces();

  return records.map(placeToPlaceEntity);
};

/** Объект, к которому привязана статья справочника. */
const getPlaceByPostId = async (
  postId: number
): Promise<PlaceEntity | null> => {
  const record = await placeRepositories.getPlaceByPostId(postId);

  return record ? placeToPlaceEntity(record) : null;
};

/** Объекты тура в порядке маршрута. */
const getTourPlaces = async (tourId: number): Promise<PlaceEntity[]> => {
  const rows = await placeRepositories.getTourPlaces(tourId);

  return rows.map(row => placeToPlaceEntity(row.place));
};

/** Города, у которых есть объекты, — для гео-страниц (E3). */
const getPlaceCities = async (): Promise<string[]> => {
  const rows = await placeRepositories.getPlaceCities();

  return rows
    .map(row => row.city)
    .filter((city): city is string => !!city)
    .sort((a, b) => a.localeCompare(b, 'ru'));
};

export const placeServices = {
  getPlaceBySlug,
  getPlaceMetaData,
  getPublishedPlaces,
  getPlaceByPostId,
  getTourPlaces,
  getPlaceCities
};
