/**
 * RateLimitService - Efficient AI Request Rate Limiting with Redis
 * 
 * Manages AI API request rate limits using an efficient fixed-window counter algorithm
 * implemented in Redis. Provides cost control and prevents API abuse while maintaining
 * high performance with minimal Redis operations.
 * 
 * Key improvements from initial design:
 * - Uses efficient fixed-window counter instead of complex sliding window
 * - Atomic Redis operations (INCR + EXPIRE) for better performance
 * - Implements "fail open" pattern for graceful degradation
 * - Full type safety using the centralized AI type system
 */

import { Redis } from 'ioredis';
import { RateLimitStrategyConfig } from '../../types/AI';
import { ILogger } from '../../types/logger';

/**
 * @class RateLimitService
 * @description Manages AI request rate limits using an efficient fixed-window counter algorithm.
 *              Provides cost control and prevents API abuse while maintaining excellent performance.
 */
export class RateLimitService {
  private redis: Redis;
  private config: RateLimitStrategyConfig;
  private logger: ILogger;

  /**
   * @constructor
   * @param redis - Configured Redis client instance
   * @param config - Rate limiting strategy configuration
   * @param logger - Logger instance (defaults to console for now)
   */
  constructor(redis: Redis, config: RateLimitStrategyConfig, logger: ILogger = console) {
    this.redis = redis;
    this.config = config;
    this.logger = logger;
    this.logger.info('[RateLimitService] Initialized with Redis rate limiting');
  }

  /**
   * Checks if a request from a user is allowed based on configured rate limits.
   * 
   * Uses an efficient fixed-window counter algorithm:
   * 1. INCR the counter for the user's current time window
   * 2. If this is the first request (count = 1), set expiry on the key
   * 3. Check if count exceeds the configured maximum
   * 
   * This approach is much more efficient than sliding windows and provides
   * adequate rate limiting for cost control purposes.
   * 
   * Implements "fail open" pattern - if Redis fails, allows the request to proceed
   * rather than blocking legitimate users due to infrastructure issues.
   * 
   * @param userId - The ID of the user making the request
   * @returns Promise<boolean> - true if request is allowed, false if rate limited
   */
  async isAllowed(userId: string): Promise<boolean> {
    if (!this.config.enabled) {
      return true;
    }

    // Generate time-based key for fixed window
    const windowStart = Math.floor(Date.now() / (this.config.windowMinutes * 60 * 1000));
    const key = `rate-limit:${userId}:${windowStart}`;

    try {
      // Atomic increment - this is the core of the fixed-window algorithm
      const currentRequests = await this.redis.incr(key);

      // Set expiry only on the first request in this window
      if (currentRequests === 1) {
        await this.redis.expire(key, this.config.windowMinutes * 60);
      }

      // Check against limit
      if (currentRequests > this.config.maxRequests) {
        this.logger.warn(`[RateLimitService] Rate limit EXCEEDED for user: ${userId} (${currentRequests}/${this.config.maxRequests})`);
        return false;
      }

      this.logger.info(`[RateLimitService] Rate limit check PASSED for user: ${userId} (${currentRequests}/${this.config.maxRequests})`);
      return true;

    } catch (error) {
      this.logger.error('[RateLimitService] Redis rate limit check failed. Bypassing rate limit.', error);
      return true; // Fail open - allow request to proceed
    }
  }

  /**
   * Gets current rate limit status for a user without incrementing the counter.
   * Useful for displaying remaining requests to users or for monitoring.
   * 
   * @param userId - The ID of the user to check
   * @returns Promise with current usage and remaining requests
   */
  async getStatus(userId: string): Promise<{
    currentRequests: number;
    maxRequests: number;
    remainingRequests: number;
    windowMinutes: number;
  }> {
    if (!this.config.enabled) {
      return {
        currentRequests: 0,
        maxRequests: this.config.maxRequests,
        remainingRequests: this.config.maxRequests,
        windowMinutes: this.config.windowMinutes
      };
    }

    const windowStart = Math.floor(Date.now() / (this.config.windowMinutes * 60 * 1000));
    const key = `rate-limit:${userId}:${windowStart}`;

    try {
      const currentRequests = await this.redis.get(key);
      const current = currentRequests ? parseInt(currentRequests, 10) : 0;

      return {
        currentRequests: current,
        maxRequests: this.config.maxRequests,
        remainingRequests: Math.max(0, this.config.maxRequests - current),
        windowMinutes: this.config.windowMinutes
      };

    } catch (error) {
      this.logger.error('[RateLimitService] Failed to get rate limit status.', error);
      // Return safe defaults on error
      return {
        currentRequests: 0,
        maxRequests: this.config.maxRequests,
        remainingRequests: this.config.maxRequests,
        windowMinutes: this.config.windowMinutes
      };
    }
  }

  /**
   * Resets rate limit for a specific user (admin function).
   * Useful for customer support or testing scenarios.
   * 
   * @param userId - The ID of the user whose rate limit should be reset
   */
  async resetUserLimit(userId: string): Promise<void> {
    const windowStart = Math.floor(Date.now() / (this.config.windowMinutes * 60 * 1000));
    const key = `rate-limit:${userId}:${windowStart}`;

    try {
      await this.redis.del(key);
      this.logger.info(`[RateLimitService] Reset rate limit for user: ${userId}`);
    } catch (error) {
      this.logger.error(`[RateLimitService] Failed to reset rate limit for user: ${userId}`, error);
    }
  }

  /**
   * Gets global rate limiting statistics for monitoring and optimization.
   * 
   * @returns Promise with aggregated rate limiting statistics
   */
  async getGlobalStats(): Promise<{
    totalActiveUsers: number;
    totalActiveKeys: number;
  }> {
    try {
      const keys = await this.redis.keys('rate-limit:*');
      const activeUsers = new Set();

      // Extract unique user IDs from keys
      keys.forEach(key => {
        const parts = key.split(':');
        if (parts.length >= 3) {
          activeUsers.add(parts[1]); // Extract userId from rate-limit:userId:timestamp
        }
      });

      return {
        totalActiveUsers: activeUsers.size,
        totalActiveKeys: keys.length
      };

    } catch (error) {
      this.logger.error('[RateLimitService] Failed to get global statistics.', error);
      return {
        totalActiveUsers: 0,
        totalActiveKeys: 0
      };
    }
  }

  /**
   * Cleans up expired rate limit keys (maintenance function).
   * Redis should handle this automatically with EXPIRE, but this provides
   * a manual cleanup option if needed.
   */
  async cleanup(): Promise<void> {
    try {
      const keys = await this.redis.keys('rate-limit:*');
      let cleanedCount = 0;

      for (const key of keys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -1) { // Key exists but has no expiry set
          await this.redis.del(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        this.logger.info(`[RateLimitService] Cleaned up ${cleanedCount} orphaned rate limit keys`);
      }

    } catch (error) {
      this.logger.error('[RateLimitService] Cleanup operation failed.', error);
    }
  }
}
