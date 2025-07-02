import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from '../config/redis';
import { contentGenerationServiceFactory } from '../services/contentGeneration';
import { AiGenerationJobsModel } from '../models/AiGenerationJob';
import { ContentRequest, GeneratedContent } from '../types/Content';

type JobPayload = ContentRequest;
type JobResponse = GeneratedContent;

// TODO: Replace console.log with a structured logger like Pino
console.log('Content Generation Worker started...');

const processJob = async (job: Job<JobPayload, JobResponse>) => {
  const { id: jobId, data: payload } = job;
  console.log(`Processing job ${jobId} for user ${payload.userId}`);

  try {
    await AiGenerationJobsModel.update(jobId!, { status: 'processing' });

    const contentGenerator = contentGenerationServiceFactory.getDynamicContentGenerator();
    const generatedContent = await contentGenerator.generateContent(payload);

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
