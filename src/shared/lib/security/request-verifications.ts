import { NextRequest } from 'next/server';

import {
  ALLOWED_ORIGINS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS
} from '@/shared/lib/security/constants';
import { checkRateLimitInMemory } from '@/shared/lib/security/rate-limit-memory';
import {
  SecurityLimitException,
  SecurityOriginException
} from '@/shared/lib/security/security-exception';

export const verifyLimit = (
  req: NextRequest
): { remaining: number; resetAt: Date } => {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const key = `ip:${ip}:${req.nextUrl.pathname}`;

  const { isLimited, remaining, resetAt } = checkRateLimitInMemory({
    key,
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX
  });

  if (isLimited) {
    throw new SecurityLimitException('Too many requests');
  }

  return { remaining, resetAt };
};

export const verifyOrigin = (req: NextRequest): string | null => {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const xApiKey = req.headers.get('X-API-KEY');

  const isSameOrigin =
    origin === null &&
    referer !== null &&
    ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed));
  const isAllowedOrigin = origin !== null && ALLOWED_ORIGINS.includes(origin);
  const xApiKeyValid = xApiKey === process.env.X_API_KEY;

  if (!xApiKeyValid || (!isAllowedOrigin && !isSameOrigin)) {
    throw new SecurityOriginException('Origin not allowed');
  }

  return origin;
};
