import {
  BookingStatus,
  isActionAllowed,
  parseDesiredDate
} from '@/entities/booking/domain';

describe('isActionAllowed: что можно сделать с заявкой', () => {
  test('новую заявку берут в работу, подтверждают, отменяют и метят спамом', () => {
    expect(isActionAllowed(BookingStatus.NEW, 'contact')).toBe(true);
    expect(isActionAllowed(BookingStatus.NEW, 'confirm')).toBe(true);
    expect(isActionAllowed(BookingStatus.NEW, 'cancel')).toBe(true);
    expect(isActionAllowed(BookingStatus.NEW, 'spam')).toBe(true);
  });

  test('выполненной бывает только подтверждённая заявка', () => {
    expect(isActionAllowed(BookingStatus.CONFIRMED, 'complete')).toBe(true);
    expect(isActionAllowed(BookingStatus.NEW, 'complete')).toBe(false);
    expect(isActionAllowed(BookingStatus.CONTACTED, 'complete')).toBe(false);
  });

  test('закрытая заявка не оживает', () => {
    const closed = [
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
      BookingStatus.EXPIRED,
      BookingStatus.SPAM
    ];

    for (const status of closed) {
      expect(isActionAllowed(status, 'confirm')).toBe(false);
      expect(isActionAllowed(status, 'complete')).toBe(false);
      expect(isActionAllowed(status, 'contact')).toBe(false);
      expect(isActionAllowed(status, 'reschedule')).toBe(false);
      expect(isActionAllowed(status, 'spam')).toBe(false);
    }
  });

  test('заметку пишут в любом статусе', () => {
    expect(isActionAllowed(BookingStatus.SPAM, 'note')).toBe(true);
    expect(isActionAllowed(BookingStatus.COMPLETED, 'note')).toBe(true);
  });

  test('подтверждённую заявку не подтверждают повторно', () => {
    expect(isActionAllowed(BookingStatus.CONFIRMED, 'confirm')).toBe(false);
  });
});

describe('parseDesiredDate: желаемая дата тура', () => {
  const now = new Date('2026-09-12T10:00:00.000Z');

  test('пустое значение — это «дата не выбрана»', () => {
    expect(parseDesiredDate(undefined, now)).toEqual({ ok: true, date: null });
    expect(parseDesiredDate('', now)).toEqual({ ok: true, date: null });
  });

  test('мусор отклоняется, а не превращается в пустую дату', () => {
    expect(parseDesiredDate('не дата', now)).toEqual({
      ok: false,
      error: 'Укажите корректную дату'
    });
  });

  test('дата в прошлом отклоняется', () => {
    expect(parseDesiredDate('1990-01-01', now).ok).toBe(false);
  });

  test('сегодняшняя дата принимается', () => {
    expect(parseDesiredDate('2026-09-12', now).ok).toBe(true);
  });

  test('дата дальше двух лет отклоняется', () => {
    expect(parseDesiredDate('2030-01-01', now).ok).toBe(false);
  });

  test('ближайшая дата разбирается в Date', () => {
    const result = parseDesiredDate('2026-10-01', now);

    expect(result).toEqual({ ok: true, date: new Date('2026-10-01') });
  });
});
