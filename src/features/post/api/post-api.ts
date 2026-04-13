import { queryOptions } from '@tanstack/react-query';

import { GetPostsResponse } from '@/features/post/domain';

import { PostCreate, PostUpdate } from '@/entities/post';

import { apiClient } from '@/shared/api/api-client';
import { GetApiData } from '@/shared/model/types';

const jsonFlagKey = 'by_json';
const baseUrl = 'posts';

const getPosts = <T>({ signal, page, search }: GetApiData) =>
  apiClient.get<T>({
    url: baseUrl,
    signal,
    queryParams: { page: String(page), search }
  });

const createPostsByFile = async <T>(formData: FormData): Promise<T> =>
  apiClient.post<T>({
    url: baseUrl,
    body: formData,
    queryParams: { [jsonFlagKey]: 'true' }
  });

const createPost = <T>(post: PostCreate) =>
  apiClient.post<T>({ url: baseUrl, body: JSON.stringify(post) });

const editPost = <T>(post: PostUpdate) =>
  apiClient.patch<T>({ url: baseUrl, body: JSON.stringify(post) });

const deletePost = (id: number) =>
  apiClient.del({
    url: baseUrl,
    queryParams: {
      id: String(id)
    }
  });

const getPostListQueryOption = ({
  page,
  search
}: {
  page: number;
  search: string;
}) =>
  queryOptions({
    queryKey: ['posts', { page, search }],
    queryFn: ({ signal }) =>
      getPosts<GetPostsResponse>({ signal, page, search })
  });

const exportPosts = async (): Promise<Response | null> => {
  try {
    return apiClient.get<Response>({
      url: '/posts/export',
      credentials: 'include',
      withoutParse: true
    });
  } catch {
    return null;
  }
};

export const postApi = {
  baseKey: 'posts',
  getPosts,
  createPost,
  createPostsByFile,
  editPost,
  deletePost,
  getPostListQueryOption,
  exportPosts
};
