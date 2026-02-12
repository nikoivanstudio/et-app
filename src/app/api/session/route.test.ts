import { describe, expect, it, vi } from 'vitest';

vi.mock('@/entities/user/server', () => ({
  getSession: vi.fn()
}));

import * as userServer from '@/entities/user/server';
import { GET } from './route';

describe('api/session route', () => {
  it('exports GET handler from user server', () => {
    expect(GET).toBe(userServer.getSession);
  });
});
