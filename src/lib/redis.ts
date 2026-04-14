// =============================================================================
// A36 Earn — Redis Stub
// @upstash/redis has been removed (paid infra).
// BullMQ (job queues) still uses ioredis for background jobs.
// Direct Redis usage in API routes has been replaced by the LRU rate limiter.
// This stub prevents import errors during Phase 2 cleanup.
// =============================================================================
export const redis = null;
