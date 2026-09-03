import { NextRequest } from 'next/server';

import { GetToursResponse } from '@/features/tour/domain';
import { tourSearchParamsUtils } from '@/features/tour/lib/tour-search-params-utils';
import { tourService } from '@/features/tour/server';

import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/services/session';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function getTours(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    const { id, role } = session;

    const searchParams = req.nextUrl.searchParams;
    const params = tourSearchParamsUtils.getParamsBySearchParams(searchParams);

    const eitherResult: Either<string, GetToursResponse> =
      await tourService.getUserTours({
        authorId: id,
        role: role,
        ...params
      });

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
