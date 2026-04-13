import { CreateTourData } from '@/features/tour/domain';
import {
  createTourSchema,
  PatchTourData,
  preparedPatchTourSchema
} from '@/features/tour/lib/schemas/create-tour-schemas';

import { FormDialogDomain } from '@/entities/form-dialog';
import { clientPhotoUtils } from '@/entities/photo/lib/client-photo-utils';
import { TourEntity } from '@/entities/tour/domain';

const prepareDataToCreate = (
  data: FormDialogDomain.FormData
): [string, string | File][] => {
  const { mainPhoto, photos, ...restData } = data;

  const stringValues = Object.entries(restData).map(([key, value]) => [
    key,
    typeof value === 'string' ? value : JSON.stringify(value)
  ]);

  const preparedPhotos: [string, string | File][] = [];

  if (mainPhoto && Array.isArray(mainPhoto)) {
    preparedPhotos.push(['mainPhoto', mainPhoto?.[0]]);
  }

  if (!!photos && Array.isArray(photos) && photos.length) {
    stringValues.push(['filesLength', String(photos?.length)]);

    preparedPhotos.push(
      ...(Object.values(photos).map((file, idx) => [
        `file_${idx + 1}`,
        file
      ]) as [string, File][])
    );
  }

  return [...stringValues, ...preparedPhotos] as [string, string | File][];
};

const prepareDataToEdit = async (
  tourEntity: TourEntity
): Promise<FormDialogDomain.FormData> => {
  const { mainPhoto, photos, startPlace, ...restData } = tourEntity;

  const mainPhotoFile = await clientPhotoUtils.getFileByPhotoEntity(mainPhoto);
  const photosFiles = photos?.length
    ? (
        await Promise.all(
          photos.map(
            async photo => await clientPhotoUtils.getFileByPhotoEntity(photo)
          )
        )
      ).filter(file => !!file)
    : [];

  return {
    ...restData,
    mainPhoto: mainPhotoFile ? [mainPhotoFile] : undefined,
    photos: photosFiles
  };
};

const prepareNumberValues = (
  value: Record<string, string | File | number>
): Record<string, string | File | number> => {
  if (!value) {
    return value;
  }

  if ('id' in value && typeof value.id === 'string') {
    value.id = Number(value.id);
  }
  if ('authorId' in value && typeof value.authorId === 'string') {
    value.authorId = Number(value.authorId);
  }
  if ('price' in value && typeof value.price === 'string') {
    value.price = Number(value.price);
  }
  if ('duration' in value && typeof value.duration === 'string') {
    value.duration = Number(value.duration);
  }

  if ('categories' in value && typeof value.categories === 'string') {
    try {
      value.categories = JSON.parse(value.categories);
    } catch (e) {
      console.error(e);
    }
  }

  return value;
};

const getEditTourData = (formData: FormData): PatchTourData | null => {
  const data: Record<string, string | File> = Object.fromEntries(
    formData.entries()
  );

  const preparedData = prepareNumberValues(data);
  const result = preparedPatchTourSchema.safeParse(preparedData);

  return result.success ? result.data : null;
};

const getTourData = (formData: FormData): CreateTourData | null => {
  const data: Record<string, string | File> = Object.fromEntries(
    formData.entries()
  );

  const preparedData = prepareNumberValues(data);
  const result = createTourSchema.safeParse(preparedData);

  return result.success ? result.data : null;
};

export const prepareDataUtils = {
  prepareDataToCreate,
  prepareDataToEdit,
  getTourData,
  getEditTourData
};
