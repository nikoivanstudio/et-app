/**
 * Гигиена индексации (задача H2).
 *
 * Закрепляет то, что ломалось и о чём узнавали только из Вебмастера через
 * месяц: пагинация с одинаковыми заголовками в sitemap, служебные разделы
 * в карте сайта, адреса, одновременно закрытые в robots и предложенные
 * роботу, дубли между секциями.
 *
 * Чего здесь намеренно нет: проверки, что каждый адрес из sitemap
 * отвечает 200. Это сетевой обход восьмисот адресов — он идёт по
 * расписанию раз в сутки, а не на каждый коммит, и живёт в Playwright
 * (`tests/`), а не здесь.
 *
 * @jest-environment node
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { postServices } from '@/features/post/server';
import { tourService } from '@/features/tour/server';

import { guideServices } from '@/kernel/guide/server';
import { placeServices } from '@/kernel/place/server';

jest.mock('@/features/tour/server', () => ({
  tourService: { getPublishedTourRefs: jest.fn() }
}));
jest.mock('@/features/post/server', () => ({
  postServices: { getPostRefs: jest.fn() }
}));
jest.mock('@/kernel/guide/server', () => ({
  guideServices: { getGuideRefs: jest.fn() }
}));
jest.mock('@/kernel/place/server', () => ({
  placeServices: { getPublishedPlaces: jest.fn() }
}));

import { SITEMAP_SECTIONS, sitemapService } from './_lib/sitemap-service';
import type { SitemapEntry } from './_lib/sitemap-utils';
import robots from './robots';

const mockTourRefs = tourService.getPublishedTourRefs as jest.Mock;
const mockPostRefs = postServices.getPostRefs as jest.Mock;
const mockGuideRefs = guideServices.getGuideRefs as jest.Mock;
const mockPlaces = placeServices.getPublishedPlaces as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockTourRefs.mockResolvedValue([]);
  mockPostRefs.mockResolvedValue([]);
  mockGuideRefs.mockResolvedValue([]);
  mockPlaces.mockResolvedValue([]);
});

const allEntries = async (): Promise<SitemapEntry[]> => {
  const groups = await Promise.all(
    SITEMAP_SECTIONS.map(({ id }) => sitemapService.getSectionEntries(id))
  );

  return groups.flat();
};

const getDisallowed = (): string[] => {
  const { rules } = robots();
  const list = Array.isArray(rules) ? rules : [rules];

  return list.flatMap(rule => {
    const disallow = rule.disallow ?? [];

    return Array.isArray(disallow) ? disallow : [disallow];
  });
};

describe('robots.txt и sitemap не противоречат друг другу', () => {
  test('в sitemap нет адресов, закрытых в robots', async () => {
    // Предлагать роботу обойти то, что мы сами запретили, — противоречие,
    // на которое Вебмастер указывает отдельным сообщением.
    const disallowed = getDisallowed();
    const entries = await allEntries();

    const conflicting = entries.filter(entry =>
      disallowed.some(prefix => entry.path.startsWith(prefix))
    );

    expect(conflicting.map(entry => entry.path)).toEqual([]);
  });

  test('robots указывает на карту сайта', () => {
    expect(robots().sitemap).toBe('https://energy-tur.ru/sitemap.xml');
  });

  test('приватные разделы закрыты', () => {
    const disallowed = getDisallowed();

    // Адрес брони содержит токен, кабинет и дашборд — личные данные.
    ['/api', '/account', '/dashboard', '/booking', '/sign-in'].forEach(prefix =>
      expect(disallowed).toContain(prefix)
    );
  });
});

describe('в sitemap нет мусора', () => {
  test('нет пагинации', async () => {
    mockPostRefs.mockResolvedValue([
      { slug: 'nastoyashaya-statya', updatedAt: null, createdAt: null }
    ]);

    const entries = await allEntries();

    // 76 адресов /posts/N с одинаковым title (B4) и /category/vse_tury/page/2
    // с заголовком первой страницы (B7).
    expect(entries.some(entry => /\/posts\/\d+$/.test(entry.path))).toBe(false);
    expect(entries.some(entry => /\/page\/\d+$/.test(entry.path))).toBe(false);
  });

  test('нет страниц, закрытых как дубли', async () => {
    // Эти адреса отдают `noindex, follow` и ждут склейки (B7).
    const entries = await allEntries();
    const paths = entries.map(entry => entry.path);

    expect(paths).not.toContain('/tury');
    expect(paths).not.toContain('/turisticheskie-priklyucheniya-v-krymu');
    expect(paths).not.toContain(
      '/dzhip-tur-krym/ekskursii-v-krymu-s-luchshimi-tsenami'
    );
  });

  test('нет адресов с мусором из HTML-сущностей', async () => {
    // 47 слагов вида /fontan-laquo-noch-raquo приехали при импорте
    // из WordPress (B8). Пока они не переименованы, тест фиксирует
    // сам признак — чтобы новые такие адреса не появились незаметно.
    mockPostRefs.mockResolvedValue([
      { slug: 'chistyj-slag', updatedAt: null, createdAt: null }
    ]);

    const entries = await allEntries();

    entries.forEach(entry => {
      expect(entry.path).not.toMatch(
        /(laquo|raquo|mdash|ndash|nbsp|thinsp|hellip|amp|#\d{2,})/
      );
    });
  });

  test('все адреса начинаются со слэша и не содержат домена', async () => {
    mockTourRefs.mockResolvedValue([
      { slug: 'tur', updatedAt: null, createdAt: null }
    ]);

    const entries = await allEntries();

    entries.forEach(entry => {
      expect(entry.path.startsWith('/')).toBe(true);
      expect(entry.path).not.toContain('://');
    });
  });

  test('один адрес не попадает в две секции', async () => {
    // С разбиением на секции (B10) один и тот же адрес мог оказаться
    // в двух файлах сразу — для поисковика это дубль, даже если
    // страница одна.
    mockPostRefs.mockResolvedValue([
      { slug: 'mesta', updatedAt: null, createdAt: null },
      { slug: 'kontakty', updatedAt: null, createdAt: null }
    ]);

    const paths = (await allEntries()).map(entry => entry.path);

    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe('маршруты и sitemap не разъезжаются', () => {
  const PUBLIC_DIR = join(process.cwd(), 'src/app/(public)');

  /** Статические сегменты, у которых есть своя страница. */
  const collectPaths = (dir: string, prefix = ''): string[] => {
    const paths: string[] = [];

    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);

      if (!statSync(full).isDirectory() || entry.startsWith('[')) {
        continue;
      }

      const segment = entry.startsWith('(') ? '' : `/${entry}`;
      const path = `${prefix}${segment}`;

      if (readdirSync(full).includes('page.tsx')) {
        paths.push(path || '/');
      }

      paths.push(...collectPaths(full, path));
    }

    return paths;
  };

  test('каждый адрес статики из sitemap существует как маршрут', async () => {
    // Обратная ошибка тоже бывает и стоит дороже: адрес в sitemap,
    // которого нет в приложении, — это 404, предложенный роботу нами же.
    const routes = new Set(collectPaths(PUBLIC_DIR));
    const entries = await sitemapService.getSectionEntries('static');

    const missing = entries
      .map(entry => entry.path)
      // Главная лежит не в (public), а в src/app/page.tsx.
      .filter(path => path !== '/')
      .filter(path => !routes.has(path));

    expect(missing).toEqual([]);
  });

  test('посадочные фазы E перечислены в sitemap', async () => {
    const paths = (await sitemapService.getSectionEntries('landings')).map(
      entry => entry.path
    );

    expect(paths).toContain('/dzhip-tury/bahchisaray');
    expect(paths).toContain('/iz-sevastopolya/mangup-kale');
    // Заготовки без текста в карту не попадают: адрес, который в sitemap
    // есть, а содержимого не имеет, — повод для претензии к качеству.
    expect(paths).not.toContain('/dzhip-tury/sudak');
  });
});
