/**
 * AI Service Factory - Centralized service instance management
 * 
 * This factory provides a clean abstraction for creating and managing AI service instances.
 * It implements the singleton pattern for services that should be shared across the application.
 * 
 * IMPORTANT: This is a simplified factory for the API integration phase.
 * Services are configured with stub/in-memory implementations for development.
 * 
 * TODO: Migrate to a full DI container (tsyringe/InversifyJS) as per #23 in future_implementation_considerations.md
 * when the service dependency graph becomes more complex.
 * TODO: Replace stub implementations with Redis-based services in production.
 */

import { AIOrchestrator } from './AIOrchestrator';
import { ContextService } from './ContextService';
import { AIMetricsService } from './AIMetricsService';
import { PromptTemplateEngine } from './PromptTemplateEngine';
import { CacheService } from './CacheService';
import { redisConnection } from '../../config/redis';
import { OrchestrationConfig } from '../../types/AI';

const defaultOrchestrationConfig: OrchestrationConfig = {
  defaultProvider: 'OpenAI',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  providers: {
    openAI: {
      apiKey: process.env.OPENAI_API_KEY || 'stub-key',
      defaultModel: 'gpt-3.5-turbo',
    },
  },
  strategies: {
    caching: {
      enabled: true,
      ttlSeconds: 3600,
    },
    rateLimiting: {
      enabled: true,
      windowMinutes: 1,
      maxRequests: 10,
    },
    fallback: {
      enabled: true,
      staticContent: {
        GENERATE_LESSON: {
          title: 'Service temporarily unavailable',
        },
        ASSESS_PRONUNCIATION: {
          score: 0,
          feedback: 'Pronunciation assessment temporarily unavailable',
        },
        GRADE_RESPONSE: {
          score: 0,
          feedback: 'Grading temporarily unavailable',
          isCorrect: false,
        },
      },
    },
  },
};

class StubRateLimitService {
  async isAllowed(): Promise<boolean> { return true; }
}

class StubFallbackHandler {
  getFallback<T>(taskType: T, error: Error): any {
    return {
      status: 'fallback',
      data: { message: `Fallback for ${taskType}: ${error.message}` },
      metadata: {
        provider: 'fallback',
        model: 'none',
        processingTimeMs: 0,
        cacheHit: false,
      },
    };
  }
}

const getCacheServiceInstance = (() => {
  let instance: CacheService;
  return () => {
    if (!instance) {
      instance = new CacheService(redisConnection, defaultOrchestrationConfig.strategies.caching);
    }
    return instance;
  };
})();

export const aiServiceFactory = {
  getCacheService: () => getCacheServiceInstance(),

  getAIOrchestrator: (() => {
    let instance: AIOrchestrator;
    return () => {
      if (!instance) {
        const cacheService = getCacheServiceInstance();
        const rateLimitService = new StubRateLimitService() as any;
        const fallbackHandler = new StubFallbackHandler() as any;
        const contextService = new ContextService();
        const metricsService = new AIMetricsService();
        const promptEngine = new PromptTemplateEngine();

        instance = new AIOrchestrator(
          defaultOrchestrationConfig,
          cacheService,
          rateLimitService,
          fallbackHandler,
          contextService,
          metricsService,
          promptEngine
        );
      }
      return instance;
    };
  })(),
};

// Export type for dependency injection interfaces (future enhancement)
export type AIServiceFactory = typeof aiServiceFactory;
