/**
 * CacheService - Robust AI Response Caching with Redis
 * 
 * Provides a performant caching layer for AI responses using Redis with deterministic
 * cache key generation and graceful error handling. Implements "fail open" pattern
 * to ensure AI requests continue working even if Redis is unavailable.
 * 
 * Key improvements from initial design:
 * - Uses SHA256 hashing for collision-resistant, fixed-length cache keys
 * - Canonicalizes JSON payloads for deterministic key generation
 * - Implements graceful degradation when Redis operations fail
 * - Full type safety using the centralized AI type system
 */

import { createHash } from 'crypto';
import { Redis } from 'ioredis';
import { 
  CacheStrategyConfig, 
  AIResponse, 
  AITaskRequestPayload, 
  AITaskResponsePayload,
  AITaskType 
} from '../../types/AI';
import { ILogger } from '../../types/logger';

/**
 * @class CacheService
 * @description Provides a robust, type-safe caching layer for AI responses using Redis.
 *              Implements semantic caching with deterministic key generation to maximize
 *              cache hit rates while maintaining full type safety.
 */
export class CacheService {
  private redis: Redis;
  private config: CacheStrategyConfig;
  private logger: ILogger;

  /**
   * @constructor
   * @param redis - Configured Redis client instance
   * @param config - Cache strategy configuration
   * @param logger - Logger instance (defaults to console for now)
   */
  constructor(redis: Redis, config: CacheStrategyConfig, logger: ILogger = console) {
    this.redis = redis;
    this.config = config;
    this.logger = logger;
    this.logger.info('[CacheService] Initialized with Redis caching');
  }

  /**
   * Generates a deterministic, collision-resistant cache key from task type and payload.
   * 
   * Key improvements:
   * - Sorts object keys to ensure consistent JSON string representation
   * - Uses SHA256 for collision-resistant, fixed-length keys
   * - Includes task type in key for namespace separation
   * 
   * @private
   * @param taskType - The AI task type for namespace separation
   * @param payload - The request payload to hash
   * @returns A deterministic SHA256-based cache key
   */
  private generateCacheKey<T extends AITaskType>(
    taskType: T, 
    payload: AITaskRequestPayload<T>
  ): string {
    // Sort keys for deterministic JSON string generation
    const sortedPayload = this.sortObjectKeys(payload);
    const payloadString = JSON.stringify(sortedPayload);
    
    // Generate collision-resistant hash
    const hash = createHash('sha256')
      .update(payloadString)
      .digest('hex');
    
    return `ai-cache:${taskType}:${hash}`;
  }

  /**
   * Recursively sorts object keys to ensure deterministic JSON serialization.
   * 
   * @private
   * @param obj - Object to sort
   * @returns Object with sorted keys at all levels
   */
  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }
    
    return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = this.sortObjectKeys(obj[key]);
        return sorted;
      }, {} as any);
  }

  /**
   * Retrieves a cached AI response if available.
   * 
   * Implements "fail open" pattern - if Redis fails, returns null rather than
   * throwing an error, allowing the AI request to proceed without caching.
   * 
   * @param taskType - The AI task type
   * @param payload - The request payload to look up
   * @returns Cached response or null if not found/error occurred
   */
  async get<T extends AITaskType>(
    taskType: T, 
    payload: AITaskRequestPayload<T>
  ): Promise<AIResponse<T> | null> {
    if (!this.config.enabled) {
      return null;
    }

    const key = this.generateCacheKey(taskType, payload);
    
    try {
      const cachedData = await this.redis.get(key);
      
      if (cachedData) {
        this.logger.info(`[CacheService] Cache HIT for key: ${key.substring(0, 32)}...`);
        return JSON.parse(cachedData) as AIResponse<T>;
      }
      
      this.logger.info(`[CacheService] Cache MISS for key: ${key.substring(0, 32)}...`);
      return null;
    } catch (error) {
      this.logger.error('[CacheService] Redis GET operation failed. Bypassing cache.', error);
      return null; // Fail open - allow request to proceed without cache
    }
  }

  /**
   * Caches an AI response with the configured TTL.
   * 
   * Implements "fail open" pattern - if Redis fails, logs the error but doesn't
   * throw, allowing the main AI request flow to continue successfully.
   * 
   * @param taskType - The AI task type
   * @param payload - The request payload used for key generation
   * @param response - The AI response to cache
   */
  async set<T extends AITaskType>(
    taskType: T, 
    payload: AITaskRequestPayload<T>, 
    response: AIResponse<T>
  ): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const key = this.generateCacheKey(taskType, payload);
    const ttl = this.config.ttlSeconds;
    
    try {
      this.logger.info(`[CacheService] Caching response for key: ${key.substring(0, 32)}... with TTL: ${ttl}s`);
      await this.redis.set(key, JSON.stringify(response), 'EX', ttl);
    } catch (error) {
      this.logger.error('[CacheService] Redis SET operation failed. Skipping cache set.', error);
      // Fail open - don't throw error, just skip caching
    }
  }

  /**
   * Clears all cached AI responses (useful for testing or cache invalidation).
   * 
   * @param pattern - Redis key pattern to match (defaults to all AI cache keys)
   */
  async clear(pattern: string = 'ai-cache:*'): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.info(`[CacheService] Cleared ${keys.length} cached entries matching pattern: ${pattern}`);
      }
    } catch (error) {
      this.logger.error('[CacheService] Cache clear operation failed.', error);
      // Don't throw - this is typically a maintenance operation
    }
  }

  /**
   * Gets cache statistics for monitoring and optimization.
   * 
   * @returns Basic cache statistics
   */
  async getStats(): Promise<{ totalKeys: number; memoryUsage?: string }> {
    try {
      const keys = await this.redis.keys('ai-cache:*');
      const info = await this.redis.info('memory');
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      
      return {
        totalKeys: keys.length,
        memoryUsage: memoryMatch ? memoryMatch[1].trim() : undefined
      };
    } catch (error) {
      this.logger.error('[CacheService] Failed to get cache statistics.', error);
      return { totalKeys: 0 };
    }
  }
}
