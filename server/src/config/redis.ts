import IORedis from 'ioredis';

// Determine if Redis is enabled from environment variables
export const isRedisEnabled = process.env.REDIS_ENABLED === 'true';

// Base Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Recommended for BullMQ to handle connection retries
  lazyConnect: true, // Don't connect until the first command is sent
};

/**
 * Singleton instance of the IORedis connection.
 * This connection is only created if Redis is enabled.
 */
export const redisConnection = isRedisEnabled ? new IORedis(redisConfig) : null;

/**
 * Centralized queue names to prevent typos and ensure consistency.
 */
export const QUEUE_NAMES = {
  CONTENT_GENERATION: 'content-generation-queue',
};

if (isRedisEnabled && redisConnection) {
  redisConnection.on('connect', () => {
      console.log('Successfully connected to Redis.');
  });

  redisConnection.on('error', (err: Error) => {
      console.error('Could not connect to Redis.', err);
  });
} else {
  console.log('Redis is disabled. Skipping Redis connection.');
}
