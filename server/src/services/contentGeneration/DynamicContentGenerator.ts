// server/src/services/contentGeneration/DynamicContentGenerator.ts
import { IContentGenerator, IJobQueueService } from './interfaces';
import { ContentRequest } from '../../types/Content';
import { AIGenerationError } from '../../utils/errors';

/**
 * Main implementation of dynamic content generation.
 * This class is responsible for receiving content generation requests
 * and enqueuing them for asynchronous processing by a worker.
 *
 * @implements {IContentGenerator}
 */
export class DynamicContentGenerator implements IContentGenerator {
  /**
   * @param {IJobQueueService} jobQueueService - The service for enqueuing jobs.
   */
  constructor(private jobQueueService: IJobQueueService) {}

  /**
   * Enqueues a content generation request and returns the job ID.
   * The actual content generation is handled asynchronously by a worker.
   *
   * @param {ContentRequest} request - The content generation request.
   * @returns {Promise<{ jobId: string }>} A promise that resolves with the ID of the enqueued job.
   * @throws {AIGenerationError} If the job cannot be enqueued.
   */
  public async generateContent(request: ContentRequest): Promise<{ jobId: string }> {
    try {
      const jobId = await this.jobQueueService.enqueueJob(request);
      console.log(`[DynamicContentGenerator] Enqueued job ${jobId} for type: ${request.type}`);
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
