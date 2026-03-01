import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { downloadFilesService } from '../services/download-files-services';

export async function getUsersByFiles(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'getUsersByFiles')) {
      return handleError({
        body: 'У вас нет полномочий к списку пользователей загрузивших файлы'
      });
    }

    const result = await downloadFilesService.getAuthorsByFiles();

    if (result.type === 'left') {
      return handleError({ error: 'Ошибка при получение пользователей' });
    }

    return handleSuccess({
      body: { authors: result.value }
    });
  } catch (error) {
    return handleError({ error });
  }
}
