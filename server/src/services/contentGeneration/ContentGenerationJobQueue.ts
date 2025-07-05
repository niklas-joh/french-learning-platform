import { Queue, Job } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from '../../config/redis';
import { AITaskPayloads } from '../../types/AI';

type JobPayload = AITaskPayloads['GENERATE_LESSON']['request'] & {
  userId: number;
};

/**
 * A service class to abstract interactions with the BullMQ content generation queue.
 * This keeps queue-specific logic isolated from the main application logic.
 */
export class ContentGenerationJobQueue {
  private queue: Queue;

  constructor() {
    if (!redisConnection) {
      throw new Error('Redis connection is not available.');
    }
    this.queue = new Queue(QUEUE_NAMES.CONTENT_GENERATION, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3, // Retry up to 3 times on failure
        backoff: {
          type: 'exponential',
          delay: 5000, // Start with a 5-second delay
        },
        removeOnComplete: {
          count: 1000, // Keep the last 1000 completed jobs for history
        },
        removeOnFail: {
          count: 5000, // Keep more failed jobs for debugging
        },
      },
    });
  }

  /**
   * Adds a new content generation job to the queue.
   * @param jobId - A durable, unique ID (e.g., UUID) for the job.
   * @param payload - The data required for the job, matching the generation request.
   * @returns The BullMQ Job object.
   */
  async addJob(jobId: string, payload: JobPayload): Promise<Job> {
    const job = await this.queue.add('generate-content', payload, { jobId });
    return job;
  }

  /**
   * Retrieves a job from the queue by its ID.
   * @param jobId - The ID of the job to retrieve.
   * @returns The BullMQ Job object, or undefined if not found.
   */
  async getJob(jobId: string): Promise<Job | undefined> {
    return this.queue.getJob(jobId);
  }
}

/**
 * Singleton instance of the ContentGenerationJobQueue service.
 */
export const contentGenerationJobQueue = new ContentGenerationJobQueue();
