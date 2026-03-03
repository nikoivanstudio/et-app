import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { searchParamsUtils } from '../lib/search-params-utils';
import { downloadFilesService } from '../services/download-files-services';

export async function getFiles(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'downloadFile')) {
      return handleError({ body: 'У вас нет полномочий на скачивание файлов' });
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
