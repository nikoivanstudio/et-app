import { getFileBySource } from './file-utils';

describe('file-utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('создает File при успешной загрузке', async () => {
    if (!globalThis.fetch) {
      (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn();
    }
    const blob = new Blob(['data'], { type: 'text/plain' });
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      blob: async () => blob
    } as Response);

    const file = await getFileBySource('https://example.com/file', 'test.txt');

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/file');
    expect(file).toBeInstanceOf(File);
    expect(file?.name).toBe('test.txt');
    expect(file?.type).toBe('text/plain');
  });

  it('возвращает undefined при ошибке запроса', async () => {
    if (!globalThis.fetch) {
      (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn();
    }
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      blob: async () => new Blob()
    } as Response);

    const file = await getFileBySource('https://example.com/missing', 'x.txt');

    expect(file).toBeUndefined();
  });
});
