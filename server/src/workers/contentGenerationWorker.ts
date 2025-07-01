import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from '../config/redis';
import { aiServiceFactory } from '../services/ai';
import { AITaskPayloads, AIUserContext, AIResponse } from '../types/AI';
import { AiGenerationJobsModel } from '../models/AiGenerationJob';

type JobPayload = AITaskPayloads['GENERATE_LESSON']['request'] & { userId: number };
type JobResponse = AIResponse<'GENERATE_LESSON'>;

// TODO: Replace console.log with a structured logger like Pino
console.log('Content Generation Worker started...');

const processJob = async (job: Job<JobPayload, JobResponse>) => {
  const { id: jobId, data: payload } = job;
  console.log(`Processing job ${jobId} for user ${payload.userId}`);

  const cacheService = aiServiceFactory.getCacheService();

  try {
    await AiGenerationJobsModel.update(jobId!, { status: 'processing' });

    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();
    
    const userContext: AIUserContext = {
        id: payload.userId,
        firstName: null, 
        role: 'user', 
        preferences: {},
    };

    const { userId, ...generationPayload } = payload;
    const generatedContent = await aiOrchestrator.generateLesson(userContext, generationPayload);

    // Use the correct cache service method
    await cacheService.set('GENERATE_LESSON', generationPayload, generatedContent);

    await AiGenerationJobsModel.update(jobId!, {
      status: 'completed',
      result: JSON.stringify(generatedContent),
    });

    console.log(`Job ${jobId} completed successfully.`);
    return generatedContent;
  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await AiGenerationJobsModel.update(jobId!, {
      status: 'failed',
      error_message: error.message || 'An unknown error occurred.',
    });
    throw error;
  }
};

const worker = new Worker<JobPayload, JobResponse>(
  QUEUE_NAMES.CONTENT_GENERATION,
  processJob,
  { connection: redisConnection, concurrency: 5 }
);

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

worker.on('error', err => {
  console.error('Worker encountered an error:', err);
});
