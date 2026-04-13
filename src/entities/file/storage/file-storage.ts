import { Readable } from 'node:stream';

import { Either, left, right } from '@/shared/lib/either';
import { s3Client } from '@/shared/lib/s3';

type PresignedData = {
  bucketName: string;
  filename: string;
  expiry?: number;
};

const getFileFromStorage = async ({
  bucketName,
  filename
}: Omit<PresignedData, 'expiry'>): Promise<Either<string, Readable>> => {
  try {
    await s3Client.statObject(bucketName, filename);
  } catch (e) {
    console.error(e);

    return left('Error in time of load file');
  }

  return right(await s3Client.getObject(bucketName, filename));
};

const createPresignedUrlToUpload = ({
  bucketName,
  filename,
  expiry
}: PresignedData): Promise<string> =>
  s3Client.presignedPutObject(bucketName, filename, expiry || 1800);

const createPresignedUrlToDownload = ({
  bucketName,
  filename,
  expiry
}: PresignedData): Promise<string> =>
  s3Client.presignedGetObject(bucketName, filename, expiry);

const deleteFileFromStorage = async ({
  bucketName,
  filename
}: Omit<PresignedData, 'expiry'>): Promise<Either<boolean, boolean>> => {
  try {
    await s3Client.removeObject(bucketName, filename);
  } catch (e) {
    console.error(e);

    return left(false);
  }

  return right(true);
};

export const fileStorage = {
  getFileFromStorage,
  createPresignedUrlToUpload,
  createPresignedUrlToDownload,
  deleteFileFromStorage
};
