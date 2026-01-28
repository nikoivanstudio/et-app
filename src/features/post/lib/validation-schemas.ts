import { z } from 'zod';

export const legacyPostSchema = z.object({
  title: z
    .string()
    .min(2, 'Не может быть менее 2 символов')
    .max(512, 'Превышает допустимую длину'),
  description: z.string(),
  content: z.string(),
  postAuthorId: z.number(),
  type: z.string().max(20, 'Не может быть более 20 символов'),
  guid: z.string().max(80, 'Не может быть более 80 символов'),
  image: z.string().max(512, 'Не может быть более 512 символов'),
  images: z.array(z.string().max(512, 'Не может быть более 512 символов')),
  status: z.union([
    z.literal('legacy'),
    z.literal('fresh'),
    z.literal('unknown')
  ]),
  slug: z.string().max(512, 'Не может быть более 512 символов'),
  categories: z.array(z.string()),
  metaTitle: z.string().max(512, 'Не может быть более 512 символов').optional(),
  metaDescription: z
    .string()
    .max(512, 'Не может быть более 512 символов')
    .optional(),
  link: z.string().max(512, 'Не может быть более 512 символов').optional(),
  pubDate: z.string().max(512, 'Не может быть более 128 символов').optional(),
  metaDuration: z
    .string()
    .max(512, 'Не может быть более 128 символов')
    .optional(),
  metaPrice: z.string().max(512, 'Не может быть более 128 символов').optional()
});

export const WPGuidSchema = z.object({
  '@isPermaLink': z.enum(['true', 'false']), // WordPress export often stores this as a string
  '#text': z.string()
});

export const WPCategorySchema = z.object({
  '@domain': z.string(),
  '@nicename': z.string(),
  '#text': z.string()
});

export const WPCategoryUnionSchema = z.union([
  WPCategorySchema,
  z.array(WPCategorySchema)
]);

export const WPPostmetaSchema = z.object({
  'wp:meta_key': z.string(),
  'wp:meta_value': z.string().nullable() // can be null (e.g., _post_text3)
});

export const WpUniomPostMetaSchema = z
  .union([z.array(WPPostmetaSchema), WPPostmetaSchema])
  .optional();

export const postProdSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  postAuthorId: z.number().optional(),
  type: z.string().optional(),
  guid: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.string().optional(),
  slug: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  link: z.string().optional(),
  pubDate: z.string().optional(),
  price: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
  rating: z.number().nullable().optional(),
  metaDuration: z.string().nullable().optional(),
  metaPrice: z.string().nullable().optional()
});
