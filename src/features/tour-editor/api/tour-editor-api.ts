import { apiClient } from '@/shared/api/api-client';

import { SaveTourPayload, SetTourStatusPayload } from '../model/schemas';
import { EditorPhoto } from '../model/types';

const baseUrl = 'tours/editor';
const baseKey = 'tour-editor';

const json = { 'Content-Type': 'application/json' };

const saveTour = (payload: SaveTourPayload) =>
  apiClient.post<{ id: number; status: string | null }>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: json
  });

const setStatus = (payload: SetTourStatusPayload) =>
  apiClient.patch<{ id: number; status: string | null }>({
    url: baseUrl,
    body: JSON.stringify(payload),
    headers: json
  });

const deleteTour = (id: number) =>
  apiClient.del<{ id: number }>({ url: baseUrl, queryParams: { id } });

const duplicateTour = (id: number) =>
  apiClient.post<{ id: number }>({
    url: `${baseUrl}/duplicate`,
    queryParams: { id }
  });

const uploadPhotos = (tourId: number, files: File[]) => {
  const formData = new FormData();

  formData.append('tourId', String(tourId));
  files.forEach(file => formData.append('files', file));

  return apiClient.post<{ photos: EditorPhoto[] }>({
    url: `${baseUrl}/photos`,
    body: formData
  });
};

const setMainPhoto = (tourId: number, photoId: number) =>
  apiClient.patch<{ id: number }>({
    url: `${baseUrl}/photos`,
    body: JSON.stringify({ tourId, photoId }),
    headers: json
  });

const deletePhoto = (tourId: number, photoId: number) =>
  apiClient.del<{ id: number }>({
    url: `${baseUrl}/photos`,
    queryParams: { tourId, photoId }
  });

export const tourEditorApi = {
  baseKey,
  saveTour,
  setStatus,
  deleteTour,
  duplicateTour,
  uploadPhotos,
  setMainPhoto,
  deletePhoto
};
