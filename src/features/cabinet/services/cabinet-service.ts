import { bookingService } from '@/features/booking/server';
import { inboxService, InboxThreadItem } from '@/features/booking-chat/server';

import { BookingDomain } from '@/entities/booking';
import { photoRepository } from '@/entities/photo/repositories/photo';
import { TourStatus } from '@/entities/tour/domain';
import { userRepository } from '@/entities/user/repositories/user';

import { dbClient } from '@/shared/lib/db';

import { buildDisplayName, isGuideRole } from '@/kernel/guide/domain';

const { BookingStatus } = BookingDomain;

/** Гид в шапке кабинета: имя, подпись и ссылка на публичную страницу. */
export type CabinetIdentity = {
  id: number;
  displayName: string;
  headline: string | null;
  slug: string;
  avatar: string | null;
  isVerified: boolean;
};

/** Счётчики в боковом меню — считаются на каждый переход по кабинету. */
export type CabinetBadges = {
  newBookings: number;
  unreadMessages: number;
  toursCount: number;
};

export type CabinetTourStatusItem = {
  id: number;
  title: string;
  status: string | null;
  rejectionComment: string | null;
  updatedAt: string | null;
};

export type CabinetOverview = {
  badges: CabinetBadges;
  /** Ближайший выезд: сегодняшний, если он есть, иначе следующий по дате. */
  next: BookingDomain.BookingListItem | null;
  upcoming: BookingDomain.BookingListItem[];
  waiting: InboxThreadItem[];
  moderation: CabinetTourStatusItem[];
  toursPublished: number;
  toursTotal: number;
  rating: number;
  reviewsCount: number;
  unansweredReviews: number;
};

const OPEN_STATUSES: string[] = [
  BookingStatus.NEW,
  BookingStatus.CONTACTED,
  BookingStatus.CONFIRMED
];

const startOfToday = (): Date => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
};

async function getIdentity(userId: number): Promise<CabinetIdentity | null> {
  const user = await userRepository.getUser({ id: userId });

  if (!user) return null;

  const avatar = user.avatarPhotoId
    ? ((await photoRepository.getPhotoById(user.avatarPhotoId))?.source ?? null)
    : null;

  return {
    id: user.id,
    displayName: buildDisplayName(user),
    headline: user.headline ?? null,
    slug: user.slug ?? String(user.id),
    avatar,
    isVerified: isGuideRole(user.role)
  };
}

async function getBadges(guideId: number): Promise<CabinetBadges> {
  const [newBookings, unreadMessages, toursCount] = await Promise.all([
    dbClient.booking.count({
      where: { guideId, status: BookingStatus.NEW }
    }),
    inboxService.countUnread(guideId),
    dbClient.tour.count({ where: { authorId: guideId } })
  ]);

  return { newBookings, unreadMessages, toursCount };
}

/**
 * Данные «Обзора».
 *
 * Собирается из того, что уже лежит в базе: заявки с датой выезда дают
 * ближайшие выезды, непрочитанные сообщения — «ждут ответа», статусы туров —
 * блок проверки. Ничего не кэшируем: кабинет открывают, чтобы увидеть
 * состояние на сейчас, а не минуту назад.
 */
async function getOverview(guideId: number): Promise<CabinetOverview> {
  const [badges, bookingsResult, inboxResult, tours, reviewsAggregate] =
    await Promise.all([
      getBadges(guideId),
      bookingService.getGuideBookings(guideId),
      inboxService.getGuideInbox(guideId),
      dbClient.tour.findMany({
        where: { authorId: guideId },
        select: {
          id: true,
          title: true,
          status: true,
          rejectionComment: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' }
      }),
      dbClient.review.aggregate({
        where: { tour: { authorId: guideId } },
        _avg: { estimateValue: true },
        _count: { _all: true }
      })
    ]);

  const bookings =
    bookingsResult.type === 'right' ? bookingsResult.value.bookings : [];
  const threads = inboxResult.type === 'right' ? inboxResult.value.threads : [];

  const today = startOfToday().getTime();

  const upcoming = bookings
    .filter(
      booking =>
        OPEN_STATUSES.includes(booking.status) &&
        !!booking.desiredDate &&
        new Date(booking.desiredDate).getTime() >= today
    )
    .sort(
      (a, b) =>
        new Date(a.desiredDate ?? 0).getTime() -
        new Date(b.desiredDate ?? 0).getTime()
    );

  const unansweredReviews = await dbClient.review.count({
    where: { tour: { authorId: guideId }, guideReply: null }
  });

  return {
    badges,
    next: upcoming[0] ?? null,
    upcoming: upcoming.slice(0, 5),
    waiting: threads.filter(thread => thread.unreadCount > 0).slice(0, 3),
    moderation: tours
      .filter(tour => tour.status !== TourStatus.APPROVED)
      .slice(0, 3)
      .map(tour => ({
        id: tour.id,
        title: tour.title,
        status: tour.status,
        rejectionComment: tour.rejectionComment,
        updatedAt: tour.updatedAt?.toISOString() ?? null
      })),
    toursPublished: tours.filter(tour => tour.status === TourStatus.APPROVED)
      .length,
    toursTotal: tours.length,
    rating: Number((reviewsAggregate._avg.estimateValue ?? 0).toFixed(1)),
    reviewsCount: reviewsAggregate._count._all,
    unansweredReviews
  };
}

export const cabinetService = { getIdentity, getBadges, getOverview };
