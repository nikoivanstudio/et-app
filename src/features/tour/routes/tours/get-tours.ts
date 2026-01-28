import { NextRequest } from 'next/server';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';
import { tourService } from '@/features/tour/server';
import { sessionService } from '@/entities/user/services/session';
import { Either } from '@/shared/lib/either';
import { tourSearchParamsUtils } from '@/features/tour/lib/tour-search-params-utils';
import { GetToursResponse } from '@/features/tour/domain';

export async function getTours(req: NextRequest): Promise<Response> {
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
