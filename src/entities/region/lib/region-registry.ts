import {
  DEFAULT_REGION_SLUG,
  REGIONS
} from '@/entities/region/constants/regions';
import type { Region } from '@/entities/region/model/types';

/** Все регионы, включая заготовки. Наружу отдаётся только published. */
export const getRegions = (): Region[] => REGIONS;

export const getPublishedRegions = (): Region[] =>
  REGIONS.filter(region => region.isPublished);

export const findRegion = (slug?: string | null): Region | undefined =>
  slug ? REGIONS.find(region => region.slug === slug) : undefined;

export const isRegionPublished = (slug: string): boolean =>
  !!findRegion(slug)?.isPublished;

/**
 * Регион по умолчанию.
 *
 * Не `REGIONS[0]`: порядок в списке — вопрос оформления, а регион по
 * умолчанию — решение, и меняться они должны независимо.
 */
export const getDefaultRegion = (): Region => {
  const region = findRegion(DEFAULT_REGION_SLUG);

  if (!region) {
    throw new Error(
      `Регион по умолчанию «${DEFAULT_REGION_SLUG}» отсутствует в реестре`
    );
  }

  return region;
};

/**
 * Адрес внутри региона.
 *
 * Единственный способ собрать ссылку: у Крыма приставка пустая, у прочих —
 * `/kavkaz`, и вызывающий код об этой разнице знать не должен.
 */
export const regionPath = (region: Region, path = '/'): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  // Корень региона — это `/kavkaz`, а не `/kavkaz/`, и `/` для Крыма,
  // а не пустая строка: пустой href в ссылке ведёт на текущий адрес.
  if (normalized === '/') {
    return region.pathPrefix || '/';
  }

  return `${region.pathPrefix}${normalized}`;
};

/**
 * Регион, которому принадлежит адрес.
 *
 * Сравниваются именно сегменты, а не начало строки: префикс `/kavkaz`
 * иначе поймал бы `/kavkazskie-gory`. Крым с пустым префиксом подходит
 * любому адресу и потому проверяется последним.
 */
export const findRegionByPath = (pathname: string): Region | undefined => {
  const withPrefix = getPublishedRegions()
    .filter(region => region.pathPrefix)
    .find(
      region =>
        pathname === region.pathPrefix ||
        pathname.startsWith(`${region.pathPrefix}/`)
    );

  return withPrefix;
};
