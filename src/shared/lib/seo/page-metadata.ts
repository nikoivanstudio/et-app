import type { Metadata } from 'next';

import { SITE_LOCALE, SITE_NAME } from '@/shared/constants/site-constants';

type PageMetadataConfig = {
  title: string;
  description: string;
  /** Канонический путь страницы от корня: '/uslugi', '/tour/dzhip-tur'. */
  path: string;
  keywords?: string[];
};

/**
 * Картинка из `src/app/opengraph-image.tsx`.
 *
 * Прописана вручную, хотя это файловая конвенция: Next подставляет такую
 * картинку только тому сегменту, рядом с которым лежит файл, а сегмент,
 * объявивший свой `openGraph`, затирает openGraph родителя целиком — вместе
 * с картинкой. Так что без явной ссылки og:image остался бы только у главной.
 * Путь генерируемого роута — '/opengraph-image' (см. get-metadata-route.js).
 */
const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Energy Tour — джип туры и экскурсии по Крыму'
};

/**
 * Собирает метаданные страницы с обязательным каноническим адресом.
 *
 * Зачем нужен именно билдер, а не объект в каждом сегменте: метаданные в Next
 * наследуются вниз по дереву сегментов (shallow merge — поле, которое ребёнок
 * не переопределил, берётся у родителя). Из-за этого один `alternates.canonical
 * = '/'` в корневом layout объявлял канонической копией главной каждую
 * страницу сайта, а `openGraph` главной подставлял её же og:title и og:url
 * всем остальным. Вложенные поля (`openGraph`, `alternates`) при этом
 * заменяются целиком, частично переопределить их нельзя — поэтому каждый
 * сегмент обязан задавать их полностью, и делать это стоит в одном месте.
 *
 * Пути передаются относительными: Next разворачивает их по `metadataBase`
 * из корневого layout.
 */
export const buildPageMetadata = ({
  title,
  description,
  path,
  keywords
}: PageMetadataConfig): Metadata => ({
  title,
  description,
  ...(keywords?.length ? { keywords } : {}),
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
    url: path,
    title,
    description,
    images: [OG_IMAGE]
  }
});

/**
 * Метаданные для страниц, которых не должно быть в индексе: вход, личный
 * кабинет, страница брони по токену. robots.txt закрывает их от обхода, но
 * прямая ссылка на такую страницу всё равно может попасть в индекс — meta
 * robots закрывает и этот путь.
 */
export const buildNoindexMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false }
});
