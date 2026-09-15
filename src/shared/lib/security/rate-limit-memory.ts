type RateLimitRecord = {
  count: number;
  start: number;
};

const store = new Map<string, RateLimitRecord>();

type RateLimitOptions = {
  key: string;
  windowMs: number;
  maxRequests: number;
};

export function checkRateLimitInMemory(options: RateLimitOptions) {
  const { key, windowMs, maxRequests } = options;
  const now = Date.now();

  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, start: now });
    return {
      isLimited: false,
      remaining: maxRequests - 1,
      resetAt: new Date(now + windowMs)
    };
  }

  const elapsed = now - record.start;

  if (elapsed > windowMs) {
    record.count = 1;
    record.start = now;
    store.set(key, record);

    return {
      isLimited: false,
      remaining: maxRequests - 1,
      resetAt: new Date(now + windowMs)
    };
  }

  if (record.count >= maxRequests) {
    return {
      isLimited: true,
      remaining: 0,
      resetAt: new Date(record.start + windowMs)
    };
  }

  record.count += 1;
  store.set(key, record);

  return {
    isLimited: false,
    remaining: maxRequests - record.count,
    resetAt: new Date(record.start + windowMs)
  };
}

export function startRateLimitCleanup(options: {
  intervalMs: number;
  maxAgeMs: number;
}) {
  const { intervalMs, maxAgeMs } = options;

  setInterval(() => {
    const now = Date.now();

    for (const [key, record] of store.entries()) {
      const age = now - record.start;
      if (age > maxAgeMs) {
        store.delete(key);
      }
    }
  }, intervalMs).unref?.();
}
