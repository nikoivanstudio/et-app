import { BookingDomain } from '@/entities/booking';
import type { CityEntity } from '@/entities/city/domain';
import { serverPhotoUtils } from '@/entities/photo/server';
import { normalizeRedirectSource } from '@/entities/redirect/lib/redirect-utils';
import { TourStatus } from '@/entities/tour/domain';
import {
  RouteStop as ContentRouteStop,
  toTourContent,
  TourContent
} from '@/entities/tour/model/content';

import { dbClient } from '@/shared/lib/db';
import { Either, left, right } from '@/shared/lib/either';
import { translit } from '@/shared/lib/string-utils';

import { geoServices } from '@/kernel/geo/server';
import { routes } from '@/kernel/routes';

import { Prisma } from '../../../../generated/prisma/client';
import {
  buildTourChecklist,
  missingRequired,
  tourCompleteness
} from '../lib/checklist';
import { emptyTourEditorData } from '../model/empty';
import { SaveTourPayload } from '../model/schemas';
import {
  EditorPhoto,
  FaqItem,
  PriceOption,
  RouteStop,
  TourEditorData
} from '../model/types';

const HOUR = 3600;

const asArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

const toSlug = (title: string): string =>
  translit(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'tur';

/** Slug должен быть уникальным: к занятому дописываем номер. */
const uniqueSlug = async (title: string, tourId?: number): Promise<string> => {
  const base = toSlug(title);
  let candidate = base;
  let suffix = 2;

  for (;;) {
    const existing = await dbClient.tour.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!existing || existing.id === tourId) return candidate;

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
};

const ownTour = async (tourId: number, guideId: number) => {
  const tour = await dbClient.tour.findUnique({
    where: { id: tourId },
    include: {
      photos: true,
      startCityRef: true,
      pickupCityLinks: { include: { city: true } }
    }
  });

  if (!tour) return left('Тур не найден');
  if (tour.authorId !== guideId) return left('Это чужой тур');

  return right(tour);
};

type TourRow = Awaited<ReturnType<typeof dbClient.tour.findUniqueOrThrow>> & {
  photos: { id: number; title: string; source: string }[];
  startCityRef?: { slug: string } | null;
  pickupCityLinks?: { city: { slug: string } }[];
};

const toEditorData = (
  tour: TourRow,
  bookedDates: TourEditorData['bookedDates']
): TourEditorData => ({
  id: tour.id,
  title: tour.title,
  slug: tour.slug,
  about: tour.about ?? '',
  description: tour.descriptionText ?? tour.description ?? '',
  startCitySlug: tour.startCityRef?.slug ?? '',
  durationHours: Math.max(1, Math.round((tour.duration ?? HOUR) / HOUR)),
  capacity: tour.capacity,
  difficulty: tour.difficulty ?? '',
  price: tour.price,
  priceUnit: tour.priceUnit ?? 'PER_CAR',
  seasons: tour.seasons ?? [],
  categories: tour.categories ?? [],
  included: tour.included ?? [],
  excluded: tour.excluded ?? [],
  faq: asArray<FaqItem>(tour.faq),
  routeStops: asArray<RouteStop>(tour.tourRoute),
  priceOptions: asArray<PriceOption>(tour.priceOptions),
  minGroupSize: tour.minGroupSize,
  bookingLeadDays: tour.bookingLeadDays,
  startTime: tour.startTime ?? '',
  weekdays: tour.weekdays ?? [],
  blockedDates: (tour.blockedDates ?? []).map(date => date.toISOString()),
  meetingAddress: tour.meetingAddress ?? '',
  meetingNote: tour.meetingNote ?? '',
  pickupCitySlugs: (tour.pickupCityLinks ?? []).map(link => link.city.slug),
  metaTitle: tour.metaTitle ?? '',
  metaDescription: tour.metaDescription ?? '',
  photos: tour.photos.map((photo): EditorPhoto => ({
    id: photo.id,
    title: photo.title,
    source: photo.source,
    isMain: photo.id === tour.mainPhotoId
  })),
  status: tour.status,
  rejectionComment: tour.rejectionComment,
  updatedAt: tour.updatedAt?.toISOString() ?? null,
  bookedDates
});

/** Даты, на которые уже есть подтверждённые заявки. */
const getBookedDates = async (
  tourId: number
): Promise<TourEditorData['bookedDates']> => {
  const rows = await dbClient.booking.findMany({
    where: {
      tourId,
      desiredDate: { not: null },
      status: {
        in: [
          BookingDomain.BookingStatus.NEW,
          BookingDomain.BookingStatus.CONTACTED,
          BookingDomain.BookingStatus.CONFIRMED
        ]
      }
    },
    select: { desiredDate: true, guestName: true, peopleCount: true }
  });

  return rows.map(row => ({
    date: row.desiredDate?.toISOString() ?? '',
    guestName: row.guestName,
    peopleCount: row.peopleCount
  }));
};

async function getEditorTour(
  tourId: number,
  guideId: number
): Promise<Either<string, TourEditorData>> {
  const result = await ownTour(tourId, guideId);

  if (result.type === 'left') return result;

  const bookedDates = await getBookedDates(tourId);

  return right(toEditorData(result.value as TourRow, bookedDates));
}

/**
 * `content` публичной страницы шире редактора гида: билеты, блок «что вас
 * ждёт», ссылки и координаты точек маршрута заполняет администратор. Поэтому
 * сохранение правит только свои поля, а остальное переносит из текущего
 * content — иначе каждое сохранение черновика стирало бы половину страницы
 * тура на сайте.
 *
 * Точки маршрута сопоставляются по названию, а не по порядку: гид может
 * вставить остановку в середину, и по индексу ссылки уехали бы к соседям.
 */
const mergeContent = (
  current: Prisma.JsonValue | null | undefined,
  payload: SaveTourPayload
): TourContent => {
  const content = toTourContent(current ?? {});
  const known = new Map(
    content.routeStops.map(stop => [stop.title.trim().toLowerCase(), stop])
  );

  return {
    ...content,
    lead: payload.about,
    routeStops: payload.routeStops.map(stop => {
      const previous = known.get(stop.title.trim().toLowerCase());
      const merged: ContentRouteStop = { ...previous, title: stop.title };

      if (stop.sub) {
        merged.sub = stop.sub;
      } else {
        delete merged.sub;
      }

      return merged;
    })
  };
};

/**
 * Город выезда: ключ и прежняя строка.
 *
 * Правило целиком — в `geoServices.resolveCityWrite`; здесь оно только
 * раскладывается по именам колонок тура. Строка `start_city` живёт до
 * задачи 1-К (expand-contract, см. `docs/deploy/migrations.md`), и пока
 * она жива, сохранение тура не должно её терять.
 */
const startCityColumns = (
  payload: SaveTourPayload,
  cities: Map<string, CityEntity>,
  existingStartCityId?: number | null
) => {
  const write = geoServices.resolveCityWrite(
    cities.get(payload.startCitySlug),
    existingStartCityId
  );

  return write ? { startCityId: write.id, startCity: write.title } : {};
};

/**
 * Колонки тура.
 *
 * Города приходят разрешёнными: ключ — то, по чему идёт выборка, строка —
 * денормализованное название из справочника, а не из того, что набрал гид:
 * иначе строка снова разъедется с ключом, а ради устранения этого
 * расхождения всё и затевалось.
 */
const toColumns = (
  payload: SaveTourPayload,
  cities: Map<string, CityEntity>,
  existingStartCityId?: number | null,
  currentContent?: Prisma.JsonValue | null
) => ({
  ...startCityColumns(payload, cities, existingStartCityId),
  title: payload.title,
  about: payload.about || null,
  description: payload.description,
  descriptionText: payload.description,
  duration: payload.durationHours * HOUR,
  capacity: payload.capacity,
  difficulty: payload.difficulty,
  price: payload.price,
  priceUnit: payload.priceUnit,
  seasons: payload.seasons,
  categories: payload.categories,
  included: payload.included,
  excluded: payload.excluded,
  faq: payload.faq,
  tourRoute: payload.routeStops,
  priceOptions: payload.priceOptions,
  minGroupSize: payload.minGroupSize,
  bookingLeadDays: payload.bookingLeadDays,
  startTime: payload.startTime || null,
  weekdays: payload.weekdays,
  blockedDates: payload.blockedDates.map(date => new Date(date)),
  meetingAddress: payload.meetingAddress || null,
  meetingNote: payload.meetingNote || null,
  pickupCities: payload.pickupCitySlugs
    .filter(slug => slug !== payload.startCitySlug)
    .map(slug => cities.get(slug)?.title)
    .filter((title): title is string => !!title),
  metaTitle: payload.metaTitle || null,
  metaDescription: payload.metaDescription || null,
  // Публичная страница собирается из content — держим его в согласии
  // с полями редактора, иначе тур на сайте останется со старым текстом.
  content: mergeContent(
    currentContent,
    payload
  ) as unknown as Prisma.InputJsonValue
});

/**
 * Старый адрес тура не должен становиться 404: ссылку на страницу уже могли
 * дать в переписке или в соцсетях. Заводим постоянную переадресацию и
 * переводим на новый адрес правила, которые вели на старый, — иначе после
 * второго переименования цепочка упирается в несуществующую страницу.
 */
const rememberSlugChange = async (from: string, to: string): Promise<void> => {
  const source = normalizeRedirectSource(routes.tour(from));
  const destination = routes.tour(to);

  await dbClient.$transaction([
    dbClient.redirect.updateMany({
      where: { destination: source },
      data: { destination }
    }),
    dbClient.redirect.upsert({
      where: { source },
      update: { destination, statusCode: 301, isActive: true },
      create: {
        source,
        destination,
        statusCode: 301,
        note: 'Гид переименовал тур'
      }
    })
  ]);
};

/**
 * Города тура из справочника — по слагам, пришедшим из формы.
 *
 * Слаг, которого в справочнике нет, просто не находится: тур сохранится
 * без города, а не с выдуманным. Подставить сюда произвольную строку
 * форма больше не может — в кабинете выбор, а не ввод.
 */
const resolveTourCities = (payload: SaveTourPayload) =>
  geoServices.resolveCities(
    [payload.startCitySlug, ...payload.pickupCitySlugs].filter(Boolean)
  );

/**
 * Города подбора связями.
 *
 * Город старта отсюда выбрасывается: из него и так выезжают, а в форме он
 * из списка скрыт — оставшаяся связь была бы той, которую гид не видит
 * и потому не может снять.
 */
const pickupLinks = (
  payload: SaveTourPayload,
  cities: Map<string, CityEntity>
) =>
  payload.pickupCitySlugs
    .filter(slug => slug !== payload.startCitySlug)
    .map(slug => cities.get(slug)?.id)
    .filter((id): id is number => !!id)
    .map(cityId => ({ cityId }));

/**
 * Сохранение черновика.
 *
 * Правка опубликованного тура возвращает его на модерацию — то же правило,
 * что и в старом редакторе: изменённый текст не должен уезжать в каталог
 * мимо проверки.
 */
async function saveTour(
  payload: SaveTourPayload,
  guideId: number
): Promise<Either<string, { id: number; status: string | null }>> {
  const cities = await resolveTourCities(payload);

  if (!payload.id) {
    const tour = await dbClient.tour.create({
      data: {
        ...toColumns(payload, cities),
        pickupCityLinks: { create: pickupLinks(payload, cities) },
        slug: await uniqueSlug(payload.title),
        authorId: guideId,
        status: null,
        metaKeywords: [],
        tags: []
      },
      select: { id: true, status: true }
    });

    return right(tour);
  }

  const existing = await ownTour(payload.id, guideId);

  if (existing.type === 'left') return existing;

  const wasApproved = existing.value.status === TourStatus.APPROVED;

  // Slug — публичный адрес тура. Пока тур в черновике, его в каталоге нет,
  // и адрес спокойно следует за названием; со статусом он замораживается:
  // переименование опубликованного тура иначе молча уводило бы в 404 все
  // ссылки на него, включая выдачу поиска.
  const slug =
    existing.value.status === null
      ? await uniqueSlug(payload.title, payload.id)
      : existing.value.slug;

  const tour = await dbClient.tour.update({
    where: { id: payload.id },
    data: {
      ...toColumns(
        payload,
        cities,
        existing.value.startCityId,
        existing.value.content
      ),
      // Список городов подбора правится целиком: связи, которых в форме
      // не осталось, должны исчезнуть, иначе снятый город продолжал бы
      // тянуть тур в чужую подборку.
      pickupCityLinks: {
        deleteMany: {},
        create: pickupLinks(payload, cities)
      },
      slug,
      ...(wasApproved
        ? { status: TourStatus.PENDING, rejectionComment: null }
        : {})
    },
    select: { id: true, status: true }
  });

  if (slug !== existing.value.slug) {
    await rememberSlugChange(existing.value.slug, slug);
  }

  return right(tour);
}

/** Отправить на модерацию или снять с публикации. */
async function setStatus(
  { id, status }: { id: number; status: string },
  guideId: number
): Promise<Either<string, { id: number; status: string | null }>> {
  const existing = await ownTour(id, guideId);

  if (existing.type === 'left') return existing;

  if (status === TourStatus.PENDING) {
    const bookedDates = await getBookedDates(id);
    const data = toEditorData(existing.value as TourRow, bookedDates);
    const missing = missingRequired(buildTourChecklist(data));

    if (missing.length) {
      return left(
        `Не заполнено: ${missing.map(item => item.label.toLowerCase()).join(', ')}`
      );
    }
  }

  const tour = await dbClient.tour.update({
    where: { id },
    data: {
      status: status === 'DRAFT' ? null : status,
      ...(status === TourStatus.PENDING ? { rejectionComment: null } : {})
    },
    select: { id: true, status: true }
  });

  return right(tour);
}

async function removeTour(
  id: number,
  guideId: number
): Promise<Either<string, { id: number }>> {
  const existing = await ownTour(id, guideId);

  if (existing.type === 'left') return existing;

  const bookings = await dbClient.booking.count({
    where: {
      tourId: id,
      status: {
        in: [
          BookingDomain.BookingStatus.NEW,
          BookingDomain.BookingStatus.CONTACTED,
          BookingDomain.BookingStatus.CONFIRMED
        ]
      }
    }
  });

  // Удалять тур, на который кто-то едет, нельзя: заявка останется без тура,
  // а клиент — без страницы, на которую ссылается его письмо.
  if (bookings) {
    return left(
      'По туру есть незакрытые заявки. Снимите тур с публикации или закройте заявки.'
    );
  }

  await dbClient.$transaction([
    dbClient.photo.deleteMany({ where: { tourId: id } }),
    dbClient.tour.delete({ where: { id } })
  ]);

  return right({ id });
}

/** Копия тура — черновиком, чтобы править соседний маршрут с нуля не пришлось. */
async function duplicateTour(
  id: number,
  guideId: number
): Promise<Either<string, { id: number }>> {
  const existing = await ownTour(id, guideId);

  if (existing.type === 'left') return existing;

  const source = existing.value;
  const title = `${source.title} (копия)`;

  const copy = await dbClient.tour.create({
    data: {
      title,
      slug: await uniqueSlug(title),
      description: source.description,
      descriptionText: source.descriptionText,
      about: source.about,
      content: source.content ?? {},
      price: source.price,
      priceUnit: source.priceUnit,
      duration: source.duration,
      capacity: source.capacity,
      difficulty: source.difficulty,
      categories: source.categories,
      metaKeywords: source.metaKeywords,
      tags: [],
      tourRoute: (source.tourRoute ?? []) as Prisma.InputJsonValue[],
      included: source.included,
      excluded: source.excluded,
      faq: source.faq ?? undefined,
      seasons: source.seasons,
      startCity: source.startCity,
      startCityId: source.startCityId,
      startPlace: source.startPlace ?? undefined,
      priceOptions: source.priceOptions ?? undefined,
      minGroupSize: source.minGroupSize,
      bookingLeadDays: source.bookingLeadDays,
      startTime: source.startTime,
      weekdays: source.weekdays,
      meetingAddress: source.meetingAddress,
      meetingNote: source.meetingNote,
      pickupCities: source.pickupCities,
      pickupCityLinks: {
        create: (source.pickupCityLinks ?? []).map(link => ({
          cityId: link.cityId
        }))
      },
      authorId: guideId,
      status: null
    },
    select: { id: true }
  });

  return right(copy);
}

async function addPhotos(
  tourId: number,
  guideId: number,
  files: File[]
): Promise<Either<string, { photos: EditorPhoto[] }>> {
  const existing = await ownTour(tourId, guideId);

  if (existing.type === 'left') return existing;

  const created: EditorPhoto[] = [];

  for (const file of files) {
    const entity = await serverPhotoUtils.getPhotoEntity({
      file,
      authorId: guideId,
      keywords: [],
      title: existing.value.title
    });

    if (!entity) continue;

    const photo = await dbClient.photo.create({
      data: { ...entity, tourId }
    });

    created.push({
      id: photo.id,
      title: photo.title,
      source: photo.source,
      isMain: false
    });
  }

  if (!created.length) return left('Не удалось загрузить фотографии');

  // Первая же загруженная фотография становится главной.
  if (!existing.value.mainPhotoId) {
    await dbClient.tour.update({
      where: { id: tourId },
      data: { mainPhotoId: created[0].id }
    });
    created[0].isMain = true;
  }

  return right({ photos: created });
}

async function setMainPhoto(
  tourId: number,
  photoId: number,
  guideId: number
): Promise<Either<string, { id: number }>> {
  const existing = await ownTour(tourId, guideId);

  if (existing.type === 'left') return existing;

  if (!existing.value.photos.some(photo => photo.id === photoId)) {
    return left('Фотография не относится к этому туру');
  }

  await dbClient.tour.update({
    where: { id: tourId },
    data: { mainPhotoId: photoId }
  });

  return right({ id: photoId });
}

async function removePhoto(
  tourId: number,
  photoId: number,
  guideId: number
): Promise<Either<string, { id: number }>> {
  const existing = await ownTour(tourId, guideId);

  if (existing.type === 'left') return existing;

  // Без этой проверки гид удалял бы любую строку из таблицы фотографий —
  // права проверены на тур, а удалялась фотография по чужому id.
  if (!existing.value.photos.some(photo => photo.id === photoId)) {
    return left('Фотография не относится к этому туру');
  }

  const rest = existing.value.photos.filter(photo => photo.id !== photoId);

  await dbClient.$transaction([
    dbClient.photo.delete({ where: { id: photoId } }),
    dbClient.tour.update({
      where: { id: tourId },
      data:
        existing.value.mainPhotoId === photoId
          ? { mainPhotoId: rest[0]?.id ?? null }
          : {}
    })
  ]);

  return right({ id: photoId });
}

/** Карточка тура в списке кабинета. */
export type CabinetTourItem = {
  id: number;
  title: string;
  slug: string;
  status: string | null;
  rejectionComment: string | null;
  cover: string | null;
  startCity: string | null;
  durationHours: number;
  price: number;
  priceUnit: string | null;
  capacity: number | null;
  difficulty: string | null;
  seasons: number[];
  rating: number | null;
  reviewsCount: number;
  bookingsCount: number;
  completeness: number;
  missing: string[];
};

async function getGuideTours(
  guideId: number
): Promise<Either<string, { tours: CabinetTourItem[] }>> {
  const rows = await dbClient.tour.findMany({
    where: { authorId: guideId },
    include: {
      photos: true,
      startCityRef: true,
      pickupCityLinks: { include: { city: true } },
      _count: { select: { reviews: true } }
    },
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }]
  });

  const monthAgo = new Date();

  monthAgo.setDate(monthAgo.getDate() - 30);

  const bookings = await dbClient.booking.groupBy({
    by: ['tourId'],
    where: { guideId, createdAt: { gte: monthAgo } },
    _count: { _all: true }
  });

  const bookingsByTour = new Map(
    bookings.map(row => [row.tourId, row._count._all])
  );

  const tours = rows.map(tour => {
    const data = toEditorData(tour as TourRow, []);
    const checklist = buildTourChecklist(data);

    return {
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      status: tour.status,
      rejectionComment: tour.rejectionComment,
      cover:
        tour.photos.find(photo => photo.id === tour.mainPhotoId)?.source ??
        tour.photos[0]?.source ??
        null,
      startCity: tour.startCity,
      durationHours: data.durationHours,
      price: tour.price,
      priceUnit: tour.priceUnit,
      capacity: tour.capacity,
      difficulty: tour.difficulty,
      seasons: tour.seasons ?? [],
      rating: tour.rating,
      reviewsCount: tour._count.reviews,
      bookingsCount: bookingsByTour.get(tour.id) ?? 0,
      completeness: tourCompleteness(checklist),
      missing: checklist.filter(item => !item.done).map(item => item.label)
    };
  });

  return right({ tours });
}

export { emptyTourEditorData };

export const tourEditorService = {
  getEditorTour,
  saveTour,
  setStatus,
  removeTour,
  duplicateTour,
  addPhotos,
  setMainPhoto,
  removePhoto,
  getGuideTours
};
