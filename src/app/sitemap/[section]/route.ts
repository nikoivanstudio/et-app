import {
  SITEMAP_SECTIONS,
  type SitemapSectionId,
  sitemapService
} from '@/app/_lib/sitemap-service';
import { renderUrlset, sitemapXmlHeaders } from '@/app/_lib/sitemap-xml';

/**
 * Секция sitemap: `/sitemap/tours.xml`, `/sitemap/posts.xml` и так далее.
 *
 * Имена секций перечислены в `SITEMAP_SECTIONS`, всё остальное — 404:
 * открытый по любому имени роут сам стал бы источником мусорных адресов
 * в индексе.
 */
export const revalidate = 3600;

const SECTION_IDS = new Set<string>(SITEMAP_SECTIONS.map(({ id }) => id));

export async function generateStaticParams() {
  return SITEMAP_SECTIONS.map(({ id }) => ({ section: `${id}.xml` }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
): Promise<Response> {
  void request;

  const { section } = await params;
  const id = section.replace(/\.xml$/, '');

  if (!section.endsWith('.xml') || !SECTION_IDS.has(id)) {
    return new Response('Not Found', { status: 404 });
  }

  const entries = await sitemapService.getSectionEntries(
    id as SitemapSectionId
  );

  return new Response(renderUrlset(entries), { headers: sitemapXmlHeaders });
}
