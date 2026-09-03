import { type SitemapEntry,sitemapUtils } from '@/app/_lib/sitemap-utils';

import { postServices } from '@/features/post/server';
import { tourService } from '@/features/tour/server';

import { guideServices } from '@/kernel/guide/server';

/**
 * Разделы sitemap, которые живут в БД.
 *
 * Каждая группа берётся отдельным запросом в своём try/catch, и вот почему:
 * образ собирается без DATABASE_URL (в Dockerfile доступ к боевой БД со
 * сборки убран намеренно), а роут sitemap Next пререндерит на этапе сборки.
 * Раньше запросы шли top-level await'ом в модуле-константе, так что любой
 * сбой обрушивал всю сборку. Теперь недоступность БД лишь означает, что
 * sitemap выкладывается со статическими адресами, а остальные разделы
 * появляются при первой ревалидации роута.
 */
const collect = async (
  section: string,
  load: () => Promise<SitemapEntry[]>
): Promise<SitemapEntry[]> => {
  try {
    return await load();
  } catch (error) {
    console.error(
      `[sitemap] не удалось собрать раздел «${section}», он будет пропущен`,
      error
    );

    return [];
  }
};

// Страницы туров: /tour/{slug}. Именно slug, а не id — по нему страница и
// резолвится.
const getTourEntries = (): Promise<SitemapEntry[]> =>
  collect('туры', async () => {
    const tours = await tourService.getPublishedTourRefs();

    return tours.map(tour => ({
      path: `/tour/${tour.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      lastModified: sitemapUtils.getLastModified(tour)
    }));
  });

// Посты живут в корне: /{slug}.
const getPostEntries = (): Promise<SitemapEntry[]> =>
  collect('посты', async () => {
    const posts = await postServices.getPostRefs();

    return posts
      .filter(post => Boolean(post.slug))
      .map(post => ({
        path: `/${post.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        lastModified: sitemapUtils.getLastModified(post)
      }));
  });

// Пагинация постов: /posts/2 … /posts/N. Раньше в списке была захардкожена
// ровно одна вторая страница, сколько бы их ни было на самом деле.
const getPostPaginationEntries = (): Promise<SitemapEntry[]> =>
  collect('пагинация постов', async () => {
    const totalPages = await postServices.getPostsPagesCount();

    return sitemapUtils.getPaginationPages(totalPages).map(page => ({
      path: `/posts/${page}`,
      changeFrequency: 'daily' as const,
      priority: 0.4
    }));
  });

// Страницы гидов: /guide/{slug}. Раздела в sitemap не было вовсе.
const getGuideEntries = (): Promise<SitemapEntry[]> =>
  collect('гиды', async () => {
    const guides = await guideServices.getGuideRefs();

    return guides.map(guide => ({
      path: `/guide/${guide.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      lastModified: guide.lastModified
    }));
  });

const getDynamicEntries = async (): Promise<SitemapEntry[]> => {
  const groups = await Promise.all([
    getTourEntries(),
    getGuideEntries(),
    getPostEntries(),
    getPostPaginationEntries()
  ]);

  return groups.flat();
};

export const sitemapService = { getDynamicEntries };
