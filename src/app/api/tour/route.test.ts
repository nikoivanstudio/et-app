import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/tour/server', () => ({
  postTour: vi.fn(),
  patchTour: vi.fn(),
  deleteTour: vi.fn()
}));

import * as tourServer from '@/features/tour/server';
import { DELETE, PATCH, POST } from './route';

describe('api/tour route', () => {
  it('exports POST handler from tour server', () => {
    expect(POST).toBe(tourServer.postTour);
  });

  it('exports PATCH handler from tour server', () => {
    expect(PATCH).toBe(tourServer.patchTour);
  });

  it('exports DELETE handler from tour server', () => {
    expect(DELETE).toBe(tourServer.deleteTour);
  });
});
