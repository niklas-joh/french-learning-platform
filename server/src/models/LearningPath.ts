import { LearningUnitWithUserProgress } from './LearningUnit';
import db from '../config/db';

export interface LearningPath {
  id: number;
  language: string;
  name: string;
  description?: string;
  totalLessons: number; // As in DB
  estimatedDuration?: number; // in minutes or hours, matches DB schema for learning_paths
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface LearningPathWithUserProgress extends LearningPath {
  units: LearningUnitWithUserProgress[];
  // Future: Could add aggregated path-level progress
}

export const getLearningPathById = async (id: number): Promise<LearningPath | null> => {
    const learningPath = await db<LearningPath>('learning_paths')
        .where({ id })
        .first();
    return learningPath || null;
};
