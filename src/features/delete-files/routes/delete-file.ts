import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { deleteFilesService } from '../services/delete-files-service';

export async function deleteFile(req: NextRequest, id?: string): Promise<Response> {
  try {
    if (!id) {
      return handleError({
        error: new Error('Отсутствует идентификатор удаляемой записи')
      });
    }

    const fileId = Number(id);

    if (Number.isNaN(fileId)) {
      return handleError({
        error: new Error('Ошибка валидации')
      });
    }

    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(sessionCookie);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'deleteFile')) {
      return handleForbidden('Вы не имеете полномочий на удаление этого файла');
    }

    const result = await deleteFilesService.deleteFile(fileId);

    if (result.type === 'left') {
      return handleError({ error: new Error(result.error) });
    }

    return handleSuccess({ body: result.value });
  } catch (error) {
    return handleError({ error });
  }
}
