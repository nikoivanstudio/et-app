import { NextRequest } from 'next/server';

import { userServices } from '@/features/user/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { GetUserResponse } from '../domain';
import { searchParamsUtils } from '../lib/search-params-utils';

export async function getUsers(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const params = searchParamsUtils.getParamsBySearchParams(searchParams);

    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'getAllUsers')) {
      return handleError({
        body: 'У вас нет полномочий на просмотр всех пользователей'
      });
    }

    const eitherResult: Either<string, GetUserResponse> =
      await userServices.getUsers();

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
