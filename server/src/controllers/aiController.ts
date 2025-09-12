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
} from './ai.validators.js';
import { AiGenerationJobsModel } from '../models/AiGenerationJob.js';
import { paginationSchema } from './ai.validators.js';

/**
 * Helper function to construct payload for GET requests
 * 
 * PERFORMANCE OPTIMIZATION: Constructs minimal payload objects for GET requests
 * based on task type, avoiding unnecessary object spreading and ensuring type safety.
 * 
 * SECURITY: Always uses authenticated user ID from req.user, never trusts URL parameters
 * for user identification to prevent privilege escalation attacks.
 * 
 * @param taskType - The AI task type being executed
 * @param req - Authenticated Express request containing user context
 * @returns Payload object specific to the task type
 * @throws Error for invalid GET task types
 * 
 * @example
 * // For GET /api/ai/curriculum/daily-plan
 * const payload = buildGETPayload('GET_DAILY_PLAN', req);
 * // Returns: { userId: 123 }
 *
 * @example
 * // For GET /api/ai/curriculum/recommendations?timeAvailable=30
 * const payload = buildGETPayload('GET_LEARNING_RECOMMENDATIONS', req);
 * // Returns: { userId: 123, timeAvailable: 30 }
*/
function buildGETPayload(taskType: ValidatedAITask, req: Request): any {
  const userId = req.user!.userId; // Guaranteed by auth middleware, never use URL params for security
  
  switch (taskType) {
    case 'GET_DAILY_PLAN':
      return { userId };
      
    case 'GET_LEARNING_RECOMMENDATIONS': {
      // Parse timeAvailable from query parameters with default fallback
      const timeAvailable = req.query.timeAvailable 
        ? parseInt(req.query.timeAvailable as string, 10) 
        : 20; // Default from schema
      return { userId, timeAvailable };
    }
    
    default:
      throw new Error(`Invalid GET task type: ${taskType}. Only GET_DAILY_PLAN and GET_LEARNING_RECOMMENDATIONS are supported.`);
  }
}

/**
 * Enhanced AI request handler - Centralized logic for all AI requests with GET/POST optimization
 * 
 * SUBTASK_03 ENHANCEMENT: Fixes GET endpoint validation by using method-specific payload construction.
 * GET requests extract data from URL params/query, POST requests use body validation.
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Eliminates redundant switch statement by leveraging AIOrchestrator.processAITask()
 * - Minimal object creation for GET request payloads
 * - Direct orchestrator routing instead of manual method dispatch
 * - Reuses singleton factory services for optimal memory usage
 * 
 * SECURITY ENHANCEMENTS:
 * - Always uses authenticated user ID, never trusts URL parameters
 * - Validates task types for GET requests to prevent unauthorized access
 * - Maintains consistent error response formats
 * 
 * @param taskType - The specific AI task to execute (validated against ValidatedAITask enum)
 * @returns Express middleware function that handles the AI request lifecycle
 * 
 * @example
 * // Usage in route definitions:
 * router.get('/curriculum/daily-plan', handleAIRequest('GET_DAILY_PLAN'));
 * router.post('/curriculum/daily-plan', handleAIRequest('GENERATE_DAILY_PLAN'));
 */
function handleAIRequest(taskType: ValidatedAITask) {
  return async (req: Request, res: Response): Promise<void> => {
    // TODO: Implement structured logging (Pino) as per #24 in future_implementation_considerations.md
    console.log(`[aiController] Processing ${taskType} request (${req.method}) for user ${req.user?.userId}`);

    try {
      // 1. Early authentication check - fail fast for better performance
      if (!req.user?.userId) {
        res.status(401).json({ 
          message: 'Authentication required.',
          code: 'AUTH_REQUIRED' 
        });
        return;
      }

      // 2. Method-specific payload construction
      // ENHANCEMENT: GET requests use params/query, POST requests use body
      let payload;
      if (req.method === 'GET') {
        try {
          payload = buildGETPayload(taskType, req);
        } catch (error) {
          // Handle invalid GET task types with specific error
          res.status(400).json({
            error: 'Invalid request',
            message: error instanceof Error ? error.message : 'Invalid GET task type',
            method: req.method,
            taskType,
            code: 'INVALID_TASK_TYPE'
          });
          return;
        }
      } else {
        // POST/PUT/PATCH: Use body as-is (existing behavior)
        payload = req.body;
      }

      // 3. Runtime payload validation using Zod schemas
      const validationResult = validateAIPayload(taskType, payload);
      if (!validationResult.success) {
        const errorResponse = formatValidationError(validationResult.error);
        res.status(400).json({
          message: errorResponse.message,
          details: errorResponse.details,
          method: req.method,
          taskType,
          code: 'VALIDATION_ERROR'
        });
        return;
      }

      // 4. Build user context from authenticated request
      const userContext: AIUserContext = {
        id: req.user.userId,
        firstName: null, // TODO: Add firstName to AuthenticatedRequest when user model is extended
        role: req.user.role || 'user',
        preferences: {}, // TODO: Load actual user preferences when ContextService is fully implemented
      };

      // 5. PERFORMANCE ENHANCEMENT: Direct orchestrator method calls with proper routing
      // Call the appropriate orchestrator method based on task type
      const orchestrator = aiServiceFactory.getAIOrchestrator();
      let result;
      
      switch (taskType) {
        case 'GENERATE_LESSON':
          result = await orchestrator.generateLesson(
            userContext, 
            validationResult.data as AITaskPayloads['GENERATE_LESSON']['request']
          );
          break;
        case 'ASSESS_PRONUNCIATION':
          result = await orchestrator.assessPronunciation(
            userContext, 
            validationResult.data as AITaskPayloads['ASSESS_PRONUNCIATION']['request']
          );
          break;
        case 'GRADE_RESPONSE':
          result = await orchestrator.gradeResponse(
            userContext, 
            validationResult.data as AITaskPayloads['GRADE_RESPONSE']['request']
          );
          break;
        case 'GENERATE_DAILY_PLAN':
          result = await orchestrator.generateDailyPlan(
            userContext, 
            validationResult.data as AITaskPayloads['GENERATE_DAILY_PLAN']['request']
          );
          break;
        case 'ADAPT_LEARNING_PATH':
          result = await orchestrator.adaptLearningPath(
            userContext, 
            validationResult.data as AITaskPayloads['ADAPT_LEARNING_PATH']['request']
          );
          break;
        case 'GET_DAILY_PLAN':
          result = await orchestrator.getDailyPlan(
            userContext, 
            validationResult.data as AITaskPayloads['GET_DAILY_PLAN']['request']
          );
          break;
        case 'GET_LEARNING_RECOMMENDATIONS':
          result = await orchestrator.getLearningRecommendations(
            userContext, 
            validationResult.data as AITaskPayloads['GET_LEARNING_RECOMMENDATIONS']['request']
          );
          break;
        default:
          res.status(500).json({ 
            message: 'Handler not implemented for this task type.',
            method: req.method,
            taskType,
            code: 'HANDLER_NOT_FOUND' 
          });
          return;
      }

      // 6. Send successful response
      res.status(200).json(result);

      // TODO: Add metrics logging for monitoring (response time, task type, success rate)
      console.log(`[aiController] Successfully processed ${taskType} (${req.method}) in ${result.metadata?.processingTimeMs || 0}ms`);

    } catch (error) {
      // TODO: Implement structured logging (Pino) as per #24 in future_implementation_considerations.md
      // TODO: Implement global error handling middleware to handle custom AIError types
      console.error(`[aiController] Error processing ${taskType} (${req.method}):`, error);

      // Enhanced error handling with method context
      if (error instanceof Error) {
        // Check for specific error types and map to appropriate HTTP status codes
        if (error.message.includes('Rate limit')) {
          res.status(429).json({ 
            message: 'Rate limit exceeded. Please try again later.',
            method: req.method,
            taskType,
            code: 'RATE_LIMIT_EXCEEDED' 
          });
          return;
        }
        
        if (error.message.includes('Invalid') || error.message.includes('not implemented')) {
          res.status(400).json({ 
            message: error.message,
            method: req.method,
            taskType,
            code: 'INVALID_REQUEST' 
          });
          return;
        }
      }

      // Default to 500 for unexpected errors with enhanced context
      res.status(500).json({ 
        message: 'An unexpected error occurred while processing your request.',
        method: req.method,
        taskType,
        code: 'INTERNAL_ERROR' 
      });
    }
  };
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
  console.log(`[aiController] 🚀 DEBUGGING: Starting content generation for user ${req.user!.userId}`);
  console.log(`[aiController] 🚀 DEBUGGING: Request body:`, JSON.stringify(req.body, null, 2));
  
  const validationResult = validateAIPayload('GENERATE_CONTENT', req.body);
  if (!validationResult.success) {
    console.log(`[aiController] ❌ DEBUGGING: Validation failed:`, validationResult.error);
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

  console.log(`[aiController] 🚀 DEBUGGING: Content request prepared:`, JSON.stringify(contentRequest, null, 2));

  try {
    console.log(`[aiController] 🚀 DEBUGGING: Getting content generator...`);
    const contentGenerator = contentGenerationServiceFactory.getDynamicContentGenerator();
    console.log(`[aiController] 🚀 DEBUGGING: Content generator obtained, calling generateContent...`);
    
    const { jobId } = await contentGenerator.generateContent(contentRequest);
    console.log(`[aiController] ✅ DEBUGGING: Job created successfully with ID: ${jobId}`);
    
    // DEBUGGING: Immediately check if job exists in database
    console.log(`[aiController] 🔍 DEBUGGING: Checking if job ${jobId} exists in database...`);
    // TODO: Simplify controller architecture following KISS principle 
    // See future_implementation_considerations.md #33 for detailed plan
    // Priority: Medium (after server stability achieved)
    const jobRecord = await AiGenerationJobsModel.query().findById(jobId);
    console.log(`[aiController] 🔍 DEBUGGING: Job record found:`, JSON.stringify(jobRecord, null, 2));
    
    res.status(202).json({ jobId });
  } catch (error) {
    console.error(`[aiController] ❌ DEBUGGING: Failed to schedule job for user ${req.user!.userId}:`, error);
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
        res.status(200).json({ status: 'completed', result: cachedResult });
        return;
      }
      // If not in cache, return from DB
      res.status(200).json({ status: 'completed', result: JSON.parse(jobRecord.result!) });
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
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with POST body validation
 */
export const assessPronunciation = handleAIRequest('ASSESS_PRONUNCIATION');

/**
 * [ASYNC] Controller for response grading
 * POST /api/ai/grade-response
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with POST body validation
 */
export const gradeResponse = handleAIRequest('GRADE_RESPONSE');

/**
 * [ASYNC] Controller for lesson generation
 * POST /api/ai/generate-lesson
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with POST body validation
 */
export const generateLesson = handleAIRequest('GENERATE_LESSON');

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
 * Controller for generating personalized daily learning plans
 * POST /api/ai/curriculum/daily-plan
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Daily Plan Generation
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with POST body validation.
 * Generates AI-powered daily learning plans using established validation, error handling,
 * and AI orchestration infrastructure to provide personalized learning activities based on
 * user context, available time, and performance data.
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
export const generateDailyPlan = handleAIRequest('GENERATE_DAILY_PLAN');

/**
 * Controller for adapting existing learning paths
 * POST /api/ai/curriculum/adapt-path
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Learning Path Adaptation
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with POST body validation.
 * Modifies existing learning paths based on performance data, goal changes, or time constraints
 * using established validation pattern for consistency. Provides intelligent adaptation
 * while maintaining learning continuity and pedagogical soundness through AI analysis.
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
export const adaptLearningPath = handleAIRequest('ADAPT_LEARNING_PATH');

/**
 * Controller for retrieving cached daily learning plans
 * GET /api/ai/curriculum/daily-plan
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Cached Daily Plan Access
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with GET parameter validation.
 * Retrieves cached daily learning plans using method-specific payload construction for
 * performance optimization. Provides fast access to previously generated AI recommendations
 * while maintaining the same validation and error handling standards as other endpoints.
 * 
 * @example
 * GET /api/ai/curriculum/daily-plan
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
export const getDailyPlan = handleAIRequest('GET_DAILY_PLAN');

/**
 * Controller for learning recommendations based on available time
 * GET /api/ai/curriculum/recommendations?timeAvailable=20
 * 
 * Task 3.2.A.3: Curriculum API Endpoints - Learning Recommendations
 * 
 * SUBTASK_03 ENHANCEMENT: Uses enhanced handleAIRequest pattern with GET parameter/query validation.
 * Provides learning recommendations tailored to user's available study time and current
 * progress using method-specific payload construction. Integrates with existing progress 
 * tracking and assessment systems for contextual, AI-powered suggestions while maintaining 
 * consistency with all other AI endpoints.
 * 
 * @example
 * GET /api/ai/curriculum/recommendations?timeAvailable=30
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
export const getLearningRecommendations = handleAIRequest('GET_LEARNING_RECOMMENDATIONS');
