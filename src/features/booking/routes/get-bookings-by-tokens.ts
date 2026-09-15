import { NextRequest } from 'next/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { bookingService } from '../services/booking-service';

/** Токен заявки — uuid; всё, что на него не похоже, до базы не доезжает. */
const isTokenLike = (value: string): boolean =>
  value.length >= 8 && value.length <= 100 && /^[\w-]+$/.test(value);

/**
 * Публичный роут: заявки по списку токенов.
 *
 * Сессия не нужна — заявку оставляют без регистрации, и ключ к ней только
 * токен. Страница «Мои заявки» присылает сюда то, что сохранено в браузере
 * этого устройства, и получает актуальные статусы и счётчики непрочитанного.
 */
export async function getBookingsByTokens(req: NextRequest): Promise<Response> {
  try {
    const raw = req.nextUrl.searchParams.get('tokens') ?? '';
    const tokens = raw
      .split(',')
      .map(token => token.trim())
      .filter(isTokenLike);

    const eitherResult = await bookingService.getBookingsByTokens(tokens);

    return eitherResult.type === 'left'
      ? handleError({ body: eitherResult.error })
      : handleSuccess({ body: eitherResult.value });
  } catch (e) {
    return handleError({ body: 'Ошибка при загрузке заявок', error: e });
  }
}
