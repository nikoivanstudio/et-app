import { ContentFile } from '../domain';
import { fileRepository, fileStorage } from '@/entities/file/server';
import { Either, left, right } from '@/shared/lib/either';
import { Prisma, File } from 'generated/prisma/client';

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

export const downloadFilesService = { getContentFilesBySearchParams };
