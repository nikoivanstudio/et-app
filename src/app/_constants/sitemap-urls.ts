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

  // Разделы фазы E: объекты (E2) и гиды (E6). Сами страницы разделов —
  // здесь, их содержимое — в секциях `places` и `guides`.
  { path: '/mesta', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/guides', changeFrequency: 'weekly', priority: 0.7 },

  { path: '/kontakty', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/otzyvy', changeFrequency: 'monthly', priority: 0.6 },

  // Служебные страницы (E8). Для агрегатора, принимающего заявки, это
  // требование закона о защите прав потребителей и коммерческий фактор,
  // который Яндекс считает явно.
  { path: '/o-nas', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/oferta', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politika', changeFrequency: 'yearly', priority: 0.3 },

  // Легаси-лендинги, перенесённые с WordPress: контент статичен.
  //
  // Список поредел после B7. Убраны адреса, которые отдают `noindex, follow`
  // и ждут склейки: `/tury` (пустая страница с описанием в четыре символа),
  // `/category/vse_tury/page/2` (пагинация с заголовком первой страницы) и
  // `/turisticheskie-priklyucheniya-v-krymu` (пересказ каталога без единой
  // ссылки на тур). Предлагать роботу обойти то, что мы сами закрыли от
  // индексации, — противоречие, на которое Вебмастер отдельно указывает.
  //
  // `/category/vse_tury` пока остаётся: это ЕДИНСТВЕННЫЙ работающий
  // каталог с карточками, пока в базе нет опубликованных туров (A4).
  // Его 301 на `/tours` лежит в `prisma/data/redirects.csv` и включается
  // вместе с наполнением каталога.
  { path: '/category/vse_tury', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/dzhip-tur-krym', changeFrequency: 'monthly', priority: 0.6 },
  // `/dzhip-tur-krym/ekskursii-v-krymu-s-luchshimi-tsenami` убран:
  // он рендерит то же содержимое, что `/uslugi/klassicheskie-ekskursii-po-krymu`,
  // и закрыт от индексации до заливки 301 (нашла проверка H1).
  // Переименован из `/ekskursii_po_krymu`: подчёркивание не считается
  // разделителем слов.
  { path: '/ekskursii-po-krymu', changeFrequency: 'monthly', priority: 0.6 },

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
