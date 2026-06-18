import { Prisma } from 'generated/prisma/client';

import { placeEntitySchema } from '@/entities/tour/lib/validation-schemas';
import {
  toTourContent,
  TourContent} from '@/entities/tour/model/content';
import { tourTypeguards } from '@/entities/tour/model/typeguards';

import { objectUtils } from '@/shared/lib/object-utils';
import { WithoutNull } from '@/shared/model/types';

// Жизненный цикл тура: гид отправляет на модерацию (PENDING), администратор
// одобряет (APPROVED — тур виден публично) или отклоняет (REJECTED).
export enum TourStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const TOUR_STATUS_LABELS: Record<string, string> = {
  [TourStatus.PENDING]: 'На модерации',
  [TourStatus.APPROVED]: 'Опубликован',
  [TourStatus.REJECTED]: 'Отклонён'
};

// Публично видны только одобренные туры.
export const PUBLIC_TOUR_STATUS = TourStatus.APPROVED;

type PhotoEntity = {
  title: string;
  source: string;
  authorId: number;
};

type PlaceEntity = {
  id: number;
  title: string;
  coordinates: [number, number];
  yandexLink: string;
};

export type TourEntity = {
  id: number;
  title: string;
  description: string;
  mainPhoto: PhotoEntity;
  content: TourContent;
  price: number;
  duration: number;
  categories: string[];
  photos: PhotoEntity[];
  rating?: number;
  descriptionText?: string;
  startPlace?: PlaceEntity;
  authorId: number;
  status?: string;
  tags?: string[];
  rejectionComment?: string;
};

export function tourToTourEntity(
  tour: Prisma.TourGetPayload<{
    include: {
      photos: true;
    };
  }>
): WithoutNull<TourEntity> {
  const { mainPhotoId, photos, startPlace, content, ...rest } = tour;

  if (
    !Array.isArray(photos) ||
    photos.some(photo => !tourTypeguards.isPhotoEntity(photo))
  ) {
    throw new Error('Сущность photos - имеет неверный тип данных');
  }

  const mainPhoto = photos.find(photo => photo.id === mainPhotoId);

  if (!mainPhoto) {
    console.warn('Error of main photo id: ' + mainPhotoId);
  }

  const tourEntity = objectUtils.makeWithoutNull(rest);
  const checkedStartPlace = placeEntitySchema.safeParse(startPlace);

  return {
    ...tourEntity,
    content: toTourContent(content),
    startPlace: checkedStartPlace.success ? checkedStartPlace.data : undefined,
    mainPhoto,
    photos
  } as WithoutNull<TourEntity>;
}
