import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/activity/server', () => ({
  postActivity: vi.fn()
}));

import * as activityServer from '@/features/activity/server';
import { POST } from './route';

describe('api/activity route', () => {
  it('exports POST handler from activity server', () => {
    expect(POST).toBe(activityServer.postActivity);
  });
});
