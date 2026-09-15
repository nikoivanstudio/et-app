import { NextRequest } from 'next/server';

import { handleError, handleSuccess } from '@/shared/lib/response-utils';

/**
 * Любое необработанное исключение отдаётся как обычная ошибка.
 *
 * Без этого Next отвечает пустым телом с кодом 500, а клиент падает уже на
 * `response.json()` — и вместо причины пользователь видит «Unexpected end of
 * JSON input».
 */
const guarded = (
  handler: (req: NextRequest) => Promise<Response>
): ((req: NextRequest) => Promise<Response>) => async req => {
  try {
    return await handler(req);
  } catch (error) {
    console.error('Ошибка редактора тура', error);

    return handleError({ body: 'Не удалось сохранить тур. Попробуйте ещё раз' });
  }
};

import { saveTourSchema, setTourStatusSchema } from '../model/schemas';
import { tourEditorService } from '../services/tour-editor-service';

import { requireGuide } from './guard';

const numberParam = (req: NextRequest, name: string): number | null => {
  const value = Number(req.nextUrl.searchParams.get(name));

  return Number.isInteger(value) && value > 0 ? value : null;
};

/** Сохранение черновика: создаёт тур или обновляет существующий. */
async function saveEditorTourHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const parsed = saveTourSchema.safeParse(await req.json());

  if (!parsed.success) {
    return handleError({
      body: parsed.error.issues[0]?.message ?? 'Данные тура не валидны'
    });
  }

  const result = await tourEditorService.saveTour(parsed.data, guard.value.id);

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

/** Отправить на модерацию или снять с публикации. */
async function setEditorTourStatusHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const parsed = setTourStatusSchema.safeParse(await req.json());

  if (!parsed.success) return handleError({ body: 'Неизвестный статус' });

  const result = await tourEditorService.setStatus(parsed.data, guard.value.id);

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

async function deleteEditorTourHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const id = numberParam(req, 'id');

  if (!id) return handleError({ body: 'Не указан тур' });

  const result = await tourEditorService.removeTour(id, guard.value.id);

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

async function duplicateEditorTourHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const id = numberParam(req, 'id');

  if (!id) return handleError({ body: 'Не указан тур' });

  const result = await tourEditorService.duplicateTour(id, guard.value.id);

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

/** Загрузка фотографий тура: multipart, файлы в поле `files`. */
async function uploadTourPhotosHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const formData = await req.formData();
  const tourId = Number(formData.get('tourId'));
  const files = formData
    .getAll('files')
    .filter((item): item is File => item instanceof File);

  if (!Number.isInteger(tourId) || !tourId) {
    return handleError({ body: 'Сначала сохраните черновик тура' });
  }

  if (!files.length) return handleError({ body: 'Файлы не пришли' });

  const result = await tourEditorService.addPhotos(
    tourId,
    guard.value.id,
    files
  );

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

/** Сделать фотографию главной. */
async function setTourMainPhotoHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const { tourId, photoId } = (await req.json()) as {
    tourId?: number;
    photoId?: number;
  };

  if (!tourId || !photoId) return handleError({ body: 'Не указана фотография' });

  const result = await tourEditorService.setMainPhoto(
    tourId,
    photoId,
    guard.value.id
  );

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

async function deleteTourPhotoHandler(req: NextRequest): Promise<Response> {
  const guard = await requireGuide(req);

  if (guard.type === 'left') return guard.error;

  const tourId = numberParam(req, 'tourId');
  const photoId = numberParam(req, 'photoId');

  if (!tourId || !photoId) return handleError({ body: 'Не указана фотография' });

  const result = await tourEditorService.removePhoto(
    tourId,
    photoId,
    guard.value.id
  );

  if (result.type === 'left') return handleError({ body: result.error });

  return handleSuccess({ body: result.value });
}

export const saveEditorTour = guarded(saveEditorTourHandler);
export const setEditorTourStatus = guarded(setEditorTourStatusHandler);
export const deleteEditorTour = guarded(deleteEditorTourHandler);
export const duplicateEditorTour = guarded(duplicateEditorTourHandler);
export const uploadTourPhotos = guarded(uploadTourPhotosHandler);
export const setTourMainPhoto = guarded(setTourMainPhotoHandler);
export const deleteTourPhoto = guarded(deleteTourPhotoHandler);
