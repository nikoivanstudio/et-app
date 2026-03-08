import { File } from 'generated/prisma/client';

import { fileRepository, fileStorage } from '@/entities/file/server';

import { Either, left, right } from '@/shared/lib/either';

const deleteFile = async (id: number): Promise<Either<string, File>> => {
  const result = await fileRepository.deleteFile(id);

  if (!result) {
    return left('Ошибка при удаление файла');
  }

  const storageResult = await fileStorage.deleteFileFromStorage({
    bucketName: 'wp-content',
    filename: result.filename
  });

  if (storageResult.type === 'left') {
    return left('Ошибка при удаление файла');
  }

  return right(result);
};

export const deleteFilesService = {
  deleteFile
};
