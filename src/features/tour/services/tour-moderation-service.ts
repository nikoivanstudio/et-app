import {
  GetPendingToursResponse,
  ModerationTour
} from '@/features/tour/domain';

import {
  TourStatus,
  tourToTourEntity
} from '@/entities/tour/domain';
import { tourRepositories } from '@/entities/tour/repositories/tour';

import { Either, left, right } from '@/shared/lib/either';

import { Prisma, Tour } from '../../../../generated/prisma/client';

type TourWithAuthorAndPhotos = Prisma.TourGetPayload<{
  include: { photos: true; author: true };
}>;

const getPendingTours = async (): Promise<
  Either<string, GetPendingToursResponse>
> => {
  const tours =
    (await tourRepositories.getToursByStatus(
      TourStatus.PENDING
    )) as unknown as TourWithAuthorAndPhotos[];

  if (!tours) {
    return left('Ошибка получения туров на модерации');
  }

  const mapped: ModerationTour[] = tours.map(tour => {
    const entity = tourToTourEntity(tour);

    return {
      ...entity,
      createdAt: tour.createdAt,
      author: tour.author
    } as ModerationTour;
  });

  return right({ tours: mapped });
};

const reviewTour = async ({
  id,
  status,
  comment
}: {
  id: number;
  status: string;
  comment?: string;
}): Promise<Either<string, Tour>> => {
  const tour = await tourRepositories.getTour(id);

  if (!tour) {
    return left('Тур не найден');
  }

  if (tour.status !== TourStatus.PENDING) {
    return left('Тур уже рассмотрен');
  }

  if (status === TourStatus.APPROVED) {
    const approved = await tourRepositories.moderateTour(id, {
      status: TourStatus.APPROVED,
      rejectionComment: null
    });

    return right(approved);
  }

  const rejected = await tourRepositories.moderateTour(id, {
    status: TourStatus.REJECTED,
    rejectionComment: comment ?? null
  });

  return right(rejected);
};

export const tourModerationService = {
  getPendingTours,
  reviewTour
};
