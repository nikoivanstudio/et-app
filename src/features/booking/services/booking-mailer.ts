import { absoluteUrl } from '@/shared/constants/site-constants';
import { consumeEmailQuota } from '@/shared/lib/security/email-throttle';
import { emailNotifications } from '@/shared/services/email-notifications';
import { BookingCreatedClientEmail } from '@/shared/ui/booking-created-client-email';
import { BookingCreatedGuideEmail } from '@/shared/ui/booking-created-guide-email';
import { BookingMessageEmail } from '@/shared/ui/booking-message-email';

/**
 * Почта по заявкам и переписке.
 *
 * Письмо здесь — не уведомление ради уведомления, а единственный способ
 * вернуть человека в диалог: гость оставляет заявку без регистрации, ссылка
 * на неё показывалась один раз в модалке, и после закрытия вкладки переписка
 * была недостижима.
 *
 * Отправка ничего не ломает: падение почты (нет ключа, отказ Resend) гасится
 * и пишется в журнал — заявка и сообщение уже созданы, и терять их из-за
 * недоступного письма нельзя.
 */

const isMailerConfigured = (): boolean =>
  Boolean(process.env.RESEND_API_KEY && process.env.CALLBACK_FROM);

const formatDate = (date: Date | null): string | undefined =>
  date
    ? new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date)
    : undefined;

type SendArgs = {
  to: string | null | undefined;
  scope: string;
  subject: string;
  reactNode: React.ReactNode;
};

/** Общая обвязка: проверка адреса, квоты и подавление ошибок отправки. */
const send = async ({
  to,
  scope,
  subject,
  reactNode
}: SendArgs): Promise<boolean> => {
  if (!to || !isMailerConfigured()) {
    return false;
  }

  // MED-8: тот же счётчик на адрес, что и у кода подтверждения, — чтобы
  // потоком заявок нельзя было завалить чужой ящик.
  if (!consumeEmailQuota(scope, to).allowed) {
    return false;
  }

  try {
    const result = await emailNotifications.sendToEmail({
      to,
      subject,
      reactNode
    });

    return !result.error;
  } catch (error) {
    console.error('Не удалось отправить письмо', { scope, error });

    return false;
  }
};

type BookingCreatedArgs = {
  accessToken: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  desiredDate: Date | null;
  peopleCount: number;
  comment: string | null;
  tourTitle: string;
  guideId: number;
  guideName: string;
  guideEmail: string | null;
};

/** Письма о новой заявке: клиенту — ссылка, гиду — сама заявка. */
const sendBookingCreated = async (
  args: BookingCreatedArgs
): Promise<{ clientEmailed: boolean }> => {
  const bookingUrl = absoluteUrl(`/booking/${args.accessToken}`);
  const desiredDate = formatDate(args.desiredDate);

  const clientEmailed = await send({
    to: args.guestEmail,
    scope: 'booking-created',
    subject: `Заявка на тур «${args.tourTitle}»`,
    reactNode: BookingCreatedClientEmail({
      guestName: args.guestName,
      tourTitle: args.tourTitle,
      guideName: args.guideName,
      desiredDate,
      peopleCount: args.peopleCount,
      bookingUrl
    })
  });

  await send({
    to: args.guideEmail,
    scope: 'booking-guide',
    subject: `Новая заявка: ${args.tourTitle}`,
    reactNode: BookingCreatedGuideEmail({
      guestName: args.guestName,
      guestPhone: args.guestPhone,
      tourTitle: args.tourTitle,
      desiredDate,
      peopleCount: args.peopleCount,
      comment: args.comment ?? undefined,
      dashboardUrl: absoluteUrl(`/dashboard/${args.guideId}`)
    })
  });

  return { clientEmailed };
};

type MessageNotificationArgs = {
  to: string | null;
  authorName: string;
  tourTitle: string;
  /** Клиент возвращается на страницу заявки, гид — в кабинет. */
  threadUrl: string;
};

const sendMessageNotification = (
  args: MessageNotificationArgs
): Promise<boolean> =>
  send({
    to: args.to,
    scope: 'booking-message',
    subject: `Новое сообщение по туру «${args.tourTitle}»`,
    reactNode: BookingMessageEmail({
      authorName: args.authorName,
      tourTitle: args.tourTitle,
      threadUrl: args.threadUrl
    })
  });

export const bookingMailer = { sendBookingCreated, sendMessageNotification };
