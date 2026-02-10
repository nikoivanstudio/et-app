jest.mock('@/entities/tour/server', () => ({
  tourSearchUtils: {
    getSearchParamsUtils: (searchQuery: string | null) =>
      searchQuery
        ? {
            where: {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { content: { contains: searchQuery, mode: 'insensitive' } },
                { metaTitle: { contains: searchQuery, mode: 'insensitive' } },
                {
                  metaDescription: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          }
        : undefined
  }
}));

import { tourSearchParamsUtils } from './tour-search-params-utils';

describe('tour-search-params-utils', () => {
  it('формирует параметры с include.author', () => {
    const params = new URLSearchParams();
    params.set('page', '3');

    const result = tourSearchParamsUtils.getParamsBySearchParams(params);

    expect(result).toHaveProperty('include', { author: true });
    expect(result).toHaveProperty('skip', 20);
    expect(result).toHaveProperty('take', 10);
  });

  it('добавляет фильтр поиска', () => {
    const params = new URLSearchParams();
    params.set('search', 'summer');

    const result = tourSearchParamsUtils.getParamsBySearchParams(params) as any;
    expect(result.where).toBeDefined();
    expect(result.where.OR).toHaveLength(5);
  });
});
