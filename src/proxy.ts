import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
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

export function proxy(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const { remaining, resetAt } = verifyLimit(req);

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
  matcher: ['/api/:path*']
};
