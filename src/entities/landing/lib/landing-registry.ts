import { FORMAT_LANDINGS } from '@/entities/landing/constants/format-landings';
import { GEO_LANDINGS } from '@/entities/landing/constants/geo-landings';
import { ROUTE_LANDINGS } from '@/entities/landing/constants/route-landings';
import type { Landing } from '@/entities/landing/model/types';

/**
 * Реестр посадочных фазы E.
 *
 * Гео-страницы (E3) и форматные (E5) живут в одном сегменте
 * `/dzhip-tury/[slug]`: для поисковика это одна ось раздела, и разводить
 * их по разным папкам значило бы завести второй уровень вложенности там,
 * где он ничего не объясняет. Реестр следит за тем, чтобы слаги в двух
 * списках не столкнулись.
 */

const DZHIP_TURY_LANDINGS: Landing[] = [...GEO_LANDINGS, ...FORMAT_LANDINGS];

const published = (landings: Landing[]): Landing[] =>
  landings.filter(landing => landing.isPublished && landing.intro.length > 0);

/** Опубликованные страницы `/dzhip-tury/{slug}`. */
export const getDzhipTuryLandings = (): Landing[] =>
  published(DZHIP_TURY_LANDINGS);

export const findDzhipTuryLanding = (slug: string): Landing | undefined =>
  getDzhipTuryLandings().find(landing => landing.slug === slug);

/** Связки «откуда → куда» для одного города отправления. */
export const getRouteLandings = (fromSegment: string): Landing[] =>
  published(ROUTE_LANDINGS).filter(landing =>
    landing.path.startsWith(`/${fromSegment}/`)
  );

export const findRouteLanding = (
  fromSegment: string,
  slug: string
): Landing | undefined =>
  getRouteLandings(fromSegment).find(landing => landing.slug === slug);

/**
 * Все опубликованные посадочные — для sitemap и перелинковки.
 *
 * Пустой `intro` отсекается вместе с `isPublished`: заготовка без текста
 * не должна попасть ни в карту сайта, ни в блок «смотрите также».
 * Страница, которая в sitemap есть, а содержимого не имеет, — это прямой
 * повод для претензии к качеству сайта, а не безобидная недоделка.
 */
export const getAllLandings = (): Landing[] =>
  published([...DZHIP_TURY_LANDINGS, ...ROUTE_LANDINGS]);
