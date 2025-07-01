/**
 * Integration Tests for AI Controller
 * 
 * Tests the complete AI API layer including authentication, validation,
 * controller logic, service integration, and error handling.
 */

import request from 'supertest';
import express from 'express';
import { aiServiceFactory } from '../../services/ai';
import aiRoutes from '../../routes/ai.routes';
import { 
  TestDataFactory, 
  AIServiceMocks, 
  ExpressMocks,
  TestHelpers,
  PerformanceHelpers
} from './mocks';

// Mock the AI service factory and its dependencies
jest.mock('../../services/ai/AIOrchestrator');
jest.mock('../../services/ai/ContextService');
jest.mock('../../services/ai/AIMetricsService');
jest.mock('../../services/ai/PromptTemplateEngine');

// Mock the authentication middleware to control auth state
jest.mock('../../middleware/auth.middleware', () => ({
  protect: (req: any, res: any, next: any) => {
    // Default: authenticated user
    req.user = {
      id: 1,
      email: 'test@example.com',
      role: 'user'
    };
    next();
  }
}));

// Create a minimal test app with only AI routes
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/ai', aiRoutes);
  
  // Global error handler
  app.use((error: any, req: any, res: any, next: any) => {
    console.error('Test app error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An unexpected error occurred' 
    });
  });
  
  return app;
};

describe('AI Controller Integration Tests', () => {
  let app: express.Application;
  let mockOrchestrator: any;

  beforeEach(() => {
    // Clear all mocks and reset test isolation
    jest.clearAllMocks();
    
    // Create a fresh test app instance
    app = createTestApp();
    
    // Create a fresh mock orchestrator for each test
    mockOrchestrator = AIServiceMocks.createMockAIOrchestrator();
    
    // Mock the factory to return our controlled orchestrator
    jest.spyOn(aiServiceFactory, 'getAIOrchestrator').mockReturnValue(mockOrchestrator);
  });

  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });

  describe('POST /api/ai/generate-lesson', () => {
    const endpoint = '/api/ai/generate-lesson';

    describe('successful requests', () => {
      it('should return 200 OK with generated lesson for valid request', async () => {
        const validPayload = TestDataFactory.createGenerateLessonPayload();
        const expectedResponse = TestDataFactory.createAITaskResponse('GENERATE_LESSON');
        
        mockOrchestrator.generateLesson.mockResolvedValueOnce(expectedResponse);

        const response = await request(app)
          .post(endpoint)
          .send(validPayload)
          .expect(200);

        TestHelpers.assertions.expectSuccessResponse(response);
        expect(response.body.data).toMatchObject(expectedResponse);
        expect(mockOrchestrator.generateLesson).toHaveBeenCalledWith(
          expect.objectContaining({
            task: 'GENERATE_LESSON',
            payload: validPayload,
            context: expect.objectContaining({
              id: 1,
              role: 'user'
            })
          })
        );
      });

      it('should handle all valid difficulty levels', async () => {
        const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
        
        for (const difficulty of difficulties) {
          const payload = TestDataFactory.createGenerateLessonPayload({ difficulty });
          
          const response = await request(app)
            .post(endpoint)
            .send(payload)
            .expect(200);

          TestHelpers.assertions.expectSuccessResponse(response);
        }
      });

      it('should pass user context to orchestrator correctly', async () => {
        const payload = TestDataFactory.createGenerateLessonPayload();
        
        await request(app)
          .post(endpoint)
          .send(payload)
          .expect(200);

        expect(mockOrchestrator.generateLesson).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({
              id: 1,
              firstName: undefined, // Not set in mock
              role: 'user'
            })
          })
        );
      });
    });

    describe('validation errors', () => {
      it('should return 400 Bad Request for missing topic', async () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.missingRequiredField('topic');
        
        const response = await request(app)
          .post(endpoint)
          .send(invalidPayload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'topic',
              message: expect.stringContaining('required')
            })
          ])
        );
        expect(mockOrchestrator.generateLesson).not.toHaveBeenCalled();
      });

      it('should return 400 Bad Request for invalid difficulty', async () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.invalidFieldType('difficulty', 'expert');
        
        const response = await request(app)
          .post(endpoint)
          .send(invalidPayload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'difficulty',
              message: expect.stringContaining('beginner, intermediate, or advanced')
            })
          ])
        );
      });

      it('should return 400 Bad Request for topic that is too long', async () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.tooLongString('topic', 100);
        
        const response = await request(app)
          .post(endpoint)
          .send(invalidPayload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'topic',
              message: expect.stringContaining('less than 100 characters')
            })
          ])
        );
      });

      it('should return 400 Bad Request for estimatedTime below minimum', async () => {
        const invalidPayload = TestHelpers.createInvalidPayloads.invalidFieldType('estimatedTime', 3);
        
        const response = await request(app)
          .post(endpoint)
          .send(invalidPayload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'estimatedTime',
              message: expect.stringContaining('at least 5 minutes')
            })
          ])
        );
      });
    });

    describe('service errors', () => {
      it('should return 500 Internal Server Error when orchestrator fails', async () => {
        const validPayload = TestDataFactory.createGenerateLessonPayload();
        mockOrchestrator.generateLesson.mockRejectedValueOnce(new Error('Service failure'));

        const response = await request(app)
          .post(endpoint)
          .send(validPayload)
          .expect(500);

        TestHelpers.assertions.expectErrorResponse(response, 500, 'An unexpected error occurred');
        expect(response.body.success).toBe(false);
      });

      it('should handle orchestrator timeout gracefully', async () => {
        const validPayload = TestDataFactory.createGenerateLessonPayload();
        mockOrchestrator.generateLesson.mockRejectedValueOnce(new Error('Request timeout'));

        const response = await request(app)
          .post(endpoint)
          .send(validPayload)
          .expect(500);

        TestHelpers.assertions.expectErrorResponse(response, 500);
      });
    });

    describe('performance', () => {
      it('should respond within acceptable time limits', async () => {
        const validPayload = TestDataFactory.createGenerateLessonPayload();
        
        const executionTime = await PerformanceHelpers.measureExecutionTime(async () => {
          await request(app)
            .post(endpoint)
            .send(validPayload)
            .expect(200);
        });

        PerformanceHelpers.expectResponseTimeWithinLimit(executionTime, 3000);
      });
    });
  });

  describe('POST /api/ai/assess-pronunciation', () => {
    const endpoint = '/api/ai/assess-pronunciation';

    describe('successful requests', () => {
      it('should return 200 OK with pronunciation assessment for valid request', async () => {
        const validPayload = TestDataFactory.createAssessPronunciationPayload();
        const expectedResponse = TestDataFactory.createAITaskResponse('ASSESS_PRONUNCIATION');
        
        mockOrchestrator.assessPronunciation.mockResolvedValueOnce(expectedResponse);

        const response = await request(app)
          .post(endpoint)
          .send(validPayload)
          .expect(200);

        TestHelpers.assertions.expectSuccessResponse(response);
        expect(response.body.data).toMatchObject(expectedResponse);
        expect(mockOrchestrator.assessPronunciation).toHaveBeenCalledWith(
          expect.objectContaining({
            task: 'ASSESS_PRONUNCIATION',
            payload: validPayload
          })
        );
      });

      it('should handle different audio URL formats', async () => {
        const audioUrls = [
          'https://example.com/audio.wav',
          'http://example.com/audio.mp3',
          'https://cdn.example.com/recordings/test.m4a'
        ];

        for (const audioUrl of audioUrls) {
          const payload = TestDataFactory.createAssessPronunciationPayload({ audioUrl });
          
          const response = await request(app)
            .post(endpoint)
            .send(payload)
            .expect(200);

          TestHelpers.assertions.expectSuccessResponse(response);
        }
      });
    });

    describe('validation errors', () => {
      it('should return 400 Bad Request for missing audioUrl', async () => {
        const payload = TestDataFactory.createAssessPronunciationPayload();
        delete (payload as any).audioUrl;
        
        const response = await request(app)
          .post(endpoint)
          .send(payload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'audioUrl',
              message: expect.stringContaining('required')
            })
          ])
        );
      });

      it('should return 400 Bad Request for invalid URL format', async () => {
        const payload = TestDataFactory.createAssessPronunciationPayload({
          audioUrl: 'not-a-valid-url'
        });
        
        const response = await request(app)
          .post(endpoint)
          .send(payload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'audioUrl',
              message: expect.stringContaining('valid URL')
            })
          ])
        );
      });

      it('should return 400 Bad Request for empty expectedPhrase', async () => {
        const payload = TestDataFactory.createAssessPronunciationPayload({
          expectedPhrase: ''
        });
        
        const response = await request(app)
          .post(endpoint)
          .send(payload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'expectedPhrase',
              message: expect.stringContaining('required')
            })
          ])
        );
      });
    });
  });

  describe('POST /api/ai/grade-response', () => {
    const endpoint = '/api/ai/grade-response';

    describe('successful requests', () => {
      it('should return 200 OK with grading results for valid request', async () => {
        const validPayload = TestDataFactory.createGradeResponsePayload();
        const expectedResponse = TestDataFactory.createAITaskResponse('GRADE_RESPONSE');
        
        mockOrchestrator.gradeResponse.mockResolvedValueOnce(expectedResponse);

        const response = await request(app)
          .post(endpoint)
          .send(validPayload)
          .expect(200);

        TestHelpers.assertions.expectSuccessResponse(response);
        expect(response.body.data).toMatchObject(expectedResponse);
        expect(mockOrchestrator.gradeResponse).toHaveBeenCalledWith(
          expect.objectContaining({
            task: 'GRADE_RESPONSE',
            payload: validPayload
          })
        );
      });

      it('should handle all question types', async () => {
        const questionTypes = ['multiple_choice', 'fill_blank', 'translation', 'essay'] as const;
        
        for (const questionType of questionTypes) {
          const payload = TestDataFactory.createGradeResponsePayload({ questionType });
          
          const response = await request(app)
            .post(endpoint)
            .send(payload)
            .expect(200);

          TestHelpers.assertions.expectSuccessResponse(response);
        }
      });
    });

    describe('validation errors', () => {
      it('should return 400 Bad Request for missing userResponse', async () => {
        const payload = TestDataFactory.createGradeResponsePayload();
        delete (payload as any).userResponse;
        
        const response = await request(app)
          .post(endpoint)
          .send(payload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'userResponse',
              message: expect.stringContaining('required')
            })
          ])
        );
      });

      it('should return 400 Bad Request for invalid questionType', async () => {
        const payload = TestDataFactory.createGradeResponsePayload({
          questionType: 'invalid_type' as any
        });
        
        const response = await request(app)
          .post(endpoint)
          .send(payload)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'questionType',
              message: expect.stringContaining('multiple_choice, fill_blank, translation, or essay')
            })
          ])
        );
      });
    });
  });

  describe('authentication and authorization', () => {
    beforeEach(() => {
      // Mock auth middleware to simulate unauthenticated requests
      jest.doMock('../../middleware/auth.middleware', () => ({
        authMiddleware: (req: any, res: any, next: any) => {
          res.status(401).json({ error: 'Unauthorized' });
        }
      }));
    });

    it('should return 401 Unauthorized for unauthenticated requests', async () => {
      const validPayload = TestDataFactory.createGenerateLessonPayload();
      
      const response = await request(app)
        .post('/api/ai/generate-lesson')
        .send(validPayload)
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
      expect(mockOrchestrator.generateLesson).not.toHaveBeenCalled();
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/ai/generate-lesson')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing Content-Type header', async () => {
      const validPayload = TestDataFactory.createGenerateLessonPayload();
      
      const response = await request(app)
        .post('/api/ai/generate-lesson')
        .send(validPayload);

      // Should still work with Express's default parsing
      expect(response.status).toBeLessThan(500);
    });

    it('should handle very large payloads gracefully', async () => {
      const largePayload = TestDataFactory.createGenerateLessonPayload({
        topic: 'A'.repeat(10000) // Exceeds validation limit
      });
      
      const response = await request(app)
        .post('/api/ai/generate-lesson')
        .send(largePayload)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should handle Unicode characters in payloads', async () => {
      const unicodePayload = TestDataFactory.createGenerateLessonPayload({
        topic: 'Les émotions françaises 🇫🇷'
      });
      
      const response = await request(app)
        .post('/api/ai/generate-lesson')
        .send(unicodePayload)
        .expect(200);

      TestHelpers.assertions.expectSuccessResponse(response);
    });
  });

  describe('concurrent request handling', () => {
    it('should handle multiple concurrent requests', async () => {
      const validPayload = TestDataFactory.createGenerateLessonPayload();
      
      const promises = Array.from({ length: 5 }, () =>
        request(app)
          .post('/api/ai/generate-lesson')
          .send(validPayload)
          .expect(200)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        TestHelpers.assertions.expectSuccessResponse(response);
      });

      expect(mockOrchestrator.generateLesson).toHaveBeenCalledTimes(5);
    });
  });
});
