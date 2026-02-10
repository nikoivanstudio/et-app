import {
  getOwnUserToursUrl,
  getTourCardsUrl,
  getUserToursUrl
} from './url-utils';

describe('tours url-utils', () => {
  const originalApiRoute = process.env.API_ROUTE;

  afterEach(() => {
    process.env.API_ROUTE = originalApiRoute;
  });

  it('формирует url для туров пользователя', () => {
    process.env.API_ROUTE = '/api';
    expect(getUserToursUrl(10)).toBe(
      `${window.location.origin}/api/tours/user?user_id=10`
    );
  });

  it('формирует url для собственных туров', () => {
    process.env.API_ROUTE = '/api';
    expect(getOwnUserToursUrl()).toBe(
      `${window.location.origin}/api/tours/user`
    );
  });

  it('формирует url для карточек туров', () => {
    process.env.API_ROUTE = '/api';
    expect(getTourCardsUrl(2)).toBe(
      `${window.location.origin}/api/tours?cards=true&page=2`
    );
  });
});
