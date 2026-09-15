import { dbClient } from '@/shared/lib/db';

import { Message, Prisma } from '../../../../generated/prisma/client';

const createMessage = (
  data: Prisma.MessageUncheckedCreateInput
): Promise<Message> => dbClient.message.create({ data });

const getMessages = (bookingId: number) =>
  dbClient.message.findMany({
    where: { bookingId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: { firstName: true, lastName: true, login: true } }
    }
  });

const countRecentByAuthor = (
  bookingId: number,
  authorRole: string,
  since: Date
): Promise<number> =>
  dbClient.message.count({
    where: { bookingId, authorRole, createdAt: { gt: since } }
  });

/** Прочитать всё, что написала противоположная сторона. */
const markThreadRead = (bookingId: number, readerRole: string) =>
  dbClient.message.updateMany({
    where: { bookingId, authorRole: { not: readerRole }, readAt: null },
    data: { readAt: new Date() }
  });

/**
 * Когда сообщения этого автора последний раз читала вторая сторона.
 * По этой отметке видно, сидит ли получатель в переписке прямо сейчас.
 */
const getLastReadAt = async (
  bookingId: number,
  authorRole: string
): Promise<Date | null> => {
  const result = await dbClient.message.aggregate({
    where: { bookingId, authorRole },
    _max: { readAt: true }
  });

  return result._max.readAt ?? null;
};

/**
 * Последнее сообщение в каждой из заявок — строка превью в списке переписок.
 *
 * `distinct` по bookingId вместе с сортировкой по убыванию даты оставляет
 * по одной, самой свежей записи на заявку: без этого пришлось бы тянуть
 * всю переписку по каждой и резать в памяти.
 */
const getLastMessagesByBooking = (bookingIds: number[]) =>
  dbClient.message.findMany({
    where: { bookingId: { in: bookingIds } },
    orderBy: { createdAt: 'desc' },
    distinct: ['bookingId']
  });

/** Непрочитанное по каждой заявке — для счётчиков в списке. */
const countUnreadByBooking = (bookingIds: number[], readerRole: string) =>
  dbClient.message.groupBy({
    by: ['bookingId'],
    where: {
      bookingId: { in: bookingIds },
      authorRole: { not: readerRole },
      readAt: null
    },
    _count: { _all: true }
  });

export const messageRepository = {
  createMessage,
  getMessages,
  countRecentByAuthor,
  getLastMessagesByBooking,
  getLastReadAt,
  markThreadRead,
  countUnreadByBooking
};
