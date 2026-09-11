import type { SitemapEntry } from '@/app/_lib/sitemap-utils';

import { absoluteUrl } from '@/shared/constants/site-constants';

/**
 * Сериализация sitemap вручную.
 *
 * Файловая конвенция Next (`app/sitemap.ts`) умеет отдавать только `urlset` —
 * плоский список адресов. Формата `sitemapindex` в её сериализаторе нет
 * (см. `resolveSitemap` в next/dist/build/webpack/loaders/metadata), а
 * `generateSitemaps` раскладывает адреса по `/sitemap/<id>.xml`, но индекс
 * по адресу `/sitemap.xml` при этом не создаёт вовсе — на него начинает
 * отвечать 404, то есть ровно на тот адрес, который указан в robots.txt
 * и заявлен в Вебмастере. Поэтому и индекс, и секции — обычные роуты.
 */

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
};

/**
 * Экранирование адреса.
 *
 * Не формальность: в слагах справочника встречаются `&amp;`, `&laquo;`
 * и прочий мусор из HTML-сущностей (задача B8), и неэкранированный `&`
 * делает весь файл невалидным XML — Вебмастер отвергает его целиком,
 * а не отдельный адрес.
 */
const escapeXml = (value: string): string =>
  value.replace(/[&<>"']/g, char => XML_ESCAPES[char] ?? char);

const formatDate = (date: Date): string => date.toISOString();

const renderUrl = ({
  path,
  changeFrequency = 'weekly',
  priority = 0.7,
  lastModified
}: SitemapEntry): string =>
  [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(path))}</loc>`,
    ...(lastModified
      ? [`    <lastmod>${formatDate(lastModified)}</lastmod>`]
      : []),
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n');

/** Секция sitemap: список адресов одного типа. */
export const renderUrlset = (entries: SitemapEntry[]): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(renderUrl),
    '</urlset>',
    ''
  ].join('\n');

export type SitemapIndexItem = {
  /** Адрес секции от корня: '/sitemap/tours.xml'. */
  path: string;
  lastModified?: Date | null;
};

/** Индекс: перечень секций, который и лежит по адресу /sitemap.xml. */
export const renderSitemapIndex = (items: SitemapIndexItem[]): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items.map(({ path, lastModified }) =>
      [
        '  <sitemap>',
        `    <loc>${escapeXml(absoluteUrl(path))}</loc>`,
        ...(lastModified
          ? [`    <lastmod>${formatDate(lastModified)}</lastmod>`]
          : []),
        '  </sitemap>'
      ].join('\n')
    ),
    '</sitemapindex>',
    ''
  ].join('\n');

export const sitemapXmlHeaders = {
  'Content-Type': 'application/xml; charset=utf-8'
} as const;
