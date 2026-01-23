import { dbClient } from '@/shared/lib/db';
import { CreateTourData } from '@/features/tour/domain';
import { PhotoDomain } from '@/entities/photo';
import { Prisma, Tour } from 'generated/prisma/client';
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
          ...(args as Prisma.TourFindManyArgs),
          omit: {
            author: { passwordHash: true, login: true }
          } as unknown as TourOmit
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
      ...rest
    } = data;
    const mainPhoto = await prisma.photo.create({ data: mainPhotoEntity });

    if (!mainPhoto) {
      throw new Error('Ошибка при создание основного фото тура');
    }

    return prisma.tour.create({
      data: {
        ...rest,
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
  dbClient.tour.update({
    where: {
      id: tour.id
    },
    data: { ...(tour as Partial<Tour>), startPlace: tour.startPlace }
  });

const deleteTour = async (id: number): Promise<Tour | null> =>
  dbClient.tour.delete({
    where: {
      id
    }
  });

export const tourRepositories = {
  getToursCount,
  getTour,
  getTours,
  createTour,
  updateTour,
  deleteTour
};
