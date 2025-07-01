import IORedis from 'ioredis';

// Ensure these are loaded from environment variables in a real setup
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Recommended for BullMQ to handle connection retries
};

/**
 * Singleton instance of the IORedis connection.
 * This connection will be shared across the application (e.g., for BullMQ, Caching).
 */
export const redisConnection = new IORedis(redisConfig);

/**
 * Centralized queue names to prevent typos and ensure consistency.
 */
export const QUEUE_NAMES = {
  CONTENT_GENERATION: 'content-generation-queue',
};

redisConnection.on('connect', () => {
    console.log('Successfully connected to Redis.');
});

redisConnection.on('error', (err) => {
    console.error('Could not connect to Redis.', err);
});
