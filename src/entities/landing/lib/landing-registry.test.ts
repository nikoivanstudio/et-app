import { FORMAT_LANDINGS } from '@/entities/landing/constants/format-landings';
import { GEO_LANDINGS } from '@/entities/landing/constants/geo-landings';
import { ROUTE_LANDINGS } from '@/entities/landing/constants/route-landings';
import { getAllLandings } from '@/entities/landing/lib/landing-registry';
import { findRegion, regionPath } from '@/entities/region/server';

const ALL = [...GEO_LANDINGS, ...FORMAT_LANDINGS, ...ROUTE_LANDINGS];

describe('реестр посадочных и регионы', () => {
  it('у каждой посадочной есть регион из реестра', () => {
    ALL.forEach(landing => {
      expect(findRegion(landing.regionSlug)).toBeDefined();
    });
  });

  it('адрес начинается с приставки своего региона', () => {
    // Без этой проверки запись с чужой приставкой разъедется с маршрутом
    // молча: страница соберётся, но окажется в чужом регионе.
    ALL.forEach(landing => {
      const region = findRegion(landing.regionSlug)!;

      expect(landing.path.startsWith(regionPath(region, '/'))).toBe(true);
      expect(landing.path.endsWith(`/${landing.slug}`)).toBe(true);
    });
  });

  it('адреса не повторяются', () => {
    const paths = ALL.map(landing => landing.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  it('город задан слагом, а не названием', () => {
    ALL.filter(landing => landing.citySlug).forEach(landing => {
      expect(landing.citySlug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it('наружу отдаются только посадочные опубликованных регионов', () => {
    getAllLandings().forEach(landing => {
      expect(findRegion(landing.regionSlug)?.isPublished).toBe(true);
    });
  });
});
