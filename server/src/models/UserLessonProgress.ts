// Shared type for lesson statuses
export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface UserLessonProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  status: LessonStatus;
  score?: number;
  time_spent?: number; // in seconds or minutes, to be consistent with how it's stored/used
  attempts: number;
  started_at?: string; // ISO date string
  completed_at?: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
