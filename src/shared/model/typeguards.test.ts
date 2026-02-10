import { isNumber, isObject, isString, isStringArray } from './typeguards';

describe('typeguards', () => {
  it('определяет строку', () => {
    expect(isString('test')).toBe(true);
    expect(isString(1)).toBe(false);
  });

  it('определяет число', () => {
    expect(isNumber(10)).toBe(true);
    expect(isNumber('10')).toBe(false);
  });

  it('определяет объект', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
  });

  it('определяет массив строк', () => {
    expect(isStringArray(['a', 'b'])).toBe(true);
    expect(isStringArray([1, 'b'])).toBe(false);
    expect(isStringArray([])).toBe(true);
  });
});
