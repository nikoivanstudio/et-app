import { dateUtils } from './date-utils';

describe('dateUtils', () => {
  describe('getFormattedDate', () => {
    it('форматирует дату в строку', () => {
      const date = new Date(2020, 0, 2, 3, 4);
      expect(dateUtils.getFormattedDate(date)).toBe('2020-1-2 3:4');
    });
  });

  describe('getFormattedValue', () => {
    it('возвращает значение без дополнения, если длина меньше minLength', () => {
      expect(dateUtils.getFormattedValue('1', 2)).toBe('1');
    });

    it('возвращает исходную строку, если длина больше либо равна minLength', () => {
      expect(dateUtils.getFormattedValue('123', 2)).toBe('123');
    });
  });
});
