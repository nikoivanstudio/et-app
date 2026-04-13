import { NextRequest } from 'next/server';

import { postServices } from '@/features/post/services/post-services';

import { postEditSchema } from '@/entities/post';
import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function patchPosts(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'editPosts')) {
      return handleError({
        body: 'У вас нет полномочий на редактирование постов'
      });
    }

    const data = await req.json();
    const result = postEditSchema.safeParse(data);

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
