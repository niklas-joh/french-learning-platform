/**
 * @file server/src/services/contentGeneration/index.ts
 * @description Content Generation Service Factory
 * 
 * This factory creates and configures the DynamicContentGenerator and its dependencies.
 * It ensures that all components of the content generation pipeline are wired correctly.
 */

import { ILogger } from '../../types/ILogger';
import knex from '../../config/db';
import { DynamicContentGenerator } from './DynamicContentGenerator';
import { DatabaseJobQueueService } from './DatabaseJobQueueService';
import { ContentGenerationJobHandler } from './ContentGenerationJobHandler';
import { ContentStructurerFactory } from './ContentStructurerFactory';
import { ContentValidatorFactory } from './ContentValidatorFactory';
import { ContentEnhancerFactory } from './ContentEnhancerFactory';
import { ContentTemplateManager } from './ContentTemplateManager';
import { ContentFallbackHandler } from './ContentFallbackHandler';
import { ContentGenerationMetrics } from './ContentGenerationMetrics';
import { aiServiceFactory } from '../ai';

const createDatabaseJobQueueService = (() => {
  let instance: DatabaseJobQueueService;

  return () => {
    if (instance) {
      return instance;
    }
    const logger: ILogger = console;
    instance = new DatabaseJobQueueService(knex, logger);
    return instance;
  };
})();

const createDynamicContentGenerator = (() => {
  let instance: DynamicContentGenerator;

  return () => {
    if (instance) {
      return instance;
    }
    const jobQueueService = createDatabaseJobQueueService();
    instance = new DynamicContentGenerator(jobQueueService);
    return instance;
  };
})();

const createContentGenerationJobHandler = (() => {
  let instance: ContentGenerationJobHandler;

  return () => {
    if (instance) {
      return instance;
    }

    // Dependencies from other factories
    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();
    const promptEngine = aiServiceFactory.getPromptEngine();
    const contextService = aiServiceFactory.getContextService();
    const logger: ILogger = console; // Using console as a basic logger for now

    // Local dependencies
    const structurerFactory = new ContentStructurerFactory();
    const validatorFactory = new ContentValidatorFactory(logger);
    const enhancerFactory = new ContentEnhancerFactory(logger);
    const templateManager = new ContentTemplateManager(logger);
    const fallbackHandler = new ContentFallbackHandler(logger);
    const metricsService = new ContentGenerationMetrics(logger);

    instance = new ContentGenerationJobHandler(
      aiOrchestrator,
      promptEngine,
      validatorFactory,
      enhancerFactory,
      templateManager,
      contextService,
      fallbackHandler,
      metricsService,
      structurerFactory,
      logger
    );

    return instance;
  };
})();

export const contentGenerationServiceFactory = {
  getDynamicContentGenerator: createDynamicContentGenerator,
  getContentGenerationJobHandler: createContentGenerationJobHandler,
  getDatabaseJobQueueService: createDatabaseJobQueueService,
};
