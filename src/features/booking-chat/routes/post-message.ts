import { NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { SessionEntity } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { sendMessageSchema } from '../model/schemas';
import { chatService } from '../services/chat-service';

export async function postMessage(req: NextRequest): Promise<Response> {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    let session: SessionEntity | null = null;

    if (cookie) {
      session = (await sessionService.verifySession(cookie)).session;
    }

    const body = await req.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? 'Сообщение не отправлено';

      return handleError({ body: message });
    }

    const eitherResult = await chatService.sendMessage(result.data, session);

    return eitherResult.type === 'left'
      ? handleError({ body: eitherResult.error })
      : handleSuccess({ body: eitherResult.value });
  } catch (e) {
    return handleError({ body: 'Ошибка при отправке сообщения', error: e });
  }
}
