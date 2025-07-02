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
    await this.cache.delete(cacheKey);
    // In a full implementation, this would also write `updates` to the database.
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
}
