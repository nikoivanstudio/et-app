import { dbClient } from '@/shared/lib/db';

export type RedirectRule = {
  source: string;
  destination: string;
  statusCode: number;
};

/**
 * Все действующие правила одним запросом.
 *
 * Выборка целиком, а не поиск по одному адресу, — осознанно: правил порядка
 * тысячи, это десятки килобайт, и они целиком укладываются в память процесса
 * (см. `shared/lib/redirects/redirect-map.ts`). Обратный вариант — запрос
 * в БД на каждый 404 — превращает любой скан несуществующих адресов
 * в нагрузку на базу.
 */
const getActiveRedirects = (): Promise<RedirectRule[]> =>
  dbClient.redirect.findMany({
    where: { isActive: true },
    select: { source: true, destination: true, statusCode: true }
  });

export const redirectRepositories = { getActiveRedirects };
