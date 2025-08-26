import db from '../config/db';
import Knex from 'knex';
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
    // This service will check against achievement criteria and insert into userAchievements
  }
};

export const getUserProgress = async (userId: number): Promise<UserProgress | undefined> => {
  return db('userProgress').where({ userId: userId }).first();
};

export const getUserStreak = async (userId: number): Promise<number> => {
  const progress = await getUserProgress(userId);
  // TODO: Implement more complex streak logic (checking dates)
  return progress ? progress.streakDays : 0;
};

export const recordActivity = async (userId: number, activityData: any) => {
  return db.transaction(async (trx: Knex.Transaction) => {
    const xpGained = gamificationService.calculateXpForActivity(activityData);

    const currentProgress = await trx('userProgress').where({ userId: userId }).first();

    if (!currentProgress) {
      throw new Error('User progress not found.');
    }

    // TODO: Implement proper streak logic
    const newStreak = (currentProgress.streakDays || 0) + 1;

    const [updatedProgress] = await trx('userProgress')
      .where({ userId: userId })
      .increment('totalXp', xpGained)
      .update({
        streakDays: newStreak,
        lastActivityDate: new Date(),
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

    const [newProgressId] = await db('userProgress').insert(defaultProgress).returning('id');
    
    const newProgress = await getUserProgress(userId);
    if (!newProgress) {
      throw new Error('Failed to create and retrieve user progress.');
    }
    
    return newProgress;
  }
}

export const progressService = new ProgressService();

// =================================================================
// ENHANCED PROGRESS FUNCTIONS FOR AI INTEGRATION
// Task 3.2.A.2: Missing dependency functions implementation
// =================================================================

/**
 * Retrieves recent progress data for AI-powered learning recommendations
 * 
 * Task 3.2.A.2: AI Integration - Progress Context
 * 
 * Provides comprehensive user progress context for AI services including
 * current skill levels, recent performance metrics, and learning trajectory.
 * Integrates with existing progress tracking while adding AI-specific data.
 * 
 * @param userId - User identifier for progress retrieval
 * @returns Promise resolving to recent progress data with skill scores and context
 * 
 * @example
 * ```typescript
 * const progress = await getUserRecentProgress(123);
 * console.log(`Current level: ${progress.currentLevel}, Skills: ${JSON.stringify(progress.skillScores)}`);
 * ```
 */
export async function getUserRecentProgress(userId: number): Promise<{
  currentLevel: string;
  currentPathId: number;
  skillScores: Record<string, number>;
  recentScores: number[];
  lastActivityDate: Date;
  totalXp: number;
  streakDays: number;
}> {
  try {
    // Get base progress data from existing service
    const baseProgress = await getUserProgress(userId);
    if (!baseProgress) {
      throw new Error(`No progress found for user ${userId}`);
    }

    // Get recent lesson completions for skill analysis (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLessons = await db('userLessonProgress as ulp')
      .join('lessons as l', 'ulp.lessonId', 'l.id')
      .join('learningUnits as lu', 'l.learningUnitId', 'lu.id')
      .where('ulp.userId', userId)
      .where('ulp.completedAt', '>=', thirtyDaysAgo)
      .where('ulp.status', 'completed')
      .select('ulp.score', 'l.type', 'lu.level', 'ulp.completedAt')
      .orderBy('ulp.completedAt', 'desc')
      .limit(20);

    // Calculate skill scores based on lesson types and performance
    const skillScores: Record<string, number> = {
      vocabulary: 0.5,
      grammar: 0.5,
      conversation: 0.5,
      pronunciation: 0.5,
      reading: 0.5,
      writing: 0.5
    };

    // Analyze recent lesson performance by type
    if (recentLessons.length > 0) {
      const skillMap: Record<string, number[]> = {};
      
      recentLessons.forEach(lesson => {
        const skill = lesson.type || 'general';
        if (!skillMap[skill]) skillMap[skill] = [];
        if (lesson.score) skillMap[skill].push(lesson.score);
      });

      // Calculate average scores for each skill area
      Object.entries(skillMap).forEach(([skill, scores]) => {
        if (scores.length > 0) {
          const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          skillScores[skill] = Math.min(1.0, avgScore / 100); // Normalize to 0-1
        }
      });
    }

    // Extract recent scores for pattern analysis
    const recentScores = recentLessons
      .filter(lesson => lesson.score !== null)
      .map(lesson => lesson.score)
      .slice(0, 10);

    // Get current learning path (assume first active path for now)
    const currentPath = await db('learningPaths')
      .where('isActive', true)
      .first();

    return {
      currentLevel: baseProgress.currentLevel,
      currentPathId: currentPath?.id || 1,
      skillScores,
      recentScores,
      lastActivityDate: baseProgress.lastActivityDate || new Date(),
      totalXp: baseProgress.totalXP || 0,
      streakDays: baseProgress.streakDays
    };
    
  } catch (error) {
    console.error('Error retrieving recent progress:', error);
    // Return safe defaults for AI processing
    return {
      currentLevel: 'A1',
      currentPathId: 1,
      skillScores: {
        vocabulary: 0.3,
        grammar: 0.3,
        conversation: 0.2,
        pronunciation: 0.2,
        reading: 0.3,
        writing: 0.3
      },
      recentScores: [],
      lastActivityDate: new Date(),
      totalXp: 0,
      streakDays: 0
    };
  }
}

/**
 * Retrieves user's current CEFR level for AI personalization
 * 
 * Task 3.2.A.2: AI Integration - Level Context  
 * 
 * Determines the user's current French proficiency level using existing
 * progress data and recent performance. Provides CEFR-compliant level
 * determination for AI content generation and adaptation.
 * 
 * @param userId - User identifier for level retrieval
 * @returns Promise resolving to current CEFR level (A1, A2, B1, B2, C1, C2)
 * 
 * @example
 * ```typescript
 * const level = await getUserLevel(123);
 * console.log(`User level: ${level}`); // "A2"
 * ```
 */
export async function getUserLevel(userId: number): Promise<string> {
  try {
    const progress = await getUserProgress(userId);
    if (!progress) {
      return 'A1'; // Default level for new users
    }

    // Return stored level if available
    if (progress.currentLevel) {
      return progress.currentLevel;
    }

    // Calculate level based on total XP if no explicit level set
    const totalXp = progress.totalXP || 0;
    
    // XP thresholds for CEFR levels (adjustable based on curriculum design)
    if (totalXp < 500) return 'A1';
    if (totalXp < 1500) return 'A2';  
    if (totalXp < 3000) return 'B1';
    if (totalXp < 5000) return 'B2';
    if (totalXp < 8000) return 'C1';
    return 'C2';
    
  } catch (error) {
    console.error('Error retrieving user level:', error);
    return 'A1'; // Safe default
  }
}

/**
 * Identifies learning weak areas for targeted AI recommendations
 * 
 * Task 3.2.A.2: AI Integration - Weakness Analysis
 * 
 * Analyzes user's recent assessment performance to identify skill areas
 * needing improvement. Integrates with existing assessment analytics service
 * to provide AI-ready weakness identification for curriculum adaptation.
 * 
 * @param userId - User identifier for weakness analysis
 * @returns Promise resolving to array of skill areas needing improvement
 * 
 * @example
 * ```typescript
 * const weakAreas = await identifyWeakAreas(123);
 * console.log(`Focus areas: ${weakAreas.join(', ')}`); // "grammar, pronunciation"
 * ```
 */
export async function identifyWeakAreas(userId: number): Promise<string[]> {
  try {
    // Import assessment analytics service for weakness analysis
    const { AssessmentAnalyticsService } = await import('./ai/assessment/AssessmentAnalyticsService.js');
    const { AssessmentRepository } = await import('../repositories/assessmentRepository.js');
    
    const assessmentRepo = new AssessmentRepository(db);
    const analyticsService = new AssessmentAnalyticsService(assessmentRepo, db);

    // Get recent assessment analytics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const analytics = await analyticsService.getAssessmentAnalytics(userId, {
      limit: 50,
      startDate: thirtyDaysAgo,
      endDate: new Date()
    });

    // Extract weak areas from skill breakdown
    const weakAreas: string[] = [];
    
    if (analytics.skillAreaBreakdown) {
      Object.entries(analytics.skillAreaBreakdown).forEach(([skill, data]) => {
        if (data.accuracy < 0.7 && data.count >= 2) { // At least 2 attempts, < 70% accuracy
          weakAreas.push(skill);
        }
      });
    }

    // Sort by performance (worst first) and return top 3
    const sortedWeakAreas = weakAreas.slice(0, 3);

    // If no specific weak areas found, use general skill analysis
    if (sortedWeakAreas.length === 0) {
      const recentProgress = await getUserRecentProgress(userId);
      const skillEntries = Object.entries(recentProgress.skillScores)
        .filter(([_, score]) => score < 0.6)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3);
      
      return skillEntries.map(([skill]) => skill);
    }

    return sortedWeakAreas;
    
  } catch (error) {
    console.error('Error identifying weak areas:', error);
    // Return common weak areas as fallback
    return ['grammar', 'vocabulary', 'pronunciation'];
  }
}
