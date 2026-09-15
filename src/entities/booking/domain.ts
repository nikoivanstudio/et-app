export enum BookingStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  SPAM = 'SPAM'
}

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  [BookingStatus.NEW]: 'Новая',
  [BookingStatus.CONTACTED]: 'В работе',
  [BookingStatus.CONFIRMED]: 'Подтверждена',
  [BookingStatus.COMPLETED]: 'Выполнена',
  [BookingStatus.CANCELLED]: 'Отменена',
  [BookingStatus.EXPIRED]: 'Истекла',
  [BookingStatus.SPAM]: 'Спам'
};

// Статусы, требующие внимания гида (показываются как «живые»).
export const OPEN_BOOKING_STATUSES = [
  BookingStatus.NEW,
  BookingStatus.CONTACTED,
  BookingStatus.CONFIRMED
];

export const isNewBooking = (status: string): boolean =>
  status === BookingStatus.NEW;

// Действия гида/админа над заявкой.
export type BookingActionType =
  | 'contact'
  | 'confirm'
  | 'reschedule'
  | 'cancel'
  | 'complete'
  | 'spam'
  | 'note';

/**
 * Заявки, которые уже никуда не движутся. Карточка в кабинете действий
 * по ним не показывает — до этой правки сервер их всё равно принимал,
 * и отменённую заявку можно было отметить выполненной, а выполненную —
 * спамом. В отчётности это давало выполненные туры, которых не было.
 */
export const TERMINAL_BOOKING_STATUSES: string[] = [
  BookingStatus.COMPLETED,
  BookingStatus.CANCELLED,
  BookingStatus.EXPIRED,
  BookingStatus.SPAM
];

/**
 * Какие действия допустимы в каждом статусе.
 *
 * `note` — внутренняя заметка гида, она статус не меняет и разрешена всегда,
 * в том числе по закрытой заявке: заметка часто и пишется задним числом.
 */
export const isActionAllowed = (
  status: string,
  action: BookingActionType
): boolean => {
  if (action === 'note') return true;

  if (TERMINAL_BOOKING_STATUSES.includes(status)) return false;

  switch (action) {
    case 'complete':
      // Выполненным бывает только подтверждённый тур.
      return status === BookingStatus.CONFIRMED;
    case 'contact':
      return status === BookingStatus.NEW || status === BookingStatus.CONFIRMED;
    case 'confirm':
      return status !== BookingStatus.CONFIRMED;
    default:
      return true;
  }
};

/** Дальняя граница: заявка на пять лет вперёд — опечатка, а не план. */
const MAX_DATE_AHEAD_MS = 2 * 365 * 24 * 60 * 60 * 1000;

export type DesiredDateResult =
  { ok: true; date: Date | null } | { ok: false; error: string };

/**
 * Разбор желаемой даты.
 *
 * Раньше непонятная строка молча превращалась в `null`, а дата в прошлом
 * сохранялась как есть: заявка на «1990-01-01» доезжала до кабинета гида.
 */
export const parseDesiredDate = (
  value?: string | null,
  now: Date = new Date()
): DesiredDateResult => {
  if (!value) return { ok: true, date: null };

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return { ok: false, error: 'Укажите корректную дату' };
  }

  const today = new Date(now);

  today.setHours(0, 0, 0, 0);

  if (timestamp < today.getTime()) {
    return { ok: false, error: 'Дата тура не может быть в прошлом' };
  }

  if (timestamp > now.getTime() + MAX_DATE_AHEAD_MS) {
    return { ok: false, error: 'Дата тура слишком далеко в будущем' };
  }

  return { ok: true, date: new Date(timestamp) };
};

export type StatusHistoryItem = {
  status: string;
  at: string;
  byUserId?: number;
  byRole?: string;
  note?: string;
};

// Краткие данные гида/тура для строки заявки.
export type BookingTourInfo = {
  id: number;
  title: string;
  slug: string;
};

export type BookingGuideInfo = {
  id: number;
  displayName: string;
  slug: string;
};

// Заявка в виде, пригодном для UI (даты — строки после JSON).
export type BookingListItem = {
  id: number;
  status: string;
  guideId: number;
  tourId: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  desiredDate: string | null;
  peopleCount: number;
  comment: string | null;
  cancelReason: string | null;
  guideNote: string | null;
  accessToken: string;
  createdAt: string;
  processedAt: string | null;
  /** Сколько сообщений клиента гид ещё не прочитал. */
  unreadCount: number;
  /** Подтвердил ли клиент номер кодом: неподтверждённые чаще всего боты. */
  phoneVerified: boolean;
  /** История смены статусов — лента в карточке заявки. */
  statusHistory: StatusHistoryItem[];
  tour: BookingTourInfo;
  guide?: BookingGuideInfo;
};

// Заявки одного гида (для админской группировки).
export type GuideBookingsGroup = {
  guide: BookingGuideInfo & { rating: number | null };
  newCount: number;
  total: number;
  bookings: BookingListItem[];
};
