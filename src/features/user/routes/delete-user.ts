import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { User } from '../../../../generated/prisma/client';
import { userServices } from '../services/user-service';

export async function deleteUser(req: NextRequest): Promise<Response> {
  try {
    const id = req.nextUrl.searchParams.get('id');

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

    if (!roleUtils.userHasPermissionOn(session.role, 'deleteUser')) {
      return handleError({ body: 'У вас нет полномочий на создание постов' });
    }

    const eitherResult: Either<string, User> = await userServices.deleteUser(
      Number(id)
    );

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
