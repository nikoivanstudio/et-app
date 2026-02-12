import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/tour/server', () => ({
  getTours: vi.fn()
}));

import * as tourServer from '@/features/tour/server';
import { GET } from './route';

describe('api/tours route', () => {
  it('exports GET handler from tour server', () => {
    expect(GET).toBe(tourServer.getTours);
  });
});
