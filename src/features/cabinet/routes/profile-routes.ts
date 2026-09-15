import { NextRequest } from 'next/server';

import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { SessionEntity } from '@/entities/user/domain';
import { sessionService } from '@/entities/user/server';

import { Either, left, right } from '@/shared/lib/either';
import {
  handleError,
  handleForbidden,
  handleSuccess,
  handleUnauthorized
} from '@/shared/lib/response-utils';

import { guideProfileSchema } from '../model/profile-schemas';
import { cabinetProfileService } from '../services/profile-service';

const requireCabinet = async (
  req: NextRequest
): Promise<Either<Response, SessionEntity>> => {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!cookie) return left(handleUnauthorized());

  const { session } = await sessionService.verifySession(cookie);

  if (!session) return left(handleUnauthorized());

  if (!roleUtils.userHasPermissionOn(session.role, 'dashboard')) {
    return left(handleForbidden());
  }

  return right(session);
};

/** Сохранение профиля гида. */
export async function patchCabinetProfile(req: NextRequest): Promise<Response> {
  try {
    const guard = await requireCabinet(req);

    if (guard.type === 'left') return guard.error;

    const parsed = guideProfileSchema.safeParse(await req.json());

    if (!parsed.success) {
      return handleError({
        body: parsed.error.issues[0]?.message ?? 'Проверьте поля профиля'
      });
    }

    const result = await cabinetProfileService.saveProfile(
      guard.value.id,
      parsed.data
    );

    if (result.type === 'left') return handleError({ body: result.error });

    return handleSuccess({ body: result.value });
  } catch (error) {
    console.error('Ошибка сохранения профиля', error);

    return handleError({ body: 'Не удалось сохранить профиль' });
  }
}

/** Загрузка аватара или обложки: multipart, файл в поле `file`. */
export async function postCabinetProfilePhoto(
  req: NextRequest
): Promise<Response> {
  try {
    const guard = await requireCabinet(req);

    if (guard.type === 'left') return guard.error;

    const formData = await req.formData();
    const file = formData.get('file');
    const kind = formData.get('kind') === 'cover' ? 'cover' : 'avatar';

    if (!(file instanceof File)) return handleError({ body: 'Файл не пришёл' });

    const result = await cabinetProfileService.savePhoto(
      guard.value.id,
      kind,
      file
    );

    if (result.type === 'left') return handleError({ body: result.error });

    return handleSuccess({ body: result.value });
  } catch (error) {
    console.error('Ошибка загрузки фото профиля', error);

    return handleError({ body: 'Не удалось загрузить фотографию' });
  }
}

/**
 * Завершение сессий.
 *
 * Без `id` — «выйти на всех устройствах»: отзываются все, включая текущую,
 * поэтому клиент после ответа уходит на страницу входа.
 */
export async function deleteCabinetSession(req: NextRequest): Promise<Response> {
  try {
    const guard = await requireCabinet(req);

    if (guard.type === 'left') return guard.error;

    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      await sessionService.revokeSessionById(guard.value.id, id);
    } else {
      await sessionService.revokeAllSessions(guard.value.id);
    }

    return handleSuccess({ body: { ok: true } });
  } catch (error) {
    console.error('Ошибка завершения сессии', error);

    return handleError({ body: 'Не удалось завершить сессию' });
  }
}
