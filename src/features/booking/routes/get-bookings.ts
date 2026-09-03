import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { bookingService } from '../services/booking-service';

export async function getBookings(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    const scope = req.nextUrl.searchParams.get('scope');

    // Админский режим: все заявки с группировкой по гидам.
    if (scope === 'all') {
      if (!roleUtils.userHasPermissionOn(session.role, 'getAllBookings')) {
        return handleForbidden('У вас нет полномочий на просмотр всех заявок');
      }

      const eitherAll = await bookingService.getAllBookingsGrouped();

      return eitherAll.type === 'left'
        ? handleError({ body: eitherAll.error })
        : handleSuccess({ body: eitherAll.value });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'getMyBookings')) {
      return handleForbidden('У вас нет полномочий на просмотр заявок');
    }

    const eitherResult = await bookingService.getGuideBookings(session.id);

    return eitherResult.type === 'left'
      ? handleError({ body: eitherResult.error })
      : handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
