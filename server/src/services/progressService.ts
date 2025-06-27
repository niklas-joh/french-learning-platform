import db from '../config/db';
import { Knex } from 'knex';
import { UserProgress } from '../models/UserProgress';

// Placeholder services to be replaced with actual implementations
const gamificationService = {
  calculateXpForActivity(activity: any): number {
    // TODO: Implement actual XP calculation logic
    console.log('Calculating XP for activity:', activity);
    return 10; // Return a fixed amount for now
  }
};

const achievementService = {
  async checkAndAwardAchievements(userId: number, activity: any, trx: any) {
    // TODO: Implement actual achievement checking logic
    console.log(`Checking achievements for user ${userId} within transaction.`);
    // This service will check against achievement criteria and insert into user_achievements
  }
};

export const getUserProgress = async (userId: number): Promise<UserProgress | undefined> => {
  return db('user_progress').where({ user_id: userId }).first();
};

export const getUserStreak = async (userId: number): Promise<number> => {
  const progress = await getUserProgress(userId);
  // TODO: Implement more complex streak logic (checking dates)
  return progress ? progress.streakDays : 0;
};

export const recordActivity = async (userId: number, activityData: any) => {
  return db.transaction(async (trx: Knex.Transaction) => {
    const xpGained = gamificationService.calculateXpForActivity(activityData);

    const currentProgress = await trx('user_progress').where({ user_id: userId }).first();

    if (!currentProgress) {
      throw new Error('User progress not found.');
    }

    // TODO: Implement proper streak logic
    const newStreak = (currentProgress.streakDays || 0) + 1;

    const [updatedProgress] = await trx('user_progress')
      .where({ user_id: userId })
      .increment('total_xp', xpGained)
      .update({
        streak_days: newStreak,
        last_activity_date: new Date(),
      })
      .returning('*');

    await achievementService.checkAndAwardAchievements(userId, activityData, trx);

    return updatedProgress;
  });
};

// The class-based service can be refactored or removed later,
// but we keep it for now to avoid breaking existing code.
export class ProgressService {
  
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return getUserProgress(userId);
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
      lastActivityDate: new Date(),
    };

    const [newProgressId] = await db('user_progress').insert(defaultProgress).returning('id');
    
    const newProgress = await getUserProgress(userId);
    if (!newProgress) {
      throw new Error('Failed to create and retrieve user progress.');
    }
    
    return newProgress;
  }
}

export const progressService = new ProgressService();
