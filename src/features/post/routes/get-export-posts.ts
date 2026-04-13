import { NextRequest } from 'next/server';

import { filesUtils } from '@/features/post/lib/file-utils';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError } from '@/shared/lib/response-utils';

import { postServices } from '../services/post-services';

export async function getExportPosts(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'postsJsonFile')) {
      return handleError({ body: 'У вас нет полномочий на экспорт постов' });
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
