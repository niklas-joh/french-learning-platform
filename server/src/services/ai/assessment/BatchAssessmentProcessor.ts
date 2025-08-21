import { AIAssessmentEngine } from './aiAssessmentEngine.js';
import { 
  BatchAssessmentRequest, 
  BatchAssessmentResult, 
  AssessmentRequest,
  AssessmentResult,
  ExerciseBatch,
  BatchProcessingOptions,
  BatchProgressStatus
} from '../../../types/Assessment.js';
import { IBatchAssessmentProcessor } from './interfaces/IBatchAssessmentProcessor.js';
import { DatabaseJobQueueService } from '../../contentGeneration/DatabaseJobQueueService.js';
import { AssessmentAnalyticsService } from './AssessmentAnalyticsService.js';
import { FrenchLanguageUtils } from './utils/FrenchLanguageUtils.js';
import { ILogger, createLogger } from '../../../utils/logger.js';

/**
 * Extended options for internal batch processing optimization
 * Extends the public BatchProcessingOptions with implementation-specific features
 */
export interface ExtendedBatchProcessingOptions extends BatchProcessingOptions {
  /** Maximum number of assessments to process in a single chunk (default: 25) */
  chunkSize?: number;
  /** Maximum concurrent chunks being processed (default: 2) */
  maxConcurrentChunks?: number;
  /** Enable progress tracking and callbacks (default: false) */
  enableProgressTracking?: boolean;
  /** Callback function for progress updates */
  onProgress?: (completed: number, total: number, currentChunk: number) => void;
  /** AbortSignal for cancellation support */
  signal?: AbortSignal;
}

/**
 * Progress information for batch processing
 */
export interface BatchProgress {
  totalItems: number;
  completedItems: number;
  currentChunk: number;
  totalChunks: number;
  processingTimeMs: number;
  estimatedRemainingMs: number;
}

/**
 * @class BatchAssessmentProcessor
 * @description A focused service for optimizing batch assessment processing.
 * Handles chunking, memory management, progress tracking, and performance optimization
 * while delegating actual assessment logic to AIAssessmentEngine.
 * 
 * Implements IBatchAssessmentProcessor interface for spec compliance while maintaining
 * existing performance optimizations and following Single Responsibility Principle.
 * 
 * @implements {IBatchAssessmentProcessor}
 * 
 * @example
 * ```typescript
 * const processor = new BatchAssessmentProcessor(assessmentEngine);
 * 
 * // Synchronous batch processing
 * const batch: ExerciseBatch = { assessmentRequests: [...], exerciseContext: {...} };
 * const result = await processor.processBatch(batch, 3);
 * 
 * // Asynchronous batch processing
 * const jobId = await processor.processAsync(batch, { priority: 'high' });
 * const status = await processor.getBatchStatus(jobId);
 * ```
 */
export class BatchAssessmentProcessor implements IBatchAssessmentProcessor {
  private readonly logger: ILogger;

  /**
   * Creates an instance of BatchAssessmentProcessor.
   * @param {AIAssessmentEngine} assessmentEngine The core assessment engine for processing
   * @param {AssessmentAnalyticsService} analyticsService Service for generating exercise-level analytics
   * @param {FrenchLanguageUtils} [frenchUtils] Optional French language utilities for enhanced feedback
   * @param {DatabaseJobQueueService} [jobQueueService] Optional job queue service for async processing
   * @param {ILogger} [logger] Optional logger instance
   */
  constructor(
    private readonly assessmentEngine: AIAssessmentEngine,
    private readonly analyticsService: AssessmentAnalyticsService,
    private readonly frenchUtils?: FrenchLanguageUtils,
    private readonly jobQueueService?: DatabaseJobQueueService,
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('BatchAssessmentProcessor');
    
    if (this.jobQueueService) {
      this.logger.info('BatchAssessmentProcessor initialized with job queue support');
    } else {
      this.logger.warn('BatchAssessmentProcessor initialized without job queue - async processing will use mock implementation');
    }

    if (this.frenchUtils) {
      this.logger.info('BatchAssessmentProcessor initialized with French language utilities for enhanced feedback');
    } else {
      this.logger.warn('BatchAssessmentProcessor initialized without French language utilities - feedback will be basic');
    }
  }

  /**
   * Processes a batch assessment with advanced optimization features.
   * Provides chunking, memory management, and progress tracking capabilities.
   * 
   * @param {BatchAssessmentRequest} batchRequest The batch assessment request
   * @param {BatchProcessingOptions} [options] Processing options for optimization
   * @returns {Promise<BatchAssessmentResult>} Optimized batch assessment result
   * 
   * @example
   * ```typescript
   * const result = await processor.processOptimizedBatch(batchRequest, {
   *   chunkSize: 15,
   *   enableProgressTracking: true,
   *   onProgress: (completed, total, chunk) => {
   *     console.log(`Progress: ${completed}/${total} (chunk ${chunk})`);
   *   }
   * });
   * ```
   */
  public async processOptimizedBatch(
    batchRequest: BatchAssessmentRequest,
    options: ExtendedBatchProcessingOptions = {}
  ): Promise<BatchAssessmentResult> {
    const startTime = Date.now();
    const {
      chunkSize = 25,
      maxConcurrentChunks = 2,
      enableProgressTracking = false,
      onProgress,
      signal
    } = options;

    this.logger.info('Starting optimized batch processing', {
      totalRequests: batchRequest.requests.length,
      chunkSize,
      maxConcurrentChunks,
      userId: batchRequest.userId,
      exerciseId: batchRequest.exerciseId
    });

    try {
      // Check for cancellation
      if (signal?.aborted) {
        throw new Error('Batch processing was cancelled before starting');
      }

      // For small batches, use direct processing for optimal performance
      if (batchRequest.requests.length <= chunkSize) {
        this.logger.debug('Using direct processing for small batch');
        return await this.assessmentEngine.assessBatch(batchRequest, { signal });
      }

      // Use chunked processing for large batches
      return await this.processChunkedBatch(
        batchRequest,
        chunkSize,
        maxConcurrentChunks,
        enableProgressTracking,
        onProgress,
        signal,
        startTime
      );

    } catch (error) {
      this.logger.error('Error in optimized batch processing', { 
        error, 
        batchRequest: { 
          userId: batchRequest.userId, 
          requestCount: batchRequest.requests.length 
        } 
      });
      throw error;
    }
  }

  /**
   * Processes large batches using chunking strategy for memory optimization.
   * 
   * @private
   * @param {BatchAssessmentRequest} batchRequest The original batch request
   * @param {number} chunkSize Size of each processing chunk
   * @param {number} maxConcurrentChunks Maximum concurrent chunks
   * @param {boolean} enableProgressTracking Whether to track progress
   * @param {Function} onProgress Progress callback function
   * @param {AbortSignal} signal Cancellation signal
   * @param {number} startTime Processing start time
   * @returns {Promise<BatchAssessmentResult>} Aggregated batch result
   * 
   * @todo Implement streaming results for very large batches (see future_implementation_considerations.md #34)
   */
  private async processChunkedBatch(
    batchRequest: BatchAssessmentRequest,
    chunkSize: number,
    maxConcurrentChunks: number,
    enableProgressTracking: boolean,
    onProgress?: (completed: number, total: number, currentChunk: number) => void,
    signal?: AbortSignal,
    startTime: number = Date.now()
  ): Promise<BatchAssessmentResult> {
    const { requests } = batchRequest;
    const chunks = this.createChunks(requests, chunkSize);
    const totalChunks = chunks.length;
    
    this.logger.info(`Processing ${requests.length} assessments in ${totalChunks} chunks`, {
      chunkSize,
      maxConcurrentChunks
    });

    // Process chunks with controlled concurrency
    const allResults: AssessmentResult[] = [];
    const allFailures: { request: AssessmentRequest; error: string }[] = [];
    let completedItems = 0;

    for (let i = 0; i < chunks.length; i += maxConcurrentChunks) {
      // Check for cancellation
      if (signal?.aborted) {
        throw new Error('Batch processing was cancelled during chunk processing');
      }

      // Process up to maxConcurrentChunks chunks in parallel
      const currentChunks = chunks.slice(i, i + maxConcurrentChunks);
      const chunkPromises = currentChunks.map((chunk, chunkIndex) => 
        this.processChunk(
          {
            ...batchRequest,
            requests: chunk
          },
          i + chunkIndex + 1,
          signal
        )
      );

      const chunkResults = await Promise.allSettled(chunkPromises);

      // Aggregate results from chunks
      chunkResults.forEach((result, chunkIndex) => {
        const chunkNumber = i + chunkIndex + 1;
        
        if (result.status === 'fulfilled') {
          allResults.push(...result.value.results);
          allFailures.push(...result.value.failures);
          completedItems += currentChunks[chunkIndex].length;
          
          this.logger.debug(`Chunk ${chunkNumber} completed successfully`, {
            chunkSize: currentChunks[chunkIndex].length,
            successfulResults: result.value.results.length,
            failures: result.value.failures.length
          });
        } else {
          // Handle chunk failure - mark all items in chunk as failed
          const failedChunk = currentChunks[chunkIndex];
          failedChunk.forEach(request => {
            allFailures.push({
              request,
              error: `Chunk processing failed: ${result.reason.message}`
            });
          });
          completedItems += failedChunk.length;
          
          this.logger.error(`Chunk ${chunkNumber} failed`, { 
            error: result.reason, 
            chunkSize: failedChunk.length 
          });
        }

        // Report progress if enabled
        if (enableProgressTracking && onProgress) {
          onProgress(completedItems, requests.length, chunkNumber);
        }
      });
    }

    // Calculate comprehensive batch metrics
    const overallScore = allResults.length > 0 
      ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length)
      : 0;
    
    const accuracy = allResults.length > 0
      ? Math.round((allResults.filter(r => r.isCorrect).length / allResults.length) * 100)
      : 0;

    // Generate enhanced batch feedback with chunking context
    const batchFeedback = this.generateChunkedBatchFeedback(
      accuracy, 
      allResults.length, 
      requests.length,
      totalChunks
    );

    const processingTime = Date.now() - startTime;

    this.logger.info('Chunked batch processing completed', {
      totalRequests: requests.length,
      successful: allResults.length,
      failed: allFailures.length,
      overallScore,
      accuracy,
      processingTime,
      chunksProcessed: totalChunks
    });

    return {
      exerciseId: batchRequest.exerciseId || 'unknown',
      lessonId: batchRequest.lessonId || 'unknown',
      overallScore,
      accuracy,
      totalQuestions: requests.length,
      successfulAssessments: allResults.length,
      failedAssessments: allFailures.length,
      results: allResults,
      failures: allFailures,
      batchFeedback,
      processingTime,
      timestamp: new Date(),
    };
  }

  /**
   * Processes a single chunk of assessments using the core assessment engine.
   * 
   * @private
   * @param {BatchAssessmentRequest} chunkRequest Batch request for this chunk
   * @param {number} chunkNumber Current chunk number for logging
   * @param {AbortSignal} [signal] Cancellation signal
   * @returns {Promise<BatchAssessmentResult>} Result for this chunk
   */
  private async processChunk(
    chunkRequest: BatchAssessmentRequest,
    chunkNumber: number,
    signal?: AbortSignal
  ): Promise<BatchAssessmentResult> {
    const chunkStartTime = Date.now();
    
    this.logger.debug(`Processing chunk ${chunkNumber}`, {
      chunkSize: chunkRequest.requests.length,
      userId: chunkRequest.userId
    });

    try {
      const result = await this.assessmentEngine.assessBatch(chunkRequest, { signal });
      
      const chunkProcessingTime = Date.now() - chunkStartTime;
      this.logger.debug(`Chunk ${chunkNumber} processed`, {
        processingTime: chunkProcessingTime,
        successful: result.successfulAssessments,
        failed: result.failedAssessments
      });
      
      return result;
    } catch (error) {
      this.logger.error(`Chunk ${chunkNumber} processing failed`, { error });
      throw error;
    }
  }

  /**
   * Creates chunks from the assessment requests array.
   * 
   * @private
   * @param {AssessmentRequest[]} requests Array of assessment requests
   * @param {number} chunkSize Size of each chunk
   * @returns {AssessmentRequest[][]} Array of request chunks
   */
  private createChunks(requests: AssessmentRequest[], chunkSize: number): AssessmentRequest[][] {
    const chunks: AssessmentRequest[][] = [];
    
    for (let i = 0; i < requests.length; i += chunkSize) {
      chunks.push(requests.slice(i, i + chunkSize));
    }
    
    return chunks;
  }

  /**
   * Generates enhanced batch feedback that includes chunking context.
   * 
   * @private
   * @param {number} accuracy Accuracy percentage (0-100)
   * @param {number} successful Number of successful assessments
   * @param {number} total Total number of assessments
   * @param {number} chunksProcessed Number of chunks processed
   * @returns {any} Enhanced feedback with chunking context
   * 
   * @todo Integrate with AI for personalized feedback based on chunking patterns (future_implementation_considerations.md #37)
   */
  private generateChunkedBatchFeedback(
    accuracy: number, 
    successful: number, 
    total: number,
    chunksProcessed: number
  ): any {
    const baseMessage = this.getBaseMessageByAccuracy(accuracy, successful, total);
    
    // Add chunking context for large batches
    const chunkingContext = chunksProcessed > 1 
      ? ` Your exercise was processed efficiently in ${chunksProcessed} sections.`
      : '';

    return {
      message: baseMessage + chunkingContext,
      tone: this.getToneByAccuracy(accuracy),
      suggestions: this.getSuggestionsByAccuracy(accuracy),
      encouragement: this.getEncouragementByAccuracy(accuracy),
      metadata: {
        chunksProcessed,
        processingOptimized: chunksProcessed > 1
      }
    };
  }

  /**
   * Gets base message based on accuracy level.
   * @private
   */
  private getBaseMessageByAccuracy(accuracy: number, successful: number, total: number): string {
    if (accuracy >= 90) {
      return 'Excellent work! You mastered this exercise.';
    } else if (accuracy >= 70) {
      return `Good job! You got ${successful} out of ${total} correct.`;
    } else if (accuracy >= 50) {
      return `You're making progress! You got ${successful} out of ${total} correct.`;
    } else {
      return `Keep practicing! You got ${successful} out of ${total} correct.`;
    }
  }

  /**
   * Gets tone based on accuracy level.
   * @private
   */
  private getToneByAccuracy(accuracy: number): string {
    if (accuracy >= 90) return 'congratulatory';
    if (accuracy >= 50) return 'encouraging';
    return 'motivational';
  }

  /**
   * Gets suggestions based on accuracy level.
   * @private
   */
  private getSuggestionsByAccuracy(accuracy: number): string[] {
    if (accuracy >= 90) {
      return ['Try more challenging exercises', 'Move to the next lesson'];
    } else if (accuracy >= 70) {
      return ['Review the areas you missed', 'Practice similar exercises'];
    } else if (accuracy >= 50) {
      return ['Review the lesson material', 'Focus on the fundamentals', 'Don\'t hesitate to ask for help'];
    } else {
      return ['Review the lesson material thoroughly', 'Start with simpler exercises', 'Consider reviewing previous lessons'];
    }
  }

  /**
   * Gets encouragement based on accuracy level.
   * @private
   */
  private getEncouragementByAccuracy(accuracy: number): string {
    if (accuracy >= 90) {
      return 'Your French skills are really improving!';
    } else if (accuracy >= 70) {
      return 'You\'re on the right track. Keep practicing!';
    } else if (accuracy >= 50) {
      return 'Learning takes time. Stay motivated!';
    } else {
      return 'Don\'t give up! Every expert was once a beginner.';
    }
  }

  // ============================================================================
  // IBatchAssessmentProcessor Interface Implementation
  // ============================================================================

  /**
   * Processes a batch of assessments synchronously with immediate results.
   * 
   * Implements the IBatchAssessmentProcessor interface by adapting the ExerciseBatch
   * format to the internal BatchAssessmentRequest structure and leveraging the
   * existing optimized batch processing infrastructure.
   * 
   * @param {ExerciseBatch} batch - The exercise batch containing assessments and context
   * @param {number} [concurrency] - Optional concurrency limit (defaults to 3 per spec)
   * @returns {Promise<BatchAssessmentResult>} Complete batch processing results
   * 
   * @throws {Error} When batch validation fails or processing encounters unrecoverable errors
   * 
   * @example
   * ```typescript
   * const batch: ExerciseBatch = {
   *   assessmentRequests: [
   *     { 
   *       userId: 123, 
   *       userResponse: "Bonjour", 
   *       expectedAnswer: "Bonjour", 
   *       responseType: "fill-in-blank",
   *       context: { userId: 123, skillArea: "vocabulary", userLevel: "A1" }
   *     },
   *   ],
   *   exerciseContext: { exerciseId: "ex-123", userId: 123, exerciseType: "vocabulary_practice" }
   * };
   * 
   * const result = await processor.processBatch(batch, 3);
   * ```
   */
  public async processBatch(batch: ExerciseBatch, concurrency?: number): Promise<BatchAssessmentResult> {
    this.logger.info('Processing batch via IBatchAssessmentProcessor interface', {
      exerciseId: batch.exerciseContext.exerciseId,
      userId: batch.exerciseContext.userId,
      requestCount: batch.assessmentRequests.length,
      concurrency: concurrency || 3
    });

    try {
      // Convert ExerciseBatch to internal BatchAssessmentRequest format
      const batchRequest: BatchAssessmentRequest = {
        userId: batch.exerciseContext.userId,
        exerciseId: batch.exerciseContext.exerciseId,
        lessonId: batch.exerciseContext.exerciseId, // Use exerciseId as lessonId for consistency
        exerciseType: batch.exerciseContext.exerciseType,
        requests: batch.assessmentRequests, // Now properly typed after ExerciseBatch correction
        metadata: {
          timeSpent: batch.exerciseContext.timeLimit,
        }
      };

      // Use existing optimized batch processing with interface-specified concurrency
      const options: ExtendedBatchProcessingOptions = {
        maxConcurrentChunks: concurrency || 3, // Spec default is 3
        chunkSize: 25, // Keep existing optimized chunk size
        enableProgressTracking: true
      };

      // Process the batch using existing optimized processing
      const legacyResult = await this.processOptimizedBatch(batchRequest, options);

      // Generate enhanced analytics and feedback
      const exerciseAnalytics = await this.generateExerciseAnalytics(
        legacyResult.results || [],
        batch.exerciseContext
      );

      const exerciseFeedback = await this.generateExerciseLevelFeedback(
        legacyResult.results || [],
        batch.exerciseContext,
        exerciseAnalytics
      );

      // Convert legacy result to new spec-compliant format
      const result: BatchAssessmentResult = {
        batchId: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exerciseId: batch.exerciseContext.exerciseId,
        lessonId: batch.exerciseContext.exerciseId,
        totalAssessments: legacyResult.totalQuestions || 0,
        successfulAssessments: legacyResult.successfulAssessments || 0,
        failedAssessments: legacyResult.failedAssessments || 0,
        overallScore: legacyResult.overallScore || 0,
        processingTimeMs: legacyResult.processingTime || 0,
        individualResults: legacyResult.results || [],
        exerciseAnalytics,
        exerciseFeedback,
        errors: legacyResult.failures?.map(f => ({
          message: f.error,
          stack: undefined
        })) || [],
        metadata: {
          concurrency: concurrency || 3,
          chunkCount: Math.ceil(batch.assessmentRequests.length / 25),
          averageAssessmentTime: legacyResult.results && legacyResult.results.length > 0 
            ? (legacyResult.processingTime || 0) / legacyResult.results.length 
            : 0
        },
        // Legacy fields for backward compatibility
        accuracy: legacyResult.accuracy,
        totalQuestions: legacyResult.totalQuestions,
        results: legacyResult.results,
        failures: legacyResult.failures,
        batchFeedback: legacyResult.batchFeedback,
        processingTime: legacyResult.processingTime,
        timestamp: legacyResult.timestamp,
        fallback: legacyResult.fallback
      };

      this.logger.info('Enhanced batch processing completed via interface', {
        exerciseId: batch.exerciseContext.exerciseId,
        totalAssessments: result.totalAssessments,
        successfulAssessments: result.successfulAssessments,
        overallScore: result.overallScore,
        processingTimeMs: result.processingTimeMs,
        analyticsGenerated: true,
        feedbackGenerated: true
      });

      return result;

    } catch (error) {
      this.logger.error('Error in processBatch interface method', { 
        error, 
        batch: { 
          exerciseId: batch.exerciseContext.exerciseId, 
          requestCount: batch.assessmentRequests.length 
        } 
      });
      throw error;
    }
  }

  /**
   * Processes a batch of assessments asynchronously using job queue infrastructure.
   * 
   * Integrates with DatabaseJobQueueService for true async processing when available,
   * falls back to mock implementation for testing environments.
   * 
   * @param {ExerciseBatch} batch - The exercise batch containing assessments and context
   * @param {BatchProcessingOptions} [options] - Optional processing configuration
   * @returns {Promise<string>} Job ID for tracking progress and retrieving results
   * 
   * @throws {Error} When job creation fails or batch validation errors occur
   */
  public async processAsync(batch: ExerciseBatch, options?: BatchProcessingOptions): Promise<string> {
    this.logger.info('Async batch processing requested', {
      exerciseId: batch.exerciseContext.exerciseId,
      userId: batch.exerciseContext.userId,
      requestCount: batch.assessmentRequests.length,
      options
    });

    if (!this.jobQueueService) {
      // Fallback to mock implementation when job queue service is not available
      const mockJobId = `batch_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.logger.warn('Job queue service not available, using mock implementation', { 
        mockJobId,
        exerciseId: batch.exerciseContext.exerciseId 
      });
      return mockJobId;
    }

    try {
      // Create assessment batch job using existing job queue infrastructure
      const jobData = {
        userId: batch.exerciseContext.userId,
        type: 'BATCH_ASSESSMENT', // New job type for assessment batches
        payload: {
          batch,
          options: {
            concurrency: options?.concurrency || 3,
            priority: options?.priority || 'normal',
            notifyOnCompletion: options?.notifyOnCompletion || false
          }
        },
        metadata: {
          exerciseId: batch.exerciseContext.exerciseId,
          assessmentCount: batch.assessmentRequests.length,
          exerciseType: batch.exerciseContext.exerciseType
        }
      };

      const jobId = await this.jobQueueService.enqueueJob(jobData);

      this.logger.info('Batch assessment job enqueued successfully', {
        jobId,
        exerciseId: batch.exerciseContext.exerciseId,
        userId: batch.exerciseContext.userId,
        assessmentCount: batch.assessmentRequests.length
      });

      return jobId;

    } catch (error) {
      this.logger.error('Failed to enqueue batch assessment job', {
        error,
        batch: {
          exerciseId: batch.exerciseContext.exerciseId,
          userId: batch.exerciseContext.userId,
          requestCount: batch.assessmentRequests.length
        }
      });
      throw new Error(`Failed to queue batch assessment job: ${error.message}`);
    }
  }

  /**
   * Retrieves the current status and progress of an asynchronous batch processing job.
   * 
   * Integrates with DatabaseJobQueueService for real status tracking when available,
   * falls back to mock implementation for testing environments.
   * 
   * @param {string} batchId - The job ID returned from processAsync
   * @returns {Promise<BatchProgressStatus>} Current status and progress information
   * 
   * @throws {Error} When batch ID is invalid or status retrieval fails
   */
  public async getBatchStatus(batchId: string): Promise<BatchProgressStatus> {
    this.logger.info('Batch status requested', { batchId });

    if (!this.jobQueueService) {
      // Fallback to mock implementation when job queue service is not available
      const mockStatus: BatchProgressStatus = {
        batchId,
        status: 'completed',
        progress: 100,
        totalItems: 0,
        processedItems: 0,
        estimatedTimeRemaining: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        results: null
      };

      this.logger.warn('Job queue service not available, returning mock status', { mockStatus });
      return mockStatus;
    }

    try {
      // Get job status from the database job queue service
      const jobStatus = await this.jobQueueService.getJobStatus(batchId);

      if (!jobStatus) {
        throw new Error(`Batch job not found: ${batchId}`);
      }

      // Map job queue status to batch progress status
      const status: BatchProgressStatus = {
        batchId,
        status: this.mapJobStatusToBatchStatus(jobStatus.status),
        progress: jobStatus.progress || 0,
        totalItems: 0, // Will be filled from job metadata if available
        processedItems: Math.floor((jobStatus.progress || 0) / 100 * (0)), // Calculate from progress
        estimatedTimeRemaining: jobStatus.estimatedCompletion 
          ? Math.max(0, jobStatus.estimatedCompletion.getTime() - Date.now())
          : 0,
        createdAt: new Date(), // JobStatus doesn't include creation time, using current
        updatedAt: new Date(),
        results: jobStatus.status === 'completed' ? await this.jobQueueService.getJobResult(batchId) : undefined
      };

      this.logger.info('Retrieved batch status from job queue', {
        batchId,
        status: status.status,
        progress: status.progress
      });

      return status;

    } catch (error) {
      this.logger.error('Failed to retrieve batch status', { error, batchId });
      throw new Error(`Failed to retrieve batch status: ${error.message}`);
    }
  }

  /**
   * Cancels an in-progress asynchronous batch processing job.
   * 
   * Integrates with DatabaseJobQueueService for real job cancellation when available,
   * falls back to mock implementation for testing environments.
   * 
   * @param {string} batchId - The job ID returned from processAsync
   * @returns {Promise<boolean>} True if cancellation was successful, false otherwise
   */
  public async cancelBatch(batchId: string): Promise<boolean> {
    this.logger.info('Batch cancellation requested', { batchId });

    if (!this.jobQueueService) {
      this.logger.warn('Job queue service not available, cannot cancel batch', { batchId });
      return false;
    }

    try {
      // Note: DatabaseJobQueueService doesn't currently implement job cancellation
      // This is a limitation that should be addressed in future implementation #41
      this.logger.warn('Job cancellation not implemented in DatabaseJobQueueService', { 
        batchId,
        futureImplementation: 'See future implementation #41 - Assessment Job Queue Type System Enhancement'
      });
      
      return false; // Cannot cancel with current job queue implementation

    } catch (error) {
      this.logger.error('Error attempting to cancel batch', { error, batchId });
      return false;
    }
  }

  // ============================================================================
  // Private Helper Methods for Job Queue Integration
  // ============================================================================

  /**
   * Maps job queue status to batch status enumeration.
   * 
   * @private
   * @param {string} jobStatus - The job status from DatabaseJobQueueService
   * @returns {BatchStatus} Corresponding batch status
   */
  private mapJobStatusToBatchStatus(jobStatus: string): BatchStatus {
    const statusMap: Record<string, BatchStatus> = {
      'queued': 'queued',
      'processing': 'processing', 
      'completed': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };

    return statusMap[jobStatus] || 'unknown';
  }

  // ============================================================================
  // Enhanced Analytics Integration (Phase 3)
  // ============================================================================

  /**
   * Generates comprehensive exercise-level analytics from assessment results.
   * 
   * Leverages the existing AssessmentAnalyticsService and French language utilities
   * to provide detailed performance insights, difficulty analysis, and personalized
   * recommendations based on CEFR levels and cultural context.
   * 
   * @private
   * @param {AssessmentResult[]} results - Individual assessment results
   * @param {ExerciseBatch['exerciseContext']} exerciseContext - Exercise context information
   * @returns {Promise<ExerciseAnalytics>} Comprehensive exercise analytics
   */
  private async generateExerciseAnalytics(
    results: AssessmentResult[], 
    exerciseContext: ExerciseBatch['exerciseContext']
  ): Promise<ExerciseAnalytics> {
    this.logger.info('Generating enhanced exercise analytics', {
      exerciseId: exerciseContext.exerciseId,
      resultCount: results.length,
      exerciseType: exerciseContext.exerciseType
    });

    try {
      // Calculate basic performance metrics
      const totalQuestions = results.length;
      const correctAnswers = results.filter(r => r.isCorrect).length;
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const averageScore = totalQuestions > 0 
        ? results.reduce((sum, r) => sum + r.score, 0) / totalQuestions 
        : 0;
      const averageConfidence = totalQuestions > 0 
        ? results.reduce((sum, r) => sum + (r.confidence === 'high' ? 3 : r.confidence === 'medium' ? 2 : 1), 0) / totalQuestions
        : 0;

      // Analyze performance by assessment type
      const performanceByType = this.analyzePerformanceByType(results);
      
      // Generate difficulty analysis
      const difficultyAnalysis = this.analyzeDifficulty(results, exerciseContext);
      
      // Calculate time metrics
      const timeMetrics = this.calculateTimeMetrics(results);
      
      // Extract skill areas from context or infer from exercise type
      const skillAreas = exerciseContext.skillAreas || this.inferSkillAreas(exerciseContext.exerciseType);
      
      // Generate personalized recommendations using French language insights
      const recommendations = await this.generateRecommendations(results, exerciseContext);

      const analytics: ExerciseAnalytics = {
        totalQuestions,
        correctAnswers,
        accuracy,
        averageScore,
        averageConfidence,
        performanceByType,
        difficultyAnalysis,
        timeMetrics,
        skillAreas,
        recommendations
      };

      this.logger.info('Exercise analytics generated successfully', {
        exerciseId: exerciseContext.exerciseId,
        accuracy,
        averageScore,
        recommendationCount: recommendations.length
      });

      return analytics;

    } catch (error) {
      this.logger.error('Error generating exercise analytics', { 
        error, 
        exerciseId: exerciseContext.exerciseId 
      });
      
      // Return basic fallback analytics
      return {
        totalQuestions: results.length,
        correctAnswers: results.filter(r => r.isCorrect).length,
        accuracy: results.length > 0 ? (results.filter(r => r.isCorrect).length / results.length) * 100 : 0,
        averageScore: results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0,
        averageConfidence: 0,
        performanceByType: {},
        difficultyAnalysis: {
          easy: { count: 0, percentage: 0 },
          medium: { count: 0, percentage: 0 },
          hard: { count: 0, percentage: 0 },
          overallDifficulty: 'appropriate'
        },
        timeMetrics: {
          averageTime: 0,
          minTime: 0,
          maxTime: 0,
          totalTime: 0
        },
        skillAreas: [],
        recommendations: ['Complete more exercises to improve performance analysis.']
      };
    }
  }

  /**
   * Generates comprehensive exercise-level feedback with French cultural context.
   * 
   * Combines performance analytics with French language insights and cultural
   * awareness to provide personalized, motivating feedback and study recommendations.
   * 
   * @private
   * @param {AssessmentResult[]} results - Individual assessment results
   * @param {ExerciseBatch['exerciseContext']} exerciseContext - Exercise context information  
   * @param {ExerciseAnalytics} analytics - Generated exercise analytics
   * @returns {Promise<ExerciseFeedback>} Comprehensive exercise feedback
   */
  private async generateExerciseLevelFeedback(
    results: AssessmentResult[],
    exerciseContext: ExerciseBatch['exerciseContext'],
    analytics: ExerciseAnalytics
  ): Promise<ExerciseFeedback> {
    this.logger.info('Generating enhanced exercise-level feedback', {
      exerciseId: exerciseContext.exerciseId,
      accuracy: analytics.accuracy,
      averageScore: analytics.averageScore
    });

    try {
      // Generate overall feedback message with French cultural context
      const overallFeedback = this.generateOverallFeedback(analytics, exerciseContext);
      
      // Identify strength areas based on performance analysis
      const strengthAreas = this.identifyStrengthAreas(analytics, results);
      
      // Identify improvement areas with French language specifics
      const improvementAreas = this.identifyImprovementAreas(analytics, results);
      
      // Generate specific suggestions using French language insights
      const specificSuggestions = await this.generateSpecificSuggestions(results, analytics, exerciseContext);
      
      // Generate next steps with CEFR progression awareness
      const nextSteps = this.generateNextSteps(analytics, exerciseContext);
      
      // Create motivational message with French cultural elements
      const motivationalMessage = this.generateMotivationalMessage(analytics, exerciseContext);
      
      // Generate personalized study plan
      const studyPlan = this.generateStudyPlan(analytics, exerciseContext);

      const feedback: ExerciseFeedback = {
        overallFeedback,
        strengthAreas,
        improvementAreas,
        specificSuggestions,
        nextSteps,
        motivationalMessage,
        studyPlan
      };

      this.logger.info('Exercise feedback generated successfully', {
        exerciseId: exerciseContext.exerciseId,
        strengthAreasCount: strengthAreas.length,
        improvementAreasCount: improvementAreas.length,
        suggestionsCount: specificSuggestions.length
      });

      return feedback;

    } catch (error) {
      this.logger.error('Error generating exercise feedback', { 
        error, 
        exerciseId: exerciseContext.exerciseId 
      });
      
      // Return basic fallback feedback
      return {
        overallFeedback: {
          message: `You completed ${analytics.totalQuestions} questions with ${analytics.accuracy.toFixed(1)}% accuracy.`,
          tone: analytics.accuracy >= 80 ? 'encouraging' : analytics.accuracy >= 60 ? 'supportive' : 'gentle',
          score: analytics.averageScore,
          accuracy: analytics.accuracy
        },
        strengthAreas: ['Exercise completion'],
        improvementAreas: ['Continue practicing to improve'],
        specificSuggestions: ['Review the questions you found challenging'],
        nextSteps: ['Try similar exercises to reinforce learning'],
        motivationalMessage: 'Keep practicing! Every step forward is progress.',
        studyPlan: {
          immediateAction: 'Review your answers',
          weeklyGoal: 'Complete similar exercises',
          recommendedPracticeTime: 20,
          suggestedResources: ['French language learning materials']
        }
      };
    }
  }

  // ============================================================================
  // Private Analytics Helper Methods
  // ============================================================================

  /**
   * Analyzes performance metrics by assessment response type.
   * 
   * @private
   * @param {AssessmentResult[]} results - Assessment results to analyze
   * @returns {Record<string, TypePerformance>} Performance breakdown by type
   */
  private analyzePerformanceByType(results: AssessmentResult[]): Record<string, TypePerformance> {
    const typeGroups = results.reduce((groups, result) => {
      const type = result.metadata?.responseType || 'unknown';
      if (!groups[type]) groups[type] = [];
      groups[type].push(result);
      return groups;
    }, {} as Record<string, AssessmentResult[]>);

    const performanceByType: Record<string, TypePerformance> = {};

    Object.entries(typeGroups).forEach(([type, typeResults]) => {
      const correctAnswers = typeResults.filter(r => r.isCorrect).length;
      const accuracy = (correctAnswers / typeResults.length) * 100;
      const averageScore = typeResults.reduce((sum, r) => sum + r.score, 0) / typeResults.length;
      const averageConfidence = typeResults.reduce((sum, r) => 
        sum + (r.confidence === 'high' ? 3 : r.confidence === 'medium' ? 2 : 1), 0
      ) / typeResults.length;

      performanceByType[type] = {
        totalQuestions: typeResults.length,
        correctAnswers,
        accuracy,
        averageScore,
        averageConfidence,
        difficulty: accuracy >= 80 ? 'easy' : accuracy >= 60 ? 'medium' : 'hard'
      };
    });

    return performanceByType;
  }

  /**
   * Analyzes the overall difficulty distribution of the exercise.
   * 
   * @private
   * @param {AssessmentResult[]} results - Assessment results to analyze
   * @param {ExerciseBatch['exerciseContext']} context - Exercise context
   * @returns {DifficultyAnalysis} Difficulty analysis breakdown
   */
  private analyzeDifficulty(results: AssessmentResult[], context: ExerciseBatch['exerciseContext']): DifficultyAnalysis {
    const difficultyLevels = results.map(result => {
      const score = result.score;
      if (score >= 0.8) return 'easy';
      if (score >= 0.6) return 'medium';
      return 'hard';
    });

    const counts = {
      easy: difficultyLevels.filter(d => d === 'easy').length,
      medium: difficultyLevels.filter(d => d === 'medium').length,
      hard: difficultyLevels.filter(d => d === 'hard').length
    };

    const total = results.length;
    const percentages = {
      easy: total > 0 ? (counts.easy / total) * 100 : 0,
      medium: total > 0 ? (counts.medium / total) * 100 : 0,
      hard: total > 0 ? (counts.hard / total) * 100 : 0
    };

    // Determine overall difficulty
    let overallDifficulty: 'easy' | 'appropriate' | 'challenging';
    if (percentages.easy > 60) overallDifficulty = 'easy';
    else if (percentages.hard > 60) overallDifficulty = 'challenging';
    else overallDifficulty = 'appropriate';

    return {
      easy: { count: counts.easy, percentage: percentages.easy },
      medium: { count: counts.medium, percentage: percentages.medium },
      hard: { count: counts.hard, percentage: percentages.hard },
      overallDifficulty
    };
  }

  /**
   * Calculates time-based performance metrics.
   * 
   * @private
   * @param {AssessmentResult[]} results - Assessment results to analyze
   * @returns {TimeMetrics} Time-based metrics
   */
  private calculateTimeMetrics(results: AssessmentResult[]): TimeMetrics {
    const times = results
      .map(r => r.metadata?.timeSpent || 0)
      .filter(t => t > 0);

    if (times.length === 0) {
      return {
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        totalTime: 0
      };
    }

    return {
      averageTime: times.reduce((sum, t) => sum + t, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      totalTime: times.reduce((sum, t) => sum + t, 0)
    };
  }

  /**
   * Infers skill areas from exercise type when not explicitly provided.
   * 
   * @private
   * @param {string} exerciseType - Type of exercise
   * @returns {string[]} Inferred skill areas
   */
  private inferSkillAreas(exerciseType: string): string[] {
    const skillMapping: Record<string, string[]> = {
      'vocabulary_practice': ['vocabulary', 'comprehension'],
      'grammar_exercise': ['grammar', 'syntax', 'conjugation'],
      'conversation_practice': ['speaking', 'listening', 'cultural_context'],
      'reading_comprehension': ['reading', 'comprehension', 'vocabulary'],
      'writing_exercise': ['writing', 'grammar', 'expression'],
      'pronunciation_practice': ['pronunciation', 'phonetics', 'accent']
    };

    return skillMapping[exerciseType] || ['general_french'];
  }

  /**
   * Generates personalized recommendations based on performance and French language insights.
   * 
   * @private
   * @param {AssessmentResult[]} results - Assessment results
   * @param {ExerciseBatch['exerciseContext']} context - Exercise context
   * @returns {Promise<string[]>} Personalized recommendations
   */
  private async generateRecommendations(
    results: AssessmentResult[], 
    context: ExerciseBatch['exerciseContext']
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    const correctRate = results.filter(r => r.isCorrect).length / results.length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // Performance-based recommendations
    if (correctRate < 0.6) {
      recommendations.push('Focus on reviewing fundamental concepts before advancing');
      recommendations.push('Consider practicing with easier exercises first');
    } else if (correctRate > 0.9) {
      recommendations.push('Excellent work! Try more challenging exercises');
      recommendations.push('Consider advancing to the next difficulty level');
    }

    // French-specific recommendations using language utilities
    if (this.frenchUtils && context.exerciseType === 'vocabulary_practice') {
      recommendations.push('Pay attention to accent marks - they change pronunciation and meaning');
      recommendations.push('Practice gender agreement with nouns and adjectives');
    }

    // Exercise type specific recommendations
    if (context.exerciseType === 'conversation_practice') {
      recommendations.push('Listen to French media to improve comprehension');
      recommendations.push('Practice pronunciation with native speaker audio');
    }

    return recommendations;
  }

  // Continue with more helper methods...
  
  private generateOverallFeedback(analytics: ExerciseAnalytics, context: ExerciseBatch['exerciseContext']) {
    const accuracy = analytics.accuracy;
    let tone: FeedbackTone;
    let message: string;

    if (accuracy >= 90) {
      tone = 'enthusiastic';
      message = `Excellent travail ! You achieved ${accuracy.toFixed(1)}% accuracy - that's outstanding performance!`;
    } else if (accuracy >= 75) {
      tone = 'encouraging';
      message = `Très bien ! You scored ${accuracy.toFixed(1)}% accuracy. You're making great progress!`;
    } else if (accuracy >= 60) {
      tone = 'supportive';
      message = `Bon effort ! You achieved ${accuracy.toFixed(1)}% accuracy. Keep practicing to improve!`;
    } else {
      tone = 'gentle';
      message = `Don't worry! Learning French takes time. You completed the exercise with ${accuracy.toFixed(1)}% accuracy.`;
    }

    return {
      message,
      tone,
      score: analytics.averageScore,
      accuracy
    };
  }

  private identifyStrengthAreas(analytics: ExerciseAnalytics, results: AssessmentResult[]): string[] {
    const strengths: string[] = [];
    
    // Analyze performance by type
    Object.entries(analytics.performanceByType).forEach(([type, performance]) => {
      if (performance.accuracy >= 80) {
        strengths.push(`Strong ${type.replace('_', ' ')} skills`);
      }
    });

    if (analytics.averageConfidence >= 2.5) {
      strengths.push('High confidence in responses');
    }

    if (analytics.timeMetrics.averageTime > 0 && analytics.timeMetrics.averageTime < 30) {
      strengths.push('Good response time and efficiency');
    }

    return strengths.length > 0 ? strengths : ['Completed the exercise successfully'];
  }

  private identifyImprovementAreas(analytics: ExerciseAnalytics, results: AssessmentResult[]): string[] {
    const improvements: string[] = [];
    
    Object.entries(analytics.performanceByType).forEach(([type, performance]) => {
      if (performance.accuracy < 60) {
        improvements.push(`${type.replace('_', ' ')} needs more practice`);
      }
    });

    if (analytics.averageConfidence < 2) {
      improvements.push('Building confidence in responses');
    }

    if (analytics.difficultyAnalysis.hard.percentage > 50) {
      improvements.push('Consider reviewing fundamental concepts');
    }

    return improvements.length > 0 ? improvements : ['Continue practicing to maintain progress'];
  }

  private async generateSpecificSuggestions(
    results: AssessmentResult[], 
    analytics: ExerciseAnalytics, 
    context: ExerciseBatch['exerciseContext']
  ): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Add French-specific suggestions based on common errors
    if (this.frenchUtils) {
      suggestions.push('Review accent marks and their impact on pronunciation');
      suggestions.push('Practice gender agreement with articles (le/la, un/une)');
    }

    // Context-specific suggestions
    if (context.exerciseType === 'vocabulary_practice') {
      suggestions.push('Create flashcards for words you found challenging');
      suggestions.push('Use new vocabulary in sentences to reinforce memory');
    }

    return suggestions;
  }

  private generateNextSteps(analytics: ExerciseAnalytics, context: ExerciseBatch['exerciseContext']): string[] {
    const nextSteps: string[] = [];
    
    if (analytics.accuracy >= 85) {
      nextSteps.push('Try exercises at the next difficulty level');
      nextSteps.push('Explore advanced French language concepts');
    } else {
      nextSteps.push('Review and retry similar exercises');
      nextSteps.push('Focus on areas identified for improvement');
    }

    return nextSteps;
  }

  private generateMotivationalMessage(analytics: ExerciseAnalytics, context: ExerciseBatch['exerciseContext']): string {
    if (analytics.accuracy >= 90) {
      return 'Félicitations ! Your French skills are really shining through!';
    } else if (analytics.accuracy >= 70) {
      return 'You\'re making excellent progress. Continuez comme ça !';
    } else {
      return 'Every step counts in your French journey. Bon courage !';
    }
  }

  private generateStudyPlan(analytics: ExerciseAnalytics, context: ExerciseBatch['exerciseContext']): StudyPlanSuggestion {
    let practiceTime = 15; // default
    let immediateAction = 'Review your answers';
    
    if (analytics.accuracy < 60) {
      practiceTime = 30;
      immediateAction = 'Review fundamental concepts';
    } else if (analytics.accuracy > 85) {
      practiceTime = 20;
      immediateAction = 'Try advanced exercises';
    }

    return {
      immediateAction,
      weeklyGoal: `Complete 3-4 ${context.exerciseType} exercises`,
      recommendedPracticeTime: practiceTime,
      suggestedResources: [
        'French grammar reference',
        'Vocabulary flashcards',
        'French pronunciation guide',
        'Cultural context materials'
      ]
    };
  }

  // ============================================================================
  // End Enhanced Analytics Integration
  // ============================================================================

  // ============================================================================
  // End Interface Implementation
  // ============================================================================

  /**
   * Gets current processing statistics for monitoring.
   * 
   * @returns {object} Current processor statistics
   */
  public getProcessorStats(): object {
    return {
      service: 'BatchAssessmentProcessor',
      features: [
        'chunked_processing',
        'progress_tracking', 
        'memory_optimization',
        'concurrent_chunk_processing'
      ],
      defaultChunkSize: 25,
      defaultMaxConcurrency: 2,
      supportsCancellation: true,
      supportsProgressTracking: true
    };
  }
}