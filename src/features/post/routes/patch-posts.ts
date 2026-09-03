import { NextRequest } from 'next/server';

import { postServices } from '@/features/post/services/post-services';

import { postPatchSchema } from '@/entities/post';
import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function patchPosts(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'editPosts')) {
      return handleForbidden('У вас нет полномочий на редактирование постов');
    }

    const data = await req.json();
    const result = postPatchSchema.safeParse(data);

    if (!result.success) {
      return handleError({
        body: 'Невозможно внести изменения. Данные невалидны.'
      });
    }

    const createResult = await postServices.updatePost(result.data);

    return handleSuccess({
      body:
        createResult.type === 'right'
          ? `Успешно отредактирован.`
          : 'Ну удалось создать посты.'
    });
  } catch (error) {
    return handleError({ error });
  }
}
