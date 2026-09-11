import { redirectService } from '@/entities/redirect/server';

/**
 * Правила переадресации для прокси.
 *
 * Роут существует ради одного потребителя — `shared/lib/redirects/redirect-map.ts`.
 * Прокси в Next 16 собирается отдельным бандлом и по замыслу может
 * исполняться вне основного рантайма, поэтому тащить туда Prisma нельзя;
 * список он забирает обычным запросом и держит в памяти минуту.
 *
 * Данные не приватные: это перечень адресов, каждый из которых и так
 * отдаётся любому посетителю в виде заголовка `Location`. Раздел `/api`
 * закрыт в robots.txt, поэтому в индекс он не попадёт.
 *
 * `force-dynamic` обязателен: смысл таблицы в том, что редирект добавляется
 * данными, а не деплоем, — запечённый на сборке ответ это ломает.
 */
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    const rules = await redirectService.getRedirectRules();

    return Response.json(rules);
  } catch (error) {
    console.error('[redirects] не удалось прочитать правила', error);

    // Пустой список, а не ошибка: прокси обязан пропустить запрос дальше,
    // а не встать вместе с базой.
    return Response.json([]);
  }
}
