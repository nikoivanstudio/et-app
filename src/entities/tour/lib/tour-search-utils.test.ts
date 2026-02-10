import { tourSearchUtils } from './tour-search-utils';

describe('tour-search-utils', () => {
  describe('getValidStatus', () => {
    it('возвращает new для статуса new', () => {
      expect(tourSearchUtils.getValidStatus('new')).toBe('new');
    });

    it('возвращает default для неизвестного статуса', () => {
      expect(tourSearchUtils.getValidStatus('other')).toBe('default');
    });
  });

  describe('getSearchParamsUtils', () => {
    it('возвращает undefined при пустом запросе', () => {
      expect(tourSearchUtils.getSearchParamsUtils(null)).toBeUndefined();
      expect(tourSearchUtils.getSearchParamsUtils('')).toBeUndefined();
    });

    it('создает where с OR для поиска', () => {
      const result = tourSearchUtils.getSearchParamsUtils('sea') as any;
      expect(result.where.OR).toHaveLength(5);
      expect(result.where.OR[0]).toEqual({
        title: { contains: 'sea', mode: 'insensitive' }
      });
    });
  });
});
