import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/post/server', () => ({
  getExportPosts: vi.fn()
}));

import * as postServer from '@/features/post/server';
import { GET } from './route';

describe('api/posts/export route', () => {
  it('exports GET handler from post server', () => {
    expect(GET).toBe(postServer.getExportPosts);
  });
});
