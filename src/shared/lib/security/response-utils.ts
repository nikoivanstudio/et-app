import { NextResponse } from 'next/server';

import {
  ALLOWED_ORIGINS,
  RATE_LIMIT_MAX
} from '@/shared/lib/security/constants';
import {
  SecurityLimitException,
  SecurityOriginException
} from '@/shared/lib/security/security-exception';

const getSecuredResponse = ({
  origin,
  remaining,
  resetAt
}: {
  origin: string | null;
  remaining: number;
  resetAt: Date;
}): NextResponse => {
  const res = NextResponse.next();

  /**
   * MED-4: раньше при неизвестном Origin подставлялся первый домен из списка
   * вместе с `Allow-Credentials: true`. Теперь заголовки CORS выдаются только
   * для действительно разрешённого источника, а в остальных случаях
   * не выдаются вовсе — браузер тогда сам заблокирует кросс-доменное чтение.
   */
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Vary', 'Origin');
    res.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.headers.set('X-RateLimit-Remaining', String(remaining));
  res.headers.set('X-RateLimit-Reset', resetAt.toISOString());

  return res;
};

const jsonError = (
  message: string,
  status: number,
  extraHeaders: Record<string, string> = {}
): NextResponse =>
  new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });

const handleError = (error: unknown): NextResponse => {
  if (error instanceof SecurityOriginException) {
    return jsonError(error.message, 403);
  }

  if (error instanceof SecurityLimitException) {
    return jsonError(error.message, 429, { 'Retry-After': '60' });
  }

  console.error(error);

  return jsonError('Unknown error on server', 500);
};

export const securityUtils = { getSecuredResponse, handleError };
