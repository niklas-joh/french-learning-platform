import { LessonStatus } from './UserLessonProgress';

export interface Lesson {
  id: number;
  learning_unit_id: number;
  title: string;
  description?: string;
  type: string; // e.g., 'video', 'quiz', 'reading'
  estimated_time: number; // in minutes, matches DB schema for lessons.learning_units
  order_index: number;
  content_data?: string; // JSON string or similar for lesson content
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface LessonWithUserProgress extends Lesson {
  status: LessonStatus;
  score?: number;
  started_at?: string; // ISO date string
  completed_at?: string; // ISO date string
  // Other progress fields like time_spent, attempts can be added if needed directly on lesson
}
