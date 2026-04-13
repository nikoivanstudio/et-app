import { NextRequest } from 'next/server';

import { CreateTourData } from '@/features/tour/domain';
import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';
import { patchTourSchema } from '@/features/tour/lib/schemas/create-tour-schemas';
import { tourService } from '@/features/tour/services/tour-service';

import { PhotoDomain } from '@/entities/photo';
import { serverPhotoUtils } from '@/entities/photo/server';
import { roleUtils } from '@/entities/user';
import { Role } from '@/entities/user/domain';
import { sessionUtils } from '@/entities/user/lib/session-utils';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

export async function patchTour(req: NextRequest): Promise<Response> {
  try {
    const session = await sessionUtils.getSession(
      req.cookies.get('session')?.value
    );

    if (!roleUtils.userHasPermissionOn(session?.role, 'updateTour')) {
      return handleError({
        body: 'У вас нет полномочий на редактирование туров'
      });
    }

    const formData = await req.formData?.();
    const data = prepareDataUtils.getEditTourData(formData);
    const dataEntity = patchTourSchema.safeParse(data);

    if (!data || !dataEntity.success) {
      return handleError({
        body: 'Невозможно обновить запись. Данные не валидны'
      });
    }

    const hasPermissionOnEdit =
      session.role === Role.SUPER_ADMIN ||
      session.id === dataEntity.data?.authorId;

    if (!hasPermissionOnEdit) {
      return handleError({
        body: 'У вас нет полномочий на редактирование этого тура'
      });
    }

    const { title, authorId, mainPhoto, photos, ...rest } = dataEntity.data;

    const mainPhotoEntity =
      'mainPhoto' in dataEntity.data && mainPhoto?.length
        ? await serverPhotoUtils.getPhotoEntity({
            title,
            keywords: [],
            authorId: session.id,
            file: mainPhoto[0]
          })
        : undefined;

    const photosEntities =
      'photos' in dataEntity.data && photos?.length
        ? await Promise.all(
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
      authorId,
      ...rest
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
