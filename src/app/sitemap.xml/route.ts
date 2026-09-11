import {
  SITEMAP_SECTIONS,
  sitemapSectionPath,
  sitemapService
} from '@/app/_lib/sitemap-service';
import {
  renderSitemapIndex,
  type SitemapIndexItem,
  sitemapXmlHeaders
} from '@/app/_lib/sitemap-xml';

/**
 * `/sitemap.xml` — индекс секций.
 *
 * Раньше по этому адресу лежали все 868 адресов сайта одним файлом: туры,
 * гиды, статьи, пагинация и служебные страницы вперемешку. Диагностировать
 * по такому файлу нечего — в Вебмастере он одна строка, и понять, какая
 * часть сайта не обходится, нельзя.
 *
 * Роут обычный, а не файловая конвенция `app/sitemap.ts`: её сериализатор
 * умеет только `urlset`, а `generateSitemaps` раскладывает адреса по
 * `/sitemap/<id>.xml`, но сам `/sitemap.xml` при этом начинает отвечать 404 —
 * тот самый адрес, что указан в robots.txt.
 *
 * ISR на час: sitemap не должен замерзать на сборке (новый тур не попадал
 * в него никогда), но и пересобирать список на каждый запрос робота незачем.
 * Час, а не сутки, выбран из-за сборки без доступа к БД — иначе полный
 * sitemap появлялся бы только через сутки после деплоя.
 */
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const items = await Promise.all(
    SITEMAP_SECTIONS.map<Promise<SitemapIndexItem>>(async ({ id }) => {
      const entries = await sitemapService.getSectionEntries(id);

      return {
        path: sitemapSectionPath(id),
        lastModified: sitemapService.getSectionLastModified(entries)
      };
    })
  );

  return new Response(renderSitemapIndex(items), {
    headers: sitemapXmlHeaders
  });
}
