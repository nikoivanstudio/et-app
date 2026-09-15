import {
  deleteTourPhoto,
  setTourMainPhoto,
  uploadTourPhotos
} from '@/features/tour-editor/server';

export const POST = uploadTourPhotos;
export const PATCH = setTourMainPhoto;
export const DELETE = deleteTourPhoto;
