import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/post/server', () => ({
  getPosts: vi.fn(),
  postPosts: vi.fn(),
  deletePost: vi.fn(),
  patchPosts: vi.fn()
}));

import * as postServer from '@/features/post/server';
import { DELETE, GET, PATCH, POST } from './route';

describe('api/posts route', () => {
  it('exports GET handler from post server', () => {
    expect(GET).toBe(postServer.getPosts);
  });

  it('exports POST handler from post server', () => {
    expect(POST).toBe(postServer.postPosts);
  });

  it('exports PATCH handler from post server', () => {
    expect(PATCH).toBe(postServer.patchPosts);
  });

  it('exports DELETE handler from post server', () => {
    expect(DELETE).toBe(postServer.deletePost);
  });
});
