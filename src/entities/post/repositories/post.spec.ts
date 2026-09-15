import { jest } from '@jest/globals';
import { Post, Prisma } from 'generated/prisma/client';

import { PostPatch } from '@/entities/post/domain';

import { postRepositories } from './post';

/**
 * Делегаты Prisma перекрыты заглушками, поэтому точная сигнатура здесь
 * не нужна — важно лишь, что вызов асинхронный. `unknown` вместо `any`
 * заставляет разворачивать значение на месте, где оно действительно
 * читается (см. `calledWith` ниже), а не расползаться по всему файлу.
 */
const mockFn = () => jest.fn<(...args: unknown[]) => Promise<unknown>>();

const mockPost = {
  count: mockFn(),
  findFirst: mockFn(),
  findMany: mockFn(),
  create: mockFn(),
  createMany: mockFn(),
  update: mockFn(),
  delete: mockFn()
};

jest.mock('@/shared/lib/db', () => ({
  dbClient: {
    post: mockPost
  }
}));

describe('postRepositories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getPostsCount forwards where to dbClient.post.count and returns value', async () => {
    mockPost.count.mockResolvedValue(7);
    const res = await postRepositories.getPostsCount({
      status: 'fresh'
    });
    expect(mockPost.count).toHaveBeenCalledWith({ where: { status: 'fresh' } });
    expect(res).toBe(7);
  });

  test('getPost forwards params to findFirst and returns value', async () => {
    const expected = { id: 1, title: 'x' };
    mockPost.findFirst.mockResolvedValue(expected);
    const res = await postRepositories.getPost({ where: { id: 1 } });
    expect(mockPost.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res).toBe(expected);
  });

  test('getPostsSlugs calls findMany with slug select', async () => {
    const payload = [{ slug: 'a' }];
    mockPost.findMany.mockResolvedValue(payload);
    const res = await postRepositories.getPostsSlugs();
    expect(mockPost.findMany).toHaveBeenCalledWith({ select: { slug: true } });
    expect(res).toBe(payload);
  });

  test('getPosts ensures include.user is set and returns results', async () => {
    const payload = [{ id: 1 }];
    mockPost.findMany.mockResolvedValue(payload);
    // `include` намеренно не передаём: смысл теста в том, что репозиторий
    // сам дописывает `user: true`. Сигнатура же требует `include` от
    // вызывающего, поэтому здесь нужно приведение — но точечное,
    // к типу самого параметра, а не `any` на всю строку.
    const res = await postRepositories.getPosts({
      where: { status: 'fresh' }
    } as unknown as Parameters<typeof postRepositories.getPosts>[0]);
    expect(mockPost.findMany).toHaveBeenCalled();
    const calledWith = mockPost.findMany.mock.calls[0][0] as Prisma.PostFindManyArgs;
    expect(calledWith.where).toEqual({ status: 'fresh' });
    expect(calledWith.include).toMatchObject({ user: true });
    expect(res).toBe(payload);
  });

  test('getAllPosts calls findMany without args', async () => {
    const payload = [{ id: 2 }];
    mockPost.findMany.mockResolvedValue(payload);
    const res = await postRepositories.getAllPosts();
    expect(mockPost.findMany).toHaveBeenCalledWith();
    expect(res).toBe(payload);
  });

  test('getPostsBySelect forwards params to findMany', async () => {
    const payload = [{ id: 3 }];
    const params = { where: { id: 3 }, select: { id: true } };
    mockPost.findMany.mockResolvedValue(payload);
    const res = await postRepositories.getPostsBySelect(params);
    expect(mockPost.findMany).toHaveBeenCalledWith(params);
    expect(res).toBe(payload);
  });

  test('createPost calls create with data and returns created post', async () => {
    const post = { id: 5, title: 't' } as unknown as Post;
    mockPost.create.mockResolvedValue(post);
    const res = await postRepositories.createPost(post);
    expect(mockPost.create).toHaveBeenCalledWith({ data: post });
    expect(res).toBe(post);
  });

  test('createManyPosts calls createMany with skipDuplicates', async () => {
    const posts = [{ title: 'a' }];
    const result: Prisma.BatchPayload = { count: 1 };
    mockPost.createMany.mockResolvedValue(result);
    const res = await postRepositories.createManyPosts(
      posts as unknown as Parameters<typeof postRepositories.createManyPosts>[0]
    );
    expect(mockPost.createMany).toHaveBeenCalledWith({
      data: posts,
      skipDuplicates: true
    });
    expect(res).toBe(result);
  });

  test('updatePost calls update with where.id and data', async () => {
    const post = { id: 9, title: 'u' } as unknown as PostPatch;
    mockPost.update.mockResolvedValue(post);
    const res = await postRepositories.updatePost(post);
    expect(mockPost.update).toHaveBeenCalledWith({
      where: { id: post.id },
      data: post
    });
    expect(res).toBe(post);
  });

  test('deletePost calls delete with where.id and returns deleted', async () => {
    const deleted = { id: 11 } as unknown as Post;
    mockPost.delete.mockResolvedValue(deleted);
    const res = await postRepositories.deletePost(11);
    expect(mockPost.delete).toHaveBeenCalledWith({ where: { id: 11 } });
    expect(res).toBe(deleted);
  });
});
