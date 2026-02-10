jest.mock('next/server', () => {
  class MockNextResponse {
    headers = new Headers();
    status?: number;
    body?: string;

    constructor(
      body?: string,
      init?: { status?: number; headers?: HeadersInit }
    ) {
      this.body = body;
      this.status = init?.status;
      if (init?.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key, String(value));
        });
      }
    }

    static next() {
      return new MockNextResponse();
    }
  }

  return { NextResponse: MockNextResponse };
});

import {
  SecurityLimitException,
  SecurityOriginException
} from './security-exception';
import { securityUtils } from './response-utils';

describe('security response-utils', () => {
  it('устанавливает CORS и лимитные заголовки', () => {
    const res = securityUtils.getSecuredResponse({
      origin: 'https://energy-tur.ru',
      remaining: 5,
      resetAt: new Date('2020-01-01T00:00:00.000Z')
    });

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://energy-tur.ru'
    );
    expect(res.headers.get('X-RateLimit-Limit')).toBe('60');
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('5');
  });

  it('использует первый разрешенный origin при невалидном origin', () => {
    const res = securityUtils.getSecuredResponse({
      origin: 'https://evil.com',
      remaining: 1,
      resetAt: new Date('2020-01-01T00:00:00.000Z')
    });

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://okryme.ru'
    );
  });

  it('возвращает 403 для неизвестной ошибки', () => {
    const res = securityUtils.handleError(new Error('boom'));
    expect(res.status).toBe(403);
  });

  it('возвращает 403 для ошибки origin', () => {
    const res = securityUtils.handleError(
      new SecurityOriginException('Origin not allowed')
    );
    expect(res.status).toBe(403);
  });

  it('возвращает 429 для ошибки лимита', () => {
    const res = securityUtils.handleError(
      new SecurityLimitException('Too many requests')
    );
    expect(res.status).toBe(429);
  });
});
