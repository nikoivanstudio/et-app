import { isTourFavourite } from './helpers';

describe('isTourFavourite', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('возвращает false, если список избранного пустой', () => {
    expect(isTourFavourite(1)).toBe(false);
  });

  it('возвращает true, если id есть в избранном', () => {
    localStorage.setItem('favouritesTours', JSON.stringify([1, 2, 3]));
    expect(isTourFavourite(2)).toBe(true);
  });

  it('возвращает false, если данные в storage невалидны', () => {
    localStorage.setItem('favouritesTours', JSON.stringify(['1']));
    expect(isTourFavourite(1)).toBe(false);
  });
});
