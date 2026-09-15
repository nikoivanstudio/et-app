import { bookingRepository } from '@/entities/booking/server';
import { MessageDomain, messageRepository } from '@/entities/message/server';

import { Either, right } from '@/shared/lib/either';

/**
 * Список переписок гида.
 *
 * Отдельной сущности «диалог» в базе нет и не будет: переписка привязана
 * к заявке (см. комментарий в prisma/models/message.prisma), а заявка уже
 * содержит и тур, и клиента, и способ входа по токену. Поэтому «Сообщения» —
 * это выборка заявок, у которых есть хотя бы одно сообщение, с превью
 * последнего и счётчиком непрочитанного.
 */
export type InboxThreadItem = {
  bookingId: number;
  status: string;
  guestName: string;
  tourTitle: string;
  tourSlug: string;
  desiredDate: string | null;
  peopleCount: number;
  unreadCount: number;
  lastMessage: {
    text: string;
    /** CLIENT | GUIDE — по нему в списке появляется префикс «Вы:». */
    authorRole: string;
    createdAt: string;
  } | null;
};

const toPreview = (text: string): string =>
  text.length > 120 ? `${text.slice(0, 119).trimEnd()}…` : text;

async function getGuideInbox(
  guideId: number
): Promise<Either<string, { threads: InboxThreadItem[] }>> {
  const rows = await bookingRepository.getBookings({
    where: { guideId, messages: { some: {} } },
    include: { tour: { select: { id: true, title: true, slug: true } } },
    orderBy: { updatedAt: 'desc' }
  });

  const ids = rows.map(row => row.id);

  const [lastMessages, unread] = await Promise.all([
    messageRepository.getLastMessagesByBooking(ids),
    messageRepository.countUnreadByBooking(
      ids,
      MessageDomain.MessageAuthorRole.GUIDE
    )
  ]);

  const lastByBooking = new Map(
    lastMessages.map(message => [message.bookingId, message])
  );
  const unreadByBooking = new Map(
    unread.map(row => [row.bookingId, row._count._all])
  );

  const threads = rows
    .map(row => {
      const last = lastByBooking.get(row.id);

      return {
        bookingId: row.id,
        status: row.status,
        guestName: row.guestName,
        tourTitle: row.tour.title,
        tourSlug: row.tour.slug,
        desiredDate: row.desiredDate?.toISOString() ?? null,
        peopleCount: row.peopleCount,
        unreadCount: unreadByBooking.get(row.id) ?? 0,
        lastMessage: last
          ? {
              text: toPreview(last.text),
              authorRole: last.authorRole,
              createdAt: last.createdAt.toISOString()
            }
          : null
      };
    })
    // Сортируем по последнему сообщению, а не по дате заявки: в переписке
    // важно, кто написал последним, а не когда заявка создана.
    .sort((a, b) => {
      if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;

      return (
        new Date(b.lastMessage?.createdAt ?? 0).getTime() -
        new Date(a.lastMessage?.createdAt ?? 0).getTime()
      );
    });

  return right({ threads });
}

/** Сколько всего сообщений клиентов гид ещё не прочитал. */
async function countUnread(guideId: number): Promise<number> {
  const rows = await bookingRepository.getBookings({
    where: { guideId },
    select: { id: true }
  });

  const unread = await messageRepository.countUnreadByBooking(
    rows.map(row => row.id),
    MessageDomain.MessageAuthorRole.GUIDE
  );

  return unread.reduce((total, row) => total + row._count._all, 0);
}

export const inboxService = { getGuideInbox, countUnread };
