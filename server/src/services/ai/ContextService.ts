/**
 * @file ContextService.ts
 * @description Manages user-specific context for AI personalization.
 *
 * This service is responsible for fetching, processing, and caching user-specific
 * context data required by AI services. It uses a cache-through strategy to
 * optimize performance.
 */

import { ILearningContextService } from '../contentGeneration/interfaces';
import { LearningContext } from '../../types/Content';
import { AIUserContext } from '../../types/AI';
import { AssessmentContext, FrenchLevel } from '../../types/Assessment';
import { ICacheService } from '../common/ICacheService';
import { getUserById, UserApplicationData } from '../../models/User';
import UserPreferenceModel from '../../models/UserPreference';
import { ILogger } from '../../types/ILogger';

const CONTEXT_CACHE_TTL_SECONDS = 60 * 5; // 5 minutes

/**
 * @class ContextService
 * @implements {ILearningContextService}
 * @description Manages user context data for AI personalization.
 */
export class ContextService implements ILearningContextService {
  private cache: ICacheService;
  private logger: ILogger;

  constructor(cacheService: ICacheService, logger: ILogger = console) {
    this.cache = cacheService;
    this.logger = logger;
    this.logger.info('[ContextService] Initialized');
  }

  /**
   * Retrieves the full learning context for a user, using a cache-through strategy.
   * @param userId - The ID of the user.
   * @returns {Promise<LearningContext>} The user's learning context.
   */
  public async getUserContext(userId: number): Promise<LearningContext> {
    const cacheKey = `user-context:${userId}`;
    const cachedContext = await this.cache.get<LearningContext>(cacheKey);

    if (cachedContext) {
      this.logger.debug(`[ContextService] Cache hit for user: ${userId}`);
      return cachedContext;
    }

    this.logger.debug(`[ContextService] Cache miss for user: ${userId}. Fetching from DB.`);
    const context = await this.fetchAndBuildContext(userId);
    await this.cache.set(cacheKey, context, CONTEXT_CACHE_TTL_SECONDS);

    return context;
  }

  /**
   * Updates parts of a user's context and invalidates the cache.
   * @param userId - The ID of the user to update.
   * @param updates - The partial context data to update (not yet implemented).
   */
  public async updateContext(userId: number, updates: Partial<LearningContext>): Promise<void> {
    const cacheKey = `user-context:${userId}`;
    this.logger.info(`[ContextService] Invalidating cache for user: ${userId}`);
    await this.cache.del(cacheKey);
    // In a full implementation, this would also write `updates` to the database.
  }

  /**
   * Retrieves assessment-specific context for a user with optimized query performance.
   * Focuses on data needed specifically for assessment processing.
   * 
   * @param {number} userId The user ID to get assessment context for
   * @returns {Promise<AssessmentContext>} Assessment-specific context data
   * 
   * @example
   * ```typescript
   * const assessmentContext = await contextService.getAssessmentContext(123);
   * // Returns: { userId: 123, skillArea: "vocabulary", userLevel: "A2", ... }
   * ```
   */
  public async getAssessmentContext(userId: number): Promise<AssessmentContext> {
    const cacheKey = `assessment-context:${userId}`;
    const cachedContext = await this.cache.get<AssessmentContext>(cacheKey);

    if (cachedContext) {
      this.logger.debug(`[ContextService] Assessment context cache hit for user: ${userId}`);
      return cachedContext;
    }

    this.logger.debug(`[ContextService] Assessment context cache miss for user: ${userId}. Fetching optimized context.`);
    
    try {
      const context = await this.fetchAssessmentContext(userId);
      
      // Cache with shorter TTL for assessment-specific context (more dynamic)
      await this.cache.set(cacheKey, context, CONTEXT_CACHE_TTL_SECONDS / 2); // 2.5 minutes
      
      return context;
    } catch (error) {
      this.logger.error(`[ContextService] Failed to fetch assessment context for user ${userId}`, { error });
      // Return fallback context
      return this.createFallbackAssessmentContext(userId);
    }
  }

  /**
   * Retrieves assessment context for multiple users efficiently.
   * Optimized for batch assessment processing scenarios.
   * 
   * @param {number[]} userIds Array of user IDs to get contexts for
   * @returns {Promise<Map<number, AssessmentContext>>} Map of user ID to assessment context
   * 
   * @example
   * ```typescript
   * const contexts = await contextService.getBatchAssessmentContext([123, 456, 789]);
   * const user123Context = contexts.get(123);
   * ```
   * 
   * @todo Implement query optimization for large batches (see future_implementation_considerations.md #36)
   */
  public async getBatchAssessmentContext(userIds: number[]): Promise<Map<number, AssessmentContext>> {
    const contextMap = new Map<number, AssessmentContext>();
    
    if (userIds.length === 0) {
      return contextMap;
    }

    this.logger.debug(`[ContextService] Fetching batch assessment context for ${userIds.length} users`);

    // For small batches, use individual context loading with cache benefits
    if (userIds.length <= 10) {
      const contextPromises = userIds.map(async (userId) => {
        try {
          const context = await this.getAssessmentContext(userId);
          return { userId, context };
        } catch (error) {
          this.logger.warn(`[ContextService] Failed to get assessment context for user ${userId}`, { error });
          return { userId, context: this.createFallbackAssessmentContext(userId) };
        }
      });

      const results = await Promise.allSettled(contextPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          contextMap.set(result.value.userId, result.value.context);
        } else {
          const userId = userIds[index];
          this.logger.error(`[ContextService] Critical error getting context for user ${userId}`, { error: result.reason });
          contextMap.set(userId, this.createFallbackAssessmentContext(userId));
        }
      });

      return contextMap;
    }

    // For large batches, implement optimized batch loading
    // TODO: Implement direct batch query for better performance (future_implementation_considerations.md #36)
    this.logger.warn(`[ContextService] Large batch context loading (${userIds.length} users). Consider implementing batch optimization.`);
    
    try {
      const batchContexts = await this.fetchBatchAssessmentContext(userIds);
      
      userIds.forEach((userId, index) => {
        const context = batchContexts[index] || this.createFallbackAssessmentContext(userId);
        contextMap.set(userId, context);
      });
      
      return contextMap;
    } catch (error) {
      this.logger.error(`[ContextService] Batch assessment context loading failed`, { error, userCount: userIds.length });
      
      // Fallback: create basic contexts for all users
      userIds.forEach(userId => {
        contextMap.set(userId, this.createFallbackAssessmentContext(userId));
      });
      
      return contextMap;
    }
  }

  /**
   * Invalidates assessment context cache for a user.
   * Should be called when user's assessment-relevant data changes.
   * 
   * @param {number} userId The user ID to invalidate cache for
   */
  public async invalidateAssessmentContext(userId: number): Promise<void> {
    const cacheKey = `assessment-context:${userId}`;
    this.logger.debug(`[ContextService] Invalidating assessment context cache for user: ${userId}`);
    await this.cache.del(cacheKey);
  }

  /**
   * Retrieves the lean AI-specific user context.
   * This is a convenience method for services that only need the AIUserContext.
   * @param userId - The ID of the user.
   * @returns {Promise<AIUserContext>} The user's lean AI context.
   */
  public async getAIUserContext(userId: number): Promise<AIUserContext> {
    const fullContext = await this.getUserContext(userId);
    const user = await getUserById(userId); // We need the user data for this

    // Map the full LearningContext to the leaner AIUserContext
    return {
      id: fullContext.userId,
      firstName: user?.firstName || 'User',
      role: user?.role || 'user',
      preferences: {
        learningStyle: fullContext.learningStyle,
        difficultyLevel: fullContext.currentLevel,
      },
    };
  }

  /**
   * Fetches all required data from the database and builds the LearningContext object.
   * @param userId - The ID of the user.
   * @returns {Promise<LearningContext>} The fully constructed learning context.
   */
  private async fetchAndBuildContext(userId: number): Promise<LearningContext> {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const preferencesData = await UserPreferenceModel.findByUserId(userId);
    const preferences = preferencesData ? JSON.parse(preferencesData.preferences) : {};

    // TODO: Future Implementation #40 - This is a performance bottleneck.
    // These aggregations should be moved to an asynchronous background job that
    // pre-calculates and stores these analytics in a dedicated summary table.
    // For now, we perform a simplified query.
    const recentTopics = await this.getRecentTopics(userId);
    const weakAreas = await this.getWeakAreas(userId);

    return {
      userId: user.id,
      currentLevel: preferences.difficultyLevel || 'intermediate',
      learningStyle: preferences.learningStyle || 'mixed',
      weakAreas,
      strengths: [], // Placeholder for strengths analysis
      interests: preferences.interests || [],
      recentTopics,
      performanceHistory: [], // Placeholder for performance history
      lastActivity: new Date(user.updatedAt || user.createdAt),
      streakDays: 0, // Placeholder for streak calculation
      totalLessons: 0, // Placeholder for total lesson count
    };
  }

  // NOTE: The following methods are simplified for this task.
  // A full implementation would involve more complex data analysis.

  private async getRecentTopics(userId: number): Promise<string[]> {
    // Simplified: Get topics from the last 5 completed lessons.
    // A real implementation would be more sophisticated.
    return ['Subjunctive', 'Passé Composé']; // Mocked for now
  }

  private async getWeakAreas(userId: number): Promise<string[]> {
    // Simplified: Identify topics with the lowest scores.
    // A real implementation would analyze user_content_completions.
    return ['Gender of Nouns']; // Mocked for now
  }

  /**
   * Fetches assessment-specific context data with optimized queries.
   * Focuses only on data needed for assessment processing.
   * 
   * @private
   * @param {number} userId The user ID to fetch context for
   * @returns {Promise<AssessmentContext>} Optimized assessment context
   * 
   * @todo Optimize database queries with selective field loading (see future_implementation_considerations.md #36)
   */
  private async fetchAssessmentContext(userId: number): Promise<AssessmentContext> {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found for assessment context.`);
    }

    // Get user preferences with selective loading for assessment needs
    const preferencesData = await UserPreferenceModel.findByUserId(userId);
    const preferences = preferencesData ? JSON.parse(preferencesData.preferences) : {};

    // Get recent skill area focus from user activity
    const recentSkillArea = await this.getRecentSkillArea(userId);
    
    // Determine French level from preferences or use intelligent fallback
    const userLevel = this.determineUserFrenchLevel(preferences, user);

    return {
      userId: user.id,
      skillArea: recentSkillArea,
      userLevel,
      culturalContext: preferences.culturalContext !== false, // Default to true unless explicitly disabled
      previousAttempts: 0, // Will be set by assessment engine based on specific question
    };
  }

  /**
   * Fetches assessment context for multiple users with optimized batch queries.
   * 
   * @private
   * @param {number[]} userIds Array of user IDs to fetch contexts for
   * @returns {Promise<AssessmentContext[]>} Array of assessment contexts in same order as userIds
   */
  private async fetchBatchAssessmentContext(userIds: number[]): Promise<AssessmentContext[]> {
    // TODO: Implement optimized batch queries (future_implementation_considerations.md #36)
    // For now, use Promise.all for concurrent individual queries
    const contexts = await Promise.all(
      userIds.map(async (userId) => {
        try {
          return await this.fetchAssessmentContext(userId);
        } catch (error) {
          this.logger.warn(`[ContextService] Failed to fetch assessment context for user ${userId} in batch`, { error });
          return this.createFallbackAssessmentContext(userId);
        }
      })
    );

    return contexts;
  }

  /**
   * Creates a fallback assessment context when data fetching fails.
   * Ensures assessment processing can continue with reasonable defaults.
   * 
   * @private
   * @param {number} userId The user ID to create fallback context for
   * @returns {AssessmentContext} Safe fallback assessment context
   */
  private createFallbackAssessmentContext(userId: number): AssessmentContext {
    return {
      userId,
      skillArea: 'general', // Safe default skill area
      userLevel: 'A1', // Conservative level assumption
      culturalContext: true, // Enable cultural context by default
      previousAttempts: 0,
    };
  }

  /**
   * Determines the user's recent skill area focus from their activity.
   * Uses intelligent analysis of recent lessons and assessments.
   * 
   * @private
   * @param {number} userId The user ID to analyze
   * @returns {Promise<string>} The user's current skill area focus
   * 
   * @todo Implement sophisticated skill area analysis (see future_implementation_considerations.md #33)
   */
  private async getRecentSkillArea(userId: number): Promise<string> {
    // TODO: Analyze recent lesson completions and assessment patterns
    // For now, return intelligent defaults based on user progression
    try {
      // In a full implementation, this would query:
      // - Recent lesson topics from user_lesson_progress
      // - Recent assessment categories from ai_generated_content
      // - User preferences for skill focus
      
      // Simplified implementation with common skill areas
      const commonSkillAreas = ['vocabulary', 'grammar', 'pronunciation', 'conversation', 'reading'];
      const defaultIndex = userId % commonSkillAreas.length;
      return commonSkillAreas[defaultIndex];
    } catch (error) {
      this.logger.warn(`[ContextService] Could not determine skill area for user ${userId}`, { error });
      return 'vocabulary'; // Safe fallback
    }
  }

  /**
   * Determines the user's French proficiency level from available data.
   * Uses preferences, progress data, and intelligent fallbacks.
   * 
   * @private
   * @param {any} preferences User preferences object
   * @param {UserApplicationData} user User data object
   * @returns {FrenchLevel} The determined French level
   */
  private determineUserFrenchLevel(preferences: any, user: UserApplicationData): FrenchLevel {
    // Priority order for level determination:
    // 1. Explicit user preference
    // 2. Calculated from progress data
    // 3. Intelligent fallback based on account age

    if (preferences.frenchLevel && this.isValidFrenchLevel(preferences.frenchLevel)) {
      return preferences.frenchLevel as FrenchLevel;
    }

    if (preferences.difficultyLevel && this.isValidFrenchLevel(preferences.difficultyLevel)) {
      return preferences.difficultyLevel as FrenchLevel;
    }

    // Fallback logic based on account creation date
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);

    if (daysSinceCreation < 7) {
      return 'A1'; // New users start at beginner level
    } else if (daysSinceCreation < 30) {
      return 'A2'; // Users after a week likely progressed
    } else if (daysSinceCreation < 90) {
      return 'B1'; // Users after a month likely intermediate
    } else {
      return 'B2'; // Established users likely upper intermediate
    }
  }

  /**
   * Validates if a string is a valid French CEFR level.
   * 
   * @private
   * @param {string} level The level string to validate
   * @returns {boolean} True if valid French level
   */
  private isValidFrenchLevel(level: string): boolean {
    const validLevels: FrenchLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return validLevels.includes(level as FrenchLevel);
  }
}
