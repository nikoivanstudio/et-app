import { NextRequest } from 'next/server';

import { reviewTourSchema } from '@/features/tour/lib/schemas/create-tour-schemas';
import { tourModerationService } from '@/features/tour/services/tour-moderation-service';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function reviewTour(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'reviewTour')) {
      return handleError({
        body: 'У вас нет полномочий на модерацию туров'
      });
    }

    const body = await req.json();
    const result = reviewTourSchema.safeParse(body);

    if (!result.success) {
      return handleError({ body: 'Тело запроса неверно' });
    }

    const eitherResult = await tourModerationService.reviewTour(result.data);

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
