import {
  buildRedirectTarget,
  isRedirectStatusCode,
  normalizeRedirectSource
} from './redirect-utils';

describe('normalizeRedirectSource', () => {
  test('снимает слэш на конце', () => {
    // С прежнего сайта на WordPress один материал доступен по обоим
    // вариантам, и правило заводится один раз.
    expect(normalizeRedirectSource('/mangup-kale/')).toBe('/mangup-kale');
    expect(normalizeRedirectSource('/mangup-kale///')).toBe('/mangup-kale');
  });

  test('приводит к нижнему регистру', () => {
    expect(normalizeRedirectSource('/Chufut-Kale')).toBe('/chufut-kale');
  });

  test('добавляет ведущий слэш', () => {
    // В CSV легко написать адрес без слэша — правило не должно молча
    // выпадать из работы.
    expect(normalizeRedirectSource('tury')).toBe('/tury');
  });

  test('корень остаётся корнем', () => {
    expect(normalizeRedirectSource('/')).toBe('/');
  });
});

describe('buildRedirectTarget', () => {
  test('переносит строку запроса на цель', () => {
    // Иначе utm-метки терялись бы на каждом редиректе, и трафик из
    // рассылок и ВК сваливался бы в Метрике в «переходы по ссылкам».
    expect(buildRedirectTarget('/tours', '?utm_source=vk')).toBe(
      '/tours?utm_source=vk'
    );
  });

  test('не трогает цель с собственными параметрами', () => {
    expect(buildRedirectTarget('/tours?filter=zakat', '?utm_source=vk')).toBe(
      '/tours?filter=zakat'
    );
  });

  test('без строки запроса возвращает цель как есть', () => {
    expect(buildRedirectTarget('/tours', '')).toBe('/tours');
  });
});

describe('isRedirectStatusCode', () => {
  test('пропускает коды переадресации и 410', () => {
    expect(isRedirectStatusCode(301)).toBe(true);
    expect(isRedirectStatusCode(302)).toBe(true);
    expect(isRedirectStatusCode(410)).toBe(true);
  });

  test('отсекает всё остальное', () => {
    // Опечатка в CSV не должна приводить к ответу с произвольным кодом.
    expect(isRedirectStatusCode(200)).toBe(false);
    expect(isRedirectStatusCode(500)).toBe(false);
    expect(isRedirectStatusCode(3011)).toBe(false);
  });
});
