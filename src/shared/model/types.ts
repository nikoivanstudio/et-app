import type { StaticImageData } from 'next/image';

export type PropsWithClassNames = { className?: string };

export type ServerPostProps = {
  params: Promise<{ slug: string }>;
};

export type ServerTourProps = {
  params: Promise<{ slug: string }>;
};

export type WithoutNull<T> = {
  [P in keyof T as T[P] extends null ? never : P]: T[P];
};

export type PageMetaData = {
  title: string;
  description: string;
  keywords: string[];
};

export type GetApiData = {
  signal: AbortSignal;
  page: number;
  search: string;
};

export type LegacyTourCardData = {
  title: string;
  /** Фото карточки. `null` — когда снимка для услуги пока нет. */
  img: string | StaticImageData | null;
  duration: string;
  price: string;
  href: string;
};

export type LegacyServiceData = LegacyTourCardData & {
  id: number;
  content: string;
};
