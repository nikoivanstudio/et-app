import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/activity/server', () => ({
  getUserActivities: vi.fn()
}));

import * as activityServer from '@/features/activity/server';
import { GET } from './route';

describe('api/activity/user route', () => {
  it('exports GET handler from activity server', () => {
    expect(GET).toBe(activityServer.getUserActivities);
  });
});
