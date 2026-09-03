import { NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/services/session';

import { handleError, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function getSession(req: NextRequest): Promise<Response> {
  const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!cookies) {
    return handleUnauthorized();
  }

  try {
    return handleSuccess({ body: await sessionService.verifySession(cookies) });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
