import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/application-form/server', () => ({
  postCallbackRequest: vi.fn()
}));

import * as applicationFormServer from '@/features/application-form/server';
import { POST } from './route';

describe('api/callback route', () => {
  it('exports POST handler from application form server', () => {
    expect(POST).toBe(applicationFormServer.postCallbackRequest);
  });
});
