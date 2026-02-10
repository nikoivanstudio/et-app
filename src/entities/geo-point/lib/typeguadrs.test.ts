import { isGeoPointEntity } from './typeguadrs';

describe('isGeoPointEntity', () => {
  it('возвращает true для валидного объекта', () => {
    expect(isGeoPointEntity({ latitude: 45.1, longitude: 34.2 })).toBe(true);
  });

  it('возвращает false для невалидного объекта', () => {
    expect(isGeoPointEntity({ latitude: '45', longitude: 34.2 })).toBe(false);
  });
});
