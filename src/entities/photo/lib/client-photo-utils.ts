import { photoTypeguards } from '@/entities/photo';

import { getFileBySource } from '@/shared/lib/file-utils';

const getFileByPhotoEntity = (
  photo?: unknown
): Promise<File | undefined> | undefined => {
  if (!photo || !photoTypeguards.isPhotoEntity(photo)) return undefined;

  return getFileBySource(photo.source, photo.fileName);
};

export const clientPhotoUtils = {
  getFileByPhotoEntity
};
