/**
 * @file server/src/worker.ts
 * @description Dedicated entry point for background worker process
 * 
 * This file provides a separate process entry point for the content generation
 * worker, ensuring proper separation of concerns between the API server and
 * background job processing. Follows factory singleton pattern for optimal
 * performance and implements graceful shutdown handling.
 * 
 * @author AI Content Generation System
 * @version 1.0.0
 */

// Load environment variables first
import 'dotenv/config';

import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from './config/redis.js';
import { contentGenerationServiceFactory } from './services/contentGeneration/index.js';
import { AiGenerationJobsModel } from './models/AiGenerationJob.js';
import { ContentRequest, GeneratedContent } from './types/Content.js';

/**
 * Type definitions for job payload and response
 */
type JobPayload = ContentRequest;
type JobResponse = GeneratedContent;

/**
 * Extracts the numeric database ID from the prefixed BullMQ job ID
 * BullMQ job IDs are formatted as "job-{databaseId}" (e.g., "job-11")
 * @param bullmqJobId - The prefixed job ID from BullMQ
 * @returns The numeric database ID
 * @throws Error if the job ID format is invalid
 */
const extractDatabaseId = (bullmqJobId: string): string => {
  if (!bullmqJobId || typeof bullmqJobId !== 'string') {
    throw new Error(`Invalid BullMQ job ID: ${bullmqJobId}`);
  }
  
  const PREFIX = 'job-';
  if (!bullmqJobId.startsWith(PREFIX)) {
    throw new Error(`BullMQ job ID must start with "${PREFIX}". Got: ${bullmqJobId}`);
  }
  
  const databaseId = bullmqJobId.substring(PREFIX.length);
  if (!databaseId) {
    throw new Error(`No database ID found in BullMQ job ID: ${bullmqJobId}`);
  }
  
  return databaseId;
};

/**
 * Processes a single content generation job
 * 
 * This function handles the complete lifecycle of a content generation job:
 * - Extracts database ID from BullMQ job ID
 * - Updates job status to 'processing'
 * - Executes the job using the content generation handler
 * - Updates job status to 'completed' with results
 * - Handles errors and updates status to 'failed'
 * 
 * @param job - BullMQ job object containing the payload
 * @returns Promise<GeneratedContent> - The generated content result
 * @throws Error if job processing fails
 */
const processJob = async (job: Job<JobPayload, JobResponse>): Promise<JobResponse> => {
  const { id: bullmqJobId } = job;
  console.log(`🔄 Processing job ${bullmqJobId}`);

  try {
    // Extract database ID from prefixed BullMQ job ID (e.g., "job-11" → "11")
    const databaseId = extractDatabaseId(bullmqJobId!);
    console.log(`🔍 Database ID: ${databaseId} (from BullMQ ID: ${bullmqJobId})`);

    // Find the job in database using the extracted numeric ID
    const dbJob = await AiGenerationJobsModel.query().findById(databaseId);
    if (!dbJob) {
      throw new Error(`Job with database ID ${databaseId} not found in database.`);
    }

    // Update status to processing
    await AiGenerationJobsModel.query().patchAndFetchById(databaseId, { status: 'processing' });

    // Get job handler from factory (performance optimized)
    const jobHandler = contentGenerationServiceFactory.getContentGenerationJobHandler();
    const generatedContent = await jobHandler.handleJob(dbJob);

    // Update status to completed with results
    await AiGenerationJobsModel.query().patchAndFetchById(databaseId, {
      status: 'completed',
      result: JSON.stringify(generatedContent),
    });

    console.log(`✅ Job ${bullmqJobId} (DB ID: ${databaseId}) completed successfully`);
    return generatedContent;
  } catch (error: any) {
    console.error(`❌ Job ${bullmqJobId} failed:`, error);
    
    try {
      // Attempt to update database status to failed (if we can extract the database ID)
      const databaseId = extractDatabaseId(bullmqJobId!);
      await AiGenerationJobsModel.query().patchAndFetchById(databaseId, {
        status: 'failed',
        errorMessage: error.message || 'An unknown error occurred.',
      });
    } catch (updateError) {
      console.error(`❌ Failed to update job status in database:`, updateError);
    }
    
    throw error;
  }
};

/**
 * Factory function for creating worker instance
 * 
 * Uses singleton pattern to ensure single worker instance per process.
 * Provides optimal performance with <1ms instantiation after first call.
 * Gracefully handles Redis unavailability.
 * 
 * @returns Worker instance or null if Redis not available
 */
const createWorker = (() => {
  let workerInstance: Worker<JobPayload, JobResponse> | null = null;
  
  return (): Worker<JobPayload, JobResponse> | null => {
    if (workerInstance) {
      return workerInstance;
    }
    
    if (!redisConnection) {
      console.log('❌ Redis connection not available - worker disabled');
      return null;
    }
    
    // Create new BullMQ worker with existing configuration
    workerInstance = new Worker<JobPayload, JobResponse>(
      QUEUE_NAMES.CONTENT_GENERATION,
      processJob,
      { 
        connection: redisConnection, 
        concurrency: 5 // Process up to 5 jobs simultaneously
      }
    );
    
    console.log('🏭 Worker instance created');
    return workerInstance;
  };
})();

/**
 * Handles graceful shutdown of worker process
 * 
 * Ensures all in-progress jobs complete before terminating the process.
 * Properly closes Redis connections and releases resources.
 * 
 * @param signal - The shutdown signal received (SIGTERM, SIGINT, etc.)
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`🔄 Received ${signal}, initiating graceful shutdown...`);
  
  try {
    const worker = createWorker();
    if (worker) {
      console.log('⏳ Waiting for active jobs to complete...');
      await worker.close();
      console.log('✅ Worker shutdown completed successfully');
    } else {
      console.log('ℹ️  No active worker to shutdown');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('💥 Error during shutdown:', error.message);
    process.exit(1);
  }
};

/**
 * Starts the content generation worker process
 * 
 * Main entry point that:
 * - Creates and configures the worker
 * - Sets up event handlers for monitoring
 * - Configures graceful shutdown handlers
 * - Provides comprehensive logging
 */
const startWorker = async (): Promise<void> => {
  console.log('🚀 Starting content generation worker...');
  
  try {
    const worker = createWorker();
    
    if (!worker) {
      console.log('⚠️  Worker not started (Redis connection unavailable)');
      console.log('💡 Ensure REDIS_ENABLED=true and Redis server is running');
      return;
    }
    
    // Configure worker event handlers for monitoring
    worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed successfully`);
    });
    
    worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });
    
    worker.on('error', (err) => {
      console.error('🚨 Worker encountered an error:', err);
    });
    
    worker.on('ready', () => {
      console.log('📡 Worker connected and ready to process jobs');
    });
    
    // Configure graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart
    
    console.log('✨ Content generation worker started successfully');
    console.log(`📊 Configuration: ${worker.opts.concurrency} concurrent jobs, Queue: ${QUEUE_NAMES.CONTENT_GENERATION}`);
    console.log('🎯 Worker is now processing jobs from the queue...');
    
  } catch (error: any) {
    console.error('💥 Worker startup failed:', error.message);
    console.error('🔍 Check Redis connection and configuration');
    process.exit(1);
  }
};

// Start the worker process
startWorker().catch((error) => {
  console.error('🚨 Unhandled worker startup error:', error);
  process.exit(1);
});
