jest.mock('@/entities/activity/server', () => ({
  ActivityDomain: {
    ActivityStatuses: {
      CREATED: 'created',
      ACTIVE: 'active',
      CANCELLED: 'cancelled',
      FINISHED: 'finished',
      REMOVED: 'remover'
    }
  },
  isActivityStatus: (value: unknown) =>
    ['created', 'active', 'cancelled', 'finished', 'remover'].includes(
      String(value)
    )
}));

import { activitySearchParams } from './activity-search-params-utils';

describe('activity-search-params-utils', () => {
  it('формирует параметры с include.author', () => {
    const params = new URLSearchParams();
    params.set('page', '2');

    const result = activitySearchParams.getParamsBySearchParams(params);

    expect(result).toHaveProperty('include', { author: true });
    expect(result).toHaveProperty('skip', 10);
    expect(result).toHaveProperty('take', 10);
  });

  it('добавляет фильтр поиска', () => {
    const params = new URLSearchParams();
    params.set('search', 'test');

    const result = activitySearchParams.getParamsBySearchParams(params) as any;

    expect(result.where).toBeDefined();
    expect(result.where.OR).toHaveLength(2);
  });
});
