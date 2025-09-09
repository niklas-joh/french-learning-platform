/**
 * @file server/src/config/redis.ts  
 * @description Database-Only Redis Stub Configuration
 * 
 * This is a minimal stub that maintains API compatibility with legacy Redis imports
 * while ensuring Redis is completely disabled for database-only job processing.
 * All Redis functionality is stubbed to return null/false for graceful degradation.
 * 
 * @author AI Content Generation System
 * @version 2.0.0 - Database-only stub implementation
 * @created 2025-01-08
 */

/**
 * Redis is permanently disabled for database-only operation
 * This ensures corporate environment compatibility by removing external dependencies
 */
export const isRedisEnabled = false;

/**
 * Redis connection is always null in database-only mode
 * Services that depend on Redis will gracefully degrade to no-op behavior
 */
export const redisConnection = null;

/**
 * Legacy queue names kept for backwards compatibility
 * These are no longer used in database-only implementation
 * @deprecated Use database-only job processing instead
 */
export const QUEUE_NAMES = {
  CONTENT_GENERATION: 'content-generation-queue',
} as const;

console.log('📊 Redis disabled - using database-only job processing mode');
