import { Prisma } from 'generated/prisma/client';

import { dbClient } from '@/shared/lib/db';

/**
 * Города справочника.
 *
 * Порядок — `position`, а не алфавит: сверху должны стоять города,
 * из которых выезжают чаще, иначе первым в списке у гида оказывается
 * Бахчисарай просто потому, что «Б» раньше «С».
 */
const getCities = (args?: { where?: Prisma.CityWhereInput }) =>
  dbClient.city.findMany({
    where: { isPublished: true, ...(args?.where ?? {}) },
    orderBy: [{ position: 'asc' }, { title: 'asc' }]
  });

/**
 * Города по слагам — для сохранения тура и профиля: слаги приходят
 * из формы, то есть из браузера.
 *
 * Отсюда и условия. `isPublished` и перечень регионов — не украшение:
 * без них подставленный в запрос слаг привязал бы тур к городу, которого
 * нет ни в одном списке выбора, и тур стал бы невидимым и для гида,
 * и для клиента. Область выборки обязана совпадать с областью, из которой
 * гиду предложили выбирать.
 */
const getCitiesBySlugs = (slugs: string[], regionSlugs: string[]) =>
  slugs.length
    ? dbClient.city.findMany({
        where: {
          slug: { in: slugs },
          isPublished: true,
          regionSlug: { in: regionSlugs }
        }
      })
    : Promise.resolve([]);

const getCityById = (id: number) => dbClient.city.findUnique({ where: { id } });

export const cityRepositories = {
  getCities,
  getCitiesBySlugs,
  getCityById
};
