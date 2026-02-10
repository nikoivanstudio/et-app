describe('rate-limit-memory', () => {
  const loadModule = async () => {
    jest.resetModules();
    return await import('./rate-limit-memory');
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('увеличивает счетчик и ограничивает при превышении лимита', async () => {
    const { checkRateLimitInMemory } = await loadModule();

    const first = checkRateLimitInMemory({
      key: 'k',
      windowMs: 1000,
      maxRequests: 2
    });
    const second = checkRateLimitInMemory({
      key: 'k',
      windowMs: 1000,
      maxRequests: 2
    });
    const third = checkRateLimitInMemory({
      key: 'k',
      windowMs: 1000,
      maxRequests: 2
    });

    expect(first.isLimited).toBe(false);
    expect(first.remaining).toBe(1);
    expect(second.isLimited).toBe(false);
    expect(second.remaining).toBe(0);
    expect(third.isLimited).toBe(true);
  });

  it('сбрасывает лимит после окна', async () => {
    const { checkRateLimitInMemory } = await loadModule();

    checkRateLimitInMemory({ key: 'k', windowMs: 1000, maxRequests: 2 });
    jest.advanceTimersByTime(1001);

    const result = checkRateLimitInMemory({
      key: 'k',
      windowMs: 1000,
      maxRequests: 2
    });

    expect(result.isLimited).toBe(false);
    expect(result.remaining).toBe(1);
  });

  it('очищает старые записи по таймеру', async () => {
    const { checkRateLimitInMemory, startRateLimitCleanup } = await loadModule();

    checkRateLimitInMemory({ key: 'k', windowMs: 10_000, maxRequests: 3 });
    startRateLimitCleanup({ intervalMs: 1000, maxAgeMs: 500 });

    jest.advanceTimersByTime(1000);

    const result = checkRateLimitInMemory({
      key: 'k',
      windowMs: 10_000,
      maxRequests: 3
    });

    expect(result.remaining).toBe(2);
  });
});
