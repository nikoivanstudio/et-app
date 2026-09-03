import { NextRequest } from 'next/server';

import { filesUtils } from '@/features/post/lib/file-utils';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleUnauthorized } from '@/shared/lib/response-utils';

import { postServices } from '../services/post-services';

export async function getExportPosts(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'postsJsonFile')) {
      return handleForbidden('У вас нет полномочий на экспорт постов');
    }

    const either = await postServices.getAllPosts();

    if (either.type === 'left') {
      return handleError({ body: either.error });
    }

    const stream = filesUtils.getPostsFileJSONStream(either.value);

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="posts.json"'
      }
    });
  } catch (e) {
    if (!!e && typeof e === 'object' && 'message' in e) {
      console.error(e.message);

      return handleError({ body: e.message });
    }

    return handleError({ body: 'Ошибка верификации' });
  }
}
