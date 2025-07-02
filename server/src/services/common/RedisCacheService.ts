/**
 * @file RedisCacheService.ts
 * @description Implements the ICacheService interface using Redis.
 *
 * This service provides a concrete implementation for caching data in Redis,
 * handling serialization and deserialization of objects.
 */

import { ICacheService } from './ICacheService';
import { redisConnection, isRedisEnabled } from '../../config/redis';
import IORedis from 'ioredis';

export class RedisCacheService implements ICacheService {
  private client: IORedis | null;

  constructor() {
    this.client = isRedisEnabled ? redisConnection : null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      return null;
    }
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    // Safely parse the data
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error parsing cached data for key ${key}:`, error);
      // Invalidate corrupted cache data
      await this.delete(key);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.client) {
      return;
    }
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, data);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    if (!this.client) {
      return;
    }
    // Note: In a production environment with a shared Redis instance,
    // FLUSHDB might be too destructive. A key prefixing strategy would be safer.
    await this.client.flushdb();
  }
}
