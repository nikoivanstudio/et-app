import * as Minio from 'minio';

export const s3Client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT || 'minio',
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  useSSL: false
});
