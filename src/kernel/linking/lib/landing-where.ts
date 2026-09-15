import type { Prisma } from 'generated/prisma/client';

import type { Landing } from '@/entities/landing/model/types';

/**
 * Условие подбора туров под вид посадочной.
 *
 * Три вида — три правила, и различаются они не оттенком, а смыслом
 * страницы.
 *
 * Гео-страница города (E3) — объединение: годится и тур, выезжающий
 * отсюда, и тур, заезжающий на объект рядом.
 *
 * Связка «откуда → куда» (E4) — пересечение, и это не мелочь:
 * объединение означало бы, что на `/iz-sevastopolya/mangup-kale`
 * выведены все севастопольские туры, включая те, что на Мангуп не едут, —
 * то есть страница обещает одно, а показывает другое. Связка без города
 * или без объектов — недозаполненная запись реестра, и туров у неё нет:
 * показать «все туры из Севастополя» под заголовком
 * «Севастополь → Мангуп-Кале» хуже, чем не показать ничего.
 *
 * Форматная страница (E5) — весь регион. Формат описывает способ поездки,
 * а не место: «на закат», «с детьми», «на УАЗе» — это про то, как устроен
 * выезд, и ни города, ни списка объектов у такой записи нет вовсе.
 * Отсутствие условий здесь означает «все туры региона», а не «туров нет»:
 * иначе все пять форматных страниц — опубликованных, с текстом и в
 * sitemap — оказываются тупиком без единой ссылки на тур, то есть ровно
 * тем малополезным контентом, ради отсева которого раздел и заведён.
 *
 * Отбор по региону, а не по всей базе, — цена того же перехода: тур,
 * у которого город выезда ещё не сопоставлен со справочником, на
 * форматную страницу не попадёт. Это видимое следствие невидимой
 * недоделки, и следит за ним `npm run geo:check-cities`.
 */
export const buildLandingWhere = (
  landing: Landing,
  byCity?: Prisma.TourWhereInput,
  byPlace?: Prisma.TourWhereInput
): Prisma.TourWhereInput | undefined => {
  if (landing.kind === 'route') {
    return byCity && byPlace ? { AND: [byCity, byPlace] } : undefined;
  }

  const conditions = [byCity, byPlace].filter(
    (condition): condition is Prisma.TourWhereInput => !!condition
  );

  if (landing.kind === 'format') {
    const inRegion: Prisma.TourWhereInput = {
      startCityRef: { regionSlug: landing.regionSlug }
    };

    return conditions.length
      ? { AND: [inRegion, { OR: conditions }] }
      : inRegion;
  }

  return conditions.length ? { OR: conditions } : undefined;
};
