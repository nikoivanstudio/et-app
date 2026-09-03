import { Readable } from 'node:stream';

import { fileStorage } from '@/entities/file/storage/file-storage';

import { PUBLIC_BUCKET_NAME } from '@/shared/constants/file-storage-constants';
import {
  getFileExtension,
  isSafeObjectName
} from '@/shared/constants/upload-constants';

/**
 * Типы, которые безопасно отдавать для отображения в браузере (HIGH-6).
 *
 * SVG удалён из списка сознательно: он может содержать тег script, а файл
 * отдаётся с домена приложения, поэтому скрипт исполнялся бы в контексте сайта
 * и получал доступ к cookie сессии. Всё, чего нет в списке, отдаётся как
 * поток байтов и с указанием скачать, а не открыть.
 */
const inlineContentTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  pdf: 'application/pdf'
};

export async function getFileContent(
  _req: Request,
  context: { params: Promise<{ filename: string }> }
): Promise<Response> {
  const { filename } = await context.params;

  if (!isSafeObjectName(filename)) {
    return new Response('Некорректное имя файла', { status: 400 });
  }

  const storageResult = await fileStorage.getFileFromStorage({
    bucketName: PUBLIC_BUCKET_NAME,
    filename
  });

  if (storageResult.type === 'left') {
    return new Response('Файл не найден', { status: 404 });
  }

  const extension = getFileExtension(filename);
  const inlineType = inlineContentTypes[extension];

  const stream = Readable.toWeb(
    storageResult.value
  ) as ReadableStream<Uint8Array>;

  return new Response(stream, {
    headers: {
      'Content-Type': inlineType || 'application/octet-stream',
      // Не даём браузеру угадывать тип в обход заголовка
      'X-Content-Type-Options': 'nosniff',
      // Незнакомые типы не отображаем в контексте домена, а отдаём файлом
      'Content-Disposition': inlineType ? 'inline' : 'attachment',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
