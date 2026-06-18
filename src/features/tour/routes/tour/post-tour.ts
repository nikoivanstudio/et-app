import { NextRequest } from 'next/server';

import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';
import { tourService } from '@/features/tour/services/tour-service';

import { PhotoEntity } from '@/entities/photo/domain';
import { serverPhotoUtils } from '@/entities/photo/server';
import { TourStatus } from '@/entities/tour/domain';
import { roleUtils } from '@/entities/user';
import { sessionUtils } from '@/entities/user/lib/session-utils';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function postTour(req: NextRequest): Promise<Response> {
  try {
    const session = await sessionUtils.getSession(
      req.cookies.get('session')?.value
    );

    if (!roleUtils.userHasPermissionOn(session?.role, 'createTour')) {
      return handleError({ body: 'У вас нет полномочий на создание туров' });
    }

    const formData = await req.formData?.();

    // authorId не приходит из формы — проставляем автора из сессии до валидации.
    if (formData) {
      formData.set('authorId', String(session.id));
    }

    const data = prepareDataUtils.getTourData(formData);

    if (!data) {
      return handleError({
        body: 'Невозможно создать запись. Данные не валидны'
      });
    }

    const { title, mainPhoto, photos, ...rest } = data;

    // Гид отправляет тур на модерацию (PENDING). Администратор/супер-админ
    // создаёт туры компании напрямую опубликованными (APPROVED).
    // Теги на создании не принимаем — их назначает только администратор.
    const status = roleUtils.userHasPermissionOn(session.role, 'reviewTour')
      ? TourStatus.APPROVED
      : TourStatus.PENDING;

    // Теги на создании не доверяем клиенту — назначает только администратор.
    delete (rest as Record<string, unknown>).tags;

    const mainPhotoEntity = await serverPhotoUtils.getPhotoEntity({
      title,
      keywords: [],
      authorId: session.id,
      file: mainPhoto
    });

    if (!mainPhotoEntity) {
      return handleError({
        body: 'Невозможно создать главное фото тура'
      });
    }

    const photosEntities: Omit<PhotoEntity, 'id'>[] = photos?.length
      ? ((await Promise.all(
          photos
            ?.map(
              async file =>
                await serverPhotoUtils.getPhotoEntity({
                  file,
                  authorId: session.id,
                  keywords: []
                })
            )
            .filter(Boolean)
        )) as Omit<PhotoEntity, 'id'>[])
      : [];

    const tour = await tourService.createTour({
      authorId: session.id,
      ...rest,
      status,
      title,
      mainPhoto: mainPhotoEntity,
      photos: photosEntities
    });

    if (!tour) {
      return handleError({ body: 'Ошибка. Не удалось создать тур' });
    }

    return handleSuccess({ body: tour });
  } catch (e) {
    console.error(e);

    return handleError({ body: 'Catch' });
  }
}
