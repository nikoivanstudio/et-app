import { MetadataRoute } from 'next';

import { staticSitemapEntries } from '@/app/_constants/sitemap-urls';
import { sitemapService } from '@/app/_lib/sitemap-service';
import { sitemapUtils } from '@/app/_lib/sitemap-utils';

/**
 * Раньше sitemap замерзал дважды. Список собирался top-level await'ом в
 * модуле-константе — то есть один раз за жизнь процесса, — а сам роут Next
 * запекал на этапе сборки (`"compute": "static"` в prerender-manifest).
 * Новый тур или пост не попадал в sitemap никогда: только полная пересборка
 * и передеплой.
 *
 * `revalidate` переводит роут в ISR: Next перевыполняет функцию не чаще раза
 * в час и подхватывает свежие записи сам. Час, а не сутки, выбран из-за
 * сборки без доступа к БД: если на сборке разделы из БД собрать не удалось,
 * полный sitemap появится через час после деплоя, а не через сутки.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicEntries = await sitemapService.getDynamicEntries();

  // Статика идёт первой: при совпадении адреса с легаси-постом в корне
  // (`/{slug}`) в sitemap останется статическая страница.
  const items = [...staticSitemapEntries, ...dynamicEntries].map(entry =>
    sitemapUtils.getSitemapItem(entry)
  );

  return sitemapUtils.dedupeByUrl(items);
}
