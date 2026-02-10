import { objectUtils, removeEmptyProperties } from './object-utils';

describe('object-utils', () => {
  describe('makeWithoutNull', () => {
    it('удаляет только свойства со значением null', () => {
      const result = objectUtils.makeWithoutNull({
        a: 1,
        b: null,
        c: undefined
      });
      expect(result).toEqual({ a: 1, c: undefined });
    });
  });

  describe('removeEmptyProperties', () => {
    it('удаляет все falsy-значения', () => {
      const result = removeEmptyProperties({
        a: 1,
        b: 0,
        c: '',
        d: false,
        e: null,
        f: undefined
      });
      expect(result).toEqual({ a: 1 });
    });
  });
});
