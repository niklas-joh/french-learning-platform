// server/src/services/contentGeneration/DynamicContentGenerator.ts
import type { IContentGenerator, IJobQueueService } from './interfaces.js';
import type { ContentRequest } from '../../types/Content.js';
import { AIGenerationError } from '../../utils/errors.js';
import { DB_JOB_QUEUE_CONFIG } from '../../config/database-job-queue.js';

/**
 * Database-only dynamic content generation implementation.
 * This class receives content generation requests and enqueues them 
 * directly to the database for processing by the database polling worker.
 * 
 * Replaces the previous Redis/BullMQ hybrid approach with a pure database
 * solution for corporate environment compatibility.
 *
 * @implements {IContentGenerator}
 * @version 2.0.0 - Database-only implementation
 */
export class DynamicContentGenerator implements IContentGenerator {
  /**
   * Creates a new DynamicContentGenerator instance
   * 
   * @param jobQueueService - The database job queue service with type safety
   */
  constructor(private readonly jobQueueService: IJobQueueService) {
    console.log('[DynamicContentGenerator] Database-only job processing initialized');
    console.log(`[DynamicContentGenerator] Configuration: ${DB_JOB_QUEUE_CONFIG.enabled ? 'Enabled' : 'Disabled'}`);
  }

  /**
   * Enqueues a content generation request directly to the database.
   * The database polling worker will automatically pick up and process this job.
   * 
   * Database-Only Process (Simplified):
   * 1. Validate request parameters
   * 2. Create job record in database with 'queued' status
   * 3. Database worker polls and processes job automatically
   * 4. Return database job ID for tracking
   *
   * @param request - The content generation request with proper typing
   * @returns Promise resolving to the enqueued job ID
   * @throws {AIGenerationError} If the job cannot be enqueued to database
   * 
   * @example
   * ```typescript
   * const generator = new DynamicContentGenerator(jobQueueService);
   * const { jobId } = await generator.generateContent({
   *   userId: 1,
   *   type: 'lesson',
   *   payload: { topic: 'French Grammar' }
   * });
   * ```
   */
  public async generateContent(request: ContentRequest): Promise<{ jobId: string }> {
    try {
      // Validate configuration is enabled
      if (!DB_JOB_QUEUE_CONFIG.enabled) {
        throw new AIGenerationError('Job queue is disabled in configuration');
      }

      // Create job directly in database - worker will pick it up automatically
      const jobId = await this.jobQueueService.enqueueJob(request);
      console.log(`[DynamicContentGenerator] Enqueued database job ${jobId} for user ${request.userId} (${request.type})`);

      return { jobId };
      
    } catch (error: unknown) {
      // Type-safe error handling following existing patterns
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[DynamicContentGenerator] Failed to enqueue content generation job:', {
        request: {
          userId: request.userId,
          type: request.type,
          // Don't log sensitive payload data
        },
        error: errorMessage,
      });
      
      // Preserve error chain for debugging
      throw new AIGenerationError(
        `Failed to enqueue content generation job: ${errorMessage}`,
        {
          originalError: error,
          request,
        }
      );
    }
  }
}
