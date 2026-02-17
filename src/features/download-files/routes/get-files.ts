import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';
import { handleError, handleSuccess } from '@/shared/lib/response-utils';

// queryParams maybe:
// page: number; - какую страницу отдавать
// authorId: number - идентификатор автора
// name: string - оригинальное название файла
// fileType: string - enum of fileTypes
// date: дата - дата загрузки

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

    return handleSuccess({
      body: 'presignedUrlsDto'
    });
  } catch (error) {
    return handleError({ error });
  }
}
