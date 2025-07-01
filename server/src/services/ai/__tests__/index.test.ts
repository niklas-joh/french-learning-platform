/**
 * Unit Tests for AI Service Factory
 * 
 * Tests the service factory implementation to ensure proper singleton behavior,
 * dependency injection, and service instantiation.
 */

import { aiServiceFactory } from '../index';
import { AIOrchestrator } from '../AIOrchestrator';

// Mock the AIOrchestrator class
jest.mock('../AIOrchestrator');
jest.mock('../ContextService');
jest.mock('../AIMetricsService');
jest.mock('../PromptTemplateEngine');

// Create typed mocks
const MockedAIOrchestrator = AIOrchestrator as jest.MockedClass<typeof AIOrchestrator>;
const mockOrchestratorInstance = {
  generateLesson: jest.fn(),
  assessPronunciation: jest.fn(),
  gradeResponse: jest.fn(),
} as any;

// Mock the constructor to return our mock instance
MockedAIOrchestrator.mockImplementation(() => mockOrchestratorInstance);

describe('AI Service Factory', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAIOrchestrator', () => {
    it('should return an instance of AIOrchestrator', () => {
      const orchestrator = aiServiceFactory.getAIOrchestrator();
      
      expect(orchestrator).toBe(mockOrchestratorInstance);
      expect(MockedAIOrchestrator).toHaveBeenCalledTimes(1);
    });

    it('should return the same instance on multiple calls (singleton behavior)', () => {
      const orchestrator1 = aiServiceFactory.getAIOrchestrator();
      const orchestrator2 = aiServiceFactory.getAIOrchestrator();
      
      expect(orchestrator1).toBe(orchestrator2);
      expect(orchestrator1).toBe(mockOrchestratorInstance);
      expect(MockedAIOrchestrator).toHaveBeenCalledTimes(1);
    });

    it('should create AIOrchestrator with required dependencies', () => {
      aiServiceFactory.getAIOrchestrator();
      
      expect(MockedAIOrchestrator).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultProvider: 'OpenAI',
          providers: expect.objectContaining({
            openAI: expect.objectContaining({
              defaultModel: 'gpt-3.5-turbo'
            })
          })
        }), // orchestrationConfig
        expect.any(Object), // cacheService (stub)
        expect.any(Object), // rateLimitService (stub)
        expect.any(Object), // fallbackHandler (stub)
        expect.any(Object), // contextService
        expect.any(Object), // metricsService
        expect.any(Object)  // promptEngine
      );
    });

    it('should pass orchestration configuration with correct structure', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const configArg = MockedAIOrchestrator.mock.calls[0][0];
      expect(configArg).toEqual(
        expect.objectContaining({
          defaultProvider: 'OpenAI',
          redisUrl: 'redis://localhost:6379',
          providers: expect.objectContaining({
            openAI: expect.objectContaining({
              apiKey: expect.any(String),
              defaultModel: 'gpt-3.5-turbo'
            })
          }),
          strategies: expect.objectContaining({
            caching: expect.objectContaining({
              enabled: false,
              ttlSeconds: 3600
            }),
            rateLimiting: expect.objectContaining({
              enabled: true,
              windowMinutes: 1,
              maxRequests: 10
            }),
            fallback: expect.objectContaining({
              enabled: true,
              staticContent: expect.any(Object)
            })
          })
        })
      );
    });

    it('should use environment variable for OpenAI API key when available', () => {
      const originalApiKey = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'test-api-key-from-env';
      
      // Clear the singleton instance to force recreation
      jest.resetModules();
      const { aiServiceFactory: freshFactory } = require('../index');
      
      freshFactory.getAIOrchestrator();
      
      const configArg = MockedAIOrchestrator.mock.calls[0][0];
      expect(configArg.providers.openAI.apiKey).toBe('test-api-key-from-env');
      
      // Restore original value
      if (originalApiKey) {
        process.env.OPENAI_API_KEY = originalApiKey;
      } else {
        delete process.env.OPENAI_API_KEY;
      }
    });

    it('should fall back to stub key when no environment variable is set', () => {
      const originalApiKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;
      
      // Clear the singleton instance to force recreation
      jest.resetModules();
      const { aiServiceFactory: freshFactory } = require('../index');
      
      freshFactory.getAIOrchestrator();
      
      const configArg = MockedAIOrchestrator.mock.calls[0][0];
      expect(configArg.providers.openAI.apiKey).toBe('stub-key');
      
      // Restore original value
      if (originalApiKey) {
        process.env.OPENAI_API_KEY = originalApiKey;
      }
    });
  });

  describe('singleton behavior and memory management', () => {
    it('should not create multiple instances for repeated calls', () => {
      // Call getAIOrchestrator multiple times
      for (let i = 0; i < 5; i++) {
        aiServiceFactory.getAIOrchestrator();
      }
      
      // Should only create one instance
      expect(MockedAIOrchestrator).toHaveBeenCalledTimes(1);
    });

    it('should maintain references to created instances', () => {
      const orchestrator1 = aiServiceFactory.getAIOrchestrator();
      const orchestrator2 = aiServiceFactory.getAIOrchestrator();
      
      // Should be the exact same reference
      expect(orchestrator1).toBe(orchestrator2);
    });

    it('should handle concurrent access gracefully', async () => {
      // Simulate concurrent access to the factory
      const promises = Array.from({ length: 10 }, () => 
        Promise.resolve(aiServiceFactory.getAIOrchestrator())
      );
      
      const orchestrators = await Promise.all(promises);
      
      // All promises should return the same instance
      const firstOrchestrator = orchestrators[0];
      orchestrators.forEach(orchestrator => {
        expect(orchestrator).toBe(firstOrchestrator);
      });
      
      // Only one instance should be created despite concurrent access
      expect(MockedAIOrchestrator).toHaveBeenCalledTimes(1);
    });
  });

  describe('dependency injection', () => {
    it('should create orchestrator with all required stub services', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const callArgs = MockedAIOrchestrator.mock.calls[0];
      
      // Should have 7 arguments: config + 6 services
      expect(callArgs).toHaveLength(7);
      
      // Each service dependency should be an object
      for (let i = 1; i < callArgs.length; i++) {
        expect(typeof callArgs[i]).toBe('object');
        expect(callArgs[i]).not.toBeNull();
      }
    });

    it('should provide stub implementations for cache service', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const cacheService = MockedAIOrchestrator.mock.calls[0][1];
      
      // Verify it has the expected cache service interface
      expect(typeof cacheService.get).toBe('function');
      expect(typeof cacheService.set).toBe('function');
    });

    it('should provide stub implementations for rate limit service', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const rateLimitService = MockedAIOrchestrator.mock.calls[0][2];
      
      // Verify it has the expected rate limit service interface
      expect(typeof rateLimitService.isAllowed).toBe('function');
    });

    it('should provide stub implementations for fallback handler', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const fallbackHandler = MockedAIOrchestrator.mock.calls[0][3];
      
      // Verify it has the expected fallback handler interface
      expect(typeof fallbackHandler.getFallback).toBe('function');
    });
  });

  describe('fallback configuration', () => {
    it('should include fallback content for all AI task types', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const config = MockedAIOrchestrator.mock.calls[0][0];
      const fallbackContent = config.strategies.fallback.staticContent;
      
      expect(fallbackContent).toHaveProperty('GENERATE_LESSON');
      expect(fallbackContent).toHaveProperty('ASSESS_PRONUNCIATION');
      expect(fallbackContent).toHaveProperty('GRADE_RESPONSE');
    });

    it('should provide meaningful fallback content structure', () => {
      aiServiceFactory.getAIOrchestrator();
      
      const config = MockedAIOrchestrator.mock.calls[0][0];
      const fallbackContent = config.strategies.fallback.staticContent;
      
      // Verify fallback content has expected structure
      expect(fallbackContent.GENERATE_LESSON).toHaveProperty('title');
      expect(fallbackContent.ASSESS_PRONUNCIATION).toHaveProperty('score');
      expect(fallbackContent.ASSESS_PRONUNCIATION).toHaveProperty('feedback');
      expect(fallbackContent.GRADE_RESPONSE).toHaveProperty('score');
      expect(fallbackContent.GRADE_RESPONSE).toHaveProperty('feedback');
      expect(fallbackContent.GRADE_RESPONSE).toHaveProperty('isCorrect');
    });
  });

  describe('error handling', () => {
    it('should handle service creation errors gracefully', () => {
      // Mock AIOrchestrator constructor to throw an error
      MockedAIOrchestrator.mockImplementationOnce(() => {
        throw new Error('Service initialization failed');
      });
      
      // The factory should propagate the error
      expect(() => {
        aiServiceFactory.getAIOrchestrator();
      }).toThrow('Service initialization failed');
    });

    it('should maintain error state and not retry on subsequent calls', () => {
      // Mock AIOrchestrator constructor to throw an error
      MockedAIOrchestrator.mockImplementationOnce(() => {
        throw new Error('Service initialization failed');
      });
      
      // First call should throw
      expect(() => {
        aiServiceFactory.getAIOrchestrator();
      }).toThrow('Service initialization failed');
      
      // Since the singleton failed to initialize, subsequent calls should also throw
      expect(() => {
        aiServiceFactory.getAIOrchestrator();
      }).toThrow('Service initialization failed');
      
      // Constructor should only be called once
      expect(MockedAIOrchestrator).toHaveBeenCalledTimes(1);
    });
  });
});
