import { LearningUnitWithUserProgress } from './LearningUnit';

export interface LearningPath {
  id: number;
  language: string;
  name: string;
  description?: string;
  total_lessons: number; // As in DB
  estimated_duration?: number; // in minutes or hours, matches DB schema for learning_paths
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface LearningPathWithUserProgress extends LearningPath {
  units: LearningUnitWithUserProgress[];
  // Future: Could add aggregated path-level progress
}
