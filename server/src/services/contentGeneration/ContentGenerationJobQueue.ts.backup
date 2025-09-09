import { Queue, Job } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from '../../config/redis.js';
import { ContentRequest } from '../../types/Content.js';

type JobPayload = ContentRequest;

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
   * @param jobId - A durable, unique ID (string or number) for the job.
   * @param payload - The data required for the job, matching the generation request.
   * @returns The BullMQ Job object.
   */
  async addJob(jobId: string | number, payload: JobPayload): Promise<Job> {
    // Type-safe conversion with validation following development principles
    const stringJobId = this.validateAndConvertJobId(jobId);
    const job = await this.queue.add('generate-content', payload, { 
      jobId: stringJobId 
    });
    return job;
  }

  /**
   * Validates and converts job ID to non-numeric string format required by BullMQ.
   * Follows type safety principles from development_principles.md
   * BullMQ requires custom IDs to be non-integer strings, so we prefix with "job-"
   * @param jobId - The job ID to validate and convert
   * @returns Valid non-numeric string job ID (e.g., "job-11")
   * @throws Error if job ID is invalid
   */
  private validateAndConvertJobId(jobId: string | number): string {
    if (jobId === null || jobId === undefined) {
      throw new Error('Job ID cannot be null or undefined');
    }
    
    const rawId = String(jobId);
    
    if (!rawId || rawId === 'null' || rawId === 'undefined' || rawId.trim() === '') {
      throw new Error(`Invalid job ID: ${jobId}`);
    }
    
    // BullMQ requires non-integer custom IDs, so prefix with "job-"
    // This ensures the ID is clearly non-numeric while maintaining database relationship
    const prefixedId = `job-${rawId}`;
    
    return prefixedId;
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
 * Factory function for creating ContentGenerationJobQueue instance.
 * Only creates instance when Redis is available.
 */
export const createContentGenerationJobQueue = (): ContentGenerationJobQueue | null => {
  if (!redisConnection) {
    return null;
  }
  return new ContentGenerationJobQueue();
};
