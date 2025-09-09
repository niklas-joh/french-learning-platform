/**
 * @file server/src/worker.ts
 * @description Database-only background worker process for content generation
 * 
 * This file provides a database-only worker implementation that replaces Redis/BullMQ
 * with database polling. Leverages existing DatabaseJobQueueService infrastructure
 * for production-ready job processing with race condition prevention.
 * 
 * @author AI Content Generation System
 * @version 2.0.0 - Database-only implementation
 */

// Load environment variables first
import 'dotenv/config';

import type { DatabaseJobQueueService } from './services/contentGeneration/DatabaseJobQueueService.js';
import type { ContentGenerationJobHandler } from './services/contentGeneration/ContentGenerationJobHandler.js';
import { contentGenerationServiceFactory } from './services/contentGeneration/index.js';
import { AiGenerationJobsModel } from './models/AiGenerationJob.js';
import { DB_JOB_QUEUE_CONFIG, validateConfiguration } from './config/database-job-queue.js';

/**
 * Database polling worker - replaces BullMQ worker
 * Leverages existing DatabaseJobQueueService infrastructure
 */
const startDatabaseWorker = async (): Promise<void> => {
  console.log('🚀 Starting database-only content generation worker...');
  
  // Validate configuration before starting
  validateConfiguration();
  
  // ✅ Use existing factory services with proper type safety
  const databaseJobQueue: DatabaseJobQueueService = contentGenerationServiceFactory.getDatabaseJobQueueService();
  const jobHandler: ContentGenerationJobHandler = contentGenerationServiceFactory.getContentGenerationJobHandler();
  
  let isRunning = true;
  // ✅ Use centralized, validated configuration
  const { pollInterval, maxConcurrent, shutdownTimeout } = DB_JOB_QUEUE_CONFIG;
  let activeJobs = 0;
  
  console.log(`⚙️  Configuration: Poll interval ${pollInterval}ms, Max concurrent ${maxConcurrent}, Shutdown timeout ${shutdownTimeout}ms`);
  
  /**
   * Simple polling loop - leverages existing job queue infrastructure
   * Uses existing getNextJob() method with database locking (FOR UPDATE SKIP LOCKED)
   */
  const processJobs = async (): Promise<void> => {
    while (isRunning) {
      try {
        // Respect concurrency limits
        if (activeJobs >= maxConcurrent) {
          await sleep(pollInterval);
          continue;
        }
        
        // ✅ Use existing getNextJob() - already handles locking/transactions
        const job = await databaseJobQueue.getNextJob();
        
        if (job) {
          console.log(`🔄 Processing job ${job.id} (${activeJobs + 1}/${maxConcurrent} active)`);
          
          // Process job asynchronously to allow concurrent processing
          processJobAsync(job.id, jobHandler, databaseJobQueue)
            .finally(() => {
              activeJobs--;
            });
          
          activeJobs++;
        } else {
          // No jobs available - simple polling interval
          await sleep(pollInterval);
        }
      } catch (error: any) {
        console.error('❌ Job polling error:', error.message);
        await sleep(pollInterval);
      }
    }
  };
  
  /**
   * Processes a single job asynchronously with proper error handling
   * @param jobId - Database job ID  
   * @param jobHandler - Content generation job handler with type safety
   * @param databaseJobQueue - Database job queue service with type safety
   */
  const processJobAsync = async (
    jobId: string,
    jobHandler: ContentGenerationJobHandler,
    databaseJobQueue: DatabaseJobQueueService
  ): Promise<void> => {
    try {
      // ✅ Reuse existing job processing pattern
      const dbJob = await AiGenerationJobsModel.query().findById(jobId);
      if (!dbJob) {
        console.error(`❌ Job ${jobId} not found in database`);
        return;
      }
      
      console.log(`📋 Job ${jobId}: ${dbJob.jobType} for user ${dbJob.userId}`);
      
      // ✅ Use existing job handler - same logic as BullMQ version
      const result = await jobHandler.handleJob(dbJob);
      
      // ✅ Use existing setJobResult() method
      await databaseJobQueue.setJobResult(jobId, result);
      console.log(`✅ Job ${jobId} completed successfully`);
      
    } catch (error: any) {
      console.error(`❌ Job ${jobId} failed:`, error.message);
      
      try {
        // ✅ Use existing updateJobStatus() method for error handling
        await databaseJobQueue.updateJobStatus(jobId, 'failed', error.message);
        console.log(`🔄 Job ${jobId} status updated to failed`);
      } catch (updateError: any) {
        console.error(`❌ Failed to update job ${jobId} status:`, updateError.message);
      }
    }
  };
  
  // ✅ Enhanced graceful shutdown with timeout and proper error handling
  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.log(`🔄 Received ${signal}, initiating graceful shutdown...`);
    isRunning = false;
    
    if (activeJobs === 0) {
      console.log('✅ No active jobs, shutting down immediately');
      process.exit(0);
      return;
    }
    
    // Wait for active jobs to complete with timeout
    console.log(`⏳ Waiting for ${activeJobs} active jobs to complete (max ${shutdownTimeout}ms)...`);
    const startTime = Date.now();
    
    while (activeJobs > 0 && (Date.now() - startTime) < shutdownTimeout) {
      await sleep(1000);
      console.log(`⏳ ${activeJobs} jobs still processing... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
    }
    
    if (activeJobs > 0) {
      console.warn(`⚠️ Forcing shutdown with ${activeJobs} jobs still active after ${shutdownTimeout}ms timeout`);
      process.exit(1);
    } else {
      console.log('✅ All jobs completed, worker shutdown successful');
      process.exit(0);
    }
  };
  
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  
  console.log('✨ Database worker started - polling for jobs...');
  console.log('� Worker is now processing jobs from the database...');
  
  // Start the polling loop
  processJobs();
};

/**
 * Helper function for delays
 * @param ms - Milliseconds to sleep
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validates database connection and starts worker
 */
const validateAndStartWorker = async (): Promise<void> => {
  console.log('� Validating database connection for job processing...');
  
  try {
    // Test database connectivity
    await AiGenerationJobsModel.query().select('id').limit(1);
    console.log('✅ Database connection validated');
    
    // Start the database worker
    await startDatabaseWorker();
    
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Check DATABASE_URL configuration and database accessibility');
    process.exit(1);
  }
};

// Start the worker process
validateAndStartWorker().catch((error) => {
  console.error('🚨 Unhandled worker startup error:', error);
  process.exit(1);
});
