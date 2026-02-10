import { getOwnUserActivitiesUrl } from './url-utils';

describe('getOwnUserActivitiesUrl', () => {
  const originalApiRoute = process.env.API_ROUTE;

  afterEach(() => {
    process.env.API_ROUTE = originalApiRoute;
  });

  it('формирует url для личных активностей', () => {
    process.env.API_ROUTE = '/api';
    expect(getOwnUserActivitiesUrl()).toBe(
      `${window.location.origin}/api/activity/user`
    );
  });
});
