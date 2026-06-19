import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { updateBookingSchema } from '../model/schemas';
import { bookingService } from '../services/booking-service';

export async function patchBooking(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'manageBooking')) {
      return handleError({ body: 'У вас нет полномочий на обработку заявок' });
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
