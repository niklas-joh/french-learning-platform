import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from '../config/redis';
import { contentGenerationServiceFactory } from '../services/contentGeneration';
import { AiGenerationJobsModel, AiGenerationJob } from '../models/AiGenerationJob';
import { ContentRequest, GeneratedContent } from '../types/Content';

type JobPayload = ContentRequest;
type JobResponse = GeneratedContent;

// TODO: Replace console.log with a structured logger like Pino
console.log('Content Generation Worker started...');

const processJob = async (job: Job<JobPayload, JobResponse>) => {
  const { id: jobId } = job;
  console.log(`Processing job ${jobId}`);

  try {
    const dbJob = await AiGenerationJobsModel.query().findById(jobId!);
    if (!dbJob) {
      throw new Error(`Job with ID ${jobId} not found in database.`);
    }

    await AiGenerationJobsModel.query().patchAndFetchById(jobId!, { status: 'processing' });

    const jobHandler = contentGenerationServiceFactory.getContentGenerationJobHandler();
    const generatedContent = await jobHandler.handleJob(dbJob);

    await AiGenerationJobsModel.query().patchAndFetchById(jobId!, {
      status: 'completed',
      result: JSON.stringify(generatedContent),
    });

    console.log(`Job ${jobId} completed successfully.`);
    return generatedContent;
  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await AiGenerationJobsModel.query().patchAndFetchById(jobId!, {
      status: 'failed',
      errorMessage: error.message || 'An unknown error occurred.',
    });
    throw error;
  }
};

if (redisConnection) {
  const worker = new Worker<JobPayload, JobResponse>(
    QUEUE_NAMES.CONTENT_GENERATION,
    processJob,
    { 
      connection: redisConnection, 
      concurrency: 5
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
  });

  worker.on('error', err => {
    console.error('Worker encountered an error:', err);
  });
} else {
    console.log('Redis is not enabled, so the content generation worker is disabled.');
}
