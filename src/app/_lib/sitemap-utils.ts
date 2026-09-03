import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/shared/constants/site-constants';

type SitemapItem = MetadataRoute.Sitemap[number];

export type ChangeFrequency = NonNullable<SitemapItem['changeFrequency']>;

export type SitemapEntry = {
  /** Путь от корня: '/', '/uslugi', '/tour/dzhip-tur-ai-petri'. */
  path: string;
  changeFrequency?: ChangeFrequency;
  priority?: number;
  /**
   * Дата последнего изменения. `null`/`undefined` — тега lastmod у адреса
   * не будет вовсе, и это осознанное поведение (см. комментарий ниже).
   */
  lastModified?: Date | null;
};

/**
 * Элемент sitemap.
 *
 * У `lastModified` намеренно нет значения по умолчанию. Раньше здесь стояло
 * `new Date(2026, 1, 1)` — одна захардкоженная дата на все без исключения
 * адреса (и, из-за нумерации месяцев с нуля, февраль вместо января). Такой
 * lastmod — одинаковый у всего сайта и не меняющийся от выкладки к выкладке —
 * поисковик признаёт недостоверным и перестаёт учитывать поле целиком.
 * Поэтому лучше не выдавать lastmod вообще, чем выдавать выдуманный: у
 * записей из БД он берётся из настоящих updatedAt/createdAt, а у статических
 * страниц отсутствует, пока для них не появится реальная дата правки.
 */
const getSitemapItem = ({
  path,
  changeFrequency = 'weekly',
  priority = 0.7,
  lastModified
}: SitemapEntry): SitemapItem => ({
  url: absoluteUrl(path),
  ...(lastModified ? { lastModified } : {}),
  changeFrequency,
  priority
});

/** Дата правки записи: обновление, а если его не было — создание. */
const getLastModified = (entity: {
  updatedAt?: Date | null;
  createdAt?: Date | null;
}): Date | null => entity.updatedAt ?? entity.createdAt ?? null;

/**
 * Номера страниц пагинации со второй по последнюю: [2, 3, ... n].
 *
 * Первая страница не нужна — её адрес совпадает с адресом раздела
 * (`/posts`), и именно на него у `/posts/1` указывает canonical.
 */
const getPaginationPages = (totalPages: number): number[] => {
  const pages: number[] = [];

  for (let page = 2; page <= totalPages; page += 1) {
    pages.push(page);
  }

  return pages;
};

/**
 * Убирает повторяющиеся адреса, оставляя первое вхождение.
 *
 * Нужно не для красоты: легаси-посты живут в корне (`/{slug}`), поэтому пост
 * со slug вида `tours` или `kontakty` дал бы тот же адрес, что статическая
 * страница. Статика в списке идёт первой и побеждает.
 */
const dedupeByUrl = (items: SitemapItem[]): SitemapItem[] => {
  const seen = new Set<string>();

  return items.filter(item => {
    if (seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);

    return true;
  });
};

export const sitemapUtils = {
  getSitemapItem,
  getLastModified,
  getPaginationPages,
  dedupeByUrl
};
