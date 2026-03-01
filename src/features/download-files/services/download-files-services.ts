import { Prisma } from 'generated/prisma/client';

import {
  FileDomain,
  fileRepository,
  fileStorage
} from '@/entities/file/server';

import { Either, left, right } from '@/shared/lib/either';

import { ContentFile } from '../domain';

const getContentFilesBySearchParams = async (
  data: Prisma.FileFindManyArgs
): Promise<Either<string, ContentFile[]>> => {
  const files = await fileRepository.getFiles(data);

  if (!files) {
    return left('Error in getFiles');
  }

  const contentFiles = await Promise.all(
    files.map(async file => {
      const url = await fileStorage.createPresignedUrlToDownload({
        bucketName: 'wp-content',
        filename: file.filename,
        expiry: 3600
      });

      return { ...file, url };
    })
  );

  return right(contentFiles);
};

const getAuthorsByFiles = async (): Promise<
  Either<string, FileDomain.FilesUserEntity[]>
> => {
  const users = await fileRepository.getAuthorsByFiles();

  if (!users) {
    return left('Ошибка получения пользователей');
  }

  return right(users);
};

export const downloadFilesService = {
  getContentFilesBySearchParams,
  getAuthorsByFiles
};
