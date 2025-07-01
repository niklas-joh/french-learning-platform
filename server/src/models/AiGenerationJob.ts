import knex from '../config/db';

const TABLE_NAME = 'ai_generation_jobs';

export interface AiGenerationJob {
  id: string;
  user_id: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  job_type: string;
  payload: object;
  result?: string;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

export const AiGenerationJobsModel = {
  async create(job: Omit<AiGenerationJob, 'created_at' | 'updated_at'>): Promise<AiGenerationJob> {
    const [newJob] = await knex(TABLE_NAME).insert(job).returning('*');
    return newJob;
  },

  async findById(id: string): Promise<AiGenerationJob | undefined> {
    return knex(TABLE_NAME).where({ id }).first();
  },

  async update(id: string, updates: Partial<Omit<AiGenerationJob, 'id' | 'created_at'>>): Promise<AiGenerationJob | undefined> {
    const [updatedJob] = await knex(TABLE_NAME)
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning('*');
    return updatedJob;
  },
};
