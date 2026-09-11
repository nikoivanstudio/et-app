import { staticSitemapEntries } from '@/app/_constants/sitemap-urls';
import { type SitemapEntry, sitemapUtils } from '@/app/_lib/sitemap-utils';

import { postServices } from '@/features/post/server';
import { tourService } from '@/features/tour/server';

import { guideServices } from '@/kernel/guide/server';

/**
 * Разделы sitemap.
 *
 * Было: 868 адресов одним файлом без единого `lastmod`. Такой sitemap
 * бесполезен для диагностики — в Вебмастере невозможно понять, какая часть
 * сайта не обходится, потому что часть там ровно одна. Теперь секции
 * самостоятельные, каждая отдаётся по своему адресу, а `/sitemap.xml`
 * стал индексом (см. `app/sitemap.xml/route.ts`).
 *
 * Каждая группа берётся отдельным запросом в своём try/catch, и вот почему:
 * образ собирается без DATABASE_URL (в Dockerfile доступ к боевой БД со
 * сборки убран намеренно). Раньше запросы шли top-level await'ом в
 * модуле-константе, так что любой сбой обрушивал всю сборку. Теперь
 * недоступность БД лишь означает, что секция выкладывается пустой,
 * а наполняется при первой ревалидации роута.
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

// Статические страницы: главная, каталоги, услуги, контакты.
const getStaticEntries = (): Promise<SitemapEntry[]> =>
  Promise.resolve(staticSitemapEntries);

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

// Посты живут в корне: /{slug}.
//
// Пагинации `/posts/N` здесь больше нет. Это были 76 адресов с одинаковым
// заголовком, и теперь они отдают `noindex, follow` (B4): предлагать
// поисковику обойти то, что мы сами закрыли от индексации, — противоречие,
// на которое Вебмастер отдельно жалуется.
const getPostEntries = (): Promise<SitemapEntry[]> =>
  collect('посты', async () => {
    const posts = await postServices.getPostRefs();

    const entries = posts
      .filter(post => Boolean(post.slug))
      .map(post => ({
        path: `/${post.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        lastModified: sitemapUtils.getLastModified(post)
      }));

    // Пост со слагом `tours` или `kontakty` занял бы адрес статической
    // страницы. Раньше их разводила общая дедупликация одного файла;
    // с разбиением на секции адрес попал бы в два файла сразу.
    return sitemapUtils.excludePaths(
      entries,
      staticSitemapEntries.map(entry => entry.path)
    );
  });

export type SitemapSectionId = 'static' | 'tours' | 'guides' | 'posts';

type SitemapSection = {
  id: SitemapSectionId;
  load: () => Promise<SitemapEntry[]>;
};

export const SITEMAP_SECTIONS: SitemapSection[] = [
  { id: 'static', load: getStaticEntries },
  { id: 'tours', load: getTourEntries },
  { id: 'guides', load: getGuideEntries },
  { id: 'posts', load: getPostEntries }
];

/** Адрес секции в индексе. */
export const sitemapSectionPath = (id: SitemapSectionId): string =>
  `/sitemap/${id}.xml`;

/**
 * Адреса одной секции.
 *
 * Дедупликация нужна не для красоты: легаси-посты живут в корне (`/{slug}`),
 * поэтому пост со слагом `tours` или `kontakty` дал бы тот же адрес, что
 * статическая страница. Внутри секции побеждает первое вхождение, а между
 * секциями статика идёт раньше постов — порядок в `SITEMAP_SECTIONS`.
 */
const getSectionEntries = async (
  id: SitemapSectionId
): Promise<SitemapEntry[]> => {
  const section = SITEMAP_SECTIONS.find(item => item.id === id);

  if (!section) {
    return [];
  }

  return sitemapUtils.dedupeByPath(await section.load());
};

/**
 * Самая свежая дата правки в секции — для `lastmod` в индексе.
 *
 * Поисковик по нему решает, стоит ли перекачивать секцию целиком. У
 * статики настоящих дат нет, поэтому там `lastmod` не будет вовсе: это
 * честнее, чем подставить «сегодня» каждой выкладке (см. `sitemap-utils`).
 */
const getSectionLastModified = (entries: SitemapEntry[]): Date | null =>
  entries.reduce<Date | null>(
    (latest, entry) =>
      entry.lastModified && (!latest || entry.lastModified > latest)
        ? entry.lastModified
        : latest,
    null
  );

export const sitemapService = {
  getSectionEntries,
  getSectionLastModified
};
