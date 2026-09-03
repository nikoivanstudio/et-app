import { NextRequest } from 'next/server';

import { GetToursResponse } from '@/features/tour/domain';
import { tourService } from '@/features/tour/services/tour-service';

import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function getUserTours(req: NextRequest): Promise<Response> {
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

    const eitherResult: Either<string, GetToursResponse> =
      await tourService.getUserTours({
        authorId: id,
        role: role
      });

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
