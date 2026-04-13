import { PhotoEntity } from '@/entities/photo/domain';

import { saveFileWithPath } from '@/shared/lib/server-files-utils';

const savePhoto = (photo: File): Promise<string | null> => {
  return saveFileWithPath(photo, 'images');
};

export const getPhotoEntity = async ({
  file,
  title,
  ...rest
}: {
  file: File;
  authorId: number;
  keywords: string[];
  title?: string;
}): Promise<Omit<PhotoEntity, 'id'> | null> => {
  const source = await savePhoto(file);

  if (!source) {
    return null;
  }

  return {
    title: title || file.name,
    source,
    fileName: file.name,
    ...rest
  };
};

export const serverPhotoUtils = { getPhotoEntity };
