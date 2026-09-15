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

/**
 * Пауза между попытками, пока карта не загрузилась.
 *
 * Отдельная от `TTL_MS` и намного короче: неудача не должна замораживать
 * пустую карту на минуту — именно так на проде 15.09.2026 переадресации
 * не работали вовсе. При этом на каждый запрос ломиться тоже нельзя.
 */
const RETRY_MS = 5_000;

/** Ждать ответа дольше нечего: на холодной карте в этом ожидании висит запрос. */
const LOAD_TIMEOUT_MS = 1_500;

/** Защита от разрастания: столько правил помещается в память без вопросов. */
const MAX_RULES = 20_000;

type RedirectTarget = {
  destination: string;
  statusCode: number;
};

type CacheState = {
  rules: Map<string, RedirectTarget>;
  /** Время последней УСПЕШНОЙ загрузки. Ноль — карты нет. */
  loadedAt: number;
  /** Время последней попытки, удачной или нет. Ограничивает частоту повторов. */
  attemptedAt: number;
};

const cache: CacheState = { rules: new Map(), loadedAt: 0, attemptedAt: 0 };

/**
 * Незавершённая загрузка.
 *
 * Без неё пачка одновременных запросов на холодном кеше (а это ровно то,
 * что происходит сразу после деплоя) дала бы столько же параллельных
 * обращений к базе.
 */
let pending: Promise<void> | null = null;

/**
 * Собственный адрес приложения изнутри контейнера.
 *
 * Ходить за картой по публичному адресу нельзя: `req.nextUrl.origin` для
 * внешнего посетителя — это `https://energy-tur.ru`, то есть контейнер
 * обращался бы к себе наружу, через DNS на публичный IP и обратно через
 * обратный прокси. Такая петля заворачивается не везде; там, где не
 * заворачивается, `fetch` падает и переадресаций нет вообще.
 */
const internalOrigin = (): string =>
  process.env.REDIRECT_MAP_ORIGIN ??
  `http://127.0.0.1:${process.env.PORT ?? '3000'}`;

/** Внутренний адрес первым, адрес запроса — запасным. */
const candidates = (requestOrigin: string): string[] => [
  ...new Set([internalOrigin(), requestOrigin])
];

const toMap = (rules: RedirectRule[]): Map<string, RedirectTarget> =>
  new Map(
    rules
      .slice(0, MAX_RULES)
      .map(({ source, destination, statusCode }) => [
        source,
        { destination, statusCode }
      ])
  );

const fetchRules = async (origin: string): Promise<RedirectRule[] | null> => {
  try {
    const response = await fetch(`${origin}/api/redirects`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(LOAD_TIMEOUT_MS)
    });

    if (!response.ok) {
      return null;
    }

    const rules = await response.json();

    return Array.isArray(rules) ? (rules as RedirectRule[]) : null;
  } catch {
    return null;
  }
};

const load = async (requestOrigin: string): Promise<void> => {
  cache.attemptedAt = Date.now();

  for (const origin of candidates(requestOrigin)) {
    const rules = await fetchRules(origin);

    if (!rules) {
      continue;
    }

    cache.rules = toMap(rules);
    cache.loadedAt = Date.now();

    return;
  }

  // Прежнюю карту не трогаем: устаревшие правила лучше их отсутствия.
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
  const now = Date.now();
  const isStale = now - cache.loadedAt > TTL_MS;
  const isThrottled = now - cache.attemptedAt < RETRY_MS;

  if (isStale && !isThrottled) {
    if (!cache.loadedAt) {
      await refresh(origin);
    } else {
      void refresh(origin);
    }
  }

  return cache.rules.get(source);
};

/** Сброс карты — для тестов. */
export const resetRedirectCache = (): void => {
  cache.rules = new Map();
  cache.loadedAt = 0;
  cache.attemptedAt = 0;
  pending = null;
};
