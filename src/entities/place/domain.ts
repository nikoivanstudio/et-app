import type { Place, Tour } from 'generated/prisma/client';

/**
 * Объект на карте: пещерный город, каньон, плато, дворец.
 *
 * Задача E1. До неё справочник жил в модели `Post` вперемешку со статьями,
 * и «Мангуп-Кале» был текстом, а не сущностью: привязать к нему туры,
 * посчитать, что рядом, или собрать страницу «туры сюда» было нечем.
 * Отсюда и структура сайта, где 780 из 868 адресов лежат в корне одним
 * уровнем и никуда не ведут.
 */
export type PlaceEntity = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
  kind?: string;
  mainImage?: string;
  /** Статья справочника об этом объекте, если она есть. */
  postId?: number;
  updatedAt?: Date;
  createdAt: Date;
};

/** Карточка тура в блоке «туры, которые сюда заезжают». */
export type PlaceTourCard = {
  id: number;
  slug: string;
  title: string;
  price: number;
  duration: number;
  mainPhoto?: string;
  /** Номер остановки в маршруте: по нему туры и сортируются. */
  position: number;
};

const nullable = <T>(value: T | null): T | undefined => value ?? undefined;

export const placeToPlaceEntity = (place: Place): PlaceEntity => ({
  id: place.id,
  slug: place.slug,
  title: place.title,
  description: nullable(place.description),
  content: nullable(place.content),
  latitude: nullable(place.latitude),
  longitude: nullable(place.longitude),
  city: nullable(place.city),
  district: nullable(place.district),
  kind: nullable(place.kind),
  mainImage: nullable(place.mainImage),
  postId: nullable(place.postId),
  createdAt: place.createdAt,
  updatedAt: nullable(place.updatedAt)
});

type TourWithPhotos = Pick<
  Tour,
  'id' | 'slug' | 'title' | 'price' | 'duration' | 'mainPhotoId'
> & {
  photos?: { id: number; source: string }[];
};

export const tourToPlaceTourCard = (
  tour: TourWithPhotos,
  position: number
): PlaceTourCard => ({
  id: tour.id,
  slug: tour.slug,
  title: tour.title,
  price: tour.price,
  duration: tour.duration,
  mainPhoto: tour.photos?.find(photo => photo.id === tour.mainPhotoId)?.source,
  position
});

/**
 * Годится ли объект к публикации.
 *
 * Без названия и слага страница `/mesta/{slug}` не собирается: в первом
 * случае пустой H1, во втором — адреса просто нет. Проверка нужна на
 * импорте справочника, где часть записей заводится наполовину.
 */
export const isPlacePublishable = (place: PlaceEntity): boolean =>
  !!place.title.trim() && !!place.slug.trim();
