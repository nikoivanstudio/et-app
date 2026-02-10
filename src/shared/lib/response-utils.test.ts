import { handleError, handleSuccess } from './response-utils';

class MockResponse {
  status: number;
  statusText: string;
  private body: string;

  constructor(body: string, init?: { status?: number; statusText?: string }) {
    this.body = body;
    this.status = init?.status ?? 200;
    this.statusText = init?.statusText ?? 'OK';
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return this.body;
  }
}

beforeAll(() => {
  globalThis.Response = MockResponse as unknown as typeof globalThis.Response;
});

describe('response-utils', () => {
  describe('handleSuccess', () => {
    it('возвращает Response с указанными данными', async () => {
      const res = handleSuccess({
        body: { ok: true },
        status: 201,
        statusText: 'Created'
      });

      expect(res.status).toBe(201);
      expect(res.statusText).toBe('Created');
      await expect(res.json()).resolves.toEqual({ ok: true });
    });
  });

  describe('handleError', () => {
    it('логирует ошибку и возвращает Response с сообщением', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const res = handleError({ error: new Error('boom') });

      expect(res.status).toBe(400);
      await expect(res.text()).resolves.toContain('boom');

      spy.mockRestore();
    });
  });
});
