/**
 * Тестов на sitemap не было ни одного, поэтому регрессии вида «в адресах
 * туров подставлен id вместо slug» или «lastmod у всех страниц одинаковый»
 * ничем не ловились. Здесь закреплено то, что ломалось.
 *
 * С задачи B10 sitemap разбит на секции, и проверяется как содержимое
 * каждой секции, так и сам XML: индекс, экранирование, отсутствие
 * пагинации.
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
  postServices: { getPostRefs: jest.fn() }
}));
jest.mock('@/kernel/guide/server', () => ({
  guideServices: { getGuideRefs: jest.fn() }
}));

// Модули импортируем ПОСЛЕ объявления моков.
import {
  SITEMAP_SECTIONS,
  type SitemapSectionId,
  sitemapService
} from './_lib/sitemap-service';
import type { SitemapEntry } from './_lib/sitemap-utils';
import { renderSitemapIndex, renderUrlset } from './_lib/sitemap-xml';

const mockTourRefs = tourService.getPublishedTourRefs as jest.Mock;
const mockPostRefs = postServices.getPostRefs as jest.Mock;
const mockGuideRefs = guideServices.getGuideRefs as jest.Mock;

const BASE = 'https://energy-tur.ru';

beforeEach(() => {
  jest.clearAllMocks();
  mockTourRefs.mockResolvedValue([]);
  mockPostRefs.mockResolvedValue([]);
  mockGuideRefs.mockResolvedValue([]);
});

const section = (id: SitemapSectionId) => sitemapService.getSectionEntries(id);

const findEntry = (entries: SitemapEntry[], path: string) =>
  entries.find(entry => entry.path === path);

/** Все адреса сайта разом — как раньше выглядел единственный файл. */
const allEntries = async (): Promise<SitemapEntry[]> => {
  const groups = await Promise.all(
    SITEMAP_SECTIONS.map(({ id }) => section(id))
  );

  return groups.flat();
};

describe('секции sitemap', () => {
  test('главная страница присутствует и без слэша на конце', async () => {
    const entries = await section('static');
    const home = findEntry(entries, '/');

    // Раньше список начинался с /activities: главной в sitemap не было.
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
  });

  test('адреса туров построены по slug, а не по id', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'dzhip-tur-ai-petri', updatedAt: null, createdAt: new Date(0) }
    ]);

    const entries = await section('tours');

    expect(findEntry(entries, '/tour/dzhip-tur-ai-petri')).toBeDefined();
    // Страница тура резолвится только по slug, так что /tour/{id} — это 404.
    expect(entries.some(entry => /\/tour\/\d+$/.test(entry.path))).toBe(false);
  });

  test('lastModified берётся из updatedAt, иначе из createdAt', async () => {
    const updatedAt = new Date('2026-08-01T10:00:00.000Z');
    const createdAt = new Date('2026-01-15T10:00:00.000Z');

    mockTourRefs.mockResolvedValue([
      { slug: 'obnovlyonnyy', updatedAt, createdAt },
      { slug: 'tolko-sozdan', updatedAt: null, createdAt }
    ]);

    const entries = await section('tours');

    expect(findEntry(entries, '/tour/obnovlyonnyy')?.lastModified).toEqual(
      updatedAt
    );
    expect(findEntry(entries, '/tour/tolko-sozdan')?.lastModified).toEqual(
      createdAt
    );
  });

  test('у статических страниц нет выдуманной даты', async () => {
    const entries = await section('static');

    // Раньше всем без разбора ставился захардкоженный new Date(2026, 1, 1).
    expect(findEntry(entries, '/kontakty')?.lastModified).toBeUndefined();
  });

  test('гиды попадают в sitemap', async () => {
    mockGuideRefs.mockResolvedValue([
      { slug: 'ivan-gid', lastModified: new Date('2026-05-05') }
    ]);

    const entries = await section('guides');

    // Раздел /guide/[slug] в sitemap не попадал вообще.
    expect(findEntry(entries, '/guide/ivan-gid')).toBeDefined();
  });

  test('посты живут в корне и не занимают адреса статических страниц', async () => {
    mockPostRefs.mockResolvedValue([
      { slug: 'kak-doehat-do-ai-petri', updatedAt: null, createdAt: null },
      // Легаси-пост может занять slug статической страницы.
      { slug: 'kontakty', updatedAt: null, createdAt: null }
    ]);

    const entries = await section('posts');

    expect(findEntry(entries, '/kak-doehat-do-ai-petri')).toBeDefined();
    expect(findEntry(entries, '/kontakty')).toBeUndefined();
  });

  test('посты без slug пропускаются', async () => {
    mockPostRefs.mockResolvedValue([
      { slug: '', updatedAt: null, createdAt: null }
    ]);

    const entries = await section('posts');

    expect(entries).toHaveLength(0);
  });

  test('пагинации постов в sitemap нет', async () => {
    // B4: 76 адресов /posts/N с одинаковым title теперь отдают
    // noindex, follow — предлагать их роботу было бы противоречием.
    const entries = await allEntries();

    expect(entries.some(entry => /^\/posts\/\d+$/.test(entry.path))).toBe(
      false
    );
  });

  test('недоступность БД не обрушивает sitemap', async () => {
    // Роут пререндерится на сборке: упавший запрос к БД не должен ни валить
    // сборку, ни обнулять остальные разделы.
    mockTourRefs.mockRejectedValue(new Error('no database'));
    mockGuideRefs.mockRejectedValue(new Error('no database'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mockPostRefs.mockResolvedValue([
      { slug: 'zhivoy-post', updatedAt: null, createdAt: null }
    ]);

    expect(await section('tours')).toHaveLength(0);
    // Разделы, которые удалось получить, остаются на месте.
    expect(findEntry(await section('posts'), '/zhivoy-post')).toBeDefined();
    expect(findEntry(await section('static'), '/uslugi')).toBeDefined();
  });

  test('адреса уникальны внутри секции', async () => {
    mockPostRefs.mockResolvedValue([
      { slug: 'odin', updatedAt: null, createdAt: null },
      { slug: 'odin', updatedAt: null, createdAt: null }
    ]);

    const paths = (await section('posts')).map(entry => entry.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  test('дата секции — самая свежая из её адресов', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'a', updatedAt: new Date('2026-03-01'), createdAt: null },
      { slug: 'b', updatedAt: new Date('2026-07-11'), createdAt: null }
    ]);

    const lastModified = sitemapService.getSectionLastModified(
      await section('tours')
    );

    expect(lastModified).toEqual(new Date('2026-07-11'));
  });

  test('у секции без настоящих дат lastmod отсутствует', async () => {
    expect(
      sitemapService.getSectionLastModified(await section('static'))
    ).toBeNull();
  });
});

describe('сериализация sitemap', () => {
  test('адреса абсолютные', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'tur', updatedAt: null, createdAt: null }
    ]);

    const xml = renderUrlset(await section('tours'));

    expect(xml).toContain(`<loc>${BASE}/tour/tur</loc>`);
  });

  test('амперсанд в слаге экранируется', () => {
    // В слагах справочника встречается мусор из HTML-сущностей (B8).
    // Неэкранированный & делает файл невалидным XML целиком, а не
    // один адрес: Вебмастер отвергает такой sitemap полностью.
    const xml = renderUrlset([{ path: '/fontan-laquo&raquo-noch' }]);

    expect(xml).toContain('&amp;raquo');
    expect(xml).not.toMatch(/<loc>[^<]*[^&;]&(?!amp;)/);
  });

  test('lastmod не выводится, если настоящей даты нет', () => {
    const xml = renderUrlset([{ path: '/kontakty' }]);

    expect(xml).not.toContain('<lastmod>');
  });

  test('индекс перечисляет секции', () => {
    const xml = renderSitemapIndex([
      { path: '/sitemap/tours.xml', lastModified: new Date('2026-07-11') },
      { path: '/sitemap/static.xml', lastModified: null }
    ]);

    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain(`<loc>${BASE}/sitemap/tours.xml</loc>`);
    expect(xml).toContain(`<loc>${BASE}/sitemap/static.xml</loc>`);
    // У статики настоящей даты нет — тега быть не должно.
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
  });
});
