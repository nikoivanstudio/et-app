import { resolveRegion } from '@/shared/lib/geo/resolve-region';

describe('выбор региона', () => {
  it('без cookie и без приставки — регион по умолчанию', () => {
    expect(resolveRegion({ pathname: '/tours' }).slug).toBe('krym');
  });

  it('cookie действует на адресах без региона', () => {
    // Пока опубликован один регион, в cookie может стоять только он же;
    // проверяем, что известное значение не отбрасывается.
    expect(
      resolveRegion({ pathname: '/tours', cookieValue: 'krym' }).slug
    ).toBe('krym');
  });

  it('незнакомое значение cookie не ломает страницу', () => {
    expect(
      resolveRegion({ pathname: '/tours', cookieValue: 'atlantida' }).slug
    ).toBe('krym');
  });

  it('cookie неопубликованного региона игнорируется', () => {
    expect(
      resolveRegion({ pathname: '/tours', cookieValue: 'kavkaz' }).slug
    ).toBe('krym');
  });

  it('приставка выключенного региона не разбирается', () => {
    // Адрес выключенного региона отдаёт 404 и региона не задаёт: страниц
    // за ним нет. Проверка правила «адрес сильнее cookie» на двух
    // включённых регионах — в `resolve-region.priority.test.ts`.
    expect(
      resolveRegion({ pathname: '/kavkaz/tours', cookieValue: 'krym' }).slug
    ).toBe('krym');
  });
});
