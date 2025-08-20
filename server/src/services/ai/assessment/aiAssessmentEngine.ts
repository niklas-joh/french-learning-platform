import Knex from 'knex';
import { createHash } from 'crypto';
import { AssessmentRepository } from '../../../repositories/assessmentRepository';
import { ICacheService } from '../../common/ICacheService';
import { AssessmentRequest, AssessmentResult, BatchAssessmentRequest, BatchAssessmentResult } from '../../../types/Assessment';
import { AssessmentStrategyFactory } from './assessmentStrategyFactory';
import { ILogger, createLogger } from '../../../utils/logger';

/**
 * @class AIAssessmentEngine
 * @description The core engine for handling AI-powered assessments.
 * It orchestrates caching, strategy selection, and execution.
 */
export class AIAssessmentEngine {
  private readonly logger: ILogger;

  /**
   * Creates an instance of AIAssessmentEngine.
   * @param {Knex} db The Knex instance for database transactions (for later tasks).
   * @param {AssessmentRepository} assessmentRepo The repository for assessment data access.
   * @param {ICacheService} cache The caching service.
   * @param {AssessmentStrategyFactory} strategyFactory The factory for creating assessment strategies.
   * @param {ILogger} [logger] Optional logger instance.
   */
  constructor(
    private readonly db: Knex,
    private readonly assessmentRepo: AssessmentRepository,
    private readonly cache: ICacheService,
    private readonly strategyFactory: AssessmentStrategyFactory,
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('AIAssessmentEngine');
  }

  /**
   * Assesses a single user response using the appropriate strategy.
   * This method handles caching, strategy selection, and execution.
   * @param {AssessmentRequest} request The assessment request data.
   * @param {{ signal?: AbortSignal }} [options] Optional parameters like the AbortSignal for cancellation.
   * @returns {Promise<AssessmentResult>} A promise that resolves to a structured AssessmentResult.
   */
  public async assessUserResponse(request: AssessmentRequest, options?: { signal?: AbortSignal }): Promise<AssessmentResult> {
    const cacheKey = this.generateCacheKey(request);
    
    try {
      const cachedResult = await this.cache.get<AssessmentResult>(cacheKey);
      if (cachedResult) {
        this.logger.info(`Cache HIT for assessment: ${request.responseType}`);
        return { ...cachedResult, metadata: { ...cachedResult.metadata, cached: true } };
      }
      this.logger.info(`Cache MISS for assessment: ${request.responseType}`);

      const strategy = this.strategyFactory.getStrategy(request.responseType);
      const result = await strategy.assess(request, options);

      if (!result.isFallback) {
        await this.cache.set(cacheKey, result, 3600); // Cache for 1 hour
      }

      return result;
    } catch (error) {
      this.logger.error('Critical error in assessUserResponse', { error, request });
      return {
        userResponse: request.userResponse,
        score: 0,
        isCorrect: false,
        feedback: { message: "An error occurred while assessing the response.", tone: 'neutral', suggestions: [] },
        confidence: 'low',
        assessmentType: request.responseType,
        isFallback: true,
      };
    }
  }

  /**
   * Assesses multiple user responses in batch for improved performance.
   * Leverages existing single assessment infrastructure with parallel processing.
   * 
   * @param {BatchAssessmentRequest} batchRequest The batch assessment request containing multiple assessments
   * @param {{ signal?: AbortSignal }} [options] Optional parameters like the AbortSignal for cancellation
   * @returns {Promise<BatchAssessmentResult>} A promise that resolves to batch assessment results with metrics
   * 
   * @example
   * ```typescript
   * const batchRequest = {
   *   userId: 123,
   *   requests: [
   *     { userId: 123, userResponse: "Bonjour", expectedAnswer: "Bonjour", responseType: "fill-in-blank", context: { ... } },
   *     { userId: 123, userResponse: "A", expectedAnswer: "A", responseType: "multiple-choice", context: { ... } }
   *   ],
   *   exerciseId: "exercise-123",
   *   lessonId: "lesson-456"
   * };
   * const result = await engine.assessBatch(batchRequest);
   * ```
   */
  public async assessBatch(batchRequest: BatchAssessmentRequest, options?: { signal?: AbortSignal }): Promise<BatchAssessmentResult> {
    const startTime = Date.now();
    const { requests, exerciseId, lessonId } = batchRequest;
    
    this.logger.info(`Starting batch assessment for ${requests.length} requests`, {
      userId: batchRequest.userId,
      exerciseId,
      lessonId
    });

    try {
      // TODO: Implement chunking for large batches to prevent memory issues (see future_implementation_considerations.md #34)
      if (requests.length > 50) {
        this.logger.warn(`Large batch size detected: ${requests.length} assessments. Consider implementing chunking.`);
      }

      // Process assessments in parallel for better performance
      // Use Promise.allSettled to isolate failures and continue processing
      const assessmentPromises = requests.map((request, index) => 
        this.assessUserResponse({
          ...request,
          context: {
            ...request.context,
            exerciseId,
            lessonId,
            batchIndex: index, // Add batch context for analytics
          },
        }, options).catch(error => {
          this.logger.error(`Assessment failed for batch item ${index}`, { error, request });
          return {
            userResponse: request.userResponse,
            score: 0,
            isCorrect: false,
            feedback: { 
              message: "This assessment could not be processed.", 
              tone: 'neutral' as const, 
              suggestions: ['Please try again later.'] 
            },
            confidence: 'low' as const,
            assessmentType: request.responseType,
            isFallback: true,
            processingTime: 0,
            metadata: { batchError: true, error: error.message }
          } as AssessmentResult;
        })
      );
      
      const results = await Promise.all(assessmentPromises);
      
      // Separate successful results from failures for accurate metrics
      const successfulResults: AssessmentResult[] = [];
      const failedResults: { request: AssessmentRequest; error: string }[] = [];
      
      results.forEach((result, index) => {
        if (result.isFallback && result.metadata?.batchError) {
          failedResults.push({
            request: requests[index],
            error: result.metadata.error || 'Unknown assessment error'
          });
        } else {
          successfulResults.push(result);
        }
      });
      
      // Calculate comprehensive batch metrics
      const overallScore = successfulResults.length > 0 
        ? Math.round(successfulResults.reduce((sum, r) => sum + r.score, 0) / successfulResults.length)
        : 0;
      
      const accuracy = successfulResults.length > 0
        ? Math.round((successfulResults.filter(r => r.isCorrect).length / successfulResults.length) * 100)
        : 0;
      
      // Generate simple batch feedback based on performance
      // TODO: Integrate with AI for personalized batch feedback (see future_implementation_considerations.md #37)
      const batchFeedback = this.generateSimpleBatchFeedback(accuracy, successfulResults.length, requests.length);
      
      const processingTime = Date.now() - startTime;
      
      this.logger.info(`Batch assessment completed`, {
        userId: batchRequest.userId,
        totalQuestions: requests.length,
        successful: successfulResults.length,
        failed: failedResults.length,
        overallScore,
        accuracy,
        processingTime
      });
      
      return {
        exerciseId: exerciseId || 'unknown',
        lessonId: lessonId || 'unknown',
        overallScore,
        accuracy,
        totalQuestions: requests.length,
        successfulAssessments: successfulResults.length,
        failedAssessments: failedResults.length,
        results: successfulResults,
        failures: failedResults,
        batchFeedback,
        processingTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      this.logger.error('Critical error in batch assessment', { error, batchRequest });
      
      // Return comprehensive fallback result
      return this.createFallbackBatchResult(batchRequest, error as Error, Date.now() - startTime);
    }
  }

  /**
   * Generates simple batch feedback based on performance metrics.
   * This is a lightweight implementation that can be enhanced with AI-powered feedback later.
   * 
   * @private
   * @param {number} accuracy The accuracy percentage (0-100)
   * @param {number} successful Number of successful assessments
   * @param {number} total Total number of assessments
   * @returns {PersonalizedFeedback} Structured feedback for the batch performance
   * 
   * @todo Integrate with AI orchestrator for personalized feedback generation (future_implementation_considerations.md #37)
   */
  private generateSimpleBatchFeedback(accuracy: number, successful: number, total: number): any {
    if (accuracy >= 90) {
      return {
        message: 'Excellent work! You mastered this exercise.',
        tone: 'congratulatory',
        suggestions: ['Try more challenging exercises', 'Move to the next lesson'],
        encouragement: 'Your French skills are really improving!',
      };
    } else if (accuracy >= 70) {
      return {
        message: `Good job! You got ${successful} out of ${total} correct.`,
        tone: 'encouraging',
        suggestions: ['Review the areas you missed', 'Practice similar exercises'],
        encouragement: 'You\'re on the right track. Keep practicing!',
      };
    } else if (accuracy >= 50) {
      return {
        message: `You're making progress! You got ${successful} out of ${total} correct.`,
        tone: 'encouraging',
        suggestions: ['Review the lesson material', 'Focus on the fundamentals', 'Don\'t hesitate to ask for help'],
        encouragement: 'Learning takes time. Stay motivated!',
      };
    } else {
      return {
        message: `Keep practicing! You got ${successful} out of ${total} correct.`,
        tone: 'encouraging',
        suggestions: ['Review the lesson material thoroughly', 'Start with simpler exercises', 'Consider reviewing previous lessons'],
        encouragement: 'Don\'t give up! Every expert was once a beginner.',
      };
    }
  }

  /**
   * Creates a comprehensive fallback result for failed batch assessments.
   * Ensures consistent error handling and user experience even when the entire batch fails.
   * 
   * @private
   * @param {BatchAssessmentRequest} batchRequest The original batch request
   * @param {Error} error The error that caused the batch failure
   * @param {number} processingTime The time spent before failure
   * @returns {BatchAssessmentResult} A structured fallback result
   */
  private createFallbackBatchResult(
    batchRequest: BatchAssessmentRequest, 
    error: Error, 
    processingTime: number
  ): BatchAssessmentResult {
    return {
      exerciseId: batchRequest.exerciseId || 'unknown',
      lessonId: batchRequest.lessonId || 'unknown',
      overallScore: 0,
      accuracy: 0,
      totalQuestions: batchRequest.requests.length,
      successfulAssessments: 0,
      failedAssessments: batchRequest.requests.length,
      results: [],
      failures: batchRequest.requests.map(req => ({
        request: req,
        error: error.message,
      })),
      batchFeedback: {
        message: 'Unable to assess this exercise right now. Please try again.',
        tone: 'neutral',
        suggestions: ['Check your internet connection', 'Try restarting the exercise'],
      },
      processingTime,
      timestamp: new Date(),
      fallback: true,
    };
  }

  /**
   * Generates a deterministic cache key for an assessment request.
   * @private
   * @param {AssessmentRequest} request The request to generate a key for.
   * @returns {string} A SHA256-based cache key.
   */
  private generateCacheKey(request: AssessmentRequest): string {
    const payload = {
      type: request.responseType,
      response: request.userResponse,
      expected: request.expectedAnswer,
      context: request.context,
    };
    const payloadString = JSON.stringify(payload);
    const hash = createHash('sha256').update(payloadString).digest('hex');
    return `assessment:${hash}`;
  }
}
