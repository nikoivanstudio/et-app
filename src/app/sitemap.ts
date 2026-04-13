import { MetadataRoute } from 'next';

import { sitemapFileArray } from '@/app/_constants/sitemap-urls';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapFileArray;
}
