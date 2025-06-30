# Task 2.4: Create Progress Service

Create the following file with the specified content:

**File**: `server/src/services/progressService.ts`
```typescript
import { db } from '../database/database';
import { UserProgress, CEFRLevel, LEVEL_THRESHOLDS } from '../models/UserProgress';

export class ProgressService {
  async getUserProgress(userId: number): Promise<UserProgress> {
    const query = `
      SELECT * FROM user_progress WHERE user_id = ?
    `;
    
    let progress = db.prepare(query).get(userId) as UserProgress;
    
    // Initialize progress if doesn't exist
    if (!progress) {
      progress = await this.initializeUserProgress(userId);
    }
    
    return progress;
  }

  async initializeUserProgress(userId: number): Promise<UserProgress> {
    const insertQuery = `
      INSERT INTO user_progress (
        user_id, current_level, current_xp, total_xp, streak_days,
        lessons_completed, words_learned, time_spent_minutes, accuracy_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [userId, 'A1', 0, 0, 0, 0, 0, 0, 0.0];
    db.prepare(insertQuery).run(values);
    
    return this.getUserProgress(userId);
  }

  async updateProgress(
    userId: number,
    activityType: string,
    performance: number,
    timeSpent: number
  ): Promise<UserProgress> {
    const currentProgress = await this.getUserProgress(userId);
    
    // Calculate XP gained
    const xpGained = this.calculateXP(activityType, performance, timeSpent);
    const newTotalXP = currentProgress.totalXP + xpGained;
    const newCurrentXP = currentProgress.currentXP + xpGained;
    
    // Check for level progression
    const newLevel = this.calculateLevel(newTotalXP);
    
    // Update streak if activity is today
    const { streakDays, lastActivityDate } = this.updateStreak(
      currentProgress.streakDays,
      currentProgress.lastActivityDate
    );

    const updateQuery = `
      UPDATE user_progress SET
        current_level = ?,
        current_xp = ?,
        total_xp = ?,
        streak_days = ?,
        last_activity_date = ?,
        time_spent_minutes = time_spent_minutes + ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    
    db.prepare(updateQuery).run([
      newLevel,
      newCurrentXP,
      newTotalXP,
      streakDays,
      lastActivityDate,
      Math.floor(timeSpent / 60), // Convert seconds to minutes
      userId
    ]);
    
    return this.getUserProgress(userId);
  }

  private calculateXP(activityType: string, performance: number, timeSpent: number): number {
    const baseXP: Record<string, number> = {
      lesson: 50,
      practice: 25,
      quiz: 75,
      conversation: 100,
      pronunciation: 30
    };
    
    const base = baseXP[activityType] || 25;
    const performanceMultiplier = performance / 100;
    const timeBonus = Math.min(timeSpent / 300, 1.5); // Bonus for time spent, capped at 1.5x
    
    return Math.floor(base * performanceMultiplier * timeBonus);
  }

  private calculateLevel(totalXP: number): CEFRLevel {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i].xpRequired) {
        return LEVEL_THRESHOLDS[i].level;
      }
    }
    return 'A1';
  }

  private updateStreak(currentStreak: number, lastActivity?: Date): { streakDays: number; lastActivityDate: string } {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (!lastActivity) {
      return { streakDays: 1, lastActivityDate: today };
    }
    
    const lastActivityDate = new Date(lastActivity).toISOString().split('T')[0];
    
    if (lastActivityDate === today) {
      // Already practiced today, maintain streak
      return { streakDays: currentStreak, lastActivityDate: today };
    } else if (lastActivityDate === yesterday) {
      // Practiced yesterday, continue streak
      return { streakDays: currentStreak + 1, lastActivityDate: today };
    } else {
      // Streak broken, start new
      return { streakDays: 1, lastActivityDate: today };
    }
  }

  async getStreakInfo(userId: number) {
    const progress = await this.getUserProgress(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = progress.lastActivityDate 
      ? new Date(progress.lastActivityDate).toISOString().split('T')[0]
      : null;
    
    return {
      streakDays: progress.streakDays,
      practiceToday: lastActivity === today,
      lastActivityDate: progress.lastActivityDate
    };
  }
}

export const progressService = new ProgressService();
