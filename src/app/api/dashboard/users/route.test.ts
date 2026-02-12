import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/user/server', () => ({
  getUsers: vi.fn(),
  deleteUser: vi.fn()
}));

import * as userServer from '@/features/user/server';
import { DELETE, GET } from './route';

describe('api/dashboard/users route', () => {
  it('exports GET handler from user server', () => {
    expect(GET).toBe(userServer.getUsers);
  });

  it('exports DELETE handler from user server', () => {
    expect(DELETE).toBe(userServer.deleteUser);
  });
});
