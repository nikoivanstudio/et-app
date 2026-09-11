import type { RedirectRule } from '@/entities/redirect/server';

/**
 * Карта переадресаций в памяти процесса.
 *
 * Прокси выполняется перед КАЖДЫМ запросом, включая обход робота: ходить
 * за правилами в базу на каждый запрос нельзя — любой скан несуществующих
 * адресов превратился бы в нагрузку на БД. Поэтому правила лежат в памяти
 * и обновляются не чаще раза в `TTL_MS`.
 *
 * Правила берутся не напрямую из Prisma, а через `/api/redirects`, и это
 * не лишнее звено: прокси в Next 16 — отдельный бандл, который по замыслу
 * может исполняться и вне основного рантайма приложения (см. docs
 * 01-app/03-api-reference/03-file-conventions/proxy.md, «Proxy is meant to
 * be invoked separately of your render code»). Импорт клиента базы втащил
 * бы в него Prisma целиком.
 *
 * Все ошибки здесь проглатываются намеренно. Недоступная база не должна
 * ронять сайт: без правил страницы просто отдаются как есть, а в худшем
 * случае старый адрес временно отвечает 404 вместо 301.
 */

/** Время жизни кеша: минута — компромисс между свежестью и числом запросов. */
const TTL_MS = 60_000;

/** Защита от разрастания: столько правил помещается в память без вопросов. */
const MAX_RULES = 20_000;

type RedirectTarget = {
  destination: string;
  statusCode: number;
};

type CacheState = {
  rules: Map<string, RedirectTarget>;
  loadedAt: number;
};

const cache: CacheState = { rules: new Map(), loadedAt: 0 };

/**
 * Незавершённая загрузка.
 *
 * Без неё пачка одновременных запросов на холодном кеше (а это ровно то,
 * что происходит сразу после деплоя) дала бы столько же параллельных
 * обращений к базе.
 */
let pending: Promise<void> | null = null;

const toMap = (rules: RedirectRule[]): Map<string, RedirectTarget> =>
  new Map(
    rules
      .slice(0, MAX_RULES)
      .map(({ source, destination, statusCode }) => [
        source,
        { destination, statusCode }
      ])
  );

const load = async (origin: string): Promise<void> => {
  try {
    const response = await fetch(`${origin}/api/redirects`, {
      cache: 'no-store',
      headers: { accept: 'application/json' }
    });

    if (!response.ok) {
      return;
    }

    const rules = (await response.json()) as RedirectRule[];

    if (!Array.isArray(rules)) {
      return;
    }

    cache.rules = toMap(rules);
  } catch {
    // Оставляем прежнюю карту: устаревшие правила лучше их отсутствия.
  } finally {
    // Метку времени ставим в любом случае, в том числе после ошибки:
    // иначе недоступная база означала бы попытку загрузки на каждый запрос.
    cache.loadedAt = Date.now();
  }
};

const refresh = (origin: string): Promise<void> => {
  if (!pending) {
    pending = load(origin).finally(() => {
      pending = null;
    });
  }

  return pending;
};

/**
 * Правило для адреса, если оно есть.
 *
 * На холодном кеше загрузка ожидается: первый посетитель после старта
 * процесса подождёт один запрос, но не получит 404 вместо редиректа.
 * Дальше обновление идёт фоном — ответ отдаётся по текущей карте.
 */
export const findRedirect = async (
  origin: string,
  source: string
): Promise<RedirectTarget | undefined> => {
  const isCold = !cache.loadedAt;
  const isStale = Date.now() - cache.loadedAt > TTL_MS;

  if (isCold) {
    await refresh(origin);
  } else if (isStale) {
    void refresh(origin);
  }

  return cache.rules.get(source);
};

/** Сброс карты — для тестов. */
export const resetRedirectCache = (): void => {
  cache.rules = new Map();
  cache.loadedAt = 0;
  pending = null;
};
