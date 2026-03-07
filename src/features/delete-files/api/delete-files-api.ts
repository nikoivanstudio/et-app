import { apiClient } from '@/shared/api/api-client';

const baseKey = 'delete-file';
const baseUrl = 'files/delete';

const deleteFile = (id: number) =>
  apiClient.del({
    url: baseUrl,
    queryParams: {
      id: String(id)
    }
  });

export const deleteFilesApi = {
  baseKey,
  deleteFile
};
