import { NextRequest } from 'next/server';

import { postUtils } from '@/features/post/lib/post-utils';
import { postServices } from '@/features/post/services/post-services';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

export async function postPosts(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'createPosts')) {
      return handleForbidden('У вас нет полномочий на создание постов');
    }

    const hasJSONFile = !!req.nextUrl.searchParams.get('by_json');
    const dataSource = hasJSONFile ? await req.formData() : await req.json();
    const posts = await postUtils.getDataSourcePosts(dataSource);

    if (!posts.length) {
      return handleError({ body: 'Посты отсутствуют' });
    }

    const createResult = await postServices.createPosts(posts);

    return handleSuccess({
      body:
        createResult.type === 'right'
          ? `Успешно создано ${createResult.value.count} постов.`
          : 'Ну удалось создать посты.'
    });
  } catch (error) {
    return handleError({ error });
  }
}
