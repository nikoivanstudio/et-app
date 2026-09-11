import { absoluteUrl, SITE_NAME } from '@/shared/constants/site-constants';

/**
 * Хлебные крошки.
 *
 * Крошки на сайте были только на страницах услуг — и только как строка
 * с разделителями, без разметки. Поисковик в таком виде их не видит:
 * в сниппете вместо пути остаётся голый URL. Этот модуль даёт единый
 * источник и для видимой навигации, и для `BreadcrumbList`, чтобы они
 * физически не могли разойтись (см. `shared/ui/breadcrumbs.tsx`).
 *
 * Последняя крошка — текущая страница, и она намеренно без `href`:
 * ссылка на саму себя бесполезна, а в разметке у такого элемента
 * опускается `item`, что схема допускает.
 */
export type Crumb = {
  label: string;
  href?: string;
};

export const HOME_CRUMB: Crumb = { label: 'Главная', href: '/' };

/** Обрезка длинного заголовка в последней крошке. */
const CURRENT_LABEL_MAX = 60;

const currentCrumb = (label: string): Crumb => ({
  label:
    label.length > CURRENT_LABEL_MAX
      ? `${label.slice(0, CURRENT_LABEL_MAX).replace(/[\s,.;:—–-]+$/, '')}…`
      : label
});

/** Пост или страница-справочник: лежат в разделе «Интересное о Крыме». */
export const postCrumbs = (title: string): Crumb[] => [
  HOME_CRUMB,
  { label: 'Интересное о Крыме', href: '/posts' },
  currentCrumb(title)
];

/** Карточка тура. */
export const tourCrumbs = (title: string): Crumb[] => [
  HOME_CRUMB,
  { label: 'Все туры', href: '/tours' },
  currentCrumb(title)
];

/**
 * Профиль гида.
 *
 * Крошка «Гиды» появилась вместе с листингом `/guides` (E6): до него
 * промежуточного раздела не существовало, и путь обрывался на главной.
 */
export const guideCrumbs = (name: string): Crumb[] => [
  HOME_CRUMB,
  { label: 'Гиды', href: '/guides' },
  currentCrumb(name)
];

/** Страница объекта: пещерный город, каньон, дворец (E2). */
export const placeCrumbs = (title: string): Crumb[] => [
  HOME_CRUMB,
  { label: 'Места', href: '/mesta' },
  currentCrumb(title)
];

/**
 * Гео-страница: `/dzhip-tury/bahchisaray` (E3).
 *
 * Промежуточная крошка ведёт на `/dzhip-tur-krym` — посадочную по
 * джип-турам, а не на каталог: именно она отвечает запросу «джип тур Крым»,
 * и путь в сниппете должен повторять структуру раздела, а не файловую.
 */
export const geoCrumbs = (city: string): Crumb[] => [
  HOME_CRUMB,
  { label: 'Джип-туры', href: '/dzhip-tur-krym' },
  currentCrumb(city)
];

/** Раздел без вложенности: каталог, листинг, служебная страница. */
export const sectionCrumbs = (title: string): Crumb[] => [
  HOME_CRUMB,
  currentCrumb(title)
];

type ListItem = {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
};

/**
 * Разметка BreadcrumbList для страницы.
 *
 * Адреса абсолютные: схема относительных не принимает.
 */
export const buildBreadcrumbJsonLd = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  name: `Навигация — ${SITE_NAME}`,
  itemListElement: crumbs.map<ListItem>(({ label, href }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: label,
    ...(href ? { item: absoluteUrl(href) } : {})
  }))
});
