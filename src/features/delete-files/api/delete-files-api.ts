import { apiClient } from '@/shared/api/api-client';

const baseKey = 'files';
const baseUrl = 'files/delete';

const deleteFile = (id: number) =>
  apiClient.del({
    url: `${baseUrl}/${id}`
  });

export const deleteFilesApi = {
  baseKey,
  deleteFile
};
