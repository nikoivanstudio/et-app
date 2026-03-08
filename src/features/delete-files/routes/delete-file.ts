import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

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

    const sessionCookie = req.cookies.get('session')?.value;

    if (!sessionCookie) {
      return handleError({ error: new Error('Ошибка сессии') });
    }

    const { session } = await sessionService.verifySession(sessionCookie);

    if (!session) {
      return handleError({ error: new Error('Ошибка сессии') });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'deleteFile')) {
      return handleError({
        error: new Error('Вы не имеете полномочий на удаление этого файла')
      });
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
