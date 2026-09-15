import { NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { SessionEntity } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { getThreadSchema } from '../model/schemas';
import { chatService } from '../services/chat-service';

/**
 * Переписка по заявке. Клиент приходит с токеном заявки и без аккаунта,
 * гид — с сессией и номером заявки; кто есть кто, решает сервис.
 */
export async function getThread(req: NextRequest): Promise<Response> {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    let session: SessionEntity | null = null;

    if (cookie) {
      session = (await sessionService.verifySession(cookie)).session;
    }

    const bookingId = req.nextUrl.searchParams.get('bookingId');
    const result = getThreadSchema.safeParse({
      token: req.nextUrl.searchParams.get('token') ?? undefined,
      bookingId: bookingId ? Number(bookingId) : undefined
    });

    if (!result.success) {
      return handleError({ body: 'Не указана заявка' });
    }

    const eitherResult = await chatService.getThread(result.data, session);

    return eitherResult.type === 'left'
      ? handleError({ body: eitherResult.error })
      : handleSuccess({ body: eitherResult.value });
  } catch (e) {
    return handleError({ body: 'Ошибка при загрузке переписки', error: e });
  }
}
