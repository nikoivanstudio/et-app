import { dbClient } from '@/shared/lib/db';

const getPhotoById = (id: number) =>
  dbClient.photo.findUnique({ where: { id } });

const getPhotosByIds = (ids: number[]) =>
  ids.length ? dbClient.photo.findMany({ where: { id: { in: ids } } }) : [];

export const photoRepository = { getPhotoById, getPhotosByIds };
