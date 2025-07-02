import { Knex } from 'knex';
import { IJobQueueService, JobStatus } from './interfaces';
import { ContentRequest, GeneratedContent } from '../../types/Content';
import { ILogger } from '../../types/ILogger';
import { AiGenerationJob, AiGenerationJobsModel } from '../../models/AiGenerationJob';

/**
 * A persistent job queue service using the database.
 * This implementation leverages the `ai_generation_jobs` table
 * to provide a reliable and scalable job queue.
 */
export class DatabaseJobQueueService implements IJobQueueService {
  /**
   * Creates an instance of DatabaseJobQueueService.
   * @param {Knex} knex - The Knex instance for database connectivity.
   * @param {ILogger} logger - The logger instance for logging messages.
   */
  constructor(private knex: Knex, private logger: ILogger) {
    this.logger.info('DatabaseJobQueueService initialized.');
  }

  /**
   * Enqueues a new content generation job by inserting it into the database.
   * @param {ContentRequest} request - The content generation request payload.
   * @returns {Promise<string>} A promise that resolves with the ID of the newly created job.
   */
  async enqueueJob(request: ContentRequest): Promise<string> {
    const jobData: Partial<AiGenerationJob> = {
      userId: request.userId,
      status: 'queued',
      jobType: request.type,
      payload: request,
    };

    const insertedJob = await AiGenerationJobsModel.query().insertAndFetch(jobData);
    this.logger.info(`Job ${insertedJob.id} enqueued for user ${request.userId}`);
    return insertedJob.id;
  }

  /**
   * Retrieves the status of a specific job from the database.
   * @param {string} jobId - The ID of the job to check.
   * @returns {Promise<JobStatus>} A promise that resolves with the job's status.
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    const job = await AiGenerationJobsModel.query().findById(jobId);

    if (!job) {
      this.logger.warn(`Job status requested for non-existent job ID: ${jobId}`);
      return { id: jobId, status: 'failed', error: 'Job not found' };
    }

    return {
      id: job.id,
      status: job.status as JobStatus['status'],
      progress: this.calculateProgress(job.status),
      error: job.errorMessage || undefined,
    };
  }

  /**
   * Retrieves the result of a completed job.
   * @param {string} jobId - The ID of the job.
   * @returns {Promise<GeneratedContent | null>} A promise that resolves with the generated content, or null if the job is not complete or not found.
   */
  async getJobResult(jobId: string): Promise<GeneratedContent | null> {
    const job = await AiGenerationJobsModel.query().findById(jobId);
    if (!job || job.status !== 'completed' || !job.result) {
      return null;
    }
    // Assuming job.result is stored as a JSON string
    return JSON.parse(job.result as string) as GeneratedContent;
  }

  /**
   * Calculates a progress percentage based on the job status.
   * @param {string} status - The current status of the job.
   * @returns {number} The progress percentage (0-100).
   */
  private calculateProgress(status: string): number {
    switch (status) {
      case 'queued':
        return 0;
      case 'processing':
        return 50;
      case 'completed':
        return 100;
      case 'failed':
        return 100;
      default:
        return 0;
    }
  }

  // ========================================
  // WORKER-SPECIFIC METHODS
  // ========================================

  /**
   * Atomically fetches and locks the next available job.
   * Uses SELECT ... FOR UPDATE SKIP LOCKED to prevent race conditions.
   * @returns The job to be processed, or null if no jobs are available.
   */
  async getNextJob(): Promise<{ id: string; payload: ContentRequest } | null> {
    const job = await this.knex.transaction(async (trx) => {
      const nextJob = await AiGenerationJobsModel.query(trx)
        .where({ status: 'queued' })
        .orderBy('createdAt', 'asc')
        .first()
        .forUpdate()
        .skipLocked();

      if (nextJob) {
        await AiGenerationJobsModel.query(trx).patchAndFetchById(nextJob.id, {
          status: 'processing',
        });
      }
      return nextJob;
    });

    if (!job) {
      return null;
    }

    this.logger.info(`Worker picked up job ${job.id}`);
    return {
      id: job.id,
      payload: job.payload as ContentRequest,
    };
  }

  /**
   * Updates the status of a job.
   * @param jobId The ID of the job.
   * @param status The new status.
   * @param error Optional error message if the job failed.
   */
  async updateJobStatus(jobId: string, status: JobStatus['status'], error?: string): Promise<void> {
    await AiGenerationJobsModel.query().patchAndFetchById(jobId, {
      status,
      errorMessage: error || undefined,
    });
    this.logger.info(`Job ${jobId} status updated to ${status}`);
  }

  /**
   * Sets the result for a completed job.
   * @param jobId The ID of the job.
   * @param result The generated content.
   */
  async setJobResult(jobId: string, result: GeneratedContent): Promise<void> {
    await AiGenerationJobsModel.query().patchAndFetchById(jobId, {
      result: JSON.stringify(result),
      status: 'completed',
    });
    this.logger.info(`Job ${jobId} completed and result stored.`);
  }
}
