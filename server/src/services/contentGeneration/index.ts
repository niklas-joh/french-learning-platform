/**
 * @file server/src/services/contentGeneration/index.ts
 * @description Content Generation Service Factory
 * 
 * This factory creates and configures the DynamicContentGenerator and its dependencies.
 * It ensures that all components of the content generation pipeline are wired correctly.
 */

import { DynamicContentGenerator } from './DynamicContentGenerator';
import { ContentStructurerFactory } from './ContentStructurerFactory';
import { ContentValidatorFactory } from './ContentValidatorFactory';
import { ContentEnhancerFactory } from './ContentEnhancerFactory';
import { ContentTemplateManager } from './ContentTemplateManager';
import { ContentFallbackHandler } from './ContentFallbackHandler';
import { ContentGenerationMetrics } from './ContentGenerationMetrics';
import { aiServiceFactory } from '../ai';

const createDynamicContentGenerator = (() => {
  let instance: DynamicContentGenerator;

  return () => {
    if (instance) {
      return instance;
    }

    // Dependencies from other factories
    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();
    const promptEngine = aiServiceFactory.getPromptEngine(); // Assuming this will be added to aiServiceFactory
    const contextService = aiServiceFactory.getContextService();

    // Local dependencies
    const structurerFactory = new ContentStructurerFactory();
    const validatorFactory = new ContentValidatorFactory();
    const enhancerFactory = new ContentEnhancerFactory();
    const templateManager = new ContentTemplateManager();
    const fallbackHandler = new ContentFallbackHandler();
    const metricsService = new ContentGenerationMetrics();

    instance = new DynamicContentGenerator(
      aiOrchestrator,
      promptEngine,
      validatorFactory,
      enhancerFactory,
      templateManager,
      contextService,
      fallbackHandler,
      metricsService,
      structurerFactory
    );

    return instance;
  };
})();

export const contentGenerationServiceFactory = {
  getDynamicContentGenerator: createDynamicContentGenerator,
};
