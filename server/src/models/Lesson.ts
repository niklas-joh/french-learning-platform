import { LessonStatus } from './UserLessonProgress.js';

export interface Lesson {
  id: number;
  learningUnitId: number;
  title: string;
  description?: string;
  type: string; // e.g., 'video', 'quiz', 'reading'
  estimatedTime: number; // in minutes, matches DB schema for lessons.learning_units
  orderIndex: number;
  contentData?: string; // JSON string or similar for lesson content
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface LessonWithUserProgress extends Lesson {
  status: LessonStatus;
  score?: number;
  startedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
  // Other progress fields like time_spent, attempts can be added if needed directly on lesson
}
