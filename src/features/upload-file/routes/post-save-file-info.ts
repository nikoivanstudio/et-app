import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { saveFileInfoSchema } from '../model/schemas/short-file-dto-schema';
import { fileServiceServer } from '../services/file-service-server';

export async function postSaveFileInfo(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!cookies) {
      return handleUnauthorized();
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleUnauthorized();
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'uploadFile')) {
      return handleForbidden('У вас нет полномочий на загрузку файлов');
    }

    const data = await req.json();
    const validationResult = saveFileInfoSchema.safeParse(data);

    if (!validationResult.success) {
      return handleError({ body: 'Неверный формат переданных данных' });
    }

    const saveResult = await fileServiceServer.saveFilesInfo(
      validationResult.data.filesInfo
    );

    return handleSuccess({
      body: {
        type: saveResult.type,
        result: saveResult.type === 'left' ? saveResult.error : saveResult.value
      }
    });
  } catch (error) {
    return handleError({ error });
  }
}
