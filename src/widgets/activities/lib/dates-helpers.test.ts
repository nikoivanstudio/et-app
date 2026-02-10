import { getActivitiesDates, getMonthesTitle } from './dates-helpers';

describe('dates-helpers', () => {
  it('преобразует активности в массив дат', () => {
    const dates = getActivitiesDates([
      {
        startTime: new Date('2020-01-01T00:00:00.000Z'),
        finishTime: new Date('2020-01-01T01:00:00.000Z')
      } as any
    ]);

    expect(dates).toHaveLength(1);
    expect(dates[0].startTime).toBeInstanceOf(Date);
  });

  it('возвращает название текущего месяца', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-05-01T00:00:00.000Z'));

    const title = getMonthesTitle([]);
    expect(title.toLowerCase()).toContain('май');

    jest.useRealTimers();
  });
});
