import { searchParamsUtils } from './search-params-utils';

describe('search-params-utils', () => {
  it('формирует параметры с include.user', () => {
    const params = new URLSearchParams();
    params.set('page', '2');

    const result = searchParamsUtils.getParamsBySearchParams(params);

    expect(result).toHaveProperty('include');
    expect(result.include).toEqual({ user: true });
    expect(result).toHaveProperty('skip', 10);
    expect(result).toHaveProperty('take', 10);
  });

  it('добавляет фильтры поиска при наличии search', () => {
    const params = new URLSearchParams();
    params.set('search', 'test');

    const result = searchParamsUtils.getParamsBySearchParams(params) as any;
    expect(result.where).toBeDefined();
    expect(result.where.OR).toHaveLength(5);
  });
});
