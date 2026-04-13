import { NextRequest } from 'next/server';

import { ActivityDomain } from '@/entities/activity/server';
import { roleUtils } from '@/entities/user';
import { sessionUtils } from '@/entities/user/lib/session-utils';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { activitySearchParams } from '../../lib/activity-search-params-utils';
import { activityServices } from '../../services/activity-services';

export async function getUserActivities(req: NextRequest): Promise<Response> {
  try {
    const session = await sessionUtils.getSession(
      req.cookies.get('session')?.value
    );

    if (!roleUtils.userHasPermissionOn(session?.role, 'getActivity')) {
      return handleError({
        body: 'У вас нет полномочий на получение активностей'
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const params = activitySearchParams.getParamsBySearchParams(searchParams);

    const eitherResult: Either<string, ActivityDomain.ActivityEntity[]> =
      await activityServices.getUserActivities({
        authorId: session.id,
        ...params
      });

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({
      body: {
        pagesCount: eitherResult.value.length / 10,
        activities: eitherResult.value
      }
    });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
