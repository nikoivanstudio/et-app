import { v4 } from 'uuid';
import { z } from 'zod';

import { legacyPostSchema } from '@/features/post/lib/validation-schemas';

/**
 * Заготовка легаси-поста для импорта из WordPress.
 *
 * В поле `description` раньше стояла строка-заглушка `'description'`. Она
 * уходила в базу для каждой импортированной записи, а оттуда — прямо
 * в `<meta name="description">` и `og:description`: в выборке из 50 страниц
 * заглушка нашлась у 46. Теперь поле пустое, а описание собирается из
 * контента в `shared/lib/seo/description.ts`.
 */
export const initialLegacyPost: z.infer<typeof legacyPostSchema> = {
  title: '',
  description: '',
  content: '',
  postAuthorId: 1,
  type: 'post',
  guid: v4(),
  image: '',
  images: [],
  status: 'legacy',
  slug: '',
  categories: ['legacy'],
  metaTitle: '',
  metaDescription: '',
  link: '',
  pubDate: ''
};
