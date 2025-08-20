# Task 3.1.C.5: API Layer & Testing Integration

## **Task Information**
- **Task ID**: 3.1.C.5
- **Parent Task**: 3.1.C (AI Assessment & Grading Engine)
- **Estimated Time**: 1 hour
- **Priority**: 🔥 Critical
- **Dependencies**: 3.1.C.1, 3.1.C.2, 3.1.C.3, 3.1.C.4, existing aiController.ts
- **Status**: ⏳ Not Started

## **Objective**
Create comprehensive API layer integration for the AI assessment system and implement thorough testing coverage to ensure reliability, performance, and maintainability. This includes RESTful endpoints, comprehensive testing suites, and integration with existing authentication/authorization middleware.

## **Success Criteria**
- [ ] RESTful API endpoints for all assessment operations
- [ ] Integration with existing authentication middleware  
- [ ] Comprehensive unit test coverage (>90%) for all services
- [ ] Integration tests for API endpoints and database operations
- [ ] Performance tests validating <3 second response times
- [ ] French language-specific test scenarios with cultural context
- [ ] Error handling validation and fallback mechanism testing
- [ ] API documentation with OpenAPI/Swagger specifications

## **Implementation Details**

### **1. API Controller Integration**

Update existing `aiController.ts` to integrate the new assessment architecture:

```typescript
// server/src/controllers/aiController.ts (additions)

import { AssessmentService } from '../services/assessment/AssessmentService';
import { BatchAssessmentProcessor } from '../services/assessment/BatchAssessmentProcessor';
import { AssessmentPersistenceService } from '../services/assessment/AssessmentPersistenceService';
import { 
  AssessmentRequest, 
  AssessmentResult, 
  BatchAssessmentRequest,
  WeaknessAnalysisRequest 
} from '../types/Assessment';

export class AIController {
  private assessmentService: AssessmentService;
  private batchProcessor: BatchAssessmentProcessor;
  private persistenceService: AssessmentPersistenceService;

  constructor(
    // ... existing dependencies
    assessmentService: AssessmentService,
    batchProcessor: BatchAssessmentProcessor,
    persistenceService: AssessmentPersistenceService
  ) {
    // ... existing initialization
    this.assessmentService = assessmentService;
    this.batchProcessor = batchProcessor;
    this.persistenceService = persistenceService;
  }

  /**
   * Assess individual user response
   * POST /api/ai/assess
   */
  async assessResponse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const assessmentRequest: AssessmentRequest = {
        ...req.body,
        userId: req.user!.userId,
        timestamp: new Date(),
      };

      // Validate request
      const validation = this.validateAssessmentRequest(assessmentRequest);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Invalid assessment request',
          details: validation.errors,
        });
        return;
      }

      const result = await this.assessmentService.assessResponse(assessmentRequest);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Assessment completed successfully',
      });
    } catch (error) {
      console.error('Assessment error:', error);
      res.status(500).json({
        success: false,
        error: 'Assessment failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Grade complete exercise with multiple responses
   * POST /api/ai/grade-exercise
   */
  async gradeExercise(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const batchRequest: BatchAssessmentRequest = {
        userId: req.user!.userId,
        exerciseId: req.body.exerciseId,
        exerciseType: req.body.exerciseType,
        responses: req.body.responses,
        context: {
          userLevel: req.body.context?.userLevel,
          lessonId: req.body.context?.lessonId,
          timeSpent: req.body.context?.timeSpent || 0,
          hintsUsed: req.body.context?.hintsUsed || 0,
        },
        timestamp: new Date(),
      };

      const validation = this.validateBatchRequest(batchRequest);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Invalid batch assessment request',
          details: validation.errors,
        });
        return;
      }

      const result = await this.batchProcessor.processExercise(batchRequest);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Exercise graded successfully',
      });
    } catch (error) {
      console.error('Exercise grading error:', error);
      res.status(500).json({
        success: false,
        error: 'Exercise grading failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get user's assessment analytics and weakness analysis
   * GET /api/ai/analytics/:timeframe
   */
  async getAssessmentAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const timeframe = req.params.timeframe as 'week' | 'month' | 'quarter' || 'month';
      const skillArea = req.query.skillArea as string | undefined;

      const analytics = await this.persistenceService.getPerformanceAnalytics(
        userId, 
        timeframe,
        skillArea
      );

      const weaknessAnalysis = await this.persistenceService.analyzeWeaknesses(
        userId,
        this.getTimeframeDays(timeframe)
      );

      res.status(200).json({
        success: true,
        data: {
          analytics,
          weaknessAnalysis,
          timeframe,
          generatedAt: new Date(),
        },
        message: 'Analytics retrieved successfully',
      });
    } catch (error) {
      console.error('Analytics retrieval error:', error);
      res.status(500).json({
        success: false,
        error: 'Analytics retrieval failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get personalized feedback for specific assessment
   * GET /api/ai/feedback/:assessmentId
   */
  async getPersonalizedFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const assessmentId = req.params.assessmentId;

      const assessment = await this.persistenceService.getAssessment(assessmentId);
      
      if (!assessment || assessment.userId !== userId) {
        res.status(404).json({
          success: false,
          error: 'Assessment not found',
        });
        return;
      }

      const enhancedFeedback = await this.assessmentService.generateDetailedFeedback(
        assessment,
        { includeStudyPlan: true, includeCulturalContext: true }
      );

      res.status(200).json({
        success: true,
        data: enhancedFeedback,
        message: 'Personalized feedback generated successfully',
      });
    } catch (error) {
      console.error('Feedback generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Feedback generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Validation helpers
  private validateAssessmentRequest(request: AssessmentRequest): ValidationResult {
    const errors: string[] = [];

    if (!request.userResponse || request.userResponse.trim().length === 0) {
      errors.push('User response is required');
    }

    if (!request.expectedAnswer) {
      errors.push('Expected answer is required');
    }

    if (!request.assessmentType || !['multiple_choice', 'fill_in_blank', 'open_ended', 'pronunciation', 'conversation'].includes(request.assessmentType)) {
      errors.push('Valid assessment type is required');
    }

    if (request.userResponse && request.userResponse.length > 5000) {
      errors.push('User response too long (max 5000 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateBatchRequest(request: BatchAssessmentRequest): ValidationResult {
    const errors: string[] = [];

    if (!request.exerciseId) {
      errors.push('Exercise ID is required');
    }

    if (!request.responses || !Array.isArray(request.responses) || request.responses.length === 0) {
      errors.push('At least one response is required');
    }

    if (request.responses && request.responses.length > 50) {
      errors.push('Too many responses in batch (max 50)');
    }

    if (request.responses) {
      request.responses.forEach((response, index) => {
        if (!response.userResponse || !response.expectedAnswer) {
          errors.push(`Response ${index + 1}: Both user response and expected answer are required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private getTimeframeDays(timeframe: string): number {
    switch (timeframe) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      default: return 30;
    }
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

### **2. Route Integration**

Update existing AI routes to include assessment endpoints:

```typescript
// server/src/routes/ai.routes.ts (additions)

// Assessment endpoints
router.post('/assess', 
  authenticateToken, 
  rateLimitMiddleware({ maxRequests: 30, windowMs: 60000 }), // 30 per minute
  aiController.assessResponse.bind(aiController)
);

router.post('/grade-exercise', 
  authenticateToken, 
  rateLimitMiddleware({ maxRequests: 10, windowMs: 60000 }), // 10 per minute
  aiController.gradeExercise.bind(aiController)
);

router.get('/analytics/:timeframe', 
  authenticateToken,
  aiController.getAssessmentAnalytics.bind(aiController)
);

router.get('/feedback/:assessmentId', 
  authenticateToken,
  aiController.getPersonalizedFeedback.bind(aiController)
);

// Health check endpoint for assessment services
router.get('/assessment-health', 
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const health = await assessmentService.healthCheck();
      res.json({ success: true, health });
    } catch (error) {
      res.status(503).json({ 
        success: false, 
        error: 'Assessment service unavailable' 
      });
    }
  }
);
```

### **3. Comprehensive Unit Tests**

```typescript
// server/src/__tests__/services/assessment/AssessmentService.test.ts

import { AssessmentService } from '../../../services/assessment/AssessmentService';
import { AssessmentStrategyFactory } from '../../../services/assessment/AssessmentStrategyFactory';
import { AssessmentPersistenceService } from '../../../services/assessment/AssessmentPersistenceService';
import { AIOrchestrator } from '../../../services/ai/aiOrchestrator';
import { AssessmentRequest, AssessmentResult } from '../../../types/Assessment';

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;
  let mockStrategyFactory: jest.Mocked<AssessmentStrategyFactory>;
  let mockPersistenceService: jest.Mocked<AssessmentPersistenceService>;
  let mockAIOrchestrator: jest.Mocked<AIOrchestrator>;

  beforeEach(() => {
    mockStrategyFactory = {
      getStrategy: jest.fn(),
    } as any;

    mockPersistenceService = {
      saveAssessment: jest.fn(),
      getAssessment: jest.fn(),
      getRecentAssessments: jest.fn(),
    } as any;

    mockAIOrchestrator = {
      orchestrateRequest: jest.fn(),
    } as any;

    assessmentService = new AssessmentService(
      mockStrategyFactory,
      mockPersistenceService,
      mockAIOrchestrator
    );
  });

  describe('assessResponse', () => {
    it('should successfully assess multiple choice response', async () => {
      const request: AssessmentRequest = {
        userId: 1,
        userResponse: 'bonjour',
        expectedAnswer: 'bonjour',
        assessmentType: 'multiple_choice',
        timestamp: new Date(),
      };

      const mockStrategy = {
        assess: jest.fn().mockResolvedValue({
          score: 100,
          isCorrect: true,
          confidence: 'high',
          feedback: {
            message: 'Excellent!',
            tone: 'congratulatory',
            suggestions: [],
          },
        }),
      };

      mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
      mockPersistenceService.saveAssessment.mockResolvedValue(undefined);

      const result = await assessmentService.assessResponse(request);

      expect(mockStrategyFactory.getStrategy).toHaveBeenCalledWith('multiple_choice');
      expect(mockStrategy.assess).toHaveBeenCalledWith(
        request,
        expect.any(Object) // AssessmentContext
      );
      expect(mockPersistenceService.saveAssessment).toHaveBeenCalled();
      expect(result.score).toBe(100);
      expect(result.isCorrect).toBe(true);
    });

    it('should handle French language fill-in-blank with cultural context', async () => {
      const request: AssessmentRequest = {
        userId: 1,
        userResponse: 'baguette',
        expectedAnswer: 'baguette',
        assessmentType: 'fill_in_blank',
        questionContext: 'Je mange une _____ au petit-déjeuner.',
        timestamp: new Date(),
      };

      const mockStrategy = {
        assess: jest.fn().mockResolvedValue({
          score: 95,
          isCorrect: true,
          confidence: 'high',
          feedback: {
            message: 'Très bien! The baguette is indeed a staple of French breakfast.',
            tone: 'encouraging',
            suggestions: ['Try learning more breakfast vocabulary'],
            culturalNote: 'In France, baguettes are traditionally bought fresh daily from local boulangeries.',
          },
          corrections: [],
        }),
      };

      mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
      mockPersistenceService.saveAssessment.mockResolvedValue(undefined);

      const result = await assessmentService.assessResponse(request);

      expect(result.score).toBe(95);
      expect(result.feedback.culturalNote).toContain('boulangeries');
    });

    it('should handle assessment errors gracefully with fallback', async () => {
      const request: AssessmentRequest = {
        userId: 1,
        userResponse: 'test',
        expectedAnswer: 'test',
        assessmentType: 'multiple_choice',
        timestamp: new Date(),
      };

      const mockStrategy = {
        assess: jest.fn().mockRejectedValue(new Error('AI service unavailable')),
      };

      mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);

      const result = await assessmentService.assessResponse(request);

      expect(result.isFallback).toBe(true);
      expect(result.feedback.message).toContain('temporarily unavailable');
      expect(result.confidence).toBe('low');
    });

    it('should apply context enhancement correctly', async () => {
      const request: AssessmentRequest = {
        userId: 1,
        userResponse: 'suis',
        expectedAnswer: 'suis',
        assessmentType: 'fill_in_blank',
        timestamp: new Date(),
      };

      const mockStrategy = {
        assess: jest.fn().mockResolvedValue({
          score: 90,
          isCorrect: true,
          confidence: 'high',
          feedback: { message: 'Good!', tone: 'encouraging', suggestions: [] },
        }),
      };

      mockStrategyFactory.getStrategy.mockReturnValue(mockStrategy);
      mockPersistenceService.getRecentAssessments.mockResolvedValue([
        { skillArea: 'grammar', score: 75, timestamp: new Date() },
        { skillArea: 'grammar', score: 80, timestamp: new Date() },
      ]);

      await assessmentService.assessResponse(request);

      const contextArgument = mockStrategy.assess.mock.calls[0][1];
      expect(contextArgument.userContext.recentPerformance).toBeDefined();
      expect(contextArgument.userContext.skillAreas).toContain('grammar');
    });
  });

  describe('generateDetailedFeedback', () => {
    it('should generate enhanced feedback with study plan', async () => {
      const assessment: AssessmentResult = {
        id: 'test-id',
        userId: 1,
        score: 60,
        isCorrect: false,
        assessmentType: 'open_ended',
        feedback: {
          message: 'Basic feedback',
          tone: 'encouraging',
          suggestions: ['Practice more'],
        },
        timestamp: new Date(),
      };

      mockAIOrchestrator.orchestrateRequest.mockResolvedValue({
        success: true,
        data: {
          enhancedFeedback: 'Detailed explanation with study plan',
          studyPlan: ['Review verb conjugations', 'Practice daily vocabulary'],
          culturalContext: 'French cultural insight',
        },
      });

      const result = await assessmentService.generateDetailedFeedback(
        assessment,
        { includeStudyPlan: true, includeCulturalContext: true }
      );

      expect(result.enhancedMessage).toContain('Detailed explanation');
      expect(result.studyPlan).toHaveLength(2);
      expect(result.culturalContext).toContain('cultural');
    });
  });
});
```

### **4. Integration Tests**

```typescript
// server/src/__tests__/integration/assessment.integration.test.ts

import request from 'supertest';
import { app } from '../../app';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';
import { createAuthenticatedUser } from '../helpers/auth';

describe('Assessment API Integration', () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    await setupTestDatabase();
    const { token, user } = await createAuthenticatedUser();
    authToken = token;
    userId = user.id;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/ai/assess', () => {
    it('should successfully assess a correct French multiple choice response', async () => {
      const assessmentRequest = {
        userResponse: 'Je suis étudiant',
        expectedAnswer: 'Je suis étudiant',
        assessmentType: 'multiple_choice',
        questionContext: 'How do you say "I am a student" in French?',
        skillArea: 'grammar',
      };

      const response = await request(app)
        .post('/api/ai/assess')
        .set('Authorization', `Bearer ${authToken}`)
        .send(assessmentRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.score).toBe(100);
      expect(response.body.data.isCorrect).toBe(true);
      expect(response.body.data.feedback).toBeDefined();
      expect(response.body.data.feedback.message).toBeTruthy();
    });

    it('should handle incorrect French fill-in-blank with corrections', async () => {
      const assessmentRequest = {
        userResponse: 'mange',
        expectedAnswer: 'mangé',
        assessmentType: 'fill_in_blank',
        questionContext: 'J\'ai _____ une pomme. (I have eaten an apple)',
        skillArea: 'grammar',
      };

      const response = await request(app)
        .post('/api/ai/assess')
        .set('Authorization', `Bearer ${authToken}`)
        .send(assessmentRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isCorrect).toBe(false);
      expect(response.body.data.feedback.suggestions).toContain('past participle');
      expect(response.body.data.corrections).toContain('mangé');
    });

    it('should validate request and return 400 for invalid input', async () => {
      const invalidRequest = {
        userResponse: '', // Empty response
        expectedAnswer: 'test',
        assessmentType: 'invalid_type',
      };

      const response = await request(app)
        .post('/api/ai/assess')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid assessment request');
      expect(response.body.details).toContain('User response is required');
    });

    it('should require authentication', async () => {
      const assessmentRequest = {
        userResponse: 'test',
        expectedAnswer: 'test',
        assessmentType: 'multiple_choice',
      };

      await request(app)
        .post('/api/ai/assess')
        .send(assessmentRequest)
        .expect(401);
    });

    it('should respect rate limiting', async () => {
      const assessmentRequest = {
        userResponse: 'test',
        expectedAnswer: 'test',
        assessmentType: 'multiple_choice',
      };

      // Make 31 requests (rate limit is 30 per minute)
      const requests = Array(31).fill(0).map(() =>
        request(app)
          .post('/api/ai/assess')
          .set('Authorization', `Bearer ${authToken}`)
          .send(assessmentRequest)
      );

      const responses = await Promise.allSettled(requests);
      const rejectedCount = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 429
      ).length;

      expect(rejectedCount).toBeGreaterThan(0);
    });
  });

  describe('POST /api/ai/grade-exercise', () => {
    it('should successfully grade a complete French grammar exercise', async () => {
      const batchRequest = {
        exerciseId: 'french-verbs-1',
        exerciseType: 'grammar',
        responses: [
          {
            userResponse: 'suis',
            expectedAnswer: 'suis',
            assessmentType: 'fill_in_blank',
            questionContext: 'Je _____ étudiant.',
          },
          {
            userResponse: 'avez',
            expectedAnswer: 'avez',
            assessmentType: 'fill_in_blank',
            questionContext: 'Vous _____ un livre.',
          },
          {
            userResponse: 'sont',
            expectedAnswer: 'sont',
            assessmentType: 'fill_in_blank',
            questionContext: 'Ils _____ français.',
          },
        ],
        context: {
          userLevel: 'A2',
          lessonId: 'lesson-verbs-1',
          timeSpent: 180, // 3 minutes
          hintsUsed: 1,
        },
      };

      const response = await request(app)
        .post('/api/ai/grade-exercise')
        .set('Authorization', `Bearer ${authToken}`)
        .send(batchRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.overallScore).toBeGreaterThan(0);
      expect(response.body.data.results).toHaveLength(3);
      expect(response.body.data.exerciseAnalytics).toBeDefined();
      expect(response.body.data.feedback.comprehensiveFeedback).toBeTruthy();
    });
  });

  describe('GET /api/ai/analytics/:timeframe', () => {
    beforeEach(async () => {
      // Create some test assessment data
      await request(app)
        .post('/api/ai/assess')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userResponse: 'bonjour',
          expectedAnswer: 'bonjour',
          assessmentType: 'multiple_choice',
          skillArea: 'vocabulary',
        });
    });

    it('should return comprehensive analytics for the user', async () => {
      const response = await request(app)
        .get('/api/ai/analytics/week')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.analytics).toBeDefined();
      expect(response.body.data.analytics.totalAssessments).toBeGreaterThan(0);
      expect(response.body.data.analytics.averageScore).toBeDefined();
      expect(response.body.data.analytics.skillBreakdown).toBeDefined();
      expect(response.body.data.weaknessAnalysis).toBeDefined();
    });
  });
});
```

### **5. Performance Tests**

```typescript
// server/src/__tests__/performance/assessment.performance.test.ts

import { AssessmentService } from '../../services/assessment/AssessmentService';
import { createTestAssessmentService } from '../helpers/assessment';

describe('Assessment Performance Tests', () => {
  let assessmentService: AssessmentService;

  beforeAll(async () => {
    assessmentService = await createTestAssessmentService();
  });

  describe('Response Time Requirements', () => {
    it('should assess multiple choice responses in <1 second', async () => {
      const request = {
        userId: 1,
        userResponse: 'bonjour',
        expectedAnswer: 'bonjour',
        assessmentType: 'multiple_choice' as const,
        timestamp: new Date(),
      };

      const startTime = Date.now();
      await assessmentService.assessResponse(request);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(1000);
    });

    it('should assess fill-in-blank responses in <2 seconds', async () => {
      const request = {
        userId: 1,
        userResponse: 'suis',
        expectedAnswer: 'suis',
        assessmentType: 'fill_in_blank' as const,
        questionContext: 'Je _____ étudiant.',
        timestamp: new Date(),
      };

      const startTime = Date.now();
      await assessmentService.assessResponse(request);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(2000);
    });

    it('should assess open-ended responses in <3 seconds', async () => {
      const request = {
        userId: 1,
        userResponse: 'Je m\'appelle Jean et j\'habite à Paris.',
        expectedAnswer: 'Personal introduction with name and location',
        assessmentType: 'open_ended' as const,
        questionContext: 'Introduce yourself in French',
        timestamp: new Date(),
      };

      const startTime = Date.now();
      await assessmentService.assessResponse(request);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(3000);
    });
  });

  describe('Concurrent Processing', () => {
    it('should handle 10 concurrent assessments efficiently', async () => {
      const requests = Array(10).fill(0).map((_, index) => ({
        userId: index + 1,
        userResponse: 'bonjour',
        expectedAnswer: 'bonjour',
        assessmentType: 'multiple_choice' as const,
        timestamp: new Date(),
      }));

      const startTime = Date.now();
      const results = await Promise.all(
        requests.map(req => assessmentService.assessResponse(req))
      );
      const duration = Date.now() - startTime;

      expect(results).toHaveLength(10);
      expect(results.every(r => r.score >= 0)).toBe(true);
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with repeated assessments', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform 100 assessments
      for (let i = 0; i < 100; i++) {
        await assessmentService.assessResponse({
          userId: 1,
          userResponse: `test-${i}`,
          expectedAnswer: `test-${i}`,
          assessmentType: 'multiple_choice',
          timestamp: new Date(),
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});
```

## **Files to Create**
```
server/src/__tests__/services/assessment/AssessmentService.test.ts
server/src/__tests__/services/assessment/AssessmentStrategyFactory.test.ts
server/src/__tests__/services/assessment/BatchAssessmentProcessor.test.ts
server/
