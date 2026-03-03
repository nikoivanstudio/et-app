import { Prisma } from 'generated/prisma/client';

import {
  FileDomain,
  fileRepository,
  fileStorage
} from '@/entities/file/server';

import { Either, left, right } from '@/shared/lib/either';

import { ContentFile, GetFilesResponse } from '../domain';

const getPagesCount = async (where?: Prisma.FileWhereInput) => {
  const count = await fileRepository.getFilesCount(where);

  return Math.ceil(count / 10);
};

const getContentFilesBySearchParams = async (
  data: Prisma.FileFindManyArgs
): Promise<Either<string, GetFilesResponse>> => {
  const [files, pagesCount, summary] = await Promise.all([
    fileRepository.getFiles(data),
    getPagesCount(data.where),
    fileRepository.getFilesSummary()
  ]);

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

  return right({
    files: contentFiles as ContentFile[],
    pagesCount,
    summary
  });
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
