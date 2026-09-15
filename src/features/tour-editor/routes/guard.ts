import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { SessionEntity } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/server';

import { Either, left, right } from '@/shared/lib/either';
import { handleForbidden, handleUnauthorized } from '@/shared/lib/response-utils';

/**
 * Общая проверка для всех запросов редактора: своя сессия и право на туры.
 * Принадлежность тура проверяется ниже, в сервисе, — по автору из базы,
 * а не по тому, что прислали в теле.
 */
export async function requireGuide(
  req: NextRequest
): Promise<Either<Response, SessionEntity>> {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!cookie) return left(handleUnauthorized());

  const { session } = await sessionService.verifySession(cookie);

  if (!session) return left(handleUnauthorized());

  if (!roleUtils.userHasPermissionOn(session.role, 'updateTour')) {
    return left(handleForbidden('Нет прав на редактирование туров'));
  }

  return right(session);
}
