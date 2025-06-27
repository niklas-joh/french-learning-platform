import db from '../config/db';
import { UserProgress } from '../models/UserProgress';

export class ProgressService {
  
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return db('user_progress').where({ user_id: userId }).first();
  }

  async initializeUserProgress(userId: number): Promise<UserProgress> {
    const existingProgress = await this.getUserProgress(userId);
    if (existingProgress) {
      return existingProgress;
    }

    const defaultProgress: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: userId,
      currentLevel: 'A1',
      currentXP: 0,
      totalXP: 0,
      streakDays: 0,
      lessonsCompleted: 0,
      wordsLearned: 0,
      timeSpentMinutes: 0,
      accuracyRate: 0.0,
      lastActivityDate: undefined,
    };

    await db('user_progress').insert(defaultProgress);
    
    const newProgress = await this.getUserProgress(userId);
    if (!newProgress) {
      throw new Error('Failed to create and retrieve user progress.');
    }
    
    return newProgress;
  }
}

export const progressService = new ProgressService();
