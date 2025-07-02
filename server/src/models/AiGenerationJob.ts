import { Model } from 'objection';
import knex from '../config/db';

Model.knex(knex);

export class AiGenerationJobsModel extends Model {
  static tableName = 'aiGenerationJobs';
  static idColumn = 'id';

  id!: string;
  userId!: number;
  status!: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  jobType!: string;
  payload!: object;
  result?: string;
  errorMessage?: string;
  createdAt!: Date;
  updatedAt!: Date;

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export type AiGenerationJob = AiGenerationJobsModel;
