import { PostWhereInput } from '../../../../generated/prisma/models';

import { postUtils } from './post-utils';

describe('postUtils', () => {
  describe('getValidStatus', () => {
    it('возвращает "legacy" для значения "legacy"', () => {
      expect(postUtils.getValidStatus('legacy')).toBe('legacy');
    });

    it('возвращает "fresh" для значения "fresh"', () => {
      expect(postUtils.getValidStatus('fresh')).toBe('fresh');
    });

    it('возвращает "unknown" для неверного статуса', () => {
      expect(postUtils.getValidStatus('invalid')).toBe('unknown');
    });

    it('возвращает "unknown" для пустой строки', () => {
      expect(postUtils.getValidStatus('')).toBe('unknown');
    });

    it('чувствителен к регистру (НЕ распознаёт "LEGACY")', () => {
      expect(postUtils.getValidStatus('LEGACY')).toBe('unknown');
    });
  });

  describe('getSearchParamsUtils', () => {
    it('возвращает undefined, если searchQuery равен null', () => {
      expect(postUtils.getSearchParamsUtils(null)).toBeUndefined();
    });

    it('возвращает undefined, если searchQuery пустая строка', () => {
      expect(postUtils.getSearchParamsUtils('')).toBeUndefined();
    });

    it('возвращает объект where с массивом OR для валидного запроса', () => {
      const result = postUtils.getSearchParamsUtils('test') as {
        where: PostWhereInput;
      };

      expect(result).toBeDefined();
      expect(result).toHaveProperty('where');
      expect(result.where).toHaveProperty('OR');
    });

    it('включает все 5 полей в массиве OR', () => {
      const result = postUtils.getSearchParamsUtils('test') as {
        where: PostWhereInput;
      };
      expect(result.where.OR).toHaveLength(5);
    });

    it('поле title использует contains и режим insensitive', () => {
      const result = postUtils.getSearchParamsUtils('search-term') as {
        where: { OR: { title: string }[] };
      };
      expect(result.where.OR[0]).toEqual({
        title: { contains: 'search-term', mode: 'insensitive' }
      });
    });

    it('поле description использует contains и режим insensitive', () => {
      const result = postUtils.getSearchParamsUtils('search-term') as {
        where: { OR: { title: string }[] };
      };
      expect(result.where.OR[1]).toEqual({
        description: { contains: 'search-term', mode: 'insensitive' }
      });
    });

    it('поле content использует contains и режим insensitive', () => {
      const result = postUtils.getSearchParamsUtils('search-term') as {
        where: { OR: { title: string }[] };
      };
      expect(result.where.OR[2]).toEqual({
        content: { contains: 'search-term', mode: 'insensitive' }
      });
    });

    it('поле metaTitle использует contains и режим insensitive', () => {
      const result = postUtils.getSearchParamsUtils('search-term') as {
        where: { OR: { title: string }[] };
      };
      expect(result.where.OR[3]).toEqual({
        metaTitle: { contains: 'search-term', mode: 'insensitive' }
      });
    });

    it('поле metaDescription использует contains и режим insensitive', () => {
      const result = postUtils.getSearchParamsUtils('search-term') as {
        where: { OR: { title: string }[] };
      };
      expect(result.where.OR[4]).toEqual({
        metaDescription: { contains: 'search-term', mode: 'insensitive' }
      });
    });

    it('корректно работает с особыми символами в запросе', () => {
      const result = postUtils.getSearchParamsUtils('t@st!#$') as {
        where: { OR: { title: { contains: string } }[] };
      };
      expect(result.where.OR[0].title.contains).toBe('t@st!#$');
    });

    it('корректно работает с пробелами в запросе', () => {
      const result = postUtils.getSearchParamsUtils('multi word') as {
        where: { OR: { title: { contains: string } }[] };
      };
      expect(result.where.OR[0].title.contains).toBe('multi word');
    });
  });
});
