import 'server-only';

import { FileEntity } from '@/entities/file/domain';
import { fileUtils } from '@/entities/file/lib/file-utils';
import { fileRepository } from '@/entities/file/repositories/file-repository';
import { fileStorage } from '@/entities/file/storage/file-storage';

import { PUBLIC_BUCKET_NAME } from '@/shared/constants/file-storage-constants';
import { Either, left, right } from '@/shared/lib/either';

const saveUploadedFile = async ({
  file,
  authorId
}: {
  file: File;
  authorId: number;
}): Promise<Either<string, FileEntity>> => {
  const filename = fileUtils.getUniqueFileName(file.name);
  const uploadResult = await fileStorage.uploadFileToStorage({
    bucketName: PUBLIC_BUCKET_NAME,
    filename,
    file
  });

  if (uploadResult.type === 'left') {
    return left(uploadResult.error);
  }

  try {
    const savedFile = await fileRepository.createFile({
      authorId,
      bucket: PUBLIC_BUCKET_NAME,
      filename,
      originalName: file.name,
      size: file.size,
      type: fileUtils.getFileKind(file)
    });

    return right({
      id: savedFile.id,
      authorId: savedFile.authorId,
      bucket: savedFile.bucket,
      filename: savedFile.filename,
      originalName: savedFile.originalName,
      size: savedFile.size,
      type: fileUtils.getFileKind(file)
    });
  } catch (error) {
    await fileStorage.deleteFileFromStorage({
      bucketName: PUBLIC_BUCKET_NAME,
      filename
    });

    console.error(error);

    return left('Ошибка сохранения файла');
  }
};

export const fileServiceServer = { saveUploadedFile };
