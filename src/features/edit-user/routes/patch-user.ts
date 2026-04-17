import { NextRequest } from 'next/server';

import { editUserSchema } from '@/features/edit-user/model/user-schema';

import { roleUtils } from '@/entities/user';
import { sessionService, updateUser } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function patchUser(req: NextRequest): Promise<Response> {
  try {
    const queryId = req.nextUrl.searchParams.get('id');

    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'updateUser')) {
      return handleError({ body: 'У вас нет полномочий на обновление пользователя' });
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
