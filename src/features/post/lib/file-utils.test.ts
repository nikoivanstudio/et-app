describe('files-utils', () => {
  it('создает поток с JSON массивом', async () => {
    const { TextEncoder, TextDecoder } = await import('util');
    const { ReadableStream } = await import('stream/web');
    if (!globalThis.TextEncoder) {
      globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
    }
    if (!globalThis.TextDecoder) {
      globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
    }
    if (!globalThis.ReadableStream) {
      globalThis.ReadableStream =
        ReadableStream as unknown as typeof globalThis.ReadableStream;
    }

    const { filesUtils } = await import('./file-utils');

    const posts = [
      { id: 1, title: 'a' },
      { id: 2, title: 'b' }
    ] as any;

    const stream = filesUtils.getPostsFileJSONStream(posts);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({ id: 1, title: 'a' });
  });
});
