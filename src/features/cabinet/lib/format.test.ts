import { BookingDomain } from '@/entities/booking';
import { TourStatus } from '@/entities/tour/domain';

import {
  bookingChip,
  formatAgo,
  formatDuration,
  formatSeasons,
  plural,
  tourChip
} from './format';

describe('склонения', () => {
  it('выбирает форму по последней цифре', () => {
    const forms: [string, string, string] = ['гость', 'гостя', 'гостей'];

    expect(plural(1, forms)).toBe('гость');
    expect(plural(2, forms)).toBe('гостя');
    expect(plural(5, forms)).toBe('гостей');
    expect(plural(21, forms)).toBe('гость');
  });

  it('знает про исключение от 11 до 14', () => {
    const forms: [string, string, string] = ['отзыв', 'отзыва', 'отзывов'];

    expect(plural(11, forms)).toBe('отзывов');
    expect(plural(12, forms)).toBe('отзывов');
    expect(plural(14, forms)).toBe('отзывов');
    expect(plural(0, forms)).toBe('отзывов');
  });
});

describe('длительность', () => {
  it('переводит секунды в часы', () => {
    expect(formatDuration(3600)).toBe('1 час');
    expect(formatDuration(7200)).toBe('2 часа');
    expect(formatDuration(25200)).toBe('7 часов');
  });

  it('без значения показывает прочерк', () => {
    expect(formatDuration(null)).toBe('—');
  });
});

describe('сезоны', () => {
  it('пустой список и все месяцы — круглый год', () => {
    expect(formatSeasons([])).toBe('Круглый год');
    expect(formatSeasons([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])).toBe(
      'Круглый год'
    );
  });

  it('подряд идущие месяцы схлопывает в диапазон', () => {
    expect(formatSeasons([4, 5, 6, 7, 8, 9, 10])).toBe('Апр — Окт');
  });

  it('разрозненные месяцы перечисляет', () => {
    expect(formatSeasons([12, 1, 3])).toBe('Янв, Мар, Дек');
  });
});

describe('«сколько прошло»', () => {
  const now = new Date('2026-09-12T12:00:00.000Z');

  it('считает минуты, часы и дни', () => {
    expect(formatAgo('2026-09-12T11:46:00.000Z', now)).toBe('14 мин назад');
    expect(formatAgo('2026-09-12T08:00:00.000Z', now)).toBe('4 ч назад');
    expect(formatAgo('2026-09-11T12:00:00.000Z', now)).toBe('вчера');
    expect(formatAgo('2026-09-02T12:00:00.000Z', now)).toBe('10 дн назад');
  });
});

describe('плашки статусов', () => {
  it('новая заявка требует действия — золотая', () => {
    expect(bookingChip(BookingDomain.BookingStatus.NEW)).toEqual({
      tone: 'new',
      label: 'Новая'
    });
  });

  it('отменённая и спам — красные', () => {
    expect(bookingChip(BookingDomain.BookingStatus.CANCELLED).tone).toBe('bad');
    expect(bookingChip(BookingDomain.BookingStatus.SPAM).tone).toBe('bad');
  });

  it('тур без статуса — черновик', () => {
    expect(tourChip(null)).toEqual({ tone: 'done', label: 'Черновик' });
    expect(tourChip(TourStatus.APPROVED).tone).toBe('ok');
    expect(tourChip(TourStatus.REJECTED).tone).toBe('bad');
  });
});
