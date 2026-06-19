import { v4 } from 'uuid';

import { BookingDomain } from '@/entities/booking';
import { bookingRepository } from '@/entities/booking/server';
import { PUBLIC_TOUR_STATUS } from '@/entities/tour/domain';

import { dbClient } from '@/shared/lib/db';
import { Either, left, right } from '@/shared/lib/either';

import { buildDisplayName } from '@/kernel/guide/domain';

import { Booking, Prisma } from '../../../../generated/prisma/client';
import { CreateBookingPayload, UpdateBookingPayload } from '../model/schemas';

const { BookingStatus } = BookingDomain;

// Какое действие к какому статусу приводит (null — статус не меняется).
const ACTION_TO_STATUS: Record<
  BookingDomain.BookingActionType,
  string | null
> = {
  contact: BookingStatus.CONTACTED,
  confirm: BookingStatus.CONFIRMED,
  complete: BookingStatus.COMPLETED,
  cancel: BookingStatus.CANCELLED,
  spam: BookingStatus.SPAM,
  reschedule: null,
  note: null
};

type Actor = { id: number; role: string; canManageAny: boolean };

const tourSelect = { id: true, title: true, slug: true };
const guideSelect = {
  id: true,
  firstName: true,
  lastName: true,
  login: true,
  slug: true,
  rating: true
};

type BookingWithRelations = Booking & {
  tour: { id: number; title: string; slug: string };
  guide?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    login: string;
    slug: string | null;
    rating: number | null;
  };
};

const toListItem = (
  booking: BookingWithRelations
): BookingDomain.BookingListItem => ({
  id: booking.id,
  status: booking.status,
  guideId: booking.guideId,
  tourId: booking.tourId,
  guestName: booking.guestName,
  guestPhone: booking.guestPhone,
  guestEmail: booking.guestEmail,
  desiredDate: booking.desiredDate?.toISOString() ?? null,
  peopleCount: booking.peopleCount,
  comment: booking.comment,
  cancelReason: booking.cancelReason,
  guideNote: booking.guideNote,
  accessToken: booking.accessToken,
  createdAt: booking.createdAt.toISOString(),
  processedAt: booking.processedAt?.toISOString() ?? null,
  tour: booking.tour,
  guide: booking.guide
    ? {
        id: booking.guide.id,
        displayName: buildDisplayName(booking.guide),
        slug: booking.guide.slug ?? String(booking.guide.id)
      }
    : undefined
});

// Сортировка: новые сверху, затем по дате создания (свежие выше).
const STATUS_ORDER: Record<string, number> = {
  [BookingStatus.NEW]: 0,
  [BookingStatus.CONTACTED]: 1,
  [BookingStatus.CONFIRMED]: 2,
  [BookingStatus.COMPLETED]: 3,
  [BookingStatus.EXPIRED]: 4,
  [BookingStatus.CANCELLED]: 5,
  [BookingStatus.SPAM]: 6
};

const sortBookings = (
  a: BookingDomain.BookingListItem,
  b: BookingDomain.BookingListItem
): number => {
  const byStatus = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);

  if (byStatus !== 0) return byStatus;

  return b.createdAt.localeCompare(a.createdAt);
};

async function createBooking(
  payload: CreateBookingPayload
): Promise<Either<string, { accessToken: string; guideName: string }>> {
  const tour = await dbClient.tour.findUnique({
    where: { id: payload.tourId },
    select: { id: true, authorId: true, status: true }
  });

  if (!tour || tour.status !== PUBLIC_TOUR_STATUS) {
    return left('Тур не найден или недоступен для бронирования');
  }

  // Анти-спам: не больше 3 заявок с одного телефона за 10 минут.
  const recent = await bookingRepository.countBookings({
    guestPhone: payload.phone,
    createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) }
  });

  if (recent >= 3) {
    return left('Слишком много заявок. Попробуйте позже');
  }

  const now = new Date();
  const history: BookingDomain.StatusHistoryItem[] = [
    { status: BookingStatus.NEW, at: now.toISOString() }
  ];

  const desiredDate =
    payload.desiredDate && !Number.isNaN(Date.parse(payload.desiredDate))
      ? new Date(payload.desiredDate)
      : null;

  const booking = await bookingRepository.createBooking({
    tourId: tour.id,
    guideId: tour.authorId,
    guestName: payload.name,
    guestPhone: payload.phone,
    guestEmail: payload.email || null,
    desiredDate,
    peopleCount: payload.peopleCount,
    comment: payload.comment || null,
    status: BookingStatus.NEW,
    accessToken: v4(),
    statusHistory: history as unknown as Prisma.InputJsonValue
  });

  const guide = await dbClient.user.findUnique({
    where: { id: tour.authorId },
    select: { firstName: true, lastName: true, login: true }
  });

  return right({
    accessToken: booking.accessToken,
    guideName: guide ? buildDisplayName(guide) : 'Гид'
  });
}

async function getGuideBookings(
  guideId: number
): Promise<Either<string, { bookings: BookingDomain.BookingListItem[] }>> {
  const rows = (await bookingRepository.getBookings({
    where: { guideId },
    include: { tour: { select: tourSelect } },
    orderBy: { createdAt: 'desc' }
  })) as unknown as BookingWithRelations[];

  return right({ bookings: rows.map(toListItem).sort(sortBookings) });
}

async function getAllBookingsGrouped(): Promise<
  Either<string, { groups: BookingDomain.GuideBookingsGroup[] }>
> {
  const rows = (await bookingRepository.getBookings({
    include: { tour: { select: tourSelect }, guide: { select: guideSelect } },
    orderBy: { createdAt: 'desc' }
  })) as unknown as BookingWithRelations[];

  const groups = new Map<number, BookingDomain.GuideBookingsGroup>();

  for (const row of rows) {
    const item = toListItem(row);
    const guide = row.guide;

    if (!guide) continue;

    if (!groups.has(guide.id)) {
      groups.set(guide.id, {
        guide: {
          id: guide.id,
          displayName: buildDisplayName(guide),
          slug: guide.slug ?? String(guide.id),
          rating: guide.rating
        },
        newCount: 0,
        total: 0,
        bookings: []
      });
    }

    const group = groups.get(guide.id)!;

    group.bookings.push(item);
    group.total += 1;

    if (BookingDomain.isNewBooking(item.status)) group.newCount += 1;
  }

  const result = [...groups.values()]
    .map(group => ({
      ...group,
      bookings: group.bookings.sort(sortBookings)
    }))
    .sort((a, b) => b.newCount - a.newCount || b.total - a.total);

  return right({ groups: result });
}

async function updateBookingStatus(
  payload: UpdateBookingPayload,
  actor: Actor
): Promise<Either<string, BookingDomain.BookingListItem>> {
  const booking = await bookingRepository.getBookingById(payload.id);

  if (!booking) {
    return left('Заявка не найдена');
  }

  if (!actor.canManageAny && booking.guideId !== actor.id) {
    return left('Это не ваша заявка');
  }

  const nextStatus = ACTION_TO_STATUS[payload.action];
  const data: Prisma.BookingUpdateInput = {};

  if (nextStatus) data.status = nextStatus;
  if (payload.action === 'cancel') data.cancelReason = payload.reason ?? null;
  if (payload.action === 'note') data.guideNote = payload.note ?? null;

  if (payload.action === 'reschedule') {
    if (!payload.desiredDate || Number.isNaN(Date.parse(payload.desiredDate))) {
      return left('Укажите корректную дату');
    }
    data.desiredDate = new Date(payload.desiredDate);
  }

  // Первая обработка снимает «новизну».
  if (!booking.processedAt && payload.action !== 'note') {
    data.processedAt = new Date();
  }

  const history = (
    Array.isArray(booking.statusHistory) ? booking.statusHistory : []
  ) as BookingDomain.StatusHistoryItem[];

  history.push({
    status: nextStatus ?? booking.status,
    at: new Date().toISOString(),
    byUserId: actor.id,
    byRole: actor.role,
    note: payload.reason || payload.note || undefined
  });
  data.statusHistory = history as unknown as Prisma.InputJsonValue;

  const updated = (await dbClient.booking.update({
    where: { id: payload.id },
    data,
    include: { tour: { select: tourSelect }, guide: { select: guideSelect } }
  })) as unknown as BookingWithRelations;

  return right(toListItem(updated));
}

async function getBookingByToken(
  token: string
): Promise<Either<string, BookingDomain.BookingListItem>> {
  const row = (await bookingRepository.getBookingByToken(token, {
    tour: { select: tourSelect },
    guide: { select: guideSelect }
  })) as unknown as BookingWithRelations | null;

  if (!row) {
    return left('Заявка не найдена');
  }

  return right(toListItem(row));
}

export const bookingService = {
  createBooking,
  getGuideBookings,
  getAllBookingsGrouped,
  updateBookingStatus,
  getBookingByToken
};
