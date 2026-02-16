import { apiClient } from '@/shared/api/api-client';

import {
  FullUrlDto,
  SaveFilesInfoResult,
  ShortFileDto,
  ShortUrlDto
} from '../domain';

const baseKey = 'files';

const getPresignedUrlsDto = async (
  files: ShortFileDto[]
): Promise<{ presignedUrlsDto: ShortUrlDto[] }> =>
  apiClient.post<{ presignedUrlsDto: ShortUrlDto[] }>({
    url: 'files/upload/presignedUrl',
    body: JSON.stringify({ fileItems: files })
  });

const uploadToS3 = (url: string, file: File): Promise<Response> =>
  apiClient.put({
    url,
    body: file,
    headers: {
      'Content-Type': file.type
    },
    withoutParse: true,
    clearUrl: true
  });

const saveFilesInfo = (
  filesInfo: FullUrlDto[]
): Promise<SaveFilesInfoResult> =>
  apiClient.post<SaveFilesInfoResult>({
    url: 'files/upload/save',
    body: JSON.stringify({ filesInfo })
  });

export const fileApi = {
  baseKey,
  getPresignedUrlsDto,
  uploadToS3,
  saveFilesInfo
};
