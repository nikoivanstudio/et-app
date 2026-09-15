import { NextRequest } from 'next/server';

import { CreateTourData } from '@/features/tour/domain';
import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';
import { tourService } from '@/features/tour/services/tour-service';

import { PhotoDomain } from '@/entities/photo';
import { serverPhotoUtils } from '@/entities/photo/server';
import { TourStatus } from '@/entities/tour/domain';
import { tourRepositories } from '@/entities/tour/server';
import { roleUtils } from '@/entities/user';
import { SESSION_COOKIE_NAME } from '@/entities/user/constants/session-cookie';
import { Role } from '@/entities/user/domain';
import { sessionUtils } from '@/entities/user/lib/session-utils';

import {
  handleError,
  handleForbidden,
  handleSuccess
} from '@/shared/lib/response-utils';

export async function patchTour(req: NextRequest): Promise<Response> {
  try {
    const session = await sessionUtils.getSession(
      req.cookies.get(SESSION_COOKIE_NAME)?.value
    );

    const canUpdate = roleUtils.userHasPermissionOn(
      session?.role,
      'updateTour'
    );
    // Модераторы (reviewTour) могут редактировать любой тур, в т.ч. чужой.
    const canReview = roleUtils.userHasPermissionOn(
      session?.role,
      'reviewTour'
    );

    if (!canUpdate && !canReview) {
      return handleError({
        body: 'У вас нет полномочий на редактирование туров'
      });
    }

    const formData = await req.formData?.();
    const data = prepareDataUtils.getEditTourData(formData);

    if (!data) {
      return handleError({
        body: 'Невозможно обновить запись. Данные не валидны'
      });
    }

    const { title, mainPhoto, photos, id, ...rest } = data;

    if (typeof id !== 'number') {
      return handleError({
        body: 'Невозможно обновить запись. Данные не валидны'
      });
    }

    /**
     * Автор берётся из базы, а не из формы.
     *
     * Раньше право на правку проверялось по `authorId` из тела запроса:
     * достаточно было прислать чужой `id` тура вместе со своим `authorId`,
     * чтобы проверка сошлась, — а этот же `authorId` уезжал в обновление,
     * то есть тур менял владельца. Увести чужой тур мог любой гид.
     */
    const existingTour = await tourRepositories.getTour(id);

    if (!existingTour) {
      return handleError({ body: 'Тур не найден' });
    }

    const authorId = existingTour.authorId;
    const hasPermissionOnEdit =
      session.role === Role.SUPER_ADMIN || session.id === authorId || canReview;

    if (!hasPermissionOnEdit) {
      return handleForbidden(
        'У вас нет полномочий на редактирование этого тура'
      );
    }

    // Смена автора через форму не предусмотрена ничем, кроме подлога.
    delete (rest as Record<string, unknown>).authorId;

    // Теги может назначать только администратор (assignTourTags) —
    // у остальных значение из формы игнорируем.
    if (!roleUtils.userHasPermissionOn(session.role, 'assignTourTags')) {
      delete (rest as Record<string, unknown>).tags;
    }

    // Правка гидом (не модератором) возвращает тур на повторную модерацию.
    if (!canReview) {
      (rest as Record<string, unknown>).status = TourStatus.PENDING;
    }

    const mainPhotoFile =
      Array.isArray(mainPhoto) && mainPhoto[0] instanceof File
        ? mainPhoto[0]
        : undefined;

    const uploadedPhotos = Array.isArray(photos)
      ? (photos as unknown[]).filter(
          (photo): photo is File => photo instanceof File
        )
      : [];

    const mainPhotoEntity = mainPhotoFile
      ? await serverPhotoUtils.getPhotoEntity({
          title,
          keywords: [],
          authorId: session.id,
          file: mainPhotoFile
        })
      : undefined;

    const photosEntities = uploadedPhotos.length
      ? await Promise.all(
          uploadedPhotos
            .map(
              async file =>
                await serverPhotoUtils.getPhotoEntity({
                  file,
                  authorId: session.id,
                  keywords: []
                })
            )
            .filter(Boolean)
        )
      : undefined;

    const tourEditData: Partial<
      Omit<CreateTourData, 'mainPhoto' | 'photos'>
    > & {
      id: number;
      authorId: number;
      mainPhoto?: Omit<PhotoDomain.PhotoEntity, 'id'>;
      photos?: Omit<PhotoDomain.PhotoEntity, 'id'>[];
    } = {
      ...rest,
      id,
      authorId,
      // Заголовок вынимался из данных ради главного фото и дальше нигде
      // не использовался: переименовать тур через форму было нельзя.
      ...(title ? { title } : {})
    };

    if (!!mainPhotoEntity) {
      tourEditData.mainPhoto = mainPhotoEntity;
    }

    if (!!photosEntities) {
      tourEditData.photos = photosEntities.filter(photo => !!photo);
    }

    const tour = await tourService.updateTour(tourEditData);

    if (!tour || tour.type === 'left') {
      return handleError({ body: 'Ошибка. Не удалось создать тур' });
    }

    return handleSuccess({ body: tour.value });
  } catch (e) {
    console.error(e);

    return handleError({ body: 'Catch' });
  }
}
