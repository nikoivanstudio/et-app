import { tourService } from '@/features/tour/server';
import { postServices } from '@/features/post/server';
import { sitemapUtils } from '@/app/_lib/sitemap-utils';
import { MetadataRoute } from 'next/dist/lib/metadata/types/metadata-interface';

export const baseUrl = 'https://energy-tur.ru';

export const staticUrls = [
  `${baseUrl}/activities`,
  `${baseUrl}/category/vse_tury`,
  `${baseUrl}/dzhip-tur-krym`,
  `${baseUrl}/dzhip-tur-krym/ekskursii-v-krymu-s-luchshimi-tsenami`,
  `${baseUrl}/ekskursii_po_krymu`,
  `${baseUrl}/kontakty`,
  `${baseUrl}/otzyvy`,
  `${baseUrl}/posts`,
  `${baseUrl}/posts/2`,
  `${baseUrl}/tours`,
  `${baseUrl}/turisticheskie-priklyucheniya-v-krymu`,
  `${baseUrl}/tury`,
  `${baseUrl}/uslugi`,
  `${baseUrl}/uslugi/arenda-mesta-v-kempinge-v-krymu`,
  `${baseUrl}/uslugi/arenda-vnedorozhnika-s-voditelem-v-krymu`,
  `${baseUrl}/uslugi/klassicheskie-ekskursii-po-krymu`,
  `${baseUrl}/uslugi/prokat-kvadrotsiklov-v-krymu`,
  `${baseUrl}/uslugi/prokat-palatki-v-krymu`,
  `${baseUrl}/uslugi/prokat-snegohoda-v-krymu`,
  `${baseUrl}/uslugi/prokat-velosipedov-v-krymu`,
  `${baseUrl}/uslugi/prokat-zimnego-snaryazheniya-v-krymu`
];

const staticFileItems = staticUrls.map(url =>
  sitemapUtils.getSitemapItem(url, 'monthly')
);

const tours = await tourService.getToursIds();
const tourFileItems = tours.map(({ id }) =>
  sitemapUtils.getSitemapItem(`${baseUrl}/tour/${id}`, 'weekly')
);

const posts = await postServices.getPostsSlugs();
const postFileItems = posts.map(({ slug }) =>
  sitemapUtils.getSitemapItem(`${baseUrl}/${slug}`, 'monthly')
);

export const sitemapFileArray: MetadataRoute.Sitemap = [
  ...staticFileItems,
  ...tourFileItems,
  ...postFileItems
];
