import { Prisma } from 'generated/prisma/client';

import { PUBLIC_TOUR_STATUS } from '@/entities/tour/domain';

import { dbClient } from '@/shared/lib/db';

/** Опубликованные объекты: и для раздела, и для sitemap. */
const getPublishedPlaces = (args?: {
  take?: number;
  where?: Prisma.PlaceWhereInput;
}) =>
  dbClient.place.findMany({
    where: { isPublished: true, ...(args?.where ?? {}) },
    orderBy: { title: 'asc' },
    ...(args?.take ? { take: args.take } : {})
  });

/** Ссылки для sitemap: адрес и настоящая дата правки. */
const getPlaceRefs = () =>
  dbClient.place.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true, createdAt: true }
  });

const getPlaceBySlug = (slug: string) =>
  dbClient.place.findFirst({ where: { slug, isPublished: true } });

/** Объект, привязанный к статье справочника, — для разметки на `/{slug}`. */
const getPlaceByPostId = (postId: number) =>
  dbClient.place.findUnique({ where: { postId } });

/**
 * Туры, которые заезжают на объект.
 *
 * Только опубликованные: блок «туры сюда» на странице объекта — это
 * витрина, а не отчёт. Порядок — по номеру остановки в маршруте, иначе
 * список строился бы по алфавиту.
 */
const getPlaceTours = (placeId: number) =>
  dbClient.tourPlace.findMany({
    where: { placeId, tour: { status: PUBLIC_TOUR_STATUS } },
    orderBy: { position: 'asc' },
    select: {
      position: true,
      tour: {
        select: {
          id: true,
          slug: true,
          title: true,
          price: true,
          duration: true,
          mainPhotoId: true,
          photos: { select: { id: true, source: true } }
        }
      }
    }
  });

/** Объекты одного тура — для блока «маршрут» и перелинковки (E7). */
const getTourPlaces = (tourId: number) =>
  dbClient.tourPlace.findMany({
    where: { tourId, place: { isPublished: true } },
    orderBy: { position: 'asc' },
    select: { position: true, place: true }
  });

/** Города, в которых есть объекты, — ось гео-страниц (E3). */
const getPlaceCities = () =>
  dbClient.place.findMany({
    where: { isPublished: true, city: { not: null } },
    select: { city: true },
    distinct: ['city']
  });

export const placeRepositories = {
  getPublishedPlaces,
  getPlaceRefs,
  getPlaceBySlug,
  getPlaceByPostId,
  getPlaceTours,
  getTourPlaces,
  getPlaceCities
};
