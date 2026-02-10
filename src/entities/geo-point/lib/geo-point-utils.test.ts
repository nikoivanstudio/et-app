import { getYandexGeoLink } from './geo-point-utils';

describe('getYandexGeoLink', () => {
  it('формирует ссылку на Яндекс.Навигатор', () => {
    const url = getYandexGeoLink({ latitude: 45.123, longitude: 34.456 });
    expect(url).toBe(
      'https://yandex.ru/navi/?whatshere[point]=45.123,34.456&whatshere[zoom]=18&lang=ru&from=navi\''
    );
  });
});
