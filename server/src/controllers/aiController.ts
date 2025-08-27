/**
 * AI Controller - Robust API Layer for AI Services
 * 
 * Provides a clean, type-safe, and scalable API layer for AI functionality.
 * Implements runtime validation, proper error handling, and follows established
 * architectural patterns from the existing codebase.
 * 
 * Key improvements:
 * - Runtime request validation using Zod schemas
 * - Declarative task handler mapping for scalability
 * - Proper dependency injection through service factory
 * - Comprehensive error handling with appropriate HTTP status codes
 * - Type-safe integration with AI orchestration system
 * 
 * TODO: Integrate with structured logging as per #24 in future_implementation_considerations.md
 * TODO: Add request/response logging middleware for monitoring
 */

import { Request, Response } from 'express';
import { aiServiceFactory } from '../services/ai/index.js';
import { contentGenerationServiceFactory } from '../services/contentGeneration/index.js';
import { AIUserContext, AITaskPayloads } from '../types/AI.js';
import {
  ValidatedAITask,
  validateAIPayload,
  formatValidationError,
  validationSchemaMap,
} from './ai.validators.js';
import { AiGenerationJobsModel } from '../models/AiGenerationJob.js';
import { paginationSchema } from './ai.validators.js';

/**
 * Task handler map - Declarative mapping of AI tasks to their handlers
 * 
 * This approach is more scalable and maintainable than switch statements.
 * Each task type is mapped to its handler method and validation schema.
 */
const taskHandlerMap = {
  GENERATE_LESSON: {
    handler: 'generateLesson' as const,
    validator: validationSchemaMap.GENERATE_LESSON,
  },
  ASSESS_PRONUNCIATION: {
    handler: 'assessPronunciation' as const,
    validator: validationSchemaMap.ASSESS_PRONUNCIATION,
  },
  GRADE_RESPONSE: {
    handler: 'gradeResponse' as const,
    validator: validationSchemaMap.GRADE_RESPONSE,
  },
  /**
   * Task 3.2.A.3: Curriculum Feature Task Mappings
   * 
   * These task mappings enable the curriculum API endpoints to use the established
   * handleAIRequest pattern for maximum code reuse and consistency. Each mapping
   * connects a curriculum task type to its validation schema and handler method.
   */
  GENERATE_DAILY_PLAN: {
    handler: 'generateDailyPlan' as const,
    validator: validationSchemaMap.GENERATE_DAILY_PLAN,
  },
  ADAPT_LEARNING_PATH: {
    handler: 'adaptLearningPath' as const,
    validator: validationSchemaMap.ADAPT_LEARNING_PATH,
  },
  GET_DAILY_PLAN: {
    handler: 'getDailyPlan' as const,
    validator: validationSchemaMap.GET_DAILY_PLAN,
  },
  GET_LEARNING_RECOMMENDATIONS: {
    handler: 'getLearningRecommendations' as const,
    validator: validationSchemaMap.GET_LEARNING_RECOMMENDATIONS,
  },
  // TODO: Add future task mappings as new AI features are implemented
} as const;

/**
 * Generic AI request handler - Centralized logic for all AI requests
 * 
 * This function provides a consistent, reusable pattern for handling AI requests
 * with validation, error handling, and proper response formatting.
 * 
 * @param req - Authenticated Express request
 * @param res - Express response
 * @param taskType - The specific AI task to execute
 */
async function handleAIRequest<T extends ValidatedAITask>(
  req: Request,
  res: Response,
  taskType: T
): Promise<void> {
  // TODO: Implement structured logging (Pino) as per #24 in future_implementation_considerations.md
  console.log(`[aiController] Processing ${taskType} request for user ${req.user?.userId}`);

  try {
    // 1. Authentication check
    if (!req.user?.userId) {
      res.status(401).json({ 
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED' 
      });
      return;
    }

    // 2. Runtime payload validation using Zod
    const validationResult = validateAIPayload(taskType, req.body);
    if (!validationResult.success) {
      const errorResponse = formatValidationError(validationResult.error);
      res.status(400).json({
        message: errorResponse.message,
        details: errorResponse.details,
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    // 3. Build user context from authenticated request
    const userContext: AIUserContext = {
      id: req.user.userId,
      firstName: null, // TODO: Add firstName to AuthenticatedRequest when user model is extended
      role: req.user.role || 'user',
      preferences: {}, // TODO: Load actual user preferences when ContextService is fully implemented
    };

    // 4. Get AI orchestrator instance
    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();

    // 5. Execute the specific AI task using proper type casting
    let result;
    switch (taskType) {
      case 'GENERATE_LESSON':
        result = await aiOrchestrator.generateLesson(
          userContext,
          validationResult.data as AITaskPayloads['GENERATE_LESSON']['request']
        );
        break;
      case 'ASSESS_PRONUNCIATION':
        result = await aiOrchestrator.assessPronunciation(
          userContext, 
          validationResult.data as AITaskPayloads['ASSESS_PRONUNCIATION']['request']
        );
        break;
      case 'GRADE_RESPONSE':
        result = await aiOrchestrator.gradeResponse(
          userContext, 
          validationResult.data as AITaskPayloads['GRADE_RESPONSE']['request']
        );
        break;
      /**
       * Task 3.2.A.3: Curriculum Feature Switch Cases
       * 
       * These cases handle curriculum-related AI tasks using the same pattern
       * as existing tasks, ensuring consistency and type safety throughout
       * the AI orchestration system.
       */
      case 'GENERATE_DAILY_PLAN':
        result = await aiOrchestrator.generateDailyPlan(
          userContext,
          validationResult.data as AITaskPayloads['GENERATE_DAILY_PLAN']['request']
        );
        break;
      case 'ADAPT_LEARNING_PATH':
        result = await aiOrchestrator.adaptLearningPath(
          userContext,
          validationResult.data as AITaskPayloads['ADAPT_LEARNING_PATH']['request']
        );
        break;
      case 'GET_DAILY_PLAN':
        result = await aiOrchestrator.getDailyPlan(
          userContext,
          validationResult.data as AITaskPayloads['GET_DAILY_PLAN']['request']
        );
        break;
      case 'GET_LEARNING_RECOMMENDATIONS':
        result = await aiOrchestrator.getLearningRecommendations(
          userContext,
          validationResult.data as AITaskPayloads['GET_LEARNING_RECOMMENDATIONS']['request']
        );
        break;
      default:
        res.status(500).json({ 
          message: 'Handler not implemented for this task type.',
          code: 'HANDLER_NOT_FOUND' 
        });
        return;
    }

    // 6. Send successful response
    res.status(200).json(result);

    // TODO: Add metrics logging for monitoring (response time, task type, success rate)
    console.log(`[aiController] Successfully processed ${taskType} in ${result.metadata.processingTimeMs}ms`);

  } catch (error) {
    // TODO: Implement structured logging (Pino) as per #24 in future_implementation_considerations.md
    // TODO: Implement global error handling middleware to handle custom AIError types
    console.error(`[aiController] Error processing ${taskType}:`, error);

    // Handle different error types appropriately
    if (error instanceof Error) {
      // Check for specific error types and map to appropriate HTTP status codes
      if (error.message.includes('Rate limit')) {
        res.status(429).json({ 
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED' 
        });
        return;
      }
      
      if (error.message.includes('Invalid')) {
        res.status(400).json({ 
          message: error.message,
          code: 'INVALID_REQUEST' 
        });
        return;
      }
    }

    // Default to 500 for unexpected errors
    res.status(500).json({ 
      message: 'An unexpected error occurred while processing your request.',
      code: 'INTERNAL_ERROR' 
    });
  }
}

/**
 * [ASYNC] Controller for listing a user's content generation jobs.
 * GET /api/ai/jobs
 */
export const listJobs = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  
  // Validate pagination query parameters
  const validationResult = paginationSchema.safeParse(req.query);
  if (!validationResult.success) {
    return res.status(400).json({ message: 'Invalid pagination parameters.', details: validationResult.error.flatten().fieldErrors });
  }
  
  const { page, pageSize } = validationResult.data;

  try {
    const jobQueueService = contentGenerationServiceFactory.getDatabaseJobQueueService();
    const paginatedResult = await jobQueueService.listJobsByUser(userId, page, pageSize);
    console.log('[aiController] Data before sending response:', JSON.stringify(paginatedResult, null, 2));
    // Return full pagination data for the frontend
    res.status(200).json({ success: true, data: paginatedResult.results, total: paginatedResult.total });
  } catch (error) {
    console.error(`[aiController] Error listing jobs for user ${userId}:`, error);
    res.status(500).json({ message: 'Failed to retrieve jobs.', code: 'JOB_LIST_FAILED' });
  }
};

/**
 * [ASYNC] Controller for cancelling a content generation job.
 * DELETE /api/ai/jobs/:jobId
 */
export const cancelJob = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { jobId } = req.params;

  try {
    const jobQueueService = contentGenerationServiceFactory.getDatabaseJobQueueService();
    const wasCancelled = await jobQueueService.cancelJob(jobId, userId);

    if (wasCancelled) {
      res.status(200).json({ success: true, message: 'Job cancelled successfully.' });
    } else {
      // Use 404 for a more specific error when the target is not found or in the wrong state
      res.status(404).json({ success: false, message: 'Job not found or cannot be cancelled.', code: 'CANCEL_FAILED' });
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({ message: 'Forbidden.', code: 'FORBIDDEN' });
    }
    console.error(`[aiController] Error cancelling job ${jobId} for user ${userId}:`, error);
    res.status(500).json({ message: 'An unexpected error occurred while cancelling the job.', code: 'INTERNAL_ERROR' });
  }
};

/**
 * [ASYNC] Controller for initiating a content generation job.
 * POST /api/ai/generate
 */
export const generateContentAsync = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validationResult = validateAIPayload('GENERATE_CONTENT', req.body);
  if (!validationResult.success) {
    const errorResponse = formatValidationError(validationResult.error);
    res.status(400).json({
      message: errorResponse.message,
      details: errorResponse.details,
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  const { contentType, ...restOfData } = validationResult.data;
  const contentRequest = {
    ...restOfData,
    type: contentType,
    userId: req.user!.userId,
  };

  try {
    const contentGenerator = contentGenerationServiceFactory.getDynamicContentGenerator();
    const { jobId } = await contentGenerator.generateContent(contentRequest);
    res.status(202).json({ jobId });
  } catch (error) {
    console.error(`[aiController] Failed to schedule job for user ${req.user!.userId}:`, error);
    res.status(500).json({ message: 'Failed to schedule content generation job.', code: 'JOB_SCHEDULE_FAILED' });
  }
};

/**
 * [ASYNC] Controller for checking the status of a content generation job.
 * GET /api/ai/generate/status/:jobId
 */
export const getGenerationStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const jobRecord = await AiGenerationJobsModel.query().findById(jobId);

    if (!jobRecord) {
      res.status(404).json({ message: 'Job not found.', code: 'JOB_NOT_FOUND' });
      return;
    }

    // Ensure users can only access their own jobs
    if (jobRecord.userId !== req.user!.userId) {
      res.status(403).json({ message: 'Forbidden.', code: 'FORBIDDEN' });
      return;
    }

    if (jobRecord.status === 'completed') {
      // Attempt to get from cache first for performance
      const cacheService = aiServiceFactory.getCacheService();
      const cachedResult = await cacheService.get(jobId);
      
      if (cachedResult) {
        res.status(200).json({ status: 'completed', data: cachedResult });
        return;
      }
      // If not in cache, return from DB
      res.status(200).json({ status: 'completed', data: JSON.parse(jobRecord.result!) });
      return;
    }

    res.status(200).json({ status: jobRecord.status, error: jobRecord.errorMessage });

  } catch (error) {
    console.error(`[aiController] Error fetching status for job ${jobId}:`, error);
    res.status(500).json({ message: 'An unexpected error occurred.', code: 'INTERNAL_ERROR' });
  }
};

// =================================================================
// AI ORCHESTRATION ENDPOINTS - New type-safe endpoints
// =================================================================

/**
 * [ASYNC] Controller for pronunciation assessment
 * POST /api/ai/assess-pronunciation
 */
export const assessPronunciation = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'ASSESS_PRONUNCIATION');
};

/**
 * [ASYNC] Controller for response grading
 * POST /api/ai/grade-response
 */
export const gradeResponse = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GRADE_RESPONSE');
};

/**
 * [ASYNC] Controller for lesson generation
 * POST /api/ai/generate-lesson
 */
export const generateLesson = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GENERATE_LESSON');
};

// =================================================================
// LEGACY ENDPOINTS - Maintained for backward compatibility
// TODO: Phase out these endpoints in favor of the new AI orchestration endpoints
// =================================================================

/**
 * Legacy chat endpoint - maintained for backward compatibility
 * @deprecated Use the new AI orchestration endpoints instead
 */
export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    
    // TODO: Migrate to new AI orchestration system
    console.warn('[aiController] Legacy chatWithAI endpoint used - consider migrating to new AI endpoints');
    
    const response = { 
      response: `This is a legacy placeholder response to: "${prompt}"`,
      deprecated: true,
      message: 'This endpoint is deprecated. Please use the new AI orchestration endpoints.'
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error in AI chat.',
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// =================================================================
// AI DASHBOARD CONTROLLERS - Placeholder implementations for testing
// =================================================================

// getDailyPlan moved to curriculum section - see line 599

export const getRecommendations = async (req: Request, res: Response) => {
  console.log(`[aiController] Placeholder: Firing getRecommendations for user ${req.user?.userId}`);
  res.status(200).json([]);
};

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  console.log(`[aiController] Placeholder: Firing getDashboardAnalytics for user ${req.user?.userId}`);
  res.status(200).json({
    totalLessons: 0,
    totalPractice: 0,
    streak: 0,
  });
};

export const getAIPreferences = async (req: Request, res: Response) => {
  console.log(`[aiController] Placeholder: Firing getAIPreferences for user ${req.user?.userId}`);
  res.status(200).json({
    difficulty: 'beginner',
    learningPace: 'moderate',
  });
};

export const updateAIPreferences = async (req: Request, res: Response) => {
  console.log(`[aiController] Placeholder: Firing updateAIPreferences for user ${req.user?.userId}`);
  res.status(200).json(req.body);
};

/**
 * Legacy prompts endpoint - maintained for backward compatibility
 * @deprecated Use the new AI orchestration endpoints instead
 */
export const getPrompts = async (req: Request, res: Response) => {
  try {
    const { topic } = req.query;
    
    // TODO: Migrate to new AI orchestration system
    console.warn('[aiController] Legacy getPrompts endpoint used - consider migrating to new AI endpoints');
    
    const prompts = [{ 
      prompt: `Tell me about ${topic}.`,
      deprecated: true,
      message: 'This endpoint is deprecated. Please use the new AI orchestration endpoints.'
    }];
    
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching conversation prompts.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =================================================================
// CURRICULUM API ENDPOINTS - Task 3.2.A.3
// =================================================================

/**
 * [ASYNC] Controller for generating personalized daily learning plans
 * POST /api/ai/curriculum/daily-plan
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Daily Plan Generation
 * 
 * Generates AI-powered daily learning plans using the established handleAIRequest pattern
 * for maximum code reuse and consistency. Integrates with existing validation, error handling,
 * and AI orchestration infrastructure to provide personalized learning activities based on
 * user context, available time, and performance data.
 * 
 * @param req - Express request with validated daily plan parameters in body
 * @param res - Express response object
 * @returns Promise<void>
 * 
 * @example
 * POST /api/ai/curriculum/daily-plan
 * Body: {
 *   "userId": 123,
 *   "preferredDuration": 30,
 *   "focusAreas": ["grammar", "vocabulary"]
 * }
 * 
 * Response: {
 *   "status": "success",
 *   "data": {
 *     "activities": [...],
 *     "totalMinutes": 30,
 *     "confidence": 0.85
 *   },
 *   "metadata": { ... }
 * }
 */
export const generateDailyPlan = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GENERATE_DAILY_PLAN');
};

/**
 * [ASYNC] Controller for adapting existing learning paths
 * POST /api/ai/curriculum/adapt-path
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Learning Path Adaptation
 * 
 * Modifies existing learning paths based on performance data, goal changes, or time constraints
 * using the established handleAIRequest pattern for consistency. Provides intelligent adaptation
 * while maintaining learning continuity and pedagogical soundness through AI analysis.
 * 
 * @param req - Express request with adaptation parameters in body
 * @param res - Express response object
 * @returns Promise<void>
 * 
 * @example
 * POST /api/ai/curriculum/adapt-path
 * Body: {
 *   "currentPathId": "123",
 *   "performanceData": [
 *     {"skillArea": "grammar", "score": 65, "completedAt": "2025-08-25", "difficulty": "A2"}
 *   ],
 *   "adaptationTrigger": "poor_performance"
 * }
 * 
 * Response: {
 *   "status": "success",
 *   "data": {
 *     "adaptedActivities": [...],
 *     "adaptationReasoning": "Based on recent performance...",
 *     "confidenceScore": 0.78
 *   },
 *   "metadata": { ... }
 * }
 */
export const adaptLearningPath = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'ADAPT_LEARNING_PATH');
};

/**
 * [ASYNC] Controller for retrieving cached daily learning plans
 * GET /api/ai/curriculum/daily-plan/:userId
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Cached Daily Plan Access
 * 
 * Retrieves cached daily learning plans using the established handleAIRequest pattern
 * for consistency and performance optimization. Provides fast access to previously
 * generated AI recommendations while maintaining the same validation and error
 * handling standards as other endpoints.
 * 
 * @param req - Express request with userId parameter and optional query parameters
 * @param res - Express response object
 * @returns Promise<void>
 * 
 * @example
 * GET /api/ai/curriculum/daily-plan/123
 * 
 * Response: {
 *   "status": "success",
 *   "data": {
 *     "planId": "plan_123_2025-08-26",
 *     "userId": 123,
 *     "activities": [...],
 *     "totalMinutes": 30,
 *     "isAdaptive": true
 *   },
 *   "metadata": { ... }
 * }
 */
export const getDailyPlan = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GET_DAILY_PLAN');
};

/**
 * [ASYNC] Controller for learning recommendations based on available time
 * GET /api/ai/curriculum/recommendations/:userId?timeAvailable=20
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Learning Recommendations
 * 
 * Provides learning recommendations tailored to user's available study time and current
 * progress using the established handleAIRequest pattern. Integrates with existing
 * progress tracking and assessment systems for contextual, AI-powered suggestions
 * while maintaining consistency with all other AI endpoints.
 * 
 * @param req - Express request with userId parameter and timeAvailable query parameter
 * @param res - Express response object  
 * @returns Promise<void>
 * 
 * @example
 * GET /api/ai/curriculum/recommendations/123?timeAvailable=30
 * 
 * Response: {
 *   "status": "success",
 *   "data": {
 *     "recommendations": [
 *       {
 *         "id": "rec_123",
 *         "title": "Grammar Practice",
 *         "estimatedMinutes": 15,
 *         "difficulty": "A2",
 *         "priority": 5
 *       }
 *     ],
 *     "totalMinutes": 30,
 *     "isAdaptive": true
 *   },
 *   "metadata": { ... }
 * }
 */
export const getLearningRecommendations = async (req: Request, res: Response) => {
  await handleAIRequest(req, res, 'GET_LEARNING_RECOMMENDATIONS');
};
