import z, { number } from 'zod';

const UserRefSchema = z.object({
  id: z.number().int().positive(),
  login: z.string(),
  role: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable()
});

export const postBaseSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(256),
  description: z.string(),
  content: z.string(),
  postAuthorId: z.number(),
  type: z.string().min(1).max(20),
  guid: z.string().min(1).max(80),
  images: z.array(z.string().max(512)).default([]),
  status: z.string().min(1).max(20),
  slug: z.string().min(1),
  metaKeywords: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  image: z.string().max(512).optional().nullable(),
  metaTitle: z.string().max(512).optional().nullable(),
  metaDescription: z.string().max(512).optional().nullable(),
  link: z.string().max(512).url().optional().nullable(),
  pubDate: z.string().max(128).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  price: z.number().optional().nullable(),
  duration: z.number().optional().nullable(),
  rating: z.number().optional().nullable(),
  metaDuration: z.string().max(512).optional().nullable(),
  metaPrice: z.string().max(256).optional().nullable()
});

export const postEditSchema = postBaseSchema.extend({
  id: number()
});

export const postCreateSchema = postBaseSchema
  .extend({
    user: UserRefSchema
  })
  .strict();

export const postUpdateSchema = postBaseSchema
  .partial()
  .extend({
    user: UserRefSchema.optional()
  })
  .strict();

export type PostCreate = z.infer<typeof postCreateSchema>;
export type PostUpdate = z.infer<typeof postEditSchema>;
