import knex from '../config/db';

const TABLE_NAME = 'ai_generation_jobs';

export interface AiGenerationJob {
  id: string;
  userId: number;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  jobType: string;
  payload: object;
  result?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AiGenerationJobsModel = {
  async create(job: Omit<AiGenerationJob, 'createdAt' | 'updatedAt'>): Promise<AiGenerationJob> {
    const [newJob] = await knex(TABLE_NAME).insert(job).returning('*');
    return newJob;
  },

  async findById(id: string): Promise<AiGenerationJob | undefined> {
    return knex(TABLE_NAME).where({ id }).first();
  },

  async update(id: string, updates: Partial<Omit<AiGenerationJob, 'id' | 'createdAt'>>): Promise<AiGenerationJob | undefined> {
    const [updatedJob] = await knex(TABLE_NAME)
      .where({ id })
      .update({ ...updates, updatedAt: new Date() })
      .returning('*');
    return updatedJob;
  },
};
