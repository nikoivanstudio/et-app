import { v4 } from 'uuid';
import { z } from 'zod';

import { postProdSchema } from '@/features/post/lib/validation-schemas';
import { initialPostCreateFormData } from '@/features/post/model/create-posts-model';

import { PostDomain } from '@/entities/post/server';

const getFormDataPosts = async (formData: FormData): Promise<unknown> => {
  const file = formData.get('posts_file');

  if (!file || !(file instanceof File)) {
    throw new Error('Не удалось получиться файл');
  }

  const text = (await file.text()).replace(/^\uFEFF/, '');
  return JSON.parse(text);
};

const getDataSourcePosts = async (
  dataSource: FormData | unknown
): Promise<Omit<PostDomain.PostEntity, 'id' | 'user'>[]> => {
  const data =
    dataSource instanceof FormData
      ? await getFormDataPosts(dataSource)
      : dataSource;

  const result = z.array(postProdSchema).safeParse(data);

  if (!result.success) {
    return [];
  }

  const validPosts = result.data
    .filter(post => !!post)
    .map(({ id: _, ...post }) => post);

  return validPosts as unknown as Omit<PostDomain.PostEntity, 'id' | 'user'>[];
};

const getInitialPostData = () => ({ ...initialPostCreateFormData, guid: v4() });

export const postUtils = { getDataSourcePosts, getInitialPostData };
