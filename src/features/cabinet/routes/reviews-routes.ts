import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import {
  handleError,
  handleForbidden,
  handleSuccess,
  handleUnauthorized
} from '@/shared/lib/response-utils';

import { cabinetReviewsService } from '../services/reviews-service';

const MAX_REPLY_LENGTH = 1000;

/** Ответ гида на отзыв. */
export async function patchCabinetReview(req: NextRequest): Promise<Response> {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookie) return handleUnauthorized();

    const { session } = await sessionService.verifySession(cookie);

    if (!session) return handleUnauthorized();

    if (!roleUtils.userHasPermissionOn(session.role, 'dashboard')) {
      return handleForbidden();
    }

    const { reviewId, reply } = (await req.json()) as {
      reviewId?: number;
      reply?: string;
    };

    if (!reviewId || typeof reply !== 'string') {
      return handleError({ body: 'Не указан отзыв или текст ответа' });
    }

    if (reply.length > MAX_REPLY_LENGTH) {
      return handleError({ body: 'Ответ длиннее 1000 символов' });
    }

    const result = await cabinetReviewsService.replyToReview(
      session.id,
      reviewId,
      reply
    );

    if (result.type === 'left') return handleError({ body: result.error });

    return handleSuccess({ body: result.value });
  } catch (error) {
    console.error('Ошибка ответа на отзыв', error);

    return handleError({ body: 'Не удалось сохранить ответ' });
  }
}
