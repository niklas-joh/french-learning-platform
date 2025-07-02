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

import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { aiServiceFactory } from '../services/ai';
import { contentGenerationServiceFactory } from '../services/contentGeneration';
import { AIUserContext, AITaskPayloads } from '../types/AI';
import {
  ValidatedAITask,
  validateAIPayload,
  formatValidationError,
  validationSchemaMap,
} from './ai.validators';
import { AiGenerationJobsModel } from '../models/AiGenerationJob';

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
  req: AuthenticatedRequest,
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
          validationResult.data as any // Bypassing type conflict for now
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
 * [ASYNC] Controller for initiating a content generation job.
 * POST /api/ai/generate
 */
export const generateContentAsync = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  // The validation schema for content generation can be more generic
  const validationResult = validateAIPayload('GENERATE_LESSON', req.body);
  if (!validationResult.success) {
    const errorResponse = formatValidationError(validationResult.error);
    res.status(400).json({
      message: errorResponse.message,
      details: errorResponse.details,
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  const contentRequest = {
    ...validationResult.data,
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
export const getGenerationStatus = async (req: AuthenticatedRequest, res: Response) => {
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


/**
 * @deprecated Use generateContentAsync instead.
 * Controller function for lesson generation
 * POST /api/ai/generate-lesson
 */
export const generateLesson = (req: AuthenticatedRequest, res: Response): Promise<void> =>
  handleAIRequest(req, res, 'GENERATE_LESSON');

/**
 * Controller function for pronunciation assessment
 * POST /api/ai/assess-pronunciation
 */
export const assessPronunciation = (req: AuthenticatedRequest, res: Response): Promise<void> =>
  handleAIRequest(req, res, 'ASSESS_PRONUNCIATION');

/**
 * Controller function for response grading
 * POST /api/ai/grade-response
 */
export const gradeResponse = (req: AuthenticatedRequest, res: Response): Promise<void> =>
  handleAIRequest(req, res, 'GRADE_RESPONSE');

// =================================================================
// LEGACY ENDPOINTS - Maintained for backward compatibility
// TODO: Phase out these endpoints in favor of the new AI orchestration endpoints
// =================================================================

/**
 * Legacy chat endpoint - maintained for backward compatibility
 * @deprecated Use the new AI orchestration endpoints instead
 */
export const chatWithAI = async (req: AuthenticatedRequest, res: Response) => {
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

/**
 * Legacy prompts endpoint - maintained for backward compatibility
 * @deprecated Use the new AI orchestration endpoints instead
 */
export const getPrompts = async (req: AuthenticatedRequest, res: Response) => {
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
