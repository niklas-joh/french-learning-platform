import { LessonWithUserProgress } from './Lesson.js';
import db from '../config/db.js';

export interface LearningUnit {
  id: number;
  learningPathId: number;
  title: string;
  description?: string;
  level: string; // e.g., 'A1', 'B2'
  orderIndex: number;
  prerequisites?: string; // Text description of prerequisites
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface LearningUnitWithUserProgress extends LearningUnit {
  lessons: LessonWithUserProgress[];
  // Future: Could add aggregated unit-level progress (e.g., percentage complete)
}

export type UnitAndLessonRow = {
    unitId: number;
    unitTitle: string;
    unitDescription?: string;
    unitLevel: string;
    unitOrderIndex: number;
    unitIsActive: boolean;
    unitCreatedAt: string;
    unitUpdatedAt: string;
    lessonId: number;
    lessonTitle: string;
    lessonDescription?: string;
    lessonType: string;
    lessonEstimatedTime: number;
    lessonOrderIndex: number;
    lessonContentData?: string;
    lessonIsActive: boolean;
    lessonCreatedAt: string;
    lessonUpdatedAt: string;
  };

export const getUnitsAndLessonsByPathId = async (pathId: number): Promise<UnitAndLessonRow[]> => {
    const unitsAndLessonsRaw = await db('learning_units as lu')
        .join('lessons as l', 'lu.id', '=', 'l.learningUnitId')
        .where('lu.learningPathId', pathId)
        .select(
        'lu.id as unitId', 'lu.title as unitTitle', 'lu.description as unitDescription',
        'lu.level as unitLevel', 'lu.orderIndex as unitOrderIndex',
        'lu.isActive as unitIsActive',
        'lu.createdAt as unitCreatedAt', 'lu.updatedAt as unitUpdatedAt',
        'l.id as lessonId', 'l.title as lessonTitle', 'l.description as lessonDescription',
        'l.type as lessonType', 'l.estimatedTime as lessonEstimatedTime',
        'l.orderIndex as lessonOrderIndex', 'l.contentData as lessonContentData',
        'l.isActive as lessonIsActive', 'l.createdAt as lessonCreatedAt',
        'l.updatedAt as lessonUpdatedAt'
        )
        .orderBy(['lu.orderIndex', 'l.orderIndex']) as UnitAndLessonRow[];
    return unitsAndLessonsRaw;
};
