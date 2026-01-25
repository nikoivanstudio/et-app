import { z } from 'zod';
import {
  legacyPostJSONSchema,
  legacyPostSchema
} from '@/features/post/lib/validation-schemas';
import { PostDomain } from '@/entities/post/server';
import { convertJsonToPostEntity } from '@/features/post/lib/legacy-utils';
import { initialPostCreateFormData } from '@/features/post/model/create-posts-model';
import { v4 } from 'uuid';

const getFormDataPosts = async (formData: FormData): Promise<unknown> => {
  const file = formData.get('posts_file');

  if (!file || !(file instanceof File)) {
    throw new Error('Не удалось получиться файл');
  }

  const text = (await file.text()).replace(/^\uFEFF/, '');
  return JSON.parse(text);
};

const getDataSourcePosts = async (
  dataSource: FormData | unknown,
  authorId: number
): Promise<Omit<PostDomain.PostEntity, 'id' | 'user'>[]> => {
  const data =
    dataSource instanceof FormData
      ? await getFormDataPosts(dataSource)
      : dataSource;

  const result = z.array(legacyPostJSONSchema).safeParse(data);

  if (!result.success) {
    console.log({ failedResult: result.error.format()._errors });

    throw new Error('Не удалось получить посты');
  }

  const posts = result.data.map(post =>
    convertJsonToPostEntity(post, authorId)
  );

  return posts.filter(post => legacyPostSchema.safeParse(post).success);
};

const getInitialPostData = () => ({ ...initialPostCreateFormData, guid: v4() });

export const postUtils = { getDataSourcePosts, getInitialPostData };
