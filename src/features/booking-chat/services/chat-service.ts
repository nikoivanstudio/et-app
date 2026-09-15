import { bookingMailer } from '@/features/booking/services/booking-mailer';

import { BookingDomain } from '@/entities/booking';
import { findPhoneLike, MessageDomain } from '@/entities/message';
import { shouldNotifyAboutMessage } from '@/entities/message/lib/notify-rules';
import { messageRepository } from '@/entities/message/server';
import { roleUtils } from '@/entities/user';
import { SessionEntity } from '@/entities/user/domain';

import { absoluteUrl } from '@/shared/constants/site-constants';
import { dbClient } from '@/shared/lib/db';
import { Either, left, right } from '@/shared/lib/either';

import { buildDisplayName } from '@/kernel/guide/domain';

import { GetThreadPayload, SendMessagePayload } from '../model/schemas';

const { MessageAuthorRole } = MessageDomain;

/**
 * Заявки, по которым переписка закрыта. Отклонённую как спам и просроченную
 * заявку гид уже не ведёт, и держать в ней открытое поле ввода — обещать
 * ответ, которого не будет. Отменённую оставляем: по ней обычно и остаются
 * вопросы.
 */
const CLOSED_FOR_WRITING = new Set<string>([
  BookingDomain.BookingStatus.SPAM,
  BookingDomain.BookingStatus.EXPIRED
]);

/** Не больше стольких сообщений от одной стороны в минуту. */
const RATE_LIMIT_PER_MINUTE = 10;

const bookingInclude = {
  tour: { select: { id: true, title: true, slug: true } },
  guide: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      login: true,
      email: true,
      notifyNewMessage: true
    }
  }
};

const loadBookingByToken = (accessToken: string) =>
  dbClient.booking.findUnique({
    where: { accessToken },
    include: bookingInclude
  });

const loadBookingById = (id: number) =>
  dbClient.booking.findUnique({ where: { id }, include: bookingInclude });

type Access = {
  booking: NonNullable<Awaited<ReturnType<typeof loadBookingById>>>;
  role: MessageDomain.MessageAuthorRole;
  userId: number | null;
};

/**
 * Кто спрашивает и имеет ли право.
 *
 * Клиент опознаётся токеном заявки — той же ссылкой, по которой он следит
 * за статусом; регистрация для переписки не нужна, иначе половина заявок
 * останется без ответа. Гид — сессией: переписку по заявке ведёт только
 * её гид, администратор — по любой (он разбирает споры).
 */
async function resolveAccess(
  payload: GetThreadPayload,
  session: SessionEntity | null
): Promise<Either<string, Access>> {
  if (payload.token) {
    const booking = await loadBookingByToken(payload.token);

    if (!booking) return left('Заявка не найдена');

    return right({
      booking,
      role: MessageAuthorRole.CLIENT,
      userId: booking.clientUserId ?? null
    });
  }

  if (!payload.bookingId) return left('Не указана заявка');
  if (!session) return left('Нужно войти в аккаунт');

  const booking = await loadBookingById(payload.bookingId);

  if (!booking) return left('Заявка не найдена');

  // Клиент с аккаунтом: заявка привязана к нему при создании.
  if (booking.clientUserId === session.id) {
    return right({
      booking,
      role: MessageAuthorRole.CLIENT,
      userId: session.id
    });
  }

  const canManageAny = roleUtils.userHasPermissionOn(
    session.role,
    'getAllBookings'
  );

  if (booking.guideId !== session.id && !canManageAny) {
    return left('Это не ваша заявка');
  }

  return right({ booking, role: MessageAuthorRole.GUIDE, userId: session.id });
}

const authorNameOf = (
  message: {
    authorRole: string;
    author: {
      firstName: string | null;
      lastName: string | null;
      login: string;
    } | null;
  },
  booking: Access['booking']
): string => {
  if (message.authorRole === MessageAuthorRole.CLIENT) {
    return booking.guestName;
  }

  return message.author
    ? buildDisplayName(message.author)
    : buildDisplayName(booking.guide);
};

async function getThread(
  payload: GetThreadPayload,
  session: SessionEntity | null
): Promise<Either<string, MessageDomain.ChatThread>> {
  const access = await resolveAccess(payload, session);

  if (access.type === 'left') return access;

  const { booking, role } = access.value;
  const rows = await messageRepository.getMessages(booking.id);

  // Открыли переписку — сообщения противоположной стороны прочитаны.
  await messageRepository.markThreadRead(booking.id, role);

  return right({
    bookingId: booking.id,
    tourTitle: booking.tour.title,
    tourSlug: booking.tour.slug,
    companionName:
      role === MessageAuthorRole.CLIENT
        ? buildDisplayName(booking.guide)
        : booking.guestName,
    viewerRole: role,
    canWrite: !CLOSED_FOR_WRITING.has(booking.status),
    messages: rows.map(row => ({
      id: row.id,
      authorRole: row.authorRole,
      authorName: authorNameOf(row, booking),
      text: row.text,
      createdAt: row.createdAt.toISOString(),
      readAt: row.readAt?.toISOString() ?? null
    }))
  });
}

async function sendMessage(
  payload: SendMessagePayload,
  session: SessionEntity | null
): Promise<Either<string, MessageDomain.ChatMessage>> {
  const access = await resolveAccess(payload, session);

  if (access.type === 'left') return access;

  const { booking, role, userId } = access.value;

  if (CLOSED_FOR_WRITING.has(booking.status)) {
    return left('Переписка по этой заявке закрыта');
  }

  // Главное правило переписки: номер телефона в ней не передаётся —
  // ни цифрами, ни словами, ни буквами вместо цифр.
  if (findPhoneLike(payload.text)) {
    return left(MessageDomain.PHONE_IN_MESSAGE_ERROR);
  }

  const recent = await messageRepository.countRecentByAuthor(
    booking.id,
    role,
    new Date(Date.now() - 60_000)
  );

  if (recent >= RATE_LIMIT_PER_MINUTE) {
    return left('Слишком много сообщений подряд. Подождите минуту');
  }

  const created = await messageRepository.createMessage({
    bookingId: booking.id,
    authorRole: role,
    authorId: userId,
    text: payload.text
  });

  await notifyCompanion(booking, role);

  return right({
    id: created.id,
    authorRole: created.authorRole,
    authorName:
      role === MessageAuthorRole.CLIENT
        ? booking.guestName
        : buildDisplayName(booking.guide),
    text: created.text,
    createdAt: created.createdAt.toISOString(),
    readAt: null
  });
}

/**
 * Письмо второй стороне о новом сообщении.
 *
 * Переписка по заявке живёт днями, и без письма ответ увидит только тот,
 * кто в эту минуту держит страницу открытой. Условия отправки — в
 * `notify-rules`: не пишем тому, кто сейчас читает, и не чаще раза
 * в четверть часа на направление.
 *
 * Ошибка отправки сообщение не отменяет: оно уже сохранено.
 */
async function notifyCompanion(
  booking: Access['booking'],
  authorRole: MessageDomain.MessageAuthorRole
): Promise<void> {
  try {
    const toClient = authorRole === MessageAuthorRole.GUIDE;
    const recipientEmail = toClient
      ? booking.guestEmail
      : (booking.guide.email ?? null);

    if (!recipientEmail) return;
    // Гид мог выключить письма о сообщениях в профиле; у гостя настроек нет —
    // он и получает письмо только потому, что другого входа в переписку
    // у него нет.
    if (!toClient && !booking.guide.notifyNewMessage) return;

    const lastNotifiedAt = toClient
      ? booking.clientNotifiedAt
      : booking.guideNotifiedAt;
    const lastReadAt = await messageRepository.getLastReadAt(
      booking.id,
      authorRole
    );

    if (!shouldNotifyAboutMessage({ lastReadAt, lastNotifiedAt })) return;

    const sent = await bookingMailer.sendMessageNotification({
      to: recipientEmail,
      authorName: toClient
        ? buildDisplayName(booking.guide)
        : booking.guestName,
      tourTitle: booking.tour.title,
      threadUrl: absoluteUrl(
        toClient
          ? `/booking/${booking.accessToken}`
          : `/dashboard/${booking.guideId}`
      )
    });

    if (!sent) return;

    await dbClient.booking.update({
      where: { id: booking.id },
      data: toClient
        ? { clientNotifiedAt: new Date() }
        : { guideNotifiedAt: new Date() }
    });
  } catch (error) {
    console.error('Не удалось уведомить о сообщении', error);
  }
}

export const chatService = { getThread, sendMessage };
