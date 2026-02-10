import { ActivityStatuses } from '../domain';
import { isActivityStatus } from './typeguards';

describe('isActivityStatus', () => {
  it('возвращает true для допустимого статуса', () => {
    expect(isActivityStatus(ActivityStatuses.ACTIVE)).toBe(true);
  });

  it('возвращает false для недопустимого статуса', () => {
    expect(isActivityStatus('unknown')).toBe(false);
  });
});
