import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';
import { downloadFilesService } from '../services/download-files-services';
import { searchParamsUtils } from '../lib/search-params-utils';

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
      return handleError({ body: 'У вас нет полномочий на cкачивание файлов' });
    }

    const serviceParams =
      searchParamsUtils.getParamsBySearchParams(searchParams);

    const result =
      await downloadFilesService.getContentFilesBySearchParams(serviceParams);

    if (result.type === 'left') {
      return handleError({ error: 'Ошибка при получение файлов' });
    }

    return handleSuccess({
      body: { files: result.value }
    });
  } catch (error) {
    return handleError({ error });
  }
}
