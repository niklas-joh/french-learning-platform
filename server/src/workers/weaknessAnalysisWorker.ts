// server/src/workers/weaknessAnalysisWorker.ts

import { Job } from 'bullmq';
import { AiGenerationJobsModel } from '../models/AiGenerationJob.js';
import { WeaknessAnalysisService } from '../services/ai/assessment/WeaknessAnalysisService.js';
import { AssessmentRepository } from '../repositories/assessmentRepository.js';
import { PromptTemplateEngine } from '../services/ai/PromptTemplateEngine.js';
import { AssessmentAnalyticsService } from '../services/ai/assessment/AssessmentAnalyticsService.js';
import { FrenchLanguageUtils } from '../services/ai/assessment/utils/FrenchLanguageUtils.js';
import db from '../config/db.js';
import { aiConfig } from '../config/aiConfig.js';
import { OpenAI } from 'openai';
import { createLogger } from '../utils/logger.js';

/**
 * Job data structure for weakness analysis processing
 * @interface WeaknessAnalysisJobData
 */
interface WeaknessAnalysisJobData {
  userId: number;
  triggerReason: 'completion-count' | 'scheduled' | 'manual';
  timeframeDays?: number;
}

// Initialize logger following existing patterns
const logger = createLogger('weakness-analysis-worker');

/**
 * Processes weakness analysis jobs asynchronously.
 * Follows the same pattern as existing contentGenerationWorker for consistency.
 * 
 * This worker moves heavy analytical processing off the synchronous API request path,
 * addressing the performance bottleneck identified in Task 3.1.C.7.
 * 
 * @param {Job<WeaknessAnalysisJobData>} job - The job to process
 * @returns {Promise<void>} Resolves when analysis is complete
 * @throws {Error} When analysis fails or dependencies are unavailable
 */
export async function processWeaknessAnalysisJob(job: Job<WeaknessAnalysisJobData>): Promise<void> {
  const { userId, triggerReason, timeframeDays } = job.data;
  const jobId = job.id!;
  
  logger.info(`Processing weakness analysis job ${jobId} for user ${userId}, trigger: ${triggerReason}`);

  try {
    // Step 1: Update job status to processing
    await AiGenerationJobsModel.query().patchAndFetchById(jobId, { status: 'processing' });

    // Step 2: Initialize services following dependency injection patterns
    const assessmentRepo = new AssessmentRepository(db);
    const promptEngine = new PromptTemplateEngine();
    const analyticsService = new AssessmentAnalyticsService(assessmentRepo, db, logger);
    const frenchUtils = new FrenchLanguageUtils();
    const openai = new OpenAI(aiConfig.openai);

    // Step 3: Create weakness analysis service with all dependencies
    const weaknessService = new WeaknessAnalysisService(
      assessmentRepo,
      promptEngine,
      analyticsService,
      frenchUtils,
      openai,
      logger
    );

    // Step 4: Perform the analysis (this handles all the heavy processing)
    await weaknessService.performAnalysis(userId, timeframeDays);

    // Step 5: Mark job as completed
    await AiGenerationJobsModel.query().patchAndFetchById(jobId, { 
      status: 'completed',
      result: JSON.stringify({
        message: 'Weakness analysis completed successfully',
        userId,
        timeframeDays: timeframeDays || 30,
        completedAt: new Date().toISOString()
      })
    });

    logger.info(`Weakness analysis job ${jobId} completed successfully for user ${userId}`);

  } catch (error: any) {
    logger.error(`Weakness analysis job ${jobId} failed for user ${userId}:`, error);
    
    // Update job status with error details
    await AiGenerationJobsModel.query().patchAndFetchById(jobId, {
      status: 'failed',
      errorMessage: error.message || 'Unknown error occurred during weakness analysis'
    });

    // Re-throw to allow BullMQ retry logic to handle
    throw error;
  }
}

/**
 * Enqueues a weakness analysis job using the existing DatabaseJobQueueService pattern.
 * This function can be called from triggers like completion count or scheduled tasks.
 * 
 * @param {number} userId - The user ID to analyze
 * @param {WeaknessAnalysisJobData['triggerReason']} triggerReason - Why the analysis was triggered
 * @param {number} timeframeDays - Optional timeframe override
 * @returns {Promise<string>} The job ID for tracking
 */
export async function enqueueWeaknessAnalysis(
  userId: number, 
  triggerReason: WeaknessAnalysisJobData['triggerReason'], 
  timeframeDays?: number
): Promise<string> {
  
  const jobData: Partial<any> = {
    userId,
    status: 'queued',
    jobType: 'WEAKNESS_ANALYSIS',
    payload: {
      userId,
      triggerReason,
      timeframeDays
    }
  };

  // Insert job using existing model patterns
  const insertedJob = await AiGenerationJobsModel.query().insertAndFetch(jobData);
  
  logger.info(`Weakness analysis job ${insertedJob.id} enqueued for user ${userId}, trigger: ${triggerReason}`);
  
  return insertedJob.id;
}

/**
 * TODO: Future enhancement - add support for batch weakness analysis
 * This could analyze multiple users in parallel for scheduled reports.
 * 
 * @param {number[]} userIds - Array of user IDs to analyze
 * @param {WeaknessAnalysisJobData['triggerReason']} triggerReason - Why the batch analysis was triggered
 * @returns {Promise<string[]>} Array of job IDs for tracking
 */
// export async function enqueueBatchWeaknessAnalysis(
//   userIds: number[], 
//   triggerReason: WeaknessAnalysisJobData['triggerReason']
// ): Promise<string[]> {
//   // Implementation would create multiple jobs or a single batch job
//   // Left for future implementation based on actual requirements
// }
