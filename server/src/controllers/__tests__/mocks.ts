/**
 * Test Mocks and Utilities for AI Controller Testing
 * 
 * This module provides centralized test data factories and mock utilities
 * following DRY principles and ensuring consistent test data across all tests.
 */

import { Request, Response } from 'express';
import { AITaskType, AITaskRequestPayload, AITaskResponsePayload } from '../../types/AI';

// Extend Express Request to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Type alias for difficulty levels (extracted from AI.ts)
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Test Data Factory for AI API Payloads
 * 
 * Creates valid default payloads with ability to override specific properties
 * for testing different scenarios (valid/invalid data, edge cases, etc.)
 */
export const TestDataFactory = {
  /**
   * Creates a valid generateLesson payload
   * @param overrides - Properties to override in the default payload
   */
  createGenerateLessonPayload: (overrides: Partial<AITaskRequestPayload<'GENERATE_LESSON'>> = {}) => ({
    topic: 'Subjunctive Mood',
    difficulty: 'beginner' as const,
    estimatedTime: 15,
    ...overrides
  }),

  /**
   * Creates a valid assessPronunciation payload
   * @param overrides - Properties to override in the default payload
   */
  createAssessPronunciationPayload: (overrides: Partial<AITaskRequestPayload<'ASSESS_PRONUNCIATION'>> = {}) => ({
    audioUrl: 'https://example.com/audio.wav',
    expectedPhrase: 'Bonjour, comment allez-vous?',
    ...overrides
  }),

  /**
   * Creates a valid gradeResponse payload
   * @param overrides - Properties to override in the default payload
   */
  createGradeResponsePayload: (overrides: Partial<AITaskRequestPayload<'GRADE_RESPONSE'>> = {}) => ({
    userResponse: 'Je suis bien',
    correctAnswer: 'Je vais bien',
    questionType: 'translation' as const,
    ...overrides
  }),

  /**
   * Creates a valid AI task response
   * @param taskType - The type of AI task
   * @param overrides - Properties to override in the default response
   */
  createAITaskResponse: (taskType: AITaskType, overrides: Partial<any> = {}) => {
    const baseResponse = {
      taskId: `task_${Date.now()}`,
      taskType,
      status: 'completed' as const,
      timestamp: new Date().toISOString(),
      processingTimeMs: 1500,
    };

    switch (taskType) {
      case 'GENERATE_LESSON':
        return {
          ...baseResponse,
          result: {
            id: 1,
            title: 'Introduction to French Subjunctive',
            description: 'Learn the basics of the French subjunctive mood',
            type: 'grammar',
            estimatedTime: 15,
            orderIndex: 1,
            contentData: JSON.stringify({
              content: 'The subjunctive mood in French...',
              exercises: [
                {
                  question: 'Choose the correct subjunctive form',
                  options: ['que je sois', 'que je suis'],
                  correctAnswer: 'que je sois'
                }
              ]
            }),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            learningUnitId: 1
          } as AITaskResponsePayload<'GENERATE_LESSON'>,
          ...overrides
        };

      case 'ASSESS_PRONUNCIATION':
        return {
          ...baseResponse,
          result: {
            score: 85,
            feedback: 'Good pronunciation overall. Pay attention to the "r" sound.',
            improvements: ['Work on rolling the "r" sound', 'Practice nasal vowels']
          } as AITaskResponsePayload<'ASSESS_PRONUNCIATION'>,
          ...overrides
        };

      case 'GRADE_RESPONSE':
        return {
          ...baseResponse,
          result: {
            score: 78,
            feedback: 'Good attempt! The meaning is correct, but check your verb conjugation.',
            isCorrect: false,
            suggestions: ['Use "vais" instead of "suis" with "bien"']
          } as AITaskResponsePayload<'GRADE_RESPONSE'>,
          ...overrides
        };

      default:
        return {
          ...baseResponse,
          result: { message: 'Task completed successfully' },
          ...overrides
        };
    }
  }
};

/**
 * Mock Express Request/Response utilities
 */
export const ExpressMocks = {
  /**
   * Creates a mock Express Request object with authentication
   * @param overrides - Properties to override in the mock request
   */
  createMockAuthenticatedRequest: (overrides: Partial<AuthenticatedRequest> = {}): Partial<AuthenticatedRequest> => ({
    user: {
      id: 1,
      email: 'test@example.com',
      role: 'user'
    },
    body: {},
    params: {},
    query: {},
    headers: {
      authorization: 'Bearer mock-jwt-token'
    },
    ...overrides
  }),

  /**
   * Creates a mock Express Response object with spy functions
   * @returns Mock response object with Jest spy functions
   */
  createMockResponse: (): Partial<Response> => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis()
    };
    return res;
  }
};

/**
 * AI Service Mock Factory
 * 
 * Provides mock implementations for AI services to isolate API layer testing
 */
export const AIServiceMocks = {
  /**
   * Creates a mock AIOrchestrator with configurable responses
   * @param customResponses - Custom responses for specific methods
   */
  createMockAIOrchestrator: (customResponses: {
    generateLesson?: any;
    assessPronunciation?: any;
    gradeResponse?: any;
  } = {}) => ({
    generateLesson: jest.fn().mockResolvedValue(
      customResponses.generateLesson || TestDataFactory.createAITaskResponse('GENERATE_LESSON')
    ),
    assessPronunciation: jest.fn().mockResolvedValue(
      customResponses.assessPronunciation || TestDataFactory.createAITaskResponse('ASSESS_PRONUNCIATION')
    ),
    gradeResponse: jest.fn().mockResolvedValue(
      customResponses.gradeResponse || TestDataFactory.createAITaskResponse('GRADE_RESPONSE')
    ),
    // Add mock methods for context and metrics
    getContextualRecommendations: jest.fn().mockResolvedValue([]),
    recordInteraction: jest.fn().mockResolvedValue(undefined)
  }),

  /**
   * Creates a mock AIServiceFactory
   */
  createMockServiceFactory: (orchestratorMock?: any) => ({
    getAIOrchestrator: jest.fn().mockReturnValue(
      orchestratorMock || AIServiceMocks.createMockAIOrchestrator()
    ),
    getCacheService: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(true),
      delete: jest.fn().mockResolvedValue(true)
    }),
    getRateLimitService: jest.fn().mockReturnValue({
      checkRateLimit: jest.fn().mockResolvedValue({ allowed: true, remaining: 5 }),
      recordRequest: jest.fn().mockResolvedValue(undefined)
    })
  })
};

/**
 * Test helper functions
 */
export const TestHelpers = {
  /**
   * Creates invalid payloads for testing validation errors
   */
  createInvalidPayloads: {
    missingRequiredField: (fieldName: string) => {
      const payload = TestDataFactory.createGenerateLessonPayload();
      delete (payload as any)[fieldName];
      return payload;
    },

    invalidFieldType: (fieldName: string, invalidValue: any) => {
      const payload = TestDataFactory.createGenerateLessonPayload();
      (payload as any)[fieldName] = invalidValue;
      return payload;
    },

    emptyString: (fieldName: string) => {
      const payload = TestDataFactory.createGenerateLessonPayload();
      (payload as any)[fieldName] = '';
      return payload;
    },

    tooLongString: (fieldName: string, maxLength: number = 100) => {
      const payload = TestDataFactory.createGenerateLessonPayload();
      (payload as any)[fieldName] = 'x'.repeat(maxLength + 1);
      return payload;
    }
  },

  /**
   * Common test assertions
   */
  assertions: {
    expectValidationError: (response: any, fieldPath: string) => {
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: expect.arrayContaining([fieldPath])
          })
        ])
      );
    },

    expectSuccessResponse: (response: any, expectedData?: any) => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      if (expectedData) {
        expect(response.body.data).toMatchObject(expectedData);
      }
    },

    expectErrorResponse: (response: any, statusCode: number, errorMessage?: string) => {
      expect(response.status).toBe(statusCode);
      expect(response.body.success).toBe(false);
      if (errorMessage) {
        expect(response.body.message).toContain(errorMessage);
      }
    }
  }
};

/**
 * Performance testing utilities
 */
export const PerformanceHelpers = {
  /**
   * Measures execution time of async function
   * @param fn - Async function to measure
   * @returns Execution time in milliseconds
   */
  measureExecutionTime: async (fn: () => Promise<any>): Promise<number> => {
    const start = Date.now();
    await fn();
    return Date.now() - start;
  },

  /**
   * Validates response time is within acceptable limits
   * @param executionTime - Time in milliseconds
   * @param maxTime - Maximum acceptable time in milliseconds
   */
  expectResponseTimeWithinLimit: (executionTime: number, maxTime: number = 3000) => {
    expect(executionTime).toBeLessThan(maxTime);
  }
};
