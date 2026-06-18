import { z } from 'zod';

import { TourStatus } from '@/entities/tour/domain';
import { tourContentSchema } from '@/entities/tour/model/content';

const supportedImageExtensions = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'heic',
  'heif'
]);

const isImageFile = (file: File) => {
  const extension = file.name.split('.').at(-1)?.toLowerCase();

  return (
    file.type.startsWith('image/') ||
    (!!extension && supportedImageExtensions.has(extension))
  );
};

const photoSchema = z.object({
  id: z.number(),
  title: z.string(),
  source: z.string(),
  authorId: z.number()
});

const photoSchemaWithoutId = photoSchema.extend({ id: z.never() });

const fileImageSchema = z
  .instanceof(File)
  .refine(file => isImageFile(file), {
    message: 'Неподдерживаемый формат фото'
  });

const baseTourSchema = {
  title: z
    .string()
    .min(10, 'Название тура не может быть менее 10 символов')
    .max(180, 'Название тура не может быть более 180 символов'),
  description: z.string(),
  content: tourContentSchema,
  slug: z.string().min(5),
  price: z.number().min(1000, 'Стоимость тура не может быть менее 1000 рублей'),
  duration: z
    .number()
    .min(3600, 'Продолжительность тура не может быть менее 1 часа')
    .max(86400, 'Продолжительность тура не может быть более 24 часов'),
  categories: z.array(
    z
      .string()
      .min(3, 'Наименование категории не может быть менее 3-х симвоолов')
      .max(30, 'Наименование категории не может превышать 30 символов')
  ),
  authorId: z.number(),
  photos: z.array(fileImageSchema).optional(),
  descriptionText: z.string().optional(),
  startPlace: z.string().optional(),
  status: z.string().optional(),
  // Теги назначает только администратор (право assignTourTags).
  tags: z.array(z.string()).optional()
};

export const createTourSchemas = z.object({
  ...baseTourSchema,
  mainPhoto: z
    .array(fileImageSchema)
    .max(1, 'Главным фото может быть только 1 фотография')
});

export const createTourSchema = z.object({
  ...baseTourSchema,
  status: z.string(),
  mainPhoto: fileImageSchema
});

export const editTourSchema = createTourSchema.extend({
  id: z.number(),
  mainPhoto: z.union([photoSchema, z.array(fileImageSchema)]),
  photos: z.array(z.union([photoSchema, fileImageSchema]))
});

export const patchTourSchema = editTourSchema
  .extend({
    mainPhoto: z.array(fileImageSchema).optional(),
    photos: z.array(fileImageSchema).optional()
  })
  .partial()
  .required({ id: true, authorId: true });

export const preparedPatchTourSchema = patchTourSchema
  .extend({
    mainPhoto: photoSchemaWithoutId.optional(),
    photos: z.array(photoSchemaWithoutId).optional()
  })
  .partial();

export type PatchTourData = z.infer<typeof patchTourSchema>;

// Решение модератора по туру: одобрить или отклонить (с комментарием).
export const reviewTourSchema = z.object({
  id: z.number(),
  status: z.enum([TourStatus.APPROVED, TourStatus.REJECTED]),
  comment: z.string().optional()
});

export type ReviewTourPayload = z.infer<typeof reviewTourSchema>;
