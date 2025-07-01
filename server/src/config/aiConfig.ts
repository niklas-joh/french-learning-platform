import { OrchestrationConfig } from '../types/AI';

/**
 * @description Centralized configuration for all AI-related services.
 * Fetches values from environment variables and provides sensible defaults.
 */
export const aiConfig: OrchestrationConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  timeout: 30000, // 30 seconds
  cacheConfig: {
    defaultTTL: 3600, // 1 hour
    maxSize: 1000,
    enabled: true,
  },
  rateLimitConfig: {
    enabled: true,
    windowMs: 60000, // 1 minute
    maxRequests: 10,
  },
  fallbackConfig: {
    enabled: true,
    strategies: {}, // To be defined in subsequent tasks
  },
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};
