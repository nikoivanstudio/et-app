import { dbQueryUtils } from './db-client-utils';

describe('dbQueryUtils', () => {
  describe('getDbQueryParamsByPage', () => {
    it('возвращает undefined, если params не заданы', () => {
      expect(dbQueryUtils.getDbQueryParamsByPage(undefined)).toBeUndefined();
    });

    it('возвращает take без skip для первой страницы', () => {
      const result = dbQueryUtils.getDbQueryParamsByPage({ page: 1 });
      expect(result).toEqual({ take: 10 });
    });

    it('возвращает take и skip для страниц больше первой', () => {
      const result = dbQueryUtils.getDbQueryParamsByPage({ page: 3 });
      expect(result).toEqual({ take: 10, skip: 20 });
    });
  });

  describe('getPageParams', () => {
    it('возвращает take для пустого значения', () => {
      expect(dbQueryUtils.getPageParams()).toEqual({ take: 10 });
    });

    it('возвращает take и skip для заданной страницы', () => {
      expect(dbQueryUtils.getPageParams(2)).toEqual({ take: 10, skip: 10 });
    });
  });
});
