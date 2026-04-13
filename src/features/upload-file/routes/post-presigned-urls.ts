import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { sessionService } from '@/entities/user/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

import { ShortUrlDto } from '../domain';
import { presignedUrlsDataSchema } from '../model/schemas/short-file-dto-schema';
import { fileStorageService } from '../services/file-storage-service';

export async function postPresignedUrls(req: NextRequest): Promise<Response> {
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
