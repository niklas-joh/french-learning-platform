# Phase 2: Gamification Infrastructure

**Phase**: 2 of 5  
**Priority**: HIGH  
**Estimated Duration**: 4-5 days  
**Dependencies**: Phase 1 (Database schema) must be completed  
**Deliverable**: Complete XP system, badges, daily goals, and enhanced progress tracking

## Overview

Implement the core gamification infrastructure including XP calculations, badge awarding system, daily goal management, and enhanced progress tracking that integrates seamlessly with existing learning path and progress services.

## Design Specifications

### Gamification UI Components
Based on your mockup dashboard:

**Daily Goals Panel:**
- Circular progress indicators for XP, lessons, and time targets
- Real-time progress updates with smooth animations
- Goal completion celebration with confetti effects
- Customizable goal setting interface

**Badge Display:**
- Badge grid with rarity-based visual effects (glow, particle effects)
- Badge detail modal with earning criteria and progress
- Recent badge notifications with slide-in animations
- Badge collection showcase with filtering/sorting

**XP Visualization:**
- Animated XP gain notifications (+25 XP with floating effect)
- Level progress bar with milestone indicators
- XP breakdown by activity type
- Weekly/monthly XP trend charts

### Animation Specifications
- **XP Gain**: 0.8s bounce animation with scale (1.0 → 1.2 → 1.0)
- **Goal Progress**: Smooth circular fill animation over 1.5s
- **Badge Unlock**: 2s celebration sequence (scale + glow + particles)
- **Level Up**: Full-screen celebration with sound effect hook

## Detailed Changes Required

### 1. New Service Files

**File**: `server/src/services/gamificationService.ts`
```typescript
/**
 * Gamification Service - XP, Badges, and Achievement System
 * 
 * Handles all gamification mechanics including XP calculation,
 * badge awarding, level progression, and achievement tracking.
 * Integrates with existing progress service following established patterns.
 * 
 * @version 1.0.0
 * @author Dashboard Transformation Team
 */

import db from '../config/db.js';
import type { Knex as KnexTypes } from 'knex';
import { recordActivity } from './progressService.js';

// Types for gamification system
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'streak' | 'achievement' | 'social' | 'skill';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: any; // JSON criteria for earning badge
  xpReward: number;
  isActive: boolean;
}

export interface UserBadge extends Badge {
  unlockedAt: Date;
  metadata?: any; // Context about how badge was earned
}

export interface XPActivity {
  userId: number;
  activityType: string;
  xpAmount: number;
  sourceId?: string;
  metadata?: any;
}

/**
 * Initialize gamification data for a new user
 * Creates default daily goal and sets up initial progress tracking
 * 
 * @param userId - User identifier
 * @param trx - Optional database transaction
 */
export async function initializeUserGamification(
  userId: number, 
  trx?: KnexTypes.Transaction
): Promise<void> {
  const database = trx || db;
  
  try {
    // Create today's daily goal with default targets
    const today = new Date().toISOString().split('T')[0];
    const goalId = `goal_${today.replace(/-/g, '')}_${userId}`;
    
    await database('dailyGoals').insert({
      id: goalId,
      userId,
      date: today,
      targetXp: 50,      // Default: 50 XP per day
      targetLessons: 3,  // Default: 3 lessons per day  
      targetMinutes: 20, // Default: 20 minutes per day
      currentXp: 0,
      currentLessons: 0,
      currentMinutes: 0,
      completed: false
    }).onConflict(['userId', 'date']).ignore(); // Ignore if already exists
    
    console.log(`[Gamification] Initialized gamification for user ${userId}`);
  } catch (error) {
    console.error('Error initializing user gamification:', error);
    throw error;
  }
}

/**
 * Record XP-earning activity and update user progress
 * Integrates with existing progress service and daily goals
 * 
 * @param userId - User identifier
 * @param activityType - Type of activity ('lesson_completion', 'daily_goal', etc.)
 * @param xpAmount - Amount of XP to award
 * @param trx - Optional database transaction
 * @param sourceId - Optional reference to source (lessonId, goalId, etc.)
 * @param metadata - Optional additional context
 */
export async function recordXpActivity(
  userId: number,
  activityType: string, 
  xpAmount: number,
  trx?: KnexTypes.Transaction,
  sourceId?: string,
  metadata?: any
): Promise<void> {
  const database = trx || db;
  
  try {
    // Record detailed XP activity
    await database('xpActivities').insert({
      userId,
      activityType,
      xpAmount,
      sourceId,
      metadata: metadata ? JSON.stringify(metadata) : null
    });
    
    // Update cached XP values in userProgress
    const today = new Date();
    const weekStart = getWeekStart(today);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    await database('userProgress')
      .where({ userId })
      .increment({
        totalXp: xpAmount,
        currentXp: xpAmount
      })
      .update({
        lastActivityDate: today.toISOString().split('T')[0],
        updatedAt: database.fn.now()
      });
    
    // Update weekly XP (reset on Monday)
    await database.raw(`
      UPDATE userProgress 
      SET weeklyXp = CASE 
        WHEN lastXpResetDate < ? THEN ?
        ELSE weeklyXp + ?
      END,
      lastXpResetDate = CASE
        WHEN lastXpResetDate < ? THEN date('now')
        ELSE lastXpResetDate
      END
      WHERE userId = ?
    `, [weekStart.toISOString().split('T')[0], xpAmount, xpAmount, weekStart.toISOString().split('T')[0], userId]);
    
    // Update today's daily goal progress
    const today_str = today.toISOString().split('T')[0];
    await database('dailyGoals')
      .where({ userId, date: today_str })
      .increment('currentXp', xpAmount);
    
    // Check if we need to award any badges
    await checkAndAwardAchievements(userId, activityType, database);
    
    console.log(`[XP] Awarded ${xpAmount} XP to user ${userId} for ${activityType}`);
  } catch (error) {
    console.error('Error recording XP activity:', error);
    throw error;
  }
}

/**
 * Calculate XP reward for lesson completion based on performance
 * Uses sophisticated algorithm considering score, time, difficulty
 * 
 * @param lessonId - Lesson identifier
 * @param score - User's score (0-100)
 * @param timeSpent - Time spent in minutes
 * @returns Calculated XP amount
 */
export async function calculateXpForLessonCompletion(
  lessonId: number,
  score: number,
  timeSpent: number
): Promise<number> {
  try {
    // Get lesson metadata for XP calculation
    const lesson = await db('lessons')
      .join('learningUnits', 'lessons.learningUnitId', 'learningUnits.id')
      .select('lessons.estimatedTime', 'lessons.type', 'learningUnits.level')
      .where('lessons.id', lessonId)
      .first();
    
    if (!lesson) {
      console.warn(`Lesson ${lessonId} not found for XP calculation`);
      return 10; // Default XP
    }
    
    // Base XP calculation
    let baseXp = 15; // Base XP for any lesson completion
    
    // Level multiplier (A1=1.0, A2=1.2, B1=1.5, B2=1.8, C1=2.0, C2=2.5)
    const levelMultipliers: Record<string, number> = {
      'A1': 1.0, 'A2': 1.2, 'B1': 1.5, 'B2': 1.8, 'C1': 2.0, 'C2': 2.5
    };
    const levelMultiplier = levelMultipliers[lesson.level] || 1.0;
    
    // Performance bonus (0-100% of base XP based on score)
    const performanceBonus = Math.floor(baseXp * (score / 100));
    
    // Time efficiency bonus/penalty
    const expectedTime = lesson.estimatedTime || 15;
    const timeRatio = timeSpent / expectedTime;
    let timeMultiplier = 1.0;
    
    if (timeRatio <= 0.8) {
      // Completed faster than expected - bonus
      timeMultiplier = 1.2;
    } else if (timeRatio >= 1.5) {
      // Took much longer - small penalty
      timeMultiplier = 0.9;
    }
    
    // Content type bonus
    const typeMultipliers: Record<string, number> = {
      'vocabulary': 1.0,
      'grammar': 1.1,    // Slightly more XP for grammar
      'conversation': 1.2, // More XP for conversation practice
      'pronunciation': 1.1
    };
    const typeMultiplier = typeMultipliers[lesson.type] || 1.0;
    
    // Calculate final XP
    const finalXp = Math.round(
      baseXp * levelMultiplier * timeMultiplier * typeMultiplier + performanceBonus
    );
    
    // Ensure minimum XP (5) and maximum XP (100)
    return Math.max(5, Math.min(100, finalXp));
    
  } catch (error) {
    console.error('Error calculating lesson XP:', error);
    return 10; // Fallback XP
  }
}

/**
 * Check and award achievements based on user activity
 * Evaluates all active badges and awards eligible ones
 * 
 * @param userId - User identifier
 * @param activityType - Type of activity that triggered check
 * @param trx - Database transaction
 * @returns Array of newly awarded badges
 */
export async function checkAndAwardAchievements(
  userId: number,
  activityType: string,
  trx?: KnexTypes.Transaction
): Promise<UserBadge[]> {
  const database = trx || db;
  const awardedBadges: UserBadge[] = [];
  
  try {
    // Get user's current progress and stats
    const userStats = await getUserStats(userId, database);
    
    // Get badges user hasn't earned yet
    const availableBadges = await database('badges')
      .whereNotIn('id', 
        database('userBadges').select('badgeId').where({ userId })
      )
      .where({ isActive: true });
    
    // Check each badge's criteria
    for (const badge of availableBadges) {
      if (await evaluateBadgeCriteria(badge, userStats, activityType)) {
        // Award the badge
        await database('userBadges').insert({
          userId,
          badgeId: badge.id,
          unlockedAt: database.fn.now(),
          metadata: JSON.stringify({ 
            activityType, 
            awardedFor: badge.criteria,
            userStatsAtTime: userStats 
          })
        });
        
        // Award bonus XP for earning badge
        if (badge.xpReward > 0) {
          await recordXpActivity(
            userId,
            'badge_earned',
            badge.xpReward,
            database,
            badge.id,
            { badgeName: badge.name }
          );
        }
        
        awardedBadges.push({
          ...badge,
          unlockedAt: new Date(),
          metadata: { activityType, awardedFor: badge.criteria }
        });
        
        console.log(`[Badge] Awarded "${badge.name}" to user ${userId}`);
      }
    }
    
    return awardedBadges;
    
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

/**
 * Get user's badges with filtering and sorting options
 * 
 * @param userId - User identifier
 * @param options - Filtering and sorting options
 */
export async function getUserBadges(
  userId: number,
  options: {
    category?: string;
    rarity?: string;
    limit?: number;
    sortBy?: 'unlocked_at' | 'rarity' | 'name';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<UserBadge[]> {
  try {
    let query = db('userBadges as ub')
      .join('badges as b', 'ub.badgeId', 'b.id')
      .select('b.*', 'ub.unlockedAt', 'ub.metadata')
      .where('ub.userId', userId);
    
    // Apply filters
    if (options.category) {
      query = query.where('b.category', options.category);
    }
    
    if (options.rarity) {
      query = query.where('b.rarity', options.rarity);
    }
    
    // Apply sorting
    const sortBy = options.sortBy || 'unlocked_at';
    const sortOrder = options.sortOrder || 'desc';
    
    if (sortBy === 'unlocked_at') {
      query = query.orderBy('ub.unlockedAt', sortOrder);
    } else if (sortBy === 'rarity') {
      // Custom rarity sorting (legendary > epic > rare > common)
      const rarityOrder = sortOrder === 'desc' 
        ? ['legendary', 'epic', 'rare', 'common']
        : ['common', 'rare', 'epic', 'legendary'];
      query = query.orderByRaw(`CASE b.rarity ${rarityOrder.map((r, i) => `WHEN '${r}' THEN ${i}`).join(' ')} END`);
    } else {
      query = query.orderBy(`b.${sortBy}`, sortOrder);
    }
    
    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const badges = await query;
    
    return badges.map(badge => ({
      ...badge,
      criteria: typeof badge.criteria === 'string' ? JSON.parse(badge.criteria) : badge.criteria,
      metadata: badge.metadata ? JSON.parse(badge.metadata) : null
    }));
    
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
}

/**
 * Get available achievements user can work towards
 * 
 * @param userId - User identifier
 * @returns Array of unearned badges with progress
 */
export async function getAvailableAchievements(userId: number): Promise<(Badge & { progress?: any })[]> {
  try {
    // Get badges user hasn't earned
    const availableBadges = await db('badges')
      .whereNotIn('id', 
        db('userBadges').select('badgeId').where({ userId })
      )
      .where({ isActive: true })
      .orderBy('rarity')
      .orderBy('name');
    
    // Get user stats for progress calculation
    const userStats = await getUserStats(userId);
    
    // Add progress information for each badge
    const badgesWithProgress = availableBadges.map(badge => {
      const criteria = typeof badge.criteria === 'string' ? JSON.parse(badge.criteria) : badge.criteria;
      const progress = calculateBadgeProgress(criteria, userStats);
      
      return {
        ...badge,
        criteria,
        progress
      };
    });
    
    return badgesWithProgress;
    
  } catch (error) {
    console.error('Error getting available achievements:', error);
    return [];
  }
}

// Helper Functions

/**
 * Get comprehensive user statistics for badge evaluation
 */
async function getUserStats(userId: number, trx?: KnexTypes.Transaction): Promise<any> {
  const database = trx || db;
  
  const [progress, lessonStats, friendCount] = await Promise.all([
    database('userProgress').where({ userId }).first(),
    
    database('userLessonProgress')
      .where({ userId, status: 'completed' })
      .select(
        database.raw('COUNT(*) as totalLessons'),
        database.raw('COUNT(CASE WHEN lessons.type = "vocabulary" THEN 1 END) as vocabularyLessons'),
        database.raw('COUNT(CASE WHEN lessons.type = "grammar" THEN 1 END) as grammarLessons')
      )
      .join('lessons', 'userLessonProgress.lessonId', 'lessons.id')
      .first(),
    
    database('friendships')
      .where({ userId, status: 'accepted' })
      .count('* as count')
      .first()
  ]);
  
  return {
    ...progress,
    ...lessonStats,
    friendCount: friendCount?.count || 0
  };
}

/**
 * Evaluate if user meets badge criteria
 */
async function evaluateBadgeCriteria(badge: Badge, userStats: any, activityType: string): Promise<boolean> {
  const criteria = typeof badge.criteria === 'string' ? JSON.parse(badge.criteria) : badge.criteria;
  
  // Check each criterion
  for (const [key, value] of Object.entries(criteria)) {
    const userValue = userStats[key];
    
    if (userValue === undefined || userValue < value) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculate progress towards badge criteria
 */
function calculateBadgeProgress(criteria: any, userStats: any): any {
  const progress: any = {};
  
  for (const [key, targetValue] of Object.entries(criteria)) {
    const currentValue = userStats[key] || 0;
    progress[key] = {
      current: currentValue,
      target: targetValue,
      percentage: Math.min(100, Math.round((currentValue / (targetValue as number)) * 100))
    };
  }
  
  return progress;
}

/**
 * Get start of week (Monday) for weekly XP calculations
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(d.setDate(diff));
}
```

**File**: `server/src/services/dailyGoalService.ts`
```typescript
/**
 * Daily Goal Service - Goal Setting and Progress Tracking
 * 
 * Manages user daily goals including creation, updates, and completion tracking.
 * Integrates with gamification system for XP rewards and streak maintenance.
 * 
 * @version 1.0.0
 * @author Dashboard Transformation Team
 */

import db from '../config/db.js';
import type { Knex as KnexTypes } from 'knex';
import { recordXpActivity } from './gamificationService.js';

export interface DailyGoal {
  id: string;
  userId: number;
  date: string; // YYYY-MM-DD
  targetXp: number;
  targetLessons: number;
  targetMinutes: number;
  currentXp: number;
  currentLessons: number;
  currentMinutes: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create or get today's daily goal for user
 * Auto-creates with default targets if none exists
 * 
 * @param userId - User identifier
 * @param goalParams - Optional goal parameters to override defaults
 * @returns Today's daily goal
 */
export async function getTodayGoal(userId: number): Promise<DailyGoal | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let goal = await db('dailyGoals')
      .where({ userId, date: today })
      .first();
    
    if (!goal) {
      // Create default daily goal
      goal = await createDailyGoal(userId, {
        date: today,
        targetXp: 50,
        targetLessons: 3,
        targetMinutes: 20
      });
    }
    
    return goal;
    
  } catch (error) {
    console.error('Error getting today\'s goal:', error);
    return null;
  }
}

/**
 * Create a new daily goal
 * 
 * @param userId - User identifier  
 * @param goalParams - Goal parameters
 * @returns Created daily goal
 */
export async function createDailyGoal(
  userId: number,
  goalParams: Partial<DailyGoal>
): Promise<DailyGoal> {
  try {
    const date = goalParams.date || new Date().toISOString().split('T')[0];
    const goalId = `goal_${date.replace(/-/g, '')}_${userId}`;
    
    const goalData = {
      id: goalId,
      userId,
      date,
      targetXp: goalParams.targetXp || 50,
      targetLessons: goalParams.targetLessons || 3,
      targetMinutes: goalParams.targetMinutes || 20,
      currentXp: 0,
      currentLessons: 0,
      currentMinutes: 0,
      completed: false
    };
    
    await db('dailyGoals').insert(goalData);
    
    const createdGoal = await db('dailyGoals')
      .where({ id: goalId })
      .first();
    
    console.log(`[DailyGoal] Created goal for user ${userId} on ${date}`);
    return createdGoal;
    
  } catch (error) {
    console.error('Error creating daily goal:', error);
    throw error;
  }
}

/**
 * Update goal progress and check for completion
 * Awards XP bonus when goal is completed
 * 
 * @param userId - User identifier
 * @param progressUpdate - Progress updates
 * @returns Updated goal
 */
export async function updateGoalProgress(
  userId: number,
  progressUpdate: {
    xpGained?: number;
    lessonsCompleted?: number;
    minutesSpent?: number;
  }
): Promise<DailyGoal | null> {
  return db.transaction(async (trx: KnexTypes.Transaction) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's goal
      const goal = await trx('dailyGoals')
        .where({ userId, date: today })
        .first();
      
      if (!goal) {
        console.warn(`No daily goal found for user ${userId} on ${today}`);
        return null;
      }
      
      // Update progress
      const updates: any = {};
      if (progressUpdate.xpGained) {
        updates.currentXp = Math.min(goal.targetXp, goal.currentXp + progressUpdate.xpGained);
      }
      if (progressUpdate.lessonsCompleted) {
        updates.currentLessons = Math.min(goal.targetLessons, goal.currentLessons + progressUpdate.lessonsCompleted);
      }
      if (progressUpdate.minutesSpent) {
        updates.currentMinutes = Math.min(goal.targetMinutes, goal.currentMinutes + progressUpdate.minutesSpent);
      }
      
      await trx('dailyGoals')
        .where({ userId, date: today })
        .update({
          ...updates,
          updatedAt: trx.fn.now()
        });
      
      // Get updated goal
      const updatedGoal = await trx('dailyGoals')
        .where({ userId, date: today })
        .first();
      
      // Check if goal is now completed
      const isCompleted = 
        updatedGoal.currentXp >= updatedGoal.targetXp &&
        updatedGoal.currentLessons >= updatedGoal.targetLessons &&
        updatedGoal.currentMinutes >= updatedGoal.targetMinutes;
      
      if (isCompleted && !updatedGoal.completed) {
        // Mark as completed and award bonus XP
        await trx('dailyGoals')
          .where({ userId, date: today })
          .update({
            completed: true,
            completedAt: trx.fn.now()
          });
        
        // Award goal completion bonus XP
        const bonusXp = 25; // Bonus for completing daily goal
        await recordXpActivity(
          userId,
          'daily_goal_completed',
          bonusXp,
          trx,
          updatedGoal.id,
          { 
            goalTargets: {
              xp: updatedGoal.targetXp,
              lessons: updatedGoal.targetLessons,
              minutes: updatedGoal.targetMinutes
            }
          }
        );
        
        console.log(`[DailyGoal] User ${userId} completed daily goal! Awarded ${bonusXp} bonus XP`);
      }
      
      return await trx('dailyGoals')
        .where({ userId, date: today })
        .first();
      
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  });
}

/**
 * Check if user has completed today's goal
 * 
 * @param userId - User identifier
 * @returns True if today's goal is completed
 */
export async function checkGoalCompletion(userId: number): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const goal = await db('dailyGoals')
      .where({ userId, date: today, completed: true })
      .first();
    
    return !!goal;
    
  } catch (error) {
    console.error('Error checking goal completion:', error);
    return false;
  }
}

/**
 * Get user's goal history with statistics
 * 
 * @param userId - User identifier
 * @param days - Number of days to look back (default: 30)
 * @returns Array of daily goals with completion stats
 */
export async function getGoalHistory(
  userId: number,
  days: number = 30
): Promise<{
  goals: DailyGoal[];
  statistics: {
    totalGoals: number;
    completedGoals: number;
    completionRate: number;
    currentStreak: number;
    bestStreak: number;
    averageXp: number;
    averageLessons: number;
    averageMinutes: number;
  };
}> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    const goals = await db('dailyGoals')
      .where('userId', userId)
      .where('date', '>=', startDateStr)
      .orderBy('date', 'desc');
    
    // Calculate statistics
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    // Calculate streaks
    const { currentStreak, bestStreak } = calculateGoalStreaks(goals);
    
    // Calculate averages
    const averageXp = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.currentXp, 0) / totalGoals) : 0;
    const averageLessons = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.currentLessons, 0) / totalGoals) : 0;
    const averageMinutes = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.currentMinutes, 0) / totalGoals) : 0;
    
    return {
      goals,
      statistics: {
        totalGoals,
        completedGoals,
        completionRate,
        currentStreak,
        bestStreak,
        averageXp,
        averageLessons,
        averageMinutes
      }
    };
    
  } catch (error) {
    console.error('Error getting goal history:', error);
    return {
      goals: [],
      statistics: {
        totalGoals: 0,
        completedGoals: 0,
        completionRate: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageXp: 0,
        averageLessons: 0,
        averageMinutes: 0
      }
    };
  }
}

/**
 * Calculate goal completion streaks
 * 
 * @param goals - Array of daily goals (should be ordered by date desc)
 * @returns Current and best streak counts
 */
function calculateGoalStreaks(goals: DailyGoal[]): { currentStreak: number; bestStreak: number } {
  if (goals.length === 0) return { currentStreak: 0, bestStreak: 0 };
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Goals are ordered by date desc, so reverse for chronological order
  const chronologicalGoals = [...goals].reverse();
  
  for (let i = 0; i < chronologicalGoals.length; i++) {
    if (chronologicalGoals[i].completed) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
      
      // If this is the most recent goal and it's completed, it contributes to current streak
      if (i === chronologicalGoals.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  return { currentStreak, bestStreak };
}
```

### 2. Service Extensions (MODIFY EXISTING)

**File**: `server/src/services/progressService.ts`
**Changes**: Add gamification integration functions (EXTEND: +80 lines)

```typescript
// ADD TO EXISTING progressService.ts - append to end of file

/**
 * Calculate daily XP for user (used by gamification system)
 * Sums up all XP activities for a specific date
 * 
 * @param userId - User identifier
 * @param date - Date string (YYYY-MM-DD)
 * @returns Total XP earned on that date
 */
export async function calculateDailyXp(userId: number, date: string): Promise<number> {
  try {
    const result = await db('xpActivities')
      .where({ userId })
      .whereRaw('DATE(createdAt) = ?', [date])
      .sum('xpAmount as totalXp')
      .first();
    
    return result?.totalXp || 0;
  } catch (error) {
    console.error('Error calculating daily XP:', error);
    return 0;
  }
}

/**
 * Update weekly leaderboard rankings
 * Called by scheduled job (weekly on Monday)
 */
export async function updateWeeklyLeaderboard(): Promise<void> {
  try {
    const weekStart = getWeekStart(new Date()).toISOString().split('T')[0];
    
    // Calculate weekly XP for all users
    const weeklyStats = await db.raw(`
      SELECT 
        up.userId,
        up.weeklyXp,
        ROW_NUMBER() OVER (ORDER BY up.weeklyXp DESC) as rank
      FROM userProgress up
      WHERE up.weeklyXp > 0
      ORDER BY up.weeklyXp DESC
    `);
    
    // Update leaderboard ranks in userProgress
    for (const stat of weeklyStats) {
      await db('userProgress')
        .where({ userId: stat.userId })
        .update({ leaderboardRank: stat.rank });
    }
    
    // Store snapshot in weeklyLeaderboards table
    const leaderboardData = weeklyStats.map((stat: any) => ({
      weekStartDate: weekStart,
      userId: stat.userId,
      weeklyXp: stat.weeklyXp,
      rank: stat.rank
    }));
    
    await db('weeklyLeaderboards')
      .insert(leaderboardData)
      .onConflict(['weekStartDate', 'userId'])
      .merge();
    
    console.log(`[Leaderboard] Updated weekly leaderboard for ${weekStart}`);
  } catch (error) {
    console.error('Error updating weekly leaderboard:', error);
    throw error;
  }
}

/**
 * Award badge to user (used by gamification system)
 * 
 * @param userId - User identifier
 * @param badgeId - Badge identifier
 * @param trx - Optional database transaction
 */
export async function awardBadge(
  userId: number, 
  badgeId: string, 
  trx?: KnexTypes.Transaction
): Promise<void> {
  const database = trx || db;
  
  try {
    // Check if user already has this badge
    const existingBadge = await database('userBadges')
      .where({ userId, badgeId })
      .first();
    
    if (existingBadge) {
      console.log(`User ${userId} already has badge ${badgeId}`);
      return;
    }
    
    // Award the badge
    await database('userBadges').insert({
      userId,
      badgeId,
      unlockedAt: database.fn.now()
    });
    
    console.log(`[Badge] Awarded ${badgeId} to user ${userId}`);
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
}

/**
 * Check daily goal completion status
 * 
 * @param userId - User identifier
 * @returns True if today's goal is completed
 */
export async function checkDailyGoalCompletion(userId: number): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const goal = await db('dailyGoals')
      .where({ userId, date: today, completed: true })
      .first();
    
    return !!goal;
  } catch (error) {
    console.error('Error checking daily goal completion:', error);
    return false;
  }
}

/**
 * Get user's current leaderboard rank
 * 
 * @param userId - User identifier  
 * @param timeframe - Timeframe for ranking ('weekly' | 'monthly' | 'alltime')
 * @returns Current rank (1-based, 0 if not ranked)
 */
export async function getUserRank(
  userId: number, 
  timeframe: 'weekly' | 'monthly' | 'alltime' = 'weekly'
): Promise<number> {
  try {
    let xpColumn = 'weeklyXp';
    if (timeframe === 'monthly') xpColumn = 'monthlyXp';
    if (timeframe === 'alltime') xpColumn = 'totalXp';
    
    const result = await db.raw(`
      SELECT rank FROM (
        SELECT 
          userId,
          ROW_NUMBER() OVER (ORDER BY ${xpColumn} DESC) as rank
        FROM userProgress
        WHERE ${xpColumn} > 0
      ) ranked_users
      WHERE userId = ?
    `, [userId]);
    
    return result?.[0]?.rank || 0;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return 0;
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(d.setDate(diff));
}
```

### 3. Controller Integration (MODIFY EXISTING)

**File**: `server/src/controllers/progressController.ts`
**Changes**: Integrate gamification with existing progress tracking

```typescript
// ADD TO EXISTING progressController.ts

import { 
  recordXpActivity, 
  calculateXpForLessonCompletion,
  initializeUserGamification 
} from '../services/gamificationService.js';
import { updateGoalProgress } from '../services/dailyGoalService.js';

/**
 * Enhanced lesson completion handler with gamification
 * MODIFY EXISTING completeLesson function to include XP and goals
 */
export async function completeLesson(req: Request, res: Response): Promise<void> {
  try {
    const { lessonId, score, timeSpent } = req.body;
    const userId = req.user!.id;
    
    // Calculate XP reward based on performance
    const xpReward = await calculateXpForLessonCompletion(lessonId, score || 0, timeSpent || 15);
    
    // Record lesson completion with gamification
    await db.transaction(async (trx: Transaction) => {
      // Complete lesson using existing logic
      await completeUserLesson(userId, lessonId, trx);
      
      // Record XP activity
      await recordXpActivity(
        userId,
        'lesson_completion',
        xpReward,
        trx,
        lessonId.toString(),
        { score, timeSpent, lessonId }
      );
      
      // Update daily goal progress
      await updateGoalProgress(userId, {
        xpGained: xpReward,
        lessonsCompleted: 1,
        minutesSpent: timeSpent || 15
      });
    });
    
    res.json({
      success: true,
      xpAwarded: xpReward,
      message: `Lesson completed! +${xpReward} XP earned`
    });
    
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
}
```

### 4. API Routes (NEW)

**File**: `server/src/routes/gamification.routes.ts`
```typescript
/**
 * Gamification API Routes
 * Handles XP, badges, daily goals, and achievement endpoints
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getUserBadges,
  getAvailableAchievements,
  calculateXpForLessonCompletion
} from '../services/gamificationService.js';
import {
  getTodayGoal,
  createDailyGoal,
  updateGoalProgress,
  getGoalHistory
} from '../services/dailyGoalService.js';

const router = express.Router();

// Badge endpoints
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { category, rarity, limit } = req.query;
    
    const badges = await getUserBadges(userId, {
      category: category as string,
      rarity: rarity as string,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    res.json({ badges });
  } catch (error) {
    console.error('Error getting user badges:', error);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const achievements = await getAvailableAchievements(userId);
    
    res.json({ achievements });
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

// Daily goals endpoints  
router.get('/goals/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const goal = await getTodayGoal(userId);
    
    res.json({ goal });
  } catch (error) {
    console.error('Error getting today\'s goal:', error);
    res.status(500).json({ error: 'Failed to get daily goal' });
  }
});

router.post('/goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { targetXp, targetLessons, targetMinutes } = req.body;
    
    const goal = await createDailyGoal(userId, {
      targetXp,
      targetLessons,
      targetMinutes
    });
    
    res.json({ goal, message: 'Daily goal created successfully' });
  } catch (error) {
    console.error('Error creating daily goal:', error);
    res.status(500).json({ error: 'Failed to create daily goal' });
  }
});

router.get('/goals/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const history = await getGoalHistory(userId, days);
    
    res.json(history);
  } catch (error) {
    console.error('Error getting goal history:', error);
    res.status(500).json({ error: 'Failed to get goal history' });
  }
});

export default router;
```

## Dependencies

### Prerequisites
- Phase 1 (Database schema) must be completed successfully
- All database migrations from Phase 1 applied
- Existing progress and learning path services must be functional

### Development Dependencies
No new dependencies required - leverages existing infrastructure:
- Existing Knex.js for database operations
- Existing Express.js routing patterns
- Existing authentication middleware
- Current TypeScript configuration

## Testing Strategy

### Unit Testing
```typescript
// Test file: server/src/services/__tests__/gamificationService.test.ts
describe('Gamification Service', () => {
  test('should calculate XP correctly for lesson completion', async () => {
    const xp = await calculateXpForLessonCompletion(1, 85, 12);
    expect(xp).toBeGreaterThan(15); // Base XP + performance bonus
  });

  test('should award badges when criteria are met', async () => {
    const badges = await checkAndAwardAchievements(1, 'lesson_completion');
    expect(Array.isArray(badges)).toBe(true);
  });
});
```

### Integration Testing
- XP calculation integration with lesson completion
- Badge awarding on achievement milestones
- Daily goal progress updates
- Leaderboard ranking calculations

## Review Points

### Critical Review Areas
1. **Performance Impact**: XP calculations shouldn't slow down lesson completion
2. **Badge Logic**: Ensure badge criteria evaluation is accurate and efficient
3. **Data Consistency**: XP totals should match between activities log and cached values
4. **Gamification Balance**: XP rewards should feel fair and motivating
5. **Edge Cases**: Handle streak calculations, goal rollover, and badge edge cases

### Possible Solutions Considered

**XP Calculation Strategy:**
- ✅ **Chosen**: Performance-based XP with level, time, and type bonuses (comprehensive but not complex)
- ❌ **Rejected**: Simple fixed XP per lesson (not motivating enough)
- ❌ **Rejected**: Complex AI-based XP calculation (over-engineered for Phase 2)

**Badge System Architecture:**
- ✅ **Chosen**: JSON criteria with programmatic evaluation (flexible and extensible)
- ❌ **Rejected**: Hard-coded badge logic (not maintainable)
- ❌ **Rejected**: Rule engine system (too complex for current needs)

**Daily Goals Implementation:**
- ✅ **Chosen**: Separate goals table with progress tracking (clear separation of concerns)
- ❌ **Rejected**: Goals stored in user preferences (harder to query and analyze)
- ❌ **Rejected**: Goals as part of userProgress table (would clutter existing table)

## Success Criteria

### Functional Requirements Met
- [ ] XP system accurately calculates and awards points for all activities
- [ ] Badge system evaluates criteria and awards achievements correctly
- [ ] Daily goals track progress and award completion bonuses
- [ ] Leaderboard updates rankings based on weekly XP
- [ ] All gamification integrates seamlessly with existing lesson flow

### Performance Benchmarks
- XP calculation time < 100ms for lesson completion
- Badge evaluation time < 200ms for activity triggers
- Daily goal updates < 50ms for progress tracking
- Leaderboard updates complete in < 5 seconds for 10k+ users

### User Experience Goals
- XP gains feel rewarding and appropriately scaled
- Badge achievements provide sense of accomplishment
- Daily goals are achievable but challenging
- Progress visualization is smooth and responsive

---

**Next Phase**: [Phase 3: OAuth & Social Authentication](./phase-3-oauth-social-authentication.md)
**Dependencies for Next Phase**: Gamification infrastructure operational and tested
