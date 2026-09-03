import { NextRequest } from 'next/server';

import { editUserSchema } from '@/features/edit-user/model/user-schema';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService, updateUser } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function patchUser(req: NextRequest): Promise<Response> {
  try {
    const queryId = req.nextUrl.searchParams.get('id');

    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'updateUser')) {
      return handleForbidden('У вас нет полномочий на обновление пользователя');
    }

    const body = await req.json();
    const payload = {
      ...body,
      id: Number(body?.id ?? queryId)
    };

    if (!payload.id || Number.isNaN(payload.id)) {
      return handleError({ body: 'Отсутствует идентификатор пользователя' });
    }

    const result = editUserSchema.omit({ id: true }).partial().safeParse(body);

    if (!result.success) {
      return handleError({ body: 'Тело запроса неверно' });
    }

    const eitherResult = await updateUser({
      id: payload.id,
      ...result.data
    });

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
