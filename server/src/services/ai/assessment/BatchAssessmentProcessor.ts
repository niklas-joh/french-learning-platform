import { AIAssessmentEngine } from './aiAssessmentEngine.js';
import { 
  BatchAssessmentRequest, 
  BatchAssessmentResult, 
  AssessmentRequest,
  AssessmentResult 
} from '../../../types/Assessment.js';
import { ILogger, createLogger } from '../../../utils/logger.js';

/**
 * Options for configuring batch processing behavior
 */
export interface BatchProcessingOptions {
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
 * Follows Single Responsibility Principle - ONLY handles batch processing concerns.
 * 
 * @example
 * ```typescript
 * const processor = new BatchAssessmentProcessor(assessmentEngine);
 * const result = await processor.processOptimizedBatch(batchRequest, {
 *   chunkSize: 20,
 *   enableProgressTracking: true,
 *   onProgress: (completed, total) => console.log(`${completed}/${total} completed`)
 * });
 * ```
 */
export class BatchAssessmentProcessor {
  private readonly logger: ILogger;

  /**
   * Creates an instance of BatchAssessmentProcessor.
   * @param {AIAssessmentEngine} assessmentEngine The core assessment engine for processing
   * @param {ILogger} [logger] Optional logger instance
   */
  constructor(
    private readonly assessmentEngine: AIAssessmentEngine,
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('BatchAssessmentProcessor');
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
    options: BatchProcessingOptions = {}
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