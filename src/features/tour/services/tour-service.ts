import { DefaultArgs } from '@prisma/client/runtime/client';

import { draftTourToTourCardEntity } from '@/widgets/tours/domain';

import {
  CreateTourData,
  GetToursResponse,
  TourCardEntity
} from '@/features/tour/domain';

import { PhotoDomain } from '@/entities/photo';
import {
  PUBLIC_TOUR_STATUS,
  TourEntity,
  tourToTourEntity
} from '@/entities/tour/domain';
import { tourRepositories } from '@/entities/tour/repositories/tour';
import { Role } from '@/entities/user/domain';

import { dbQueryUtils } from '@/shared/lib/db-client-utils';
import { Either, left, right } from '@/shared/lib/either';

import { Prisma, Tour } from '../../../../generated/prisma/client';
import TourSelect = Prisma.TourSelect;

type UserToursData = {
  authorId: number;
  role: string;
  paginated?: boolean;
} & Prisma.TourFindManyArgs<DefaultArgs>;

const tourCardsSelect = {
  id: true,
  title: true,
  price: true,
  slug: true,
  rating: true,
  duration: true,
  mainPhotoId: true,
  photos: true,
  activities: true,
  reviews: true
};

const getPagesCount = async (where?: Prisma.TourWhereInput) => {
  const count = await tourRepositories.getToursCount(where);

  return Math.ceil(count / 10);
};

const getTour = (id: number, select?: TourSelect) =>
  tourRepositories.getTour(id, select);

const getPopularTourCards = async (): Promise<TourCardEntity[]> => {
  const draftPopularTours = await tourRepositories.getTours({
    where: {
      status: PUBLIC_TOUR_STATUS,
      categories: {
        has: 'popular'
      }
    },
    select: tourCardsSelect,
    take: 4
  });

  return draftPopularTours.map(draftTourToTourCardEntity);
};

/**
 * Карточки каталога.
 *
 * `regionSlug` задаётся разделом, а не выбором посетителя: каталог
 * пререндерится, а чтение cookie в серверном рендере переводит маршрут
 * в динамику и обнуляет ISR — ровно тем, чем это уже оборачивалось
 * в шапке (см. `widgets/app-header/containers/app-header.tsx`). Поэтому
 * регион приходит сверху: у раздела региона он свой и известен на сборке,
 * а на общем каталоге его нет и показываются все опубликованные регионы.
 */
const getTourCards = async (
  params?: Prisma.TourFindManyArgs & { page?: number; regionSlug?: string }
) => {
  const { regionSlug, ...queryParams } = params ?? {};

  // `regionSlug` — не параметр запроса к базе, и остаток может оказаться
  // пустым. Пустой объект отдавать нельзя: `getDbQueryParamsByPage({})`
  // вернёт `take: 10`, и каталог региона молча обрезался бы на десяти
  // турах, тогда как вызов без региона отдаёт все.
  const hasQuery = Object.keys(queryParams).length > 0;

  const dbQueryParams = dbQueryUtils.getDbQueryParamsByPage<
    Prisma.TourInclude | undefined
  >(hasQuery ? queryParams : undefined);

  // Публично показываем только одобренные туры.
  const draftTourCards = await tourRepositories.getTours({
    ...(dbQueryParams ?? {}),
    where: {
      status: PUBLIC_TOUR_STATUS,
      ...(regionSlug ? { startCityRef: { regionSlug } } : {})
    },
    select: tourCardsSelect
  });

  return draftTourCards.map(draftTourToTourCardEntity);
};

// Ссылки на опубликованные туры для sitemap.
//
// Раньше метод назывался getToursIds и выбирал только { id: true }, а
// sitemap строил из этого адреса вида /tour/{id}. Страница тура резолвится
// по slug (tourServices.getTourBySlug), так что каждый такой адрес был 404.
// Даты нужны для честного lastmod.
const getPublishedTourRefs = () =>
  tourRepositories.getTours({
    where: { status: PUBLIC_TOUR_STATUS },
    select: { slug: true, updatedAt: true, createdAt: true }
  });

export const getTours = async (
  params?: Prisma.TourFindManyArgs & { page?: number }
) => {
  const dbQueryParams = dbQueryUtils.getDbQueryParamsByPage<
    Prisma.TourInclude | undefined
  >(params);

  return tourRepositories.getTours(dbQueryParams);
};

const getUserTours = async ({
  authorId,
  role,
  paginated,
  ...params
}: UserToursData): Promise<Either<string, GetToursResponse>> => {
  const isSuperAdmin = role === Role.SUPER_ADMIN;
  const where: Prisma.TourWhereInput | undefined = isSuperAdmin
    ? undefined
    : { authorId };
  const tourIncludes: Prisma.TourInclude = {
    photos: true,
    author: isSuperAdmin
  };

  const pagesCount = await getPagesCount(where);

  const tours = (await tourRepositories.getTours({
    where,
    include: tourIncludes,
    ...params
  })) as Prisma.TourGetPayload<{
    include: {
      photos: true;
    };
  }>[];

  if (!tours) {
    return left('Ошибка при получение туров');
  }

  const tourEntities: TourEntity[] = tours.length
    ? tours.map(tourToTourEntity)
    : [];

  return right({ pagesCount, tours: tourEntities });
};

const createTour = async (
  data: Omit<CreateTourData, 'mainPhoto' | 'photos'> & {
    authorId: number;
    mainPhoto: Omit<PhotoDomain.PhotoEntity, 'id'>;
    photos?: Omit<PhotoDomain.PhotoEntity, 'id'>[];
  }
): Promise<TourEntity | null> => {
  const tour = await tourRepositories.createTour(data);

  return tour ? tourToTourEntity(tour) : null;
};

const updateTour = async (
  tour: Partial<Omit<CreateTourData, 'mainPhoto' | 'photos'>> & {
    id: number;
    authorId: number;
    mainPhoto?: Omit<PhotoDomain.PhotoEntity, 'id'>;
    photos?: Omit<PhotoDomain.PhotoEntity, 'id'>[];
  }
): Promise<Either<string, Tour>> => {
  const updatedTour = await tourRepositories.updateTour(tour);

  if (!updatedTour) {
    return left('Не удалось обновить тур');
  }

  return right(updatedTour);
};

export const tourService = {
  getTour,
  getUserTours,
  getTourCards,
  getPopularTourCards,
  getTours,
  getPublishedTourRefs,
  createTour,
  updateTour
};
