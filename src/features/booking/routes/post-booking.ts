import { NextRequest } from 'next/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { createBookingSchema } from '../model/schemas';
import { bookingService } from '../services/booking-service';

// Публичный роут: заявку может оставить и неавторизованный пользователь.
export async function postBooking(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? 'Данные формы не валидны';

      return handleError({ body: message });
    }

    // Honeypot заполнен — молча отвечаем успехом, ничего не создаём.
    if (result.data.company) {
      return handleSuccess({ body: { accessToken: '', guideName: '' } });
    }

    const eitherResult = await bookingService.createBooking(result.data);

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch (e) {
    return handleError({ body: 'Ошибка при создании заявки', error: e });
  }
}
