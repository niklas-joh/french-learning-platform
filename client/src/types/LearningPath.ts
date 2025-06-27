import { CEFRLevel } from '../../../server/src/models/UserProgress';

/**
 * Represents the status of a lesson for a specific user.
 */
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

/**
 * Represents the type of content a lesson contains.
 */
export type LessonType = 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'pronunciation';

/**
 * Client-side representation of a single lesson, including its status for the current user.
 */
export interface ClientLesson {
  id: number;
  title: string;
  description?: string;
  type: LessonType;
  estimatedTime: number; // in minutes
  orderIndex: number;
  status: LessonStatus;
  contentData?: any; // Flexible content structure
}

/**
 * Client-side representation of a learning unit, which is a collection of lessons.
 */
export interface ClientLearningUnit {
  id: number;
  title: string;
  description?: string;
  level: CEFRLevel;
  orderIndex: number;
  lessons: ClientLesson[];
}

/**
 * Client-side representation of a complete learning path.
 */
export interface ClientLearningPath {
  id: number;
  name: string;
  description?: string;
  totalLessons: number;
  units: ClientLearningUnit[];
}
