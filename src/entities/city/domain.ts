import type { City } from 'generated/prisma/client';

/** Город в том виде, в каком его показывают и по которому выбирают. */
export type CityEntity = {
  id: number;
  slug: string;
  title: string;
  regionSlug: string;
};

export const cityToEntity = (city: City): CityEntity => ({
  id: city.id,
  slug: city.slug,
  title: city.title,
  regionSlug: city.regionSlug
});

/**
 * Город для выбора в кабинете.
 *
 * Значением поля идёт слаг, а не название: название — это подпись, и
 * замена «Ялты» на «Большую Ялту» не должна отвязывать от города десяток
 * туров. Ровно от этой связи через название задача 1 и уводит.
 */
export type CityOption = {
  slug: string;
  title: string;
  regionSlug: string;
  regionTitle: string;
};
