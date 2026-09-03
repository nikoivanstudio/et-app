import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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

export function proxy(req: NextRequest) {
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
      return NextResponse.next();
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
