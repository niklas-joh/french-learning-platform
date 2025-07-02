import db from '../config/db';
import { Knex } from 'knex';

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

export const getLessonProgressForUser = async (userId: number, lessonIds: number[]): Promise<UserLessonProgress[]> => {
    if (lessonIds.length === 0) {
        return [];
    }
    return db<UserLessonProgress>('userLessonProgress')
        .where('userId', userId)
        .whereIn('lessonId', lessonIds);
};

export const startLesson = async (userId: number, lessonId: number): Promise<UserLessonProgress> => {
    const existingProgress = await db<UserLessonProgress>('userLessonProgress')
        .where({ userId, lessonId })
        .first();

    if (existingProgress) {
        if (existingProgress.status === 'in-progress' || existingProgress.status === 'completed') {
            return existingProgress;
        }

        const [updated] = await db('userLessonProgress')
            .where('id', existingProgress.id)
            .update({ status: 'in-progress', startedAt: new Date().toISOString() })
            .returning('*');
        return updated;
    }

    const [newProgress] = await db<UserLessonProgress>('userLessonProgress')
        .insert({
            userId,
            lessonId,
            status: 'in-progress',
            startedAt: new Date().toISOString(),
        })
        .returning('*');
    return newProgress;
};

export const completeLesson = async (userId: number, lessonId: number, trx: Knex.Transaction): Promise<UserLessonProgress> => {
    const progressToUpdate = await trx<UserLessonProgress>('userLessonProgress')
        .where({ userId, lessonId })
        .first();

    if (!progressToUpdate) {
        throw new Error('Lesson has not been started. Cannot mark as complete.');
    }

    if (progressToUpdate.status !== 'in-progress') {
        throw new Error(`Cannot complete lesson with status: ${progressToUpdate.status}`);
    }

    const [updatedProgress] = await trx<UserLessonProgress>('userLessonProgress')
        .where('id', progressToUpdate.id)
        .update({
            status: 'completed',
            completedAt: new Date().toISOString(),
        })
        .returning('*');

    return updatedProgress;
};
