import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { bookingService } from '../services/booking-service';

export async function getBookings(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const scope = req.nextUrl.searchParams.get('scope');

    // Админский режим: все заявки с группировкой по гидам.
    if (scope === 'all') {
      if (!roleUtils.userHasPermissionOn(session.role, 'getAllBookings')) {
        return handleError({ body: 'У вас нет полномочий на просмотр всех заявок' });
      }

      const eitherAll = await bookingService.getAllBookingsGrouped();

      return eitherAll.type === 'left'
        ? handleError({ body: eitherAll.error })
        : handleSuccess({ body: eitherAll.value });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'getMyBookings')) {
      return handleError({ body: 'У вас нет полномочий на просмотр заявок' });
    }

    const eitherResult = await bookingService.getGuideBookings(session.id);

    return eitherResult.type === 'left'
      ? handleError({ body: eitherResult.error })
      : handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
