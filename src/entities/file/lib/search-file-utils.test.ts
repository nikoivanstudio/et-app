import { searchFileUtils } from './search-file-utils';

describe('searchFileUtils', () => {
  describe('getSearchParamsUtils', () => {
    it('returns undefined for empty search query', () => {
      expect(searchFileUtils.getSearchParamsUtils(null)).toBeUndefined();
      expect(searchFileUtils.getSearchParamsUtils('')).toBeUndefined();
    });

    it('builds originalName contains filter', () => {
      expect(searchFileUtils.getSearchParamsUtils('report')).toEqual({
        originalName: { contains: 'report', mode: 'insensitive' }
      });
    });
  });

  describe('getAuthorParams', () => {
    it('returns undefined for empty or invalid author id', () => {
      expect(searchFileUtils.getAuthorParams(null)).toBeUndefined();
      expect(searchFileUtils.getAuthorParams('abc')).toBeUndefined();
    });

    it('builds numeric author filter', () => {
      expect(searchFileUtils.getAuthorParams('42')).toEqual({ authorId: 42 });
    });
  });

  describe('getDateParams', () => {
    it('returns undefined when both dates are missing or invalid', () => {
      expect(searchFileUtils.getDateParams(null, null)).toBeUndefined();
      expect(
        searchFileUtils.getDateParams('invalid-date', 'also-invalid')
      ).toBeUndefined();
    });

    it('builds only gte for start_date', () => {
      const result = searchFileUtils.getDateParams('2026-01-10', null);
      expect(result).toBeDefined();
      expect(result?.createdAt).toHaveProperty('gte');
      expect(result?.createdAt).not.toHaveProperty('lt');
      expect((result?.createdAt as { gte: Date }).gte).toBeInstanceOf(Date);
    });

    it('builds only lt for end_date', () => {
      const result = searchFileUtils.getDateParams(null, '2026-01-12');
      expect(result).toBeDefined();
      expect(result?.createdAt).toHaveProperty('lt');
      expect(result?.createdAt).not.toHaveProperty('gte');
      expect((result?.createdAt as { lt: Date }).lt).toBeInstanceOf(Date);
    });

    it('builds inclusive date range with gte and lt', () => {
      const result = searchFileUtils.getDateParams('2026-01-10', '2026-01-12');
      expect(result).toBeDefined();
      expect(result?.createdAt).toHaveProperty('gte');
      expect(result?.createdAt).toHaveProperty('lt');

      const createdAt = result?.createdAt as { gte: Date; lt: Date };
      expect(createdAt.gte.getTime()).toBeLessThan(createdAt.lt.getTime());
    });
  });
});
