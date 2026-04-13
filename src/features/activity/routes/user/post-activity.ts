import { NextRequest } from 'next/server';

import { activityServices } from '@/features/activity/services/activity-services';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function postActivity(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session?.role, 'createActivity')) {
      return handleError({
        body: 'У вас нет полномочий на создание мероприятий'
      });
    }

    const data = await req.json();

    if (!data) {
      return handleSuccess({
        body: 'Невозможно создать запись. Данные не валидны'
      });
    }

    const activity = await activityServices.createActivity({
      authorId: session.id,
      ...data
    });

    if (!activity) {
      return handleError({ body: 'Ошибка. Не удалось создать тур' });
    }

    return handleSuccess({ body: activity });
  } catch (e) {
    console.error(e);

    return handleError({ body: 'Catch' });
  }
}
