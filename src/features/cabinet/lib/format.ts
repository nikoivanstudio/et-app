import { BookingDomain } from '@/entities/booking';
import { TOUR_STATUS_LABELS, TourStatus } from '@/entities/tour/domain';

import { ChipTone } from '@/shared/ui/cabinet';

/**
 * Форматирование для кабинета.
 *
 * Собрано в одном месте, потому что одна и та же заявка показывается
 * на четырёх экранах (обзор, список, карточка, переписка), и дата там
 * должна выглядеть одинаково.
 */

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
});

const dayMonthFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit'
});

const longDateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const timeFormat = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit'
});

export const formatDate = (iso?: string | null): string =>
  iso ? dateFormat.format(new Date(iso)) : '—';

export const formatDayMonth = (iso?: string | null): string =>
  iso ? dayMonthFormat.format(new Date(iso)) : '—';

export const formatLongDate = (iso?: string | null): string =>
  iso ? longDateFormat.format(new Date(iso)) : '—';

export const formatTime = (iso?: string | null): string =>
  iso ? timeFormat.format(new Date(iso)) : '';

/** «12.09.26, 10:18» — для истории статусов и служебных отметок. */
export const formatDateTime = (iso?: string | null): string =>
  iso ? `${dateFormat.format(new Date(iso))}, ${timeFormat.format(new Date(iso))}` : '—';

/** «14 мин назад», «вчера», «12 дн назад» — как в списке заявок. */
export const formatAgo = (iso: string, now: Date = new Date()): string => {
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);

  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;

  const hours = Math.round(minutes / 60);

  if (hours < 24) return `${hours} ч назад`;

  const days = Math.round(hours / 24);

  if (days === 1) return 'вчера';

  return `${days} дн назад`;
};

/** Русские окончания: 1 гость, 2 гостя, 5 гостей. */
export const plural = (
  count: number,
  forms: [string, string, string]
): string => {
  const abs = Math.abs(count) % 100;
  const last = abs % 10;

  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];

  return forms[2];
};

export const formatPeople = (count: number): string =>
  `${count} ${plural(count, ['гость', 'гостя', 'гостей'])}`;

/** Длительность тура хранится в секундах — на экранах она в часах. */
export const formatDuration = (seconds?: number | null): string => {
  if (!seconds) return '—';

  const hours = Math.round(seconds / 3600);

  return `${hours} ${plural(hours, ['час', 'часа', 'часов'])}`;
};

export const formatMoney = (value?: number | null): string =>
  typeof value === 'number'
    ? `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
    : '—';

/** Цена без единицы измерения читается как угодно — отсюда priceUnit. */
export const PRICE_UNIT_LABELS: Record<string, string> = {
  PER_CAR: 'за машину',
  PER_PERSON: 'с человека'
};

export const formatPriceUnit = (unit?: string | null): string =>
  (unit && PRICE_UNIT_LABELS[unit]) ?? '';

export const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Лёгкий',
  MEDIUM: 'Средний',
  HARD: 'Сложный'
};

const MONTHS_SHORT = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек'
];

export const MONTHS_SHORT_LABELS = MONTHS_SHORT;

/** «Круглый год» или «Апрель — октябрь»: сезоны хранятся номерами месяцев. */
export const formatSeasons = (seasons?: number[] | null): string => {
  if (!seasons?.length || seasons.length === 12) return 'Круглый год';

  const sorted = [...seasons].sort((a, b) => a - b);
  const isContiguous = sorted.every(
    (month, index) => index === 0 || month === sorted[index - 1] + 1
  );

  if (isContiguous && sorted.length > 2) {
    return `${MONTHS_SHORT[sorted[0] - 1]} — ${MONTHS_SHORT[sorted[sorted.length - 1] - 1]}`;
  }

  return sorted.map(month => MONTHS_SHORT[month - 1]).join(', ');
};

/** Статус заявки → тон плашки и подпись. */
export const bookingChip = (
  status: string
): { tone: ChipTone; label: string } => {
  const label = BookingDomain.BOOKING_STATUS_LABELS[status] ?? status;

  switch (status) {
    case BookingDomain.BookingStatus.NEW:
      return { tone: 'new', label };
    case BookingDomain.BookingStatus.CONTACTED:
      return { tone: 'work', label };
    case BookingDomain.BookingStatus.CONFIRMED:
      return { tone: 'ok', label };
    case BookingDomain.BookingStatus.CANCELLED:
    case BookingDomain.BookingStatus.SPAM:
      return { tone: 'bad', label };
    default:
      return { tone: 'done', label };
  }
};

/** Статус тура → тон плашки и подпись. Пустой статус — черновик. */
export const tourChip = (
  status?: string | null
): { tone: ChipTone; label: string } => {
  if (!status) return { tone: 'done', label: 'Черновик' };

  const label = TOUR_STATUS_LABELS[status] ?? status;

  switch (status) {
    case TourStatus.APPROVED:
      return { tone: 'ok', label };
    case TourStatus.PENDING:
      return { tone: 'wait', label };
    case TourStatus.REJECTED:
      return { tone: 'bad', label };
    default:
      return { tone: 'done', label };
  }
};
