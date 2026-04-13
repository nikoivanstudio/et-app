import { NextRequest } from 'next/server';

import { postServices } from '@/features/post/services/post-services';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { Either } from '@/shared/lib/either';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { Post } from '../../../../generated/prisma/client';

export async function deletePost(req: NextRequest): Promise<Response> {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return handleError({ body: 'Отсутствует идентификатор записи' });
    }

    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'deletePost')) {
      return handleError({ body: 'У вас нет полномочий на создание постов' });
    }

    const eitherResult: Either<string, Post> = await postServices.deletePost(
      Number(id)
    );

    if (eitherResult.type === 'left') {
      return handleError({ body: eitherResult.error });
    }

    return handleSuccess({ body: eitherResult.value });
  } catch {
    return handleError({ body: 'Ошибка верификации' });
  }
}
