import { NextRequest } from 'next/server';

import { PatchRouteParams } from '@/features/edit-user/model/types';

import { roleUtils } from '@/entities/user';
import { sessionService, updateUser, userSchema } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function patchUser(
  req: NextRequest,
  { params }: PatchRouteParams
): Promise<Response> {
  try {
    const { id } = await params;

    if (!id) {
      return handleError({ body: 'Отсутствует идентификатор пользователя' });
    }

    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'updateUser')) {
      return handleError({ body: 'У вас нет полномочий на создание постов' });
    }

    const body = await req.json();

    const result = userSchema.partial().safeParse(body);

    if (!result.success) {
      return handleError({ body: 'Тело запроса неверно' });
    }

    const eitherResult = await updateUser({
      ...result.data,
      id: Number(id)
    });

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
