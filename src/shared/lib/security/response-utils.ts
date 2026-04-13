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

  const corsOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.headers.set('Access-Control-Allow-Origin', corsOrigin);
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-API-KEY'
  );
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.headers.set('X-RateLimit-Remaining', String(remaining));
  res.headers.set('X-RateLimit-Reset', resetAt.toISOString());

  return res;
};

const handleError = (error: unknown): NextResponse => {
  if (error instanceof SecurityOriginException) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else if (error instanceof SecurityLimitException) {
    return new NextResponse(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  return new NextResponse(
    JSON.stringify({ error: 'Unknown error on server' }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const securityUtils = { getSecuredResponse, handleError };
