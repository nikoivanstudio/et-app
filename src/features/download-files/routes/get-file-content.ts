import { Readable } from 'node:stream';

import { fileStorage } from '@/entities/file/storage/file-storage';

import { PUBLIC_BUCKET_NAME } from '@/shared/constants/file-storage-constants';

const imageContentTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml'
};

const getContentType = (filename: string): string => {
  const extension = filename.split('.').at(-1)?.toLowerCase();

  return (extension && imageContentTypes[extension]) || 'application/octet-stream';
};

export async function getFileContent(
  _req: Request,
  context: { params: Promise<{ filename: string }> }
): Promise<Response> {
  const { filename } = await context.params;
  const storageResult = await fileStorage.getFileFromStorage({
    bucketName: PUBLIC_BUCKET_NAME,
    filename
  });

  if (storageResult.type === 'left') {
    return new Response('Файл не найден', { status: 404 });
  }

  const stream = Readable.toWeb(storageResult.value) as ReadableStream<Uint8Array>;

  return new Response(stream, {
    headers: {
      'Content-Type': getContentType(filename),
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
