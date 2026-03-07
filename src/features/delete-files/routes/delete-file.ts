import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { deleteFilesService } from '../services/delete-files-service';

export async function deleteFile(req: NextRequest): Promise<Response> {
  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return handleError({ error: new Error('Отсутствует идентификатор файла') });
    }

    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ error: new Error('Ошибка верификации') });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ error: new Error('Ошибка верификации') });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'deleteFile')) {
      return handleError({ error: new Error('У вас нет полномочий на удаление файлов') });
    }

    const fileId = Number(id);

    if (Number.isNaN(fileId)) {
      return handleError({ error: new Error('Некорректный идентификатор файла') });
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
