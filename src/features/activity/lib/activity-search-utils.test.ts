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

import { activitySearchUtils } from './activity-search-utils';
import { ActivityStatuses } from '@/entities/activity/domain';

describe('activity-search-utils', () => {
  describe('getValidStatus', () => {
    it('возвращает корректный статус, если он допустим', () => {
      expect(activitySearchUtils.getValidStatus(ActivityStatuses.ACTIVE)).toBe(
        ActivityStatuses.ACTIVE
      );
    });

    it('возвращает REMOVED для некорректного статуса', () => {
      expect(activitySearchUtils.getValidStatus('unknown')).toBe(
        ActivityStatuses.REMOVED
      );
    });
  });

  describe('getSearchParamsUtils', () => {
    it('возвращает undefined при пустом запросе', () => {
      expect(activitySearchUtils.getSearchParamsUtils(null)).toBeUndefined();
      expect(activitySearchUtils.getSearchParamsUtils('')).toBeUndefined();
    });

    it('создает where с OR по title и description', () => {
      const result = activitySearchUtils.getSearchParamsUtils('test') as any;
      expect(result.where.OR).toHaveLength(2);
      expect(result.where.OR[0]).toEqual({
        title: { contains: 'test', mode: 'insensitive' }
      });
    });
  });
});
