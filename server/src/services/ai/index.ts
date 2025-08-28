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

import { AIOrchestrator } from './AIOrchestrator.js';
import { ContextService } from './ContextService.js';
import { AIMetricsService } from './AIMetricsService.js';
import { PromptTemplateEngine } from './PromptTemplateEngine.js';
import { RedisCacheService } from '../common/RedisCacheService.js';
import { ContentValidator } from './ContentValidator.js';
import { ContentEnhancer } from './ContentEnhancer.js';
import { redisConnection } from '../../config/redis.js';
import { ILogger } from '../../types/ILogger.js';
import { OrchestrationConfig } from '../../types/AI.js';
import { AssessmentController } from '../../controllers/assessmentController.js';
import { AIAssessmentEngine } from './assessment/aiAssessmentEngine.js';
import { BatchAssessmentProcessor } from './assessment/BatchAssessmentProcessor.js';
import { AssessmentAnalyticsService } from './assessment/AssessmentAnalyticsService.js';
import { AssessmentStrategyFactory } from './assessment/assessmentStrategyFactory.js';
import { assessmentServiceFactory } from '../assessment/assessmentServiceFactory.js';
import { AssessmentRepository } from '../../repositories/assessmentRepository.js';
import db from '../../config/db.js';
import { aiConfig } from '../../config/aiConfig.js';
import OpenAI from 'openai';

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
  let instance: RedisCacheService;
  return () => {
    if (!instance) {
      instance = new RedisCacheService();
    }
    return instance;
  };
})();

const getContextServiceInstance = (() => {
  let instance: ContextService;
  return (logger: ILogger = console) => {
    if (!instance) {
      const cacheService = getCacheServiceInstance();
      instance = new ContextService(cacheService, logger);
    }
    return instance;
  };
})();

export const aiServiceFactory = {
  getCacheService: getCacheServiceInstance,
  getContextService: getContextServiceInstance,

  getPromptEngine: (() => {
    let instance: PromptTemplateEngine;
    return () => {
      if (!instance) {
        instance = new PromptTemplateEngine();
      }
      return instance;
    };
  })(),

  getContentValidator: (() => {
    let instance: ContentValidator;
    return () => {
      if (!instance) {
        instance = new ContentValidator();
      }
      return instance;
    };
  })(),

  getContentEnhancer: (() => {
    let instance: ContentEnhancer;
    return () => {
      if (!instance) {
        instance = new ContentEnhancer();
      }
      return instance;
    };
  })(),

  getAIOrchestrator: (() => {
    let instance: AIOrchestrator;
    return () => {
      if (!instance) {
        const cacheService = getCacheServiceInstance();
        const rateLimitService = new StubRateLimitService() as any;
        const fallbackHandler = new StubFallbackHandler() as any;
        const contextService = getContextServiceInstance();
        const metricsService = new AIMetricsService();
        const promptEngine = new PromptTemplateEngine();
        const contentValidator = aiServiceFactory.getContentValidator();
        const contentEnhancer = aiServiceFactory.getContentEnhancer();
        const openai = new OpenAI(aiConfig.openai);

        instance = new AIOrchestrator(
          defaultOrchestrationConfig,
          db,
          openai,
          cacheService,
          rateLimitService,
          fallbackHandler,
          contextService,
          metricsService,
          promptEngine,
          contentValidator,
          contentEnhancer
        );
      }
      return instance;
    };
  })(),

  getAssessmentStrategyFactory: (() => {
    let instance: AssessmentStrategyFactory;
    return () => {
      if (!instance) {
        const openai = new OpenAI(aiConfig.openai);
        const promptEngine = aiServiceFactory.getPromptEngine();
        instance = new AssessmentStrategyFactory(openai, promptEngine, console);
        // Set AIOrchestrator after creation to avoid circular dependencies
        const orchestrator = aiServiceFactory.getAIOrchestrator();
        instance.setAIOrchestrator(orchestrator);
      }
      return instance;
    };
  })(),

  getAIAssessmentEngine: (() => {
    let instance: AIAssessmentEngine;
    return () => {
      if (!instance) {
        const assessmentRepository = new AssessmentRepository(db);
        const cacheService = getCacheServiceInstance();
        const strategyFactory = aiServiceFactory.getAssessmentStrategyFactory();
        instance = new AIAssessmentEngine(db, assessmentRepository, cacheService, strategyFactory);
      }
      return instance;
    };
  })(),

  getBatchAssessmentProcessor: (() => {
    let instance: BatchAssessmentProcessor;
    return () => {
      if (!instance) {
        const assessmentEngine = aiServiceFactory.getAIAssessmentEngine();
        const analyticsService = aiServiceFactory.getAssessmentAnalyticsService();
        instance = new BatchAssessmentProcessor(assessmentEngine, analyticsService);
      }
      return instance;
    };
  })(),

  getAssessmentAnalyticsService: (() => {
    let instance: AssessmentAnalyticsService;
    return () => {
      if (!instance) {
        const assessmentRepository = new AssessmentRepository(db);
        instance = new AssessmentAnalyticsService(assessmentRepository, db);
      }
      return instance;
    };
  })(),

  getAssessmentController: (() => {
    let instance: AssessmentController;
    return () => {
      if (!instance) {
        const orchestrator = aiServiceFactory.getAIOrchestrator();
        // PERFORMANCE: Inject singleton services following dependency injection pattern
        const batchProcessor = assessmentServiceFactory.getBatchAssessmentProcessor();
        const analyticsService = assessmentServiceFactory.getAssessmentAnalyticsService();
        
        instance = new AssessmentController(orchestrator, batchProcessor, analyticsService);
      }
      return instance;
    };
  })(),
};

// Export individual service getters for convenience
export const {
  getCacheService,
  getContextService,
  getPromptEngine,
  getContentValidator,
  getContentEnhancer,
  getAIOrchestrator,
  getAssessmentStrategyFactory,
  getAIAssessmentEngine,
  getBatchAssessmentProcessor,
  getAssessmentAnalyticsService,
  getAssessmentController,
} = aiServiceFactory;

// Export type for dependency injection interfaces (future enhancement)
export type AIServiceFactory = typeof aiServiceFactory;
