import { urlUtils } from './url-utils';

describe('urlUtils', () => {
  const originalApiRoute = process.env.API_ROUTE;

  afterEach(() => {
    process.env.API_ROUTE = originalApiRoute;
  });

  it('берет origin из location', () => {
    expect(urlUtils.getOrigin()).toBe(window.location.origin);
  });

  it('использует API_ROUTE из окружения', () => {
    process.env.API_ROUTE = '/api/v2';
    expect(urlUtils.getApiUrl()).toBe(`${window.location.origin}/api/v2`);
  });

  it('формирует url с query-параметрами и фильтрует пустые значения', () => {
    process.env.API_ROUTE = '/api';
    const result = urlUtils.getUrl('test', {
      a: '1',
      b: 0,
      c: ''
    });
    expect(result).toBe(`${window.location.origin}/api/test?a=1`);
  });

  it('использует дефолтный origin без window.location', () => {
    const originalLocation = globalThis.location;
    Object.defineProperty(globalThis, 'location', {
      value: undefined,
      configurable: true
    });

    process.env.API_ROUTE = '/api';
    const result = urlUtils.getUrl('test');

    expect(result).toBe('https://ay-petry.ru/api/test');

    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      configurable: true
    });
  });

  it('фильтрует пустые ключи в query-параметрах', () => {
    const result = urlUtils.getUrl('test', {
      '': '1',
      a: '2'
    });

    expect(result.endsWith('?a=2')).toBe(true);
  });

  it('возвращает url c вопросительным знаком при пустых параметрах (текущее поведение)', () => {
    const result = urlUtils.getUrl('test', { a: '' });
    expect(result.endsWith('/test?')).toBe(true);
  });
});
