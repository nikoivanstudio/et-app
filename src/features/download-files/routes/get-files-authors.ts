import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { downloadFilesService } from '../services/download-files-services';

export async function getUsersByFiles(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'getUsersByFiles')) {
      return handleForbidden('У вас нет полномочий к списку пользователей загрузивших файлы');
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
