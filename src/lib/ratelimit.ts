// =============================================================================
// A36 Earn — Rate Limiter (Free, Redis-free, LRU-Cache based)
// Replaces @upstash/ratelimit. Runs in-process — zero infra cost.
// For production scale-out, swap the store with an ioredis adapter.
// =============================================================================
import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  uniqueTokenPerInterval?: number;
  interval?: number; // ms
};

export function rateLimit(options: RateLimitOptions = {}) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval ?? 500,
    ttl: options.interval ?? 60_000,
  });

  return {
    check: (limit: number, token: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const tokenCount = tokenCache.get(token) ?? [];
        const now = Date.now();
        const windowStart = now - (options.interval ?? 60_000);
        const requestsInWindow = tokenCount.filter((ts) => ts > windowStart);

        if (requestsInWindow.length >= limit) {
          reject(new Error('Rate limit exceeded'));
        } else {
          tokenCache.set(token, [...requestsInWindow, now]);
          resolve();
        }
      }),
  };
}

// Pre-configured limiters for API routes
export const apiRateLimit = rateLimit({
  interval: 60_000, // 1 minute window
  uniqueTokenPerInterval: 500,
});

export const authRateLimit = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 100,
});
