// Shared type for lesson statuses
export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface UserLessonProgress {
  id: number;
  userId: number;
  lessonId: number;
  status: LessonStatus;
  score?: number;
  timeSpent?: number;
  attempts: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
