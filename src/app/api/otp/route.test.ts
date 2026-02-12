import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/otp/routes/post-otp', () => ({
  postOtp: vi.fn()
}));

import * as postOtpRoute from '@/features/otp/routes/post-otp';
import { POST } from './route';

describe('api/otp route', () => {
  it('exports POST handler from otp route module', () => {
    expect(POST).toBe(postOtpRoute.postOtp);
  });
});
