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
