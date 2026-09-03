/**
 * Тестов на sitemap не было ни одного, поэтому регрессии вида «в адресах
 * туров подставлен id вместо slug» или «lastmod у всех страниц одинаковый»
 * ничем не ловились. Здесь закреплено то, что ломалось.
 *
 * @jest-environment node
 */
import { postServices } from '@/features/post/server';
import { tourService } from '@/features/tour/server';

import { guideServices } from '@/kernel/guide/server';

jest.mock('@/features/tour/server', () => ({
  tourService: { getPublishedTourRefs: jest.fn() }
}));
jest.mock('@/features/post/server', () => ({
  postServices: { getPostRefs: jest.fn(), getPostsPagesCount: jest.fn() }
}));
jest.mock('@/kernel/guide/server', () => ({
  guideServices: { getGuideRefs: jest.fn() }
}));

// Роут импортируем ПОСЛЕ объявления моков.
import sitemap from './sitemap';

const mockTourRefs = tourService.getPublishedTourRefs as jest.Mock;
const mockPostRefs = postServices.getPostRefs as jest.Mock;
const mockPostsPagesCount = postServices.getPostsPagesCount as jest.Mock;
const mockGuideRefs = guideServices.getGuideRefs as jest.Mock;

const BASE = 'https://energy-tur.ru';

beforeEach(() => {
  jest.clearAllMocks();
  mockTourRefs.mockResolvedValue([]);
  mockPostRefs.mockResolvedValue([]);
  mockPostsPagesCount.mockResolvedValue(1);
  mockGuideRefs.mockResolvedValue([]);
});

const findItem = (items: Awaited<ReturnType<typeof sitemap>>, url: string) =>
  items.find(item => item.url === url);

describe('sitemap', () => {
  test('главная страница присутствует и без слэша на конце', async () => {
    const items = await sitemap();
    const home = findItem(items, BASE);

    // Раньше список начинался с /activities: главной в sitemap не было.
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
    // Next резолвит canonical '/' в домен без слэша — адреса должны совпадать.
    expect(findItem(items, `${BASE}/`)).toBeUndefined();
  });

  test('адреса туров построены по slug, а не по id', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'dzhip-tur-ai-petri', updatedAt: null, createdAt: new Date(0) }
    ]);

    const items = await sitemap();

    expect(findItem(items, `${BASE}/tour/dzhip-tur-ai-petri`)).toBeDefined();
    // Страница тура резолвится только по slug, так что /tour/{id} — это 404.
    expect(items.some(item => /\/tour\/\d+$/.test(item.url))).toBe(false);
  });

  test('lastModified берётся из updatedAt, иначе из createdAt', async () => {
    const updatedAt = new Date('2026-08-01T10:00:00.000Z');
    const createdAt = new Date('2026-01-15T10:00:00.000Z');

    mockTourRefs.mockResolvedValue([
      { slug: 'obnovlyonnyy', updatedAt, createdAt },
      { slug: 'tolko-sozdan', updatedAt: null, createdAt }
    ]);

    const items = await sitemap();

    expect(findItem(items, `${BASE}/tour/obnovlyonnyy`)?.lastModified).toEqual(
      updatedAt
    );
    expect(findItem(items, `${BASE}/tour/tolko-sozdan`)?.lastModified).toEqual(
      createdAt
    );
  });

  test('у статических страниц нет выдуманной даты', async () => {
    const items = await sitemap();

    // Раньше всем без разбора ставился захардкоженный new Date(2026, 1, 1).
    expect(findItem(items, `${BASE}/kontakty`)?.lastModified).toBeUndefined();
  });

  test('даты не совпадают у всех адресов подряд', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'a', updatedAt: new Date('2026-03-01'), createdAt: null },
      { slug: 'b', updatedAt: new Date('2026-07-11'), createdAt: null }
    ]);

    const items = await sitemap();
    const dates = items
      .map(item => item.lastModified)
      .filter(Boolean)
      .map(String);

    expect(new Set(dates).size).toBe(dates.length);
  });

  test('пагинация постов перечисляется целиком', async () => {
    mockPostsPagesCount.mockResolvedValue(4);

    const items = await sitemap();

    // Раньше в списке была захардкожена ровно одна страница — /posts/2.
    expect(findItem(items, `${BASE}/posts/2`)).toBeDefined();
    expect(findItem(items, `${BASE}/posts/3`)).toBeDefined();
    expect(findItem(items, `${BASE}/posts/4`)).toBeDefined();
    // Первой страницы нет: её адрес — /posts, туда же смотрит canonical.
    expect(findItem(items, `${BASE}/posts/1`)).toBeUndefined();
    expect(findItem(items, `${BASE}/posts/5`)).toBeUndefined();
  });

  test('единственная страница постов не даёт лишних адресов', async () => {
    mockPostsPagesCount.mockResolvedValue(1);

    const items = await sitemap();

    expect(items.some(item => item.url.startsWith(`${BASE}/posts/`))).toBe(
      false
    );
  });

  test('гиды попадают в sitemap', async () => {
    mockGuideRefs.mockResolvedValue([
      { slug: 'ivan-gid', lastModified: new Date('2026-05-05') }
    ]);

    const items = await sitemap();

    // Раздел /guide/[slug] в sitemap не попадал вообще.
    expect(findItem(items, `${BASE}/guide/ivan-gid`)).toBeDefined();
  });

  test('посты живут в корне и не дублируют статические адреса', async () => {
    mockPostRefs.mockResolvedValue([
      { slug: 'kak-doehat-do-ai-petri', updatedAt: null, createdAt: null },
      // Легаси-пост может занять slug статической страницы.
      { slug: 'kontakty', updatedAt: null, createdAt: null }
    ]);

    const items = await sitemap();

    expect(findItem(items, `${BASE}/kak-doehat-do-ai-petri`)).toBeDefined();
    expect(items.filter(item => item.url === `${BASE}/kontakty`)).toHaveLength(
      1
    );
    // Побеждает статическая запись — у неё свой changeFrequency.
    expect(findItem(items, `${BASE}/kontakty`)?.changeFrequency).toBe('yearly');
  });

  test('посты без slug пропускаются', async () => {
    mockPostRefs.mockResolvedValue([
      { slug: '', updatedAt: null, createdAt: null }
    ]);

    const items = await sitemap();

    expect(items.some(item => item.url === BASE)).toBe(true);
    expect(items.filter(item => item.url === `${BASE}/`)).toHaveLength(0);
  });

  test('недоступность БД не обрушивает sitemap', async () => {
    // Образ собирается без DATABASE_URL, а роут пререндерится на сборке:
    // упавший запрос не должен ни валить сборку, ни обнулять остальное.
    mockTourRefs.mockRejectedValue(new Error('no database'));
    mockGuideRefs.mockRejectedValue(new Error('no database'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mockPostRefs.mockResolvedValue([
      { slug: 'zhivoy-post', updatedAt: null, createdAt: null }
    ]);

    const items = await sitemap();

    expect(findItem(items, BASE)).toBeDefined();
    expect(findItem(items, `${BASE}/uslugi`)).toBeDefined();
    // Раздел, который удалось получить, остаётся на месте.
    expect(findItem(items, `${BASE}/zhivoy-post`)).toBeDefined();
    expect(items.some(item => item.url.includes('/tour/'))).toBe(false);
  });

  test('все адреса абсолютные и уникальные', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'tur', updatedAt: null, createdAt: null }
    ]);
    mockPostsPagesCount.mockResolvedValue(3);

    const items = await sitemap();
    const urls = items.map(item => item.url);

    expect(urls.every(url => url.startsWith(BASE))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
