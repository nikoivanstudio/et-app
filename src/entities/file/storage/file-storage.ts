import { s3Client } from '@/shared/lib/s3';

const getPresignedUrlToUpload = ({
  bucketName,
  filename,
  expiry
}: {
  bucketName: string;
  filename: string;
  expiry?: number;
}): Promise<string> =>
  s3Client.presignedPutObject(bucketName, filename, expiry);

export const fileStorage = { getPresignedUrlToUpload };
