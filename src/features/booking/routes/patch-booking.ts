import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { updateBookingSchema } from '../model/schemas';
import { bookingService } from '../services/booking-service';

export async function patchBooking(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'manageBooking')) {
      return handleForbidden('У вас нет полномочий на обработку заявок');
    }

    const body = await req.json();
    const result = updateBookingSchema.safeParse(body);

    if (!result.success) {
      return handleError({ body: 'Тело запроса неверно' });
    }

    const canManageAny = roleUtils.userHasPermissionOn(
      session.role,
      'getAllBookings'
    );

    const eitherResult = await bookingService.updateBookingStatus(result.data, {
      id: session.id,
      role: session.role,
      canManageAny
    });

    return eitherResult.type === 'left'
      ? handleError({ body: eitherResult.error })
      : handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
