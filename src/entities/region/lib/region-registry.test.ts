import { existsSync } from 'node:fs';
import path from 'node:path';

import { REGIONS } from '@/entities/region/constants/regions';
import {
  findRegionByPath,
  getDefaultRegion,
  getPublishedRegions,
  regionPath
} from '@/entities/region/lib/region-registry';

describe('реестр регионов', () => {
  it('у опубликованного региона есть корневой маршрут', () => {
    // Переключатель в шапке ведёт на `regionPath(region, '/')`, то есть
    // на корень приставки. Пока сегмента в `src/app` нет, этот адрес
    // отдаёт 404 — и обещание «включение региона это один флаг»
    // оборачивается битой ссылкой в шапке на всех страницах сразу.
    // Проверено вживую: при `isPublished: true` у заготовки Кавказа
    // переключатель появляется, а `/kavkaz` отвечает 404.
    getPublishedRegions()
      .filter(region => region.pathPrefix)
      .forEach(region => {
        const segment = path.join(
          process.cwd(),
          'src/app/(public)',
          region.pathPrefix
        );

        expect([region.slug, existsSync(segment)]).toEqual([
          region.slug,
          true
        ]);
      });
  });

  it('слаги не повторяются', () => {
    const slugs = REGIONS.map(region => region.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('приставки не повторяются и заданы по форме', () => {
    const prefixes = REGIONS.map(region => region.pathPrefix);

    expect(new Set(prefixes).size).toBe(prefixes.length);

    prefixes
      .filter(Boolean)
      .forEach(prefix => expect(prefix).toMatch(/^\/[a-z0-9-]+$/));
  });

  it('пустая приставка — ровно у одного региона', () => {
    expect(REGIONS.filter(region => !region.pathPrefix)).toHaveLength(1);
  });

  it('регион по умолчанию опубликован', () => {
    expect(getDefaultRegion().isPublished).toBe(true);
  });

  it('адрес собирается с приставкой региона', () => {
    const krym = getDefaultRegion();
    const kavkaz = REGIONS.find(region => region.slug === 'kavkaz')!;

    expect(regionPath(krym, '/tours')).toBe('/tours');
    expect(regionPath(kavkaz, '/tours')).toBe('/kavkaz/tours');
  });

  it('корень региона не оканчивается косой чертой и не пуст', () => {
    REGIONS.forEach(region => {
      const root = regionPath(region, '/');

      expect(root).not.toBe('');
      expect(root === '/' || !root.endsWith('/')).toBe(true);
    });
  });

  it('регион адреса определяется по сегменту, а не по началу строки', () => {
    // `/kavkazskie-gory` — статья справочника, а не раздел региона.
    // Если бы сравнивалось начало строки, она уехала бы в чужой регион.
    expect(findRegionByPath('/kavkazskie-gory')).toBeUndefined();
  });

  it('неопубликованный регион не отдаётся ни списком, ни адресом', () => {
    expect(getPublishedRegions().map(region => region.slug)).not.toContain(
      'kavkaz'
    );
    expect(findRegionByPath('/kavkaz/tours')).toBeUndefined();
  });
});
