import { fileStorage } from '@/entities/file/server';
import { PUBLIC_BUCKET_NAME } from '@/shared/constants/file-storage-constants';
import { v4 } from 'uuid';
import { ShortFileDto } from '../domain';

const publicBucketName = PUBLIC_BUCKET_NAME;

const getPresignedUrlsDto = (fileItems: ShortFileDto[]) =>
  Promise.all(
    fileItems.map(async ({ originalFileName, size }) => {
      const fileNameInBucket = `${v4()}-${originalFileName}`;

      return {
        fileNameInBucket,
        originalFileName,
        size,
        publicBucketName,
        url: await fileStorage.createPresignedUrlToUpload({
          bucketName: publicBucketName,
          filename: fileNameInBucket
        })
      };
    })
  );

export const fileStorageService = { getPresignedUrlsDto };
