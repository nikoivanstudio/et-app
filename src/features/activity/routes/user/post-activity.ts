import { NextRequest } from 'next/server';

import { activityServices } from '@/features/activity/services/activity-services';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function postActivity(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session?.role, 'createActivity')) {
      return handleForbidden('У вас нет полномочий на создание мероприятий');
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
