import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  buildRedirectTarget,
  isRedirectStatusCode,
  normalizeRedirectSource
} from '@/entities/redirect/lib/redirect-utils';

import { findRedirect } from '@/shared/lib/redirects/redirect-map';
import {
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW_MS,
  AUTH_SENSITIVE_PATHS,
  PROTECTED_API_PREFIX,
  RATE_LIMIT_WINDOW_MS
} from '@/shared/lib/security/constants';
import { startRateLimitCleanup } from '@/shared/lib/security/rate-limit-memory';
import {
  verifyLimit,
  verifyOrigin
} from '@/shared/lib/security/request-verifications';
import { securityUtils } from '@/shared/lib/security/response-utils';

startRateLimitCleanup({
  intervalMs: 5 * RATE_LIMIT_WINDOW_MS,
  maxAgeMs: 10 * RATE_LIMIT_WINDOW_MS
});

/**
 * Формы аутентификации — это server actions, то есть POST на адрес самой
 * страницы (HIGH-1). Прежний matcher `/api/:path*` их не покрывал, поэтому
 * подбор пароля и кода подтверждения не ограничивался ничем.
 */
const isAuthSensitive = (req: NextRequest): boolean =>
  req.method === 'POST' &&
  AUTH_SENSITIVE_PATHS.some(
    path =>
      req.nextUrl.pathname === path ||
      req.nextUrl.pathname.startsWith(`${path}/`)
  );

/**
 * Адреса, для которых таблица переадресаций не спрашивается.
 *
 * `/api` — обязательно: именно оттуда карта и загружается, и запрос к
 * `/api/redirects` вызвал бы сам себя. Остальное — служебное, где правил
 * быть не может, а лишний поиск исполняется на каждом запросе.
 */
const SKIP_REDIRECT_PREFIXES = ['/api', '/_next', '/sitemap', '/robots.txt'];

/**
 * Переадресация по таблице в базе (B5).
 *
 * Склеить предстоит около девятисот адресов: дубли справочника (B6),
 * конкурирующие каталоги (B7), слаги с HTML-сущностями (B8). Списком
 * в `next.config.ts` это не поддерживается — каждая правка означала бы
 * деплой, а правится он по мере разбора справочника. Поэтому правила
 * лежат данными, а прокси держит их карту в памяти (см. `redirect-map.ts`).
 *
 * Только безопасные методы: переадресовывать POST на другой адрес значит
 * потерять тело запроса, а заявка с формы — последнее, что можно терять.
 */
const resolveRedirect = async (
  req: NextRequest
): Promise<NextResponse | null> => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return null;
  }

  const { pathname, search, origin } = req.nextUrl;

  if (SKIP_REDIRECT_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return null;
  }

  const rule = await findRedirect(origin, normalizeRedirectSource(pathname));

  if (!rule || !isRedirectStatusCode(rule.statusCode)) {
    return null;
  }

  // 410 Gone — для адресов, которые удалены без замены (тестовые страницы,
  // страницы про украинскую таможню). Поисковик выбрасывает такой адрес
  // из индекса быстрее, чем 404, и перестаёт к нему возвращаться.
  if (rule.statusCode === 410) {
    return new NextResponse(null, { status: 410 });
  }

  const target = buildRedirectTarget(rule.destination, search);

  return NextResponse.redirect(new URL(target, req.nextUrl), rule.statusCode);
};

export async function proxy(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    const { remaining, resetAt } = isAuthSensitive(req)
      ? verifyLimit(req, {
          scope: 'auth',
          maxRequests: AUTH_RATE_LIMIT_MAX,
          windowMs: AUTH_RATE_LIMIT_WINDOW_MS
        })
      : verifyLimit(req);

    if (!pathname.startsWith(PROTECTED_API_PREFIX)) {
      // Переадресация проверяется после лимита, но до рендера: страница
      // старого адреса не должна собираться только ради того, чтобы её
      // выбросили.
      return (await resolveRedirect(req)) ?? NextResponse.next();
    }

    const origin = verifyOrigin(req);

    const res = securityUtils.getSecuredResponse({
      origin,
      remaining,
      resetAt
    });

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: res.headers
      });
    }

    return res;
  } catch (error) {
    return securityUtils.handleError(error);
  }
}

export const config = {
  /**
   * Покрываются все маршруты, кроме статики: только так под ограничения
   * попадают server actions форм входа и регистрации.
   */
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|images/|robots.txt|sitemap.xml).*)'
  ]
};
