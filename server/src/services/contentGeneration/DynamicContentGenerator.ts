// server/src/services/contentGeneration/DynamicContentGenerator.ts
import { IContentGenerator, IJobQueueService } from './interfaces.js';
import { ContentRequest } from '../../types/Content.js';
import { AIGenerationError } from '../../utils/errors.js';
import { redisConnection } from '../../config/redis.js';
import { ContentGenerationJobQueue, createContentGenerationJobQueue } from './ContentGenerationJobQueue.js';

/**
 * Main implementation of dynamic content generation.
 * This class is responsible for receiving content generation requests
 * and enqueuing them for asynchronous processing by a worker.
 * 
 * Supports both Redis/BullMQ and database-only job processing modes.
 * When Redis is available, jobs are added to BullMQ queue for optimal performance.
 * When Redis is unavailable, jobs remain in database for fallback processing.
 *
 * @implements {IContentGenerator}
 */
export class DynamicContentGenerator implements IContentGenerator {
  private bullMQQueue: ContentGenerationJobQueue | null = null;

  /**
   * @param {IJobQueueService} jobQueueService - The database job queue service.
   */
  constructor(private jobQueueService: IJobQueueService) {
    // Initialize BullMQ queue using factory function (safe when Redis disabled)
    try {
      this.bullMQQueue = createContentGenerationJobQueue();
      if (this.bullMQQueue) {
        console.log('[DynamicContentGenerator] BullMQ integration enabled');
      } else {
        console.log('[DynamicContentGenerator] Redis disabled, using database-only job processing');
      }
    } catch (error) {
      console.warn('[DynamicContentGenerator] BullMQ initialization failed, falling back to database-only:', error);
      this.bullMQQueue = null;
    }
  }

  /**
   * Enqueues a content generation request and returns the job ID.
   * The actual content generation is handled asynchronously by a worker.
   * 
   * Process:
   * 1. Create job record in database (always)
   * 2. If Redis available, add job to BullMQ queue using database ID
   * 3. Return database job ID for consistent tracking
   *
   * @param {ContentRequest} request - The content generation request.
   * @returns {Promise<{ jobId: string }>} A promise that resolves with the ID of the enqueued job.
   * @throws {AIGenerationError} If the job cannot be enqueued.
   */
  public async generateContent(request: ContentRequest): Promise<{ jobId: string }> {
    try {
      // Step 1: Create job in database first (always required for persistence)
      const jobId = await this.jobQueueService.enqueueJob(request);
      console.log(`[DynamicContentGenerator] Created database job ${jobId} for user ${request.userId}`);

      // Step 2: Add to BullMQ queue if Redis is available
      if (this.bullMQQueue) {
        try {
          await this.bullMQQueue.addJob(jobId, request);
          console.log(`[DynamicContentGenerator] Added job ${jobId} to BullMQ queue`);
        } catch (bullMQError) {
          console.warn(`[DynamicContentGenerator] Failed to add job ${jobId} to BullMQ queue:`, bullMQError);
          // Don't fail the entire operation - job is still in database
        }
      }

      return { jobId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[DynamicContentGenerator] Failed to enqueue content generation job:', {
        request,
        error: errorMessage,
      });
      
      // Throw a more specific error to be handled by the controller
      throw new AIGenerationError(`Failed to enqueue content generation job.`, {
        originalError: error,
        request,
      });
    }
  }
}
