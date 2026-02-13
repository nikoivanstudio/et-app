import { apiClient } from '@/shared/api/api-client';
import { ShortFileDto, ShortUrlDto } from '../domain';

const getPresignedUrlsDto = async (
  files: ShortFileDto[]
): Promise<{ presignedUrlsDto: ShortUrlDto[] }> =>
  apiClient.post<{ presignedUrlsDto: ShortUrlDto[] }>({
    url: 'files/upload/presignedUrl',
    body: JSON.stringify({ fileItems: files })
  });

export const uploadFileApi = { getPresignedUrlsDto };
