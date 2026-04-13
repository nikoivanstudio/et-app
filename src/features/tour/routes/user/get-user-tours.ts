import { NextRequest } from 'next/server';

import { GetToursResponse } from '@/features/tour/domain';
import { tourService } from '@/features/tour/services/tour-service';

import { sessionService } from '@/entities/user/server';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function getUserTours(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Cookies not found' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Session not found' });
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
