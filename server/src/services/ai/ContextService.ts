/**
 * ContextService - User Context Management for AI
 * 
 * This service is responsible for fetching, processing, and managing user-specific
 * context data required by the AI Orchestrator for personalization.
 * 
 * TODO: Implement full database integration for loading user context (Future Task).
 * For now, this provides a stubbed implementation.
 */

import { AIUserContext } from '../../types/AI';

/**
 * @interface ILogger
 * @description Temporary logger interface to support future structured logging implementation.
 *              TODO: Replace with proper structured logger (Future Consideration #16)
 */
interface ILogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: any): void;
  debug(message: string, ...args: any[]): void;
}

/**
 * @class ContextService
 * @description Manages user context data for AI personalization.
 */
export class ContextService {
  private logger: ILogger;

  /**
   * @constructor
   * @param logger - Logger instance (defaults to console for now)
   */
  constructor(logger: ILogger = console) {
    this.logger = logger;
    this.logger.info('[ContextService] Initialized (stubbed)');
  }

  /**
   * Fetches and prepares user context data for an AI request.
   * 
   * TODO: Implement actual data loading from database (User, UserPreference, Progress, etc.)
   * For now, returns a mock context.
   * 
   * @param userId - The ID of the user
   * @returns Promise<AIUserContext> - The user's AI context
   */
  async getUserContext(userId: string): Promise<AIUserContext> {
    this.logger.debug(`[ContextService] Fetching context for user: ${userId} (stubbed)`);
    
    // Mock data for now
    return {
      id: userId,
      firstName: 'MockUser',
      role: 'user',
      preferences: {
        learningStyle: 'visual',
        preferredLanguage: 'french',
        difficultyLevel: 'intermediate',
      },
      // progressSummary: { // TODO: Task 3.2.C - Add lean progress summary
      //   recentScores: [85, 90, 78],
      //   weakTopics: ['Subjunctive', 'Past Participle'],
      //   learningStreak: 7,
      // },
    };
  }
}
