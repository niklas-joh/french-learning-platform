/**
 * @file Interface for batch assessment processing services
 * @description Defines the contract for processing multiple assessments in batch,
 * supporting both synchronous and asynchronous processing workflows with comprehensive
 * analytics and progress tracking capabilities.
 */

import { 
  ExerciseBatch, 
  BatchAssessmentResult, 
  BatchProgressStatus, 
  BatchProcessingOptions 
} from '../../../../types/Assessment.js';

/**
 * Interface for batch assessment processing services
 * 
 * This interface defines the contract for services that can process multiple
 * assessments simultaneously, supporting both immediate processing and 
 * asynchronous job queue-based workflows.
 * 
 * @interface IBatchAssessmentProcessor
 * @since Task 3.1.C.4 - Batch Assessment Processing
 * 
 * @example
 * ```typescript
 * class MyBatchProcessor implements IBatchAssessmentProcessor {
 *   async processBatch(batch: ExerciseBatch): Promise<BatchAssessmentResult> {
 *     // Process assessments immediately
 *     return await this.processImmediately(batch);
 *   }
 * 
 *   async processAsync(batch: ExerciseBatch): Promise<string> {
 *     // Queue for background processing
 *     return await this.queueForProcessing(batch);
 *   }
 * }
 * ```
 */
export interface IBatchAssessmentProcessor {
  /**
   * Processes a batch of assessments synchronously with immediate results.
   * 
   * This method processes all assessments in the batch and returns comprehensive
   * results including individual assessment outcomes, exercise-level analytics,
   * and personalized feedback. Ideal for smaller batches (5-20 questions) that
   * can be processed within acceptable response time limits.
   * 
   * @param {ExerciseBatch} batch - The exercise batch containing assessments and context
   * @param {number} [concurrency] - Optional concurrency limit (defaults to service configuration)
   * @returns {Promise<BatchAssessmentResult>} Complete batch processing results
   * 
   * @throws {Error} When batch validation fails or processing encounters unrecoverable errors
   * 
   * @example
   * ```typescript
   * const batch: ExerciseBatch = {
   *   assessmentRequests: [
   *     { userId: 123, userResponse: "Bonjour", expectedAnswer: "Bonjour", assessmentType: "fill-in-blank", context: {...} },
   *     // ... more assessments
   *   ],
   *   exerciseContext: {
   *     exerciseId: "ex-123",
   *     userId: 123,
   *     exerciseType: "vocabulary_practice"
   *   }
   * };
   * 
   * const result = await processor.processBatch(batch, 3);
   * console.log(`Processed ${result.totalQuestions} questions with ${result.accuracy}% accuracy`);
   * ```
   */
  processBatch(batch: ExerciseBatch, concurrency?: number): Promise<BatchAssessmentResult>;

  /**
   * Processes a batch of assessments asynchronously using job queue infrastructure.
   * 
   * This method immediately returns a job ID and processes the batch in the background
   * using the application's job queue system. Ideal for larger batches or when
   * immediate processing would exceed acceptable response times.
   * 
   * @param {ExerciseBatch} batch - The exercise batch containing assessments and context
   * @param {BatchProcessingOptions} [options] - Optional processing configuration
   * @returns {Promise<string>} Job ID for tracking progress and retrieving results
   * 
   * @throws {Error} When job creation fails or batch validation errors occur
   * 
   * @example
   * ```typescript
   * const batch: ExerciseBatch = {
   *   assessmentRequests: [...], // Large batch of 50+ assessments
   *   exerciseContext: { exerciseId: "ex-456", userId: 123, exerciseType: "comprehensive_review" }
   * };
   * 
   * const jobId = await processor.processAsync(batch, {
   *   concurrency: 5,
   *   priority: 'high',
   *   notifyOnCompletion: true
   * });
   * 
   * // Later, check progress
   * const status = await processor.getBatchStatus(jobId);
   * ```
   */
  processAsync(batch: ExerciseBatch, options?: BatchProcessingOptions): Promise<string>;

  /**
   * Retrieves the current status and progress of an asynchronous batch processing job.
   * 
   * This method provides real-time information about batch processing progress,
   * including completion percentage, estimated time remaining, and results when
   * processing is complete.
   * 
   * @param {string} batchId - The job ID returned from processAsync
   * @returns {Promise<BatchProgressStatus>} Current status and progress information
   * 
   * @throws {Error} When batch ID is invalid or status retrieval fails
   * 
   * @example
   * ```typescript
   * const status = await processor.getBatchStatus("batch_123456");
   * 
   * if (status.status === 'processing') {
   *   console.log(`Progress: ${status.progress}% (${status.processedItems}/${status.totalItems})`);
   *   console.log(`ETA: ${status.estimatedTimeRemaining}ms`);
   * } else if (status.status === 'completed') {
   *   console.log('Batch processing completed!');
   *   const results = status.results; // Access final results
   * }
   * ```
   */
  getBatchStatus(batchId: string): Promise<BatchProgressStatus>;

  /**
   * Cancels an in-progress asynchronous batch processing job.
   * 
   * This method attempts to cancel a running batch processing job. Jobs that
   * have already completed cannot be cancelled. Partial results may be available
   * for jobs cancelled during processing.
   * 
   * @param {string} batchId - The job ID returned from processAsync
   * @returns {Promise<boolean>} True if cancellation was successful, false otherwise
   * 
   * @example
   * ```typescript
   * const cancelled = await processor.cancelBatch("batch_123456");
   * if (cancelled) {
   *   console.log('Batch processing has been cancelled');
   * } else {
   *   console.log('Could not cancel batch (may have already completed)');
   * }
   * ```
   */
  cancelBatch(batchId: string): Promise<boolean>;
}