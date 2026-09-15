import type { CityEntity, CityOption } from '@/entities/city/domain';
import { cityToEntity } from '@/entities/city/domain';
import { resolveCityWrite } from '@/entities/city/lib/city-write';
import { cityRepositories } from '@/entities/city/repositories/city';
import { findRegion, getPublishedRegions } from '@/entities/region/server';

/**
 * Города для выбора в кабинете.
 *
 * Города неопубликованного региона в список не попадают: гид не должен
 * заводить тур в регионе, которого на сайте ещё нет, — тур станет
 * невидимым и для него, и для клиента.
 */
const getCityOptions = async (): Promise<CityOption[]> => {
  const published = getPublishedRegions();
  const cities = await cityRepositories.getCities({
    where: { regionSlug: { in: published.map(region => region.slug) } }
  });

  return cities.map(city => ({
    slug: city.slug,
    title: city.title,
    regionSlug: city.regionSlug,
    regionTitle: findRegion(city.regionSlug)?.title ?? ''
  }));
};

const getCities = async (regionSlug?: string): Promise<CityEntity[]> => {
  const cities = await cityRepositories.getCities(
    regionSlug ? { where: { regionSlug } } : undefined
  );

  return cities.map(cityToEntity);
};

/**
 * Города по слагам из формы — и ключи, и названия сразу.
 *
 * Название нужно не для красоты: строковые колонки `start_city`
 * и `pickup_cities` продолжают заполняться до задачи 1-К, и заполняться
 * они должны из справочника, а не из того, что набрал гид. Иначе строка
 * снова разъедется с ключом, а ради устранения этого расхождения всё
 * и затевалось.
 */
const resolveCities = async (
  slugs: string[]
): Promise<Map<string, CityEntity>> => {
  const cities = await cityRepositories.getCitiesBySlugs(
    slugs,
    getPublishedRegions().map(region => region.slug)
  );

  // Ключ — слаг, и он уникален по всему справочнику (см. `city.prisma`):
  // одноимённые города в разных регионах разводятся слагом, а не
  // порядком строк в ответе.
  return new Map(cities.map(city => [city.slug, cityToEntity(city)]));
};

/** Слаг города по ключу — для формы, которая работает слагами. */
const getCitySlug = async (cityId?: number | null): Promise<string> => {
  if (!cityId) {
    return '';
  }

  const city = await cityRepositories.getCityById(cityId);

  return city?.slug ?? '';
};

export const geoServices = {
  getCitySlug,
  resolveCityWrite,
  getCities,
  getCityOptions,
  resolveCities
};
