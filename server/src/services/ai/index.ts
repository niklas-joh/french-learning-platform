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
import { OrchestrationConfig } from '../../types/AI';

/**
 * Simplified orchestration configuration for API integration phase
 * This uses in-memory implementations for development and testing.
 * 
 * TODO: Move to environment-based configuration with Redis as per aiConfig.ts patterns
 */
const defaultOrchestrationConfig: OrchestrationConfig = {
  defaultProvider: 'OpenAI',
  redisUrl: 'redis://localhost:6379', // Not used in stub mode
  providers: {
    openAI: {
      apiKey: process.env.OPENAI_API_KEY || 'stub-key',
      defaultModel: 'gpt-3.5-turbo',
    },
  },
  strategies: {
    caching: {
      enabled: false, // Disabled for API integration phase
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
        // Minimal fallback content for each task type
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

/**
 * Simplified in-memory implementations for development
 * These replace the full Redis-based services during API integration phase
 */

class StubCacheService {
  async get(): Promise<any> { return null; } // No caching in stub mode
  async set(): Promise<void> { /* No-op */ }
}

class StubRateLimitService {
  async isAllowed(): Promise<boolean> { return true; } // No rate limiting in stub mode
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

/**
 * Centralized factory for AI services
 * 
 * This factory manages singleton instances to ensure consistent service usage
 * across the application while providing a clean interface for dependency access.
 */
export const aiServiceFactory = {
  /**
   * Get the singleton instance of AIOrchestrator
   * 
   * @returns {AIOrchestrator} The AI orchestrator instance
   */
  getAIOrchestrator: (() => {
    let instance: AIOrchestrator;
    return () => {
      if (!instance) {
        // Instantiate all required dependencies with stub implementations
        const cacheService = new StubCacheService() as any;
        const rateLimitService = new StubRateLimitService() as any;
        const fallbackHandler = new StubFallbackHandler() as any;
        const contextService = new ContextService();
        const metricsService = new AIMetricsService();
        const promptEngine = new PromptTemplateEngine();

        // Create the orchestrator with all dependencies
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
