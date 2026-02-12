import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/tour/server', () => ({
  getUserTours: vi.fn()
}));

import * as tourServer from '@/features/tour/server';
import { GET } from './route';

describe('api/tours/user route', () => {
  it('exports GET handler from tour server', () => {
    expect(GET).toBe(tourServer.getUserTours);
  });
});
