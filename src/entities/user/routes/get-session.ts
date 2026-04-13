import { NextRequest } from 'next/server';

import { sessionService } from '@/entities/user/services/session';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function getSession(req: NextRequest): Promise<Response> {
  const cookies = req.cookies.get('session')?.value;

  if (!cookies) {
    return handleError({ body: 'Ошибка верификации' });
  }

  try {
    return handleSuccess({ body: await sessionService.verifySession(cookies) });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
