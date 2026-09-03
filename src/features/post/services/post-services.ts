import { Post, Prisma } from 'generated/prisma/client';

import { GetPostsResponse } from '@/features/post/domain';

import { PostPatch } from '@/entities/post';
import { PostDomain, postRepositories } from '@/entities/post/server';

import { Either, left, right } from '@/shared/lib/either';
import { PageMetaData } from '@/shared/model/types';

const getPagesCount = async (where?: Prisma.PostWhereInput) => {
  const count = await postRepositories.getPostsCount(where);

  return Math.ceil(count / 10);
};

const getPostsSlugs = () => postRepositories.getPostsSlugs();

const getPostRefs = () => postRepositories.getPostRefs();

// Сколько всего страниц в /posts — чтобы sitemap перечислял их все, а не
// только захардкоженную /posts/2. Размер страницы тот же, что у выдачи
// (postsServices.getPaginatedPostCards), иначе адреса разъедутся.
const getPostsPagesCount = () => getPagesCount();

const getPosts = async (
  dbQueryParams?: Prisma.PostFindManyArgs & {
    select?: never;
    include: { user: true };
  }
): Promise<Either<string, GetPostsResponse>> => {
  const pagesCount = await getPagesCount(dbQueryParams?.where);

  const result = await postRepositories.getPosts(dbQueryParams);

  if (!pagesCount || !result) {
    return left('Ошибка получения постов из базы данных');
  }

  return right({ pagesCount, posts: result.map(PostDomain.postToPostEntity) });
};

const getAllPosts = async (): Promise<Either<string, Post[]>> => {
  const posts = await postRepositories.getAllPosts();

  if (!posts?.length) {
    return left('Ошибка получения постов. Их нет');
  }

  return right(posts);
};

const getPostBySlug = async (
  slug: string
): Promise<Either<string, PostDomain.PostEntity>> => {
  const result: Prisma.PostGetPayload<{ include: { user: true } }> | null =
    await postRepositories.getPost({
      where: { slug },
      include: { user: true }
    });

  if (!result) {
    return left('Ошибка получения данных поста из базы данных');
  }

  const postEntity = PostDomain.postToPostEntity(result);

  return right(postEntity);
};

const getPostMetaDataBySlug = async (
  slug: string
): Promise<Either<string, PageMetaData>> => {
  const result: Prisma.PostGetPayload<{
    select: {
      title: true;
      description: true;
      metaTitle: true;
      metaDescription: true;
      metaKeywords: true;
    };
  }> | null = await postRepositories.getPost({
    where: { slug },
    select: {
      title: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true
    }
  });

  if (!result) {
    return left('Не удалось найти пост');
  }

  return right({
    title: result.metaTitle || result.title,
    description: result.metaDescription || result.description,
    keywords: result.metaKeywords
  });
};

const createPosts = async (
  posts: Omit<PostDomain.PostEntity, 'id' | 'user'>[]
): Promise<Either<string, Prisma.BatchPayload>> => {
  const createResult = await postRepositories.createManyPosts(posts);

  if (!createResult || !createResult.count) {
    return left('Не удалось создать посты');
  }

  return right(createResult);
};

const updatePost = async (post: PostPatch): Promise<Either<string, Post>> => {
  const result = await postRepositories.updatePost(post);

  if (!result) {
    return left<string>('Не удалось обновить пост.');
  }

  return right<Post>(result);
};

const deletePost = async (id: number): Promise<Either<string, Post>> => {
  const result = await postRepositories.deletePost(id);

  if (!result) {
    return left<string>('Не удалось удалить данный пост');
  }

  return right<Post>(result);
};

export const postServices = {
  getPostsSlugs,
  getPostRefs,
  getPostsPagesCount,
  getPosts,
  getAllPosts,
  getPostBySlug,
  getPostMetaDataBySlug,
  createPosts,
  updatePost,
  deletePost
};
