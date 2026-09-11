import { Prisma } from 'generated/prisma/client';

export const postCardFields: Prisma.PostSelect = {
  title: true,
  id: true,
  user: true,
  slug: true,
  // `image` — одиночная обложка поста; без неё карточки, у которых заполнено
  // только оно, все показывали одну и ту же запасную картинку.
  image: true,
  images: true,
  price: true,
  duration: true,
  metaPrice: true,
  metaDuration: true
};
