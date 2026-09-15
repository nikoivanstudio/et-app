import type { Landing } from '@/entities/landing/model/types';

import { buildLandingWhere } from '@/kernel/linking/lib/landing-where';

const landing = (over: Partial<Landing>): Landing => ({
  slug: 'x',
  path: '/x',
  regionSlug: 'krym',
  kind: 'geo',
  title: 'X',
  metaTitle: 'X',
  metaDescription: '',
  intro: ['текст'],
  isPublished: true,
  ...over
});

const byCity = { startCityRef: { slug: 'sevastopol' } };
const byPlace = { places: { some: { place: { slug: { in: ['mangup'] } } } } };

describe('подбор туров под вид посадочной', () => {
  it('город: объединение города и объектов', () => {
    expect(
      buildLandingWhere(landing({ kind: 'geo' }), byCity, byPlace)
    ).toEqual({ OR: [byCity, byPlace] });
  });

  it('связка «откуда → куда»: пересечение', () => {
    // Объединение вывело бы на `/iz-sevastopolya/mangup-kale` все
    // севастопольские туры, включая те, что на Мангуп не едут.
    expect(
      buildLandingWhere(landing({ kind: 'route' }), byCity, byPlace)
    ).toEqual({ AND: [byCity, byPlace] });
  });

  it('недозаполненная связка туров не даёт', () => {
    expect(
      buildLandingWhere(landing({ kind: 'route' }), byCity, undefined)
    ).toBeUndefined();
  });

  it('форматная страница без города и объектов берёт туры региона', () => {
    // Формат — это способ поездки, а не место: города и объектов у такой
    // записи нет вовсе. Пустое условие оставило бы все пять форматных
    // страниц без единого тура.
    expect(
      buildLandingWhere(landing({ kind: 'format' }), undefined, undefined)
    ).toEqual({ startCityRef: { regionSlug: 'krym' } });
  });

  it('форматная страница с объектами сужает выборку внутри региона', () => {
    expect(
      buildLandingWhere(landing({ kind: 'format' }), undefined, byPlace)
    ).toEqual({
      AND: [{ startCityRef: { regionSlug: 'krym' } }, { OR: [byPlace] }]
    });
  });

  it('форматная страница чужого региона туров Крыма не берёт', () => {
    expect(
      buildLandingWhere(landing({ kind: 'format', regionSlug: 'kavkaz' }))
    ).toEqual({ startCityRef: { regionSlug: 'kavkaz' } });
  });

  it('гео-страница без города и без объектов условия не даёт', () => {
    // Здесь пустое условие вернуло бы все опубликованные туры сайта:
    // запись реестра недозаполнена, и показывать по ней нечего.
    expect(
      buildLandingWhere(landing({ kind: 'geo' }), undefined, undefined)
    ).toBeUndefined();
  });
});
