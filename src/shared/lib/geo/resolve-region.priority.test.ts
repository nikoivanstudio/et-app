/**
 * Правило «адрес сильнее cookie» на двух включённых регионах.
 *
 * Отдельный файл с подменённым реестром — потому что на боевом реестре
 * правило непроверяемо: опубликован один регион, и любой адрес приводит
 * к нему. Проверять механику только тогда, когда она понадобится, поздно:
 * понадобится она в день включения второго региона.
 */
jest.mock('@/entities/region/constants/regions', () => ({
  REGIONS: [
    { slug: 'krym', title: 'Крым', pathPrefix: '', isPublished: true },
    {
      slug: 'kavkaz',
      title: 'Кавказ',
      pathPrefix: '/kavkaz',
      isPublished: true
    }
  ],
  DEFAULT_REGION_SLUG: 'krym'
}));

import { resolveRegion } from '@/shared/lib/geo/resolve-region';

describe('выбор региона на двух регионах', () => {
  it('приставка в адресе побеждает cookie', () => {
    expect(
      resolveRegion({ pathname: '/kavkaz/tours', cookieValue: 'krym' }).slug
    ).toBe('kavkaz');
  });

  it('cookie действует на адресе без приставки', () => {
    expect(
      resolveRegion({ pathname: '/tours', cookieValue: 'kavkaz' }).slug
    ).toBe('kavkaz');
  });

  it('приставка не ловит похожий адрес', () => {
    // `/kavkazskie-gory` — статья справочника, а не раздел региона.
    expect(
      resolveRegion({ pathname: '/kavkazskie-gory', cookieValue: 'krym' }).slug
    ).toBe('krym');
  });

  it('корень региона относится к региону', () => {
    expect(resolveRegion({ pathname: '/kavkaz' }).slug).toBe('kavkaz');
  });
});
