import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { searchParamsUtils } from '../lib/search-params-utils';
import { downloadFilesService } from '../services/download-files-services';

export async function getFiles(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'downloadFile')) {
      return handleForbidden('У вас нет полномочий на скачивание файлов');
    }

    const serviceParams =
      searchParamsUtils.getParamsBySearchParams(searchParams);

    const result =
      await downloadFilesService.getContentFilesBySearchParams(serviceParams);

    if (result.type === 'left') {
      return handleError({ error: 'Ошибка при получении файлов' });
    }

    return handleSuccess({
      body: result.value
    });
  } catch (error) {
    return handleError({ error });
  }
}
