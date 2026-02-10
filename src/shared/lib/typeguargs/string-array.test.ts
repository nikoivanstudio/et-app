import { isStringArray } from './string-array';

describe('isStringArray', () => {
  it('возвращает true для массива строк', () => {
    expect(isStringArray(['a', 'b'])).toBe(true);
  });

  it('возвращает false для массива с нестроковыми значениями', () => {
    expect(isStringArray(['a', 1])).toBe(false);
  });

  it('возвращает false для не-массива', () => {
    expect(isStringArray(null)).toBe(false);
  });
});
