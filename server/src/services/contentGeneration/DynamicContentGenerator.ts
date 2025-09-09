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
    console.log(`[DynamicContentGenerator] 🚀 DEBUGGING: generateContent called with request:`, JSON.stringify(request, null, 2));
    
    try {
      // Validate configuration is enabled
      console.log(`[DynamicContentGenerator] 🚀 DEBUGGING: Checking if DB_JOB_QUEUE_CONFIG is enabled:`, DB_JOB_QUEUE_CONFIG.enabled);
      
      if (!DB_JOB_QUEUE_CONFIG.enabled) {
        console.log(`[DynamicContentGenerator] ❌ DEBUGGING: Job queue is disabled in configuration`);
        throw new AIGenerationError('Job queue is disabled in configuration');
      }

      console.log(`[DynamicContentGenerator] 🚀 DEBUGGING: About to call jobQueueService.enqueueJob...`);
      
      // Create job directly in database - worker will pick it up automatically
      const jobId = await this.jobQueueService.enqueueJob(request);
      console.log(`[DynamicContentGenerator] ✅ DEBUGGING: Successfully enqueued database job ${jobId} for user ${request.userId} (${request.type})`);

      console.log(`[DynamicContentGenerator] 🚀 DEBUGGING: Returning jobId: ${jobId}`);
      return { jobId };
      
    } catch (error: unknown) {
      // Type-safe error handling following existing patterns
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[DynamicContentGenerator] ❌ DEBUGGING: Failed to enqueue content generation job:', {
        request: {
          userId: request.userId,
          type: request.type,
          // Don't log sensitive payload data
        },
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
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
