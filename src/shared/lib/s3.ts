import * as Minio from 'minio';

const isDevMode = process.env.NODE_ENV === 'development';

export const s3Client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT || '',
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  useSSL: isDevMode ? false : process.env.S3_USE_SSL === 'true' || true
});
