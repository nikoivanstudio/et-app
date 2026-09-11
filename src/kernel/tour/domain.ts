import { ActivityDomain } from '@/entities/activity/server';
import { GeoPointDomain } from '@/entities/geo-point';
import { isGeoPointEntity } from '@/entities/geo-point/lib/typeguadrs';
import { ReviewDomain } from '@/entities/review';
import { toTourContent, TourContent } from '@/entities/tour/model/content';

import type { FaqItem } from '@/shared/lib/seo/json-ld';

import { TourWR } from '@/kernel/tour/model/types';

import { Photo } from '../../../generated/prisma/client';

export type TourKernel = {
  id: number;
  title: string;
  description: string;
  mainPhoto: string;
  price: number;
  slug: string;
  duration: number;
  categories: string[];
  authorId: number;
  photos: Photo[];
  reviews: ReviewDomain.ReviewEntity[];
  activities: ActivityDomain.ActivityEntity[];
  rating: number;
  descriptionText?: string;
  content: TourContent;
  startPlace?: GeoPointDomain.GeoPointEntity;

  // --- Поля из A3 -------------------------------------------------------
  // Нужны и карточке, и разметке: без единицы цены `Offer` обещает
  // неизвестно что, а без города старта не собрать гео-страницы (E3).
  included: string[];
  excluded: string[];
  capacity?: number;
  difficulty?: string;
  faq: FaqItem[];
  seasons: number[];
  priceUnit?: TourPriceUnit;
  startCity?: string;
};

export type TourPriceUnit = 'PER_CAR' | 'PER_PERSON';

const toPriceUnit = (value: string | null): TourPriceUnit | undefined =>
  value === 'PER_CAR' || value === 'PER_PERSON' ? value : undefined;

/**
 * Вопросы и ответы из jsonb.
 *
 * Разбираем с проверкой каждого элемента, а не приведением типа: поле
 * правится редактором через форму, и один кривой объект не должен ронять
 * страницу тура — он просто не попадёт ни в блок, ни в разметку.
 */
const toFaqItems = (raw: unknown): FaqItem[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter(
    (item): item is FaqItem =>
      !!item &&
      typeof item === 'object' &&
      typeof (item as FaqItem).question === 'string' &&
      typeof (item as FaqItem).answer === 'string' &&
      !!(item as FaqItem).question.trim() &&
      !!(item as FaqItem).answer.trim()
  );
};

export function tourToKernelTour(tour: TourWR): TourKernel {
  const {
    mainPhotoId,
    photos,
    rating,
    descriptionText,
    startPlace,
    content,
    capacity,
    difficulty,
    faq,
    priceUnit,
    startCity,
    ...rest
  } = tour;

  const reviews = tour.reviews.length
    ? tour.reviews.map(ReviewDomain.reviewToReviewEntity)
    : [];
  const activities = tour.activities.length
    ? tour.activities.map(ActivityDomain.activityToActivityEntity)
    : [];

  const mainPhoto = photos.find(photo => photo.id === mainPhotoId)?.source;

  if (!mainPhoto) {
    throw new Error('Error of main photo id: ' + mainPhotoId);
  }

  return {
    ...rest,
    content: toTourContent(content),
    rating: rating || 0,
    descriptionText: descriptionText || undefined,
    startPlace:
      startPlace && isGeoPointEntity(startPlace) ? startPlace : undefined,
    capacity: capacity ?? undefined,
    difficulty: difficulty ?? undefined,
    faq: toFaqItems(faq),
    priceUnit: toPriceUnit(priceUnit),
    startCity: startCity ?? undefined,
    reviews,
    activities,
    mainPhoto,
    photos
  };
}
