import { PhotoEntity } from '@/entities/photo/domain';
import { fileUtils } from '@/entities/file/lib/file-utils';
import { fileServiceServer } from '@/entities/file/services/file-service-server';

export const getPhotoEntity = async ({
  file,
  authorId,
  title,
  ...rest
}: {
  file: File;
  authorId: number;
  keywords: string[];
  title?: string;
}): Promise<Omit<PhotoEntity, 'id'> | null> => {
  const result = await fileServiceServer.saveUploadedFile({ file, authorId });

  if (result.type === 'left') {
    return null;
  }

  const source = fileUtils.getFileSource(result.value.filename);

  return {
    title: title || file.name,
    source,
    fileName: result.value.filename,
    authorId,
    ...rest
  };
};

export const serverPhotoUtils = { getPhotoEntity };
