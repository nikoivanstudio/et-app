import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { saveFileInfoSchema } from '../model/schemas/short-file-dto-schema';
import { fileServiceServer } from '../services/file-service-server';

export async function postSaveFileInfo(req: NextRequest): Promise<Response> {
  try {
    const cookies = req.cookies.get('session')?.value;

    if (!cookies) {
      return handleError({ body: 'Ошибка верификации' });
    }

    const { session } = await sessionService.verifySession(cookies);

    if (!session) {
      return handleError({ body: 'Ошибка верификации' });
    }

    if (!roleUtils.userHasPermissionOn(session.role, 'uploadFile')) {
      return handleError({ body: 'У вас нет полномочий на загрузку файлов' });
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
