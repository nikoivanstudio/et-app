import { Prisma, Tour } from 'generated/prisma/client';

import { CreateTourData } from '@/features/tour/domain';

import { PhotoDomain } from '@/entities/photo';

import { dbClient } from '@/shared/lib/db';

import { TourOmit } from '../../../../generated/prisma/models/Tour';
import TourSelect = Prisma.TourSelect;

type Payload<T extends Prisma.TourFindManyArgs> = Prisma.TourGetPayload<T>;

const getToursCount = (where?: Prisma.TourWhereInput) =>
  dbClient.tour.count({ where });

const getTour = (id: number, select?: TourSelect): Promise<Tour | null> =>
  dbClient.tour.findUnique({
    where: {
      id
    },
    select
  });

const getTours = <T extends Prisma.TourFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.TourFindManyArgs>
): Promise<Payload<T>[]> =>
  dbClient.tour.findMany(
    args
      ? {
          ...(args as Prisma.TourFindManyArgs)
        }
      : {
          omit: {
            author: { passwordHash: true, login: true }
          } as unknown as TourOmit
        }
  ) as unknown as Promise<Payload<T>[]>;

const createTour = async (
  data: Omit<CreateTourData, 'mainPhoto' | 'photos'> & {
    authorId: number;
    mainPhoto: Omit<PhotoDomain.PhotoEntity, 'id'>;
    photos?: Omit<PhotoDomain.PhotoEntity, 'id'>[];
  }
): Promise<Prisma.TourGetPayload<{
  include: {
    photos: true;
  };
}> | null> =>
  dbClient.$transaction(async prisma => {
    const {
      mainPhoto: mainPhotoEntity,
      photos: photosEntities,
      content,
      ...rest
    } = data;
    const mainPhoto = await prisma.photo.create({ data: mainPhotoEntity });

    if (!mainPhoto) {
      throw new Error('Ошибка при создание основного фото тура');
    }

    return prisma.tour.create({
      data: {
        ...rest,
        content: content as Prisma.InputJsonValue,
        mainPhotoId: mainPhoto.id,
        photos: {
          create: photosEntities,
          connect: {
            id: mainPhoto.id
          }
        }
      },
      include: {
        photos: true
      }
    });
  });

const updateTour = (
  tour: Partial<Omit<CreateTourData, 'mainPhoto' | 'photos'>> & {
    id: number;
    authorId: number;
    mainPhoto?: Omit<PhotoDomain.PhotoEntity, 'id'>;
    photos?: Omit<PhotoDomain.PhotoEntity, 'id'>[];
  }
): Promise<Tour> =>
  dbClient.$transaction(async prisma => {
    const { id, mainPhoto, photos, content, ...rest } = tour;
    let mainPhotoId: number | undefined;

    if (mainPhoto) {
      const createdMainPhoto = await prisma.photo.create({ data: mainPhoto });

      mainPhotoId = createdMainPhoto.id;
    }

    if (photos?.length) {
      await Promise.all(
        photos.map(photo =>
          prisma.photo.create({
            data: {
              ...photo,
              tourId: id
            }
          })
        )
      );
    }

    return prisma.tour.update({
      where: {
        id
      },
      data: {
        ...rest,
        startPlace: rest.startPlace,
        ...(content ? { content: content as Prisma.InputJsonValue } : {}),
        ...(mainPhotoId ? { mainPhotoId } : {})
      }
    });
  });

const deleteTour = async (id: number): Promise<Tour | null> =>
  dbClient.tour.delete({
    where: {
      id
    }
  });

// Туры в указанном статусе вместе с автором — для очереди модерации.
const getToursByStatus = (status: string) =>
  dbClient.tour.findMany({
    where: { status },
    include: {
      photos: true,
      author: { omit: { passwordHash: true, salt: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

// Решение модератора: смена статуса (+ комментарий при отклонении).
const moderateTour = (
  id: number,
  data: { status: string; rejectionComment?: string | null }
): Promise<Tour> => dbClient.tour.update({ where: { id }, data });

export const tourRepositories = {
  getToursCount,
  getTour,
  getTours,
  createTour,
  updateTour,
  deleteTour,
  getToursByStatus,
  moderateTour
};
