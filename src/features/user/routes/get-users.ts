import { NextRequest } from 'next/server';

import { userServices } from '@/features/user/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { Either } from '@/shared/lib/either';
import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { GetUserResponse } from '../domain';
import { searchParamsUtils } from '../lib/search-params-utils';

export async function getUsers(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const params = searchParamsUtils.getParamsBySearchParams(searchParams);

    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'getAllUsers')) {
      return handleForbidden('У вас нет полномочий на просмотр всех пользователей');
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
