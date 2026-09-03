import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { sessionService } from '@/entities/user/server';

import { handleError, handleForbidden, handleSuccess, handleUnauthorized } from '@/shared/lib/response-utils';

import { ShortUrlDto } from '../domain';
import { presignedUrlsDataSchema } from '../model/schemas/short-file-dto-schema';
import { fileStorageService } from '../services/file-storage-service';

export async function postPresignedUrls(req: NextRequest): Promise<Response> {
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
    const result = presignedUrlsDataSchema.safeParse(data);

    if (!result.success) {
      return handleError({ body: 'Неверный формат переданных данных' });
    }

    const presignedUrlsDto: ShortUrlDto[] =
      await fileStorageService.getPresignedUrlsDto(result.data.fileItems);

    return handleSuccess({
      body: { presignedUrlsDto }
    });
  } catch (error) {
    return handleError({ error });
  }
}
