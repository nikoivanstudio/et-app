import type { SitemapEntry } from '@/app/_lib/sitemap-utils';

/**
 * Статические страницы сайта.
 *
 * Модуль обязан оставаться чистой константой: раньше здесь же выполнялись
 * top-level `await` в БД, из-за чего список туров и постов вычислялся один
 * раз за жизнь процесса и больше не обновлялся никогда. Всё, что приходит из
 * БД, теперь собирается в `_lib/sitemap-service.ts` внутри функции роута.
 *
 * lastModified не указан осознанно — см. `getSitemapItem`. Как только у
 * страницы появится настоящая дата правки, её можно добавить в запись.
 */
export const staticSitemapEntries: SitemapEntry[] = [
  // Главной в sitemap не было вообще.
  { path: '/', changeFrequency: 'weekly', priority: 1 },

  // Каталоги: обновляются вместе с турами и постами.
  { path: '/tours', changeFrequency: 'daily', priority: 0.9 },
  { path: '/activities', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/posts', changeFrequency: 'daily', priority: 0.8 },
  { path: '/uslugi', changeFrequency: 'monthly', priority: 0.8 },

  { path: '/kontakty', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/otzyvy', changeFrequency: 'monthly', priority: 0.6 },

  // Легаси-лендинги, перенесённые с WordPress: контент статичен.
  { path: '/category/vse_tury', changeFrequency: 'monthly', priority: 0.6 },
  {
    // Вторая страница легаси-каталога: маршрут есть, а в sitemap не было.
    path: '/category/vse_tury/page/2',
    changeFrequency: 'monthly',
    priority: 0.4
  },
  { path: '/dzhip-tur-krym', changeFrequency: 'monthly', priority: 0.6 },
  {
    path: '/dzhip-tur-krym/ekskursii-v-krymu-s-luchshimi-tsenami',
    changeFrequency: 'monthly',
    priority: 0.6
  },
  { path: '/ekskursii_po_krymu', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/tury', changeFrequency: 'monthly', priority: 0.6 },
  {
    path: '/turisticheskie-priklyucheniya-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.6
  },

  // Страницы услуг.
  {
    path: '/uslugi/arenda-mesta-v-kempinge-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/arenda-vnedorozhnika-s-voditelem-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/klassicheskie-ekskursii-po-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/prokat-kvadrotsiklov-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/prokat-palatki-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/prokat-snegohoda-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/prokat-velosipedov-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    path: '/uslugi/prokat-zimnego-snaryazheniya-v-krymu',
    changeFrequency: 'monthly',
    priority: 0.7
  }
];
