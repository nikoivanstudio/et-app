import { NextRequest } from 'next/server';

import {
  SecurityLimitException,
  SecurityOriginException
} from './security-exception';
import { verifyLimit, verifyOrigin } from './request-verifications';

jest.mock('@/shared/lib/security/rate-limit-memory', () => ({
  checkRateLimitInMemory: jest.fn()
}));

const { checkRateLimitInMemory } = jest.requireMock(
  '@/shared/lib/security/rate-limit-memory'
);

const createRequest = (
  headers: Record<string, string>,
  pathname: string = '/api/test'
) =>
  ({
    headers: new Headers(headers),
    nextUrl: { pathname }
  }) as unknown as NextRequest;

describe('request-verifications', () => {
  const originalApiKey = process.env.X_API_KEY;

  beforeEach(() => {
    process.env.X_API_KEY = 'secret';
  });

  afterEach(() => {
    process.env.X_API_KEY = originalApiKey;
    (checkRateLimitInMemory as jest.Mock).mockReset();
  });

  describe('verifyLimit', () => {
    it('возвращает remaining и resetAt, если лимит не превышен', () => {
      (checkRateLimitInMemory as jest.Mock).mockReturnValue({
        isLimited: false,
        remaining: 5,
        resetAt: new Date('2020-01-01T00:00:00.000Z')
      });

      const result = verifyLimit(
        createRequest({ 'x-forwarded-for': '127.0.0.1' })
      );

      expect(result.remaining).toBe(5);
      expect(result.resetAt).toBeInstanceOf(Date);
    });

    it('выбрасывает исключение при превышении лимита', () => {
      (checkRateLimitInMemory as jest.Mock).mockReturnValue({
        isLimited: true,
        remaining: 0,
        resetAt: new Date()
      });

      expect(() =>
        verifyLimit(createRequest({ 'x-forwarded-for': '127.0.0.1' }))
      ).toThrow(SecurityLimitException);
    });
  });

  describe('verifyOrigin', () => {
    it('разрешает origin из белого списка при валидном ключе', () => {
      const req = createRequest({
        origin: 'https://energy-tur.ru',
        'X-API-KEY': 'secret'
      });

      expect(verifyOrigin(req)).toBe('https://energy-tur.ru');
    });

    it('разрешает referer с совпадающим origin без заголовка origin', () => {
      const req = createRequest({
        referer: 'http://localhost:3000/page',
        'X-API-KEY': 'secret'
      });

      expect(verifyOrigin(req)).toBeNull();
    });

    it('выбрасывает исключение при отсутствии origin и referer', () => {
      const req = createRequest({ 'X-API-KEY': 'secret' });

      expect(() => verifyOrigin(req)).toThrow(SecurityOriginException);
    });

    it('выбрасывает исключение при неверном origin', () => {
      const req = createRequest({
        origin: 'https://evil.com',
        'X-API-KEY': 'secret'
      });

      expect(() => verifyOrigin(req)).toThrow(SecurityOriginException);
    });

    it('разрешает referer из белого списка при валидном ключе', () => {
      const req = createRequest({
        referer: 'https://okryme.ru/page',
        'X-API-KEY': 'secret'
      });

      expect(verifyOrigin(req)).toBeNull();
    });

    it('выбрасывает исключение при неверном ключе', () => {
      const req = createRequest({
        origin: 'https://energy-tur.ru',
        'X-API-KEY': 'wrong'
      });

      expect(() => verifyOrigin(req)).toThrow(SecurityOriginException);
    });
  });
});
