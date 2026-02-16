import 'server-only';

import { fileRepository } from '@/entities/file/server';

import { Either, left, right } from '@/shared/lib/either';

import { FullUrlDto } from '../domain';
import { fileUtils } from '../lib/file-utils';

const saveFilesInfo = async (
  files: FullUrlDto[]
): Promise<Either<string, string>> => {
  const createFilesDto = files.map(fileUtils.fullFileDtoToCreateFileDto);
  const result = await fileRepository.createFiles(createFilesDto);

  if (!result.count) {
    return left('Ошибка загрузки файлов');
  }

  return right(`Успешно загружено ${result.count} файлов`);
};

export const fileServiceServer = {
  saveFilesInfo
};
