import { LessonWithUserProgress } from './Lesson';

export interface LearningUnit {
  id: number;
  learning_path_id: number;
  title: string;
  description?: string;
  level: string; // e.g., 'A1', 'B2'
  order_index: number;
  prerequisites?: string; // Text description of prerequisites
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface LearningUnitWithUserProgress extends LearningUnit {
  lessons: LessonWithUserProgress[];
  // Future: Could add aggregated unit-level progress (e.g., percentage complete)
}
