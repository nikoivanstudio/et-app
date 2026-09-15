import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import {
  handleError,
  handleForbidden,
  handleSuccess,
  handleUnauthorized
} from '@/shared/lib/response-utils';

import { inboxService } from '../services/inbox-service';

/** Список переписок гида: заявки, в которых есть сообщения. */
export async function getInbox(req: NextRequest): Promise<Response> {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!cookie) return handleUnauthorized();

  const { session } = await sessionService.verifySession(cookie);

  if (!session) return handleUnauthorized();

  if (!roleUtils.userHasPermissionOn(session.role, 'getMyBookings')) {
    return handleForbidden();
  }

  const result = await inboxService.getGuideInbox(session.id);

  if (result.type === 'left') {
    return handleError({ body: result.error });
  }

  return handleSuccess({ body: result.value });
}
