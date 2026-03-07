import { File } from 'generated/prisma/client';

import { fileRepository, fileStorage } from '@/entities/file/server';

import { Either, left, right } from '@/shared/lib/either';

const deleteFile = async (id: number): Promise<Either<string, File>> => {
  const result = await fileRepository.deleteFile(id);

  if (!result) {
    return left('Не удалось удалить файл');
  }

  const storageResult = await fileStorage.deleteFileFromStorage({
    bucketName: 'wp-content',
    filename: result.filename
  });

  if (storageResult.type === 'left') {
    return left('Файл удален из базы, но не удален из хранилища');
  }

  return right(result);
};

export const deleteFilesService = {
  deleteFile
};
