/**
 * @file AssessmentQueryService - Database query service for assessment operations
 * @description Provides database query methods specifically for assessment data,
 * following the established model-based query patterns in the codebase.
 * Extracted from original monolithic service to follow Single Responsibility Principle.
 * 
 * @author AI Development Team
 * @since Task 3.1.C.3.refactor.1
 */

import { AIGeneratedContent } from '../../models/AIGeneratedContent.js';
import { AssessmentResult, AssessmentContext } from '../../types/Assessment.js';

/**
 * Time frame options for assessment queries
 */
export type AssessmentTimeframe = 'day' | 'week' | 'month' | 'all';

/**
 * Basic assessment statistics interface
 */
export interface AssessmentStats {
  totalAssessments: number;
  averageScore: number;
  lastAssessmentDate: Date | null;
  assessmentTypes: string[];
}

/**
 * Assessment type statistics interface
 */
export interface AssessmentTypeStats {
  assessmentType: string;
  averageScore: number;
  attemptCount: number;
  lastAttempt: Date;
}

/**
 * Topic-based assessment statistics interface
 */
export interface TopicAssessmentStats {
  topic: string;
  averageScore: number;
  attemptCount: number;
  lastAttempt: Date;
}

/**
 * AssessmentQueryService provides focused database query operations for assessments.
 * 
 * This service follows the established patterns in the codebase:
 * - Uses AIGeneratedContent model with type='assessment_result'
 * - Leverages existing query methods and patterns
 * - Avoids raw SQL in favor of model-based queries
 * - Follows Single Responsibility Principle by focusing only on data access
 * 
 * @example
 * ```typescript
 * const queryService = new AssessmentQueryService();
 * const recentAssessments = await queryService.findAssessmentResults(userId, 'week');
 * const stats = await queryService.getBasicAssessmentStats(userId);
 * ```
 */
export class AssessmentQueryService {
  
  /**
   * Finds assessment results for a user within a specified timeframe.
   * 
   * This method follows the existing pattern established in AIGeneratedContent.findByUserAndType()
   * and extends it with assessment-specific filtering.
   * 
   * @param userId - The ID of the user whose assessments to retrieve
   * @param timeframe - The time period to filter assessments ('day', 'week', 'month', 'all')
   * @param assessmentType - Optional filter for specific assessment type
   * @param limit - Maximum number of results to return (default: 100)
   * @returns Promise resolving to array of assessment records
   * 
   * @example
   * ```typescript
   * // Get last week's pronunciation assessments
   * const assessments = await queryService.findAssessmentResults(123, 'week', 'pronunciation');
   * ```
   */
  async findAssessmentResults(
    userId: number,
    timeframe: AssessmentTimeframe = 'week',
    assessmentType?: string,
    limit: number = 100
  ): Promise<AIGeneratedContent[]> {
    try {
      // Start with base query using existing model pattern
      let query = AIGeneratedContent.query()
        .where('userId', userId)
        .where('type', 'personalized_exercise')
        .where('status', 'completed')
        .orderBy('createdAt', 'desc');

      // Apply timeframe filter following existing date filtering patterns
      if (timeframe !== 'all') {
        const daysBack = this.getTimeframeDays(timeframe);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);
        query = query.where('createdAt', '>=', cutoffDate);
      }

      // Apply assessment type filter if specified
      if (assessmentType) {
        query = query.whereJsonSupersetOf('metadata', { assessmentStrategy: assessmentType });
      }

      // Apply limit for performance
      const results = await query.limit(limit);
      
      return results;
    } catch (error) {
      console.error('Error finding assessment results:', error);
      throw new Error(`Failed to retrieve assessment results for user ${userId}`);
    }
  }

  /**
   * Gets basic assessment statistics for a user.
   * 
   * Uses simple aggregation queries following existing patterns in the codebase.
   * Avoids complex JSON extraction in favor of JavaScript-based calculations.
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period for statistics calculation
   * @returns Promise resolving to basic assessment statistics
   * 
   * @example
   * ```typescript
   * const stats = await queryService.getBasicAssessmentStats(123, 'month');
   * console.log(`Average score: ${stats.averageScore}%`);
   * ```
   */
  async getBasicAssessmentStats(
    userId: number,
    timeframe: AssessmentTimeframe = 'month'
  ): Promise<AssessmentStats> {
    try {
      // Get assessment records using existing query method
      const assessments = await this.findAssessmentResults(userId, timeframe);
      
      if (assessments.length === 0) {
        return {
          totalAssessments: 0,
          averageScore: 0,
          lastAssessmentDate: null,
          assessmentTypes: []
        };
      }

      // Calculate statistics using JavaScript to avoid complex SQL
      const scores = assessments
        .map(assessment => assessment.generatedData?.score)
        .filter(score => typeof score === 'number') as number[];
      
      const averageScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;

      const assessmentTypes = Array.from(new Set(
        assessments
          .map(assessment => assessment.metadata?.assessmentStrategy)
          .filter(type => typeof type === 'string')
      )) as string[];

      const lastAssessmentDate = assessments.length > 0 
        ? assessments[0].createdAt 
        : null;

      return {
        totalAssessments: assessments.length,
        averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
        lastAssessmentDate,
        assessmentTypes
      };
    } catch (error) {
      console.error('Error calculating basic assessment stats:', error);
      throw new Error(`Failed to calculate assessment statistics for user ${userId}`);
    }
  }

  /**
   * Gets assessment statistics grouped by assessment type.
   * 
   * Provides insights into performance across different assessment strategies
   * (multiple-choice, pronunciation, conversation, etc.).
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period for statistics calculation
   * @param minAttempts - Minimum number of attempts required to include a type (default: 3)
   * @returns Promise resolving to array of assessment type statistics
   * 
   * @example
   * ```typescript
   * const typeStats = await queryService.getAssessmentTypeStats(123, 'month');
   * typeStats.forEach(stat => {
   *   console.log(`${stat.assessmentType}: ${stat.averageScore}% (${stat.attemptCount} attempts)`);
   * });
   * ```
   */
  async getAssessmentTypeStats(
    userId: number,
    timeframe: AssessmentTimeframe = 'month',
    minAttempts: number = 3
  ): Promise<AssessmentTypeStats[]> {
    try {
      const assessments = await this.findAssessmentResults(userId, timeframe);
      
      // Group assessments by type using JavaScript
      const typeGroups = new Map<string, AIGeneratedContent[]>();
      
      assessments.forEach(assessment => {
        const assessmentType = assessment.metadata?.assessmentStrategy;
        if (typeof assessmentType === 'string') {
          if (!typeGroups.has(assessmentType)) {
            typeGroups.set(assessmentType, []);
          }
          typeGroups.get(assessmentType)!.push(assessment);
        }
      });

      // Calculate statistics for each type
      const typeStats: AssessmentTypeStats[] = [];
      
      for (const [assessmentType, typeAssessments] of typeGroups) {
        if (typeAssessments.length >= minAttempts) {
          const scores = typeAssessments
            .map(assessment => assessment.generatedData?.score)
            .filter(score => typeof score === 'number') as number[];
          
          if (scores.length > 0) {
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            const lastAttempt = typeAssessments[0].createdAt; // Already sorted by createdAt desc
            
            typeStats.push({
              assessmentType,
              averageScore: Math.round(averageScore * 100) / 100,
              attemptCount: typeAssessments.length,
              lastAttempt
            });
          }
        }
      }

      // Sort by average score (ascending) to show weakest areas first
      return typeStats.sort((a, b) => a.averageScore - b.averageScore);
    } catch (error) {
      console.error('Error calculating assessment type stats:', error);
      throw new Error(`Failed to calculate assessment type statistics for user ${userId}`);
    }
  }

  /**
   * Gets assessment statistics grouped by topic.
   * 
   * Analyzes performance across different learning topics to identify
   * areas where the user needs improvement.
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period for statistics calculation
   * @param minAttempts - Minimum number of attempts required to include a topic (default: 2)
   * @returns Promise resolving to array of topic assessment statistics
   * 
   * @example
   * ```typescript
   * const topicStats = await queryService.getTopicAssessmentStats(123, 'month');
   * const weakTopics = topicStats.filter(stat => stat.averageScore < 70);
   * ```
   */
  async getTopicAssessmentStats(
    userId: number,
    timeframe: AssessmentTimeframe = 'month',
    minAttempts: number = 2
  ): Promise<TopicAssessmentStats[]> {
    try {
      const assessments = await this.findAssessmentResults(userId, timeframe);
      
      // Group assessments by topic using JavaScript
      const topicGroups = new Map<string, AIGeneratedContent[]>();
      
      assessments.forEach(assessment => {
        const topics = assessment.topics;
        if (Array.isArray(topics)) {
          topics.forEach(topic => {
            if (typeof topic === 'string') {
              if (!topicGroups.has(topic)) {
                topicGroups.set(topic, []);
              }
              topicGroups.get(topic)!.push(assessment);
            }
          });
        }
      });

      // Calculate statistics for each topic
      const topicStats: TopicAssessmentStats[] = [];
      
      for (const [topic, topicAssessments] of topicGroups) {
        if (topicAssessments.length >= minAttempts) {
          const scores = topicAssessments
            .map(assessment => assessment.generatedData?.score)
            .filter(score => typeof score === 'number') as number[];
          
          if (scores.length > 0) {
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            const lastAttempt = topicAssessments[0].createdAt; // Already sorted by createdAt desc
            
            topicStats.push({
              topic,
              averageScore: Math.round(averageScore * 100) / 100,
              attemptCount: topicAssessments.length,
              lastAttempt
            });
          }
        }
      }

      // Sort by average score (ascending) to show weakest topics first
      return topicStats.sort((a, b) => a.averageScore - b.averageScore);
    } catch (error) {
      console.error('Error calculating topic assessment stats:', error);
      throw new Error(`Failed to calculate topic assessment statistics for user ${userId}`);
    }
  }

  /**
   * Checks if a user has sufficient assessment data for meaningful analytics.
   * 
   * Determines whether analytics calculations would be reliable based on
   * the number of completed assessments.
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period to check
   * @param minAssessments - Minimum number of assessments required (default: 5)
   * @returns Promise resolving to boolean indicating if sufficient data exists
   * 
   * @example
   * ```typescript
   * const hasSufficientData = await queryService.hasSufficientData(123, 'month');
   * if (!hasSufficientData) {
   *   return { message: 'Complete more assessments for better insights' };
   * }
   * ```
   */
  async hasSufficientData(
    userId: number,
    timeframe: AssessmentTimeframe = 'month',
    minAssessments: number = 5
  ): Promise<boolean> {
    try {
      // Use count query for efficiency instead of fetching all records
      let query = AIGeneratedContent.query()
        .where('userId', userId)
        .where('type', 'personalized_exercise')
        .where('status', 'completed');

      // Apply timeframe filter if needed
      if (timeframe !== 'all') {
        const daysBack = this.getTimeframeDays(timeframe);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);
        query = query.where('createdAt', '>=', cutoffDate);
      }

      const countResult = await query.count('* as count').first() as { count: string | number } | undefined;
      const count = parseInt(String(countResult?.count || 0)) || 0;

      return count >= minAssessments;
    } catch (error) {
      console.error('Error checking sufficient data:', error);
      return false;
    }
  }

  /**
   * Converts timeframe string to number of days for date calculations.
   * 
   * @private
   * @param timeframe - The timeframe to convert
   * @returns Number of days to look back
   */
  private getTimeframeDays(timeframe: AssessmentTimeframe): number {
    switch (timeframe) {
      case 'day':
        return 1;
      case 'week':
        return 7;
      case 'month':
        return 30;
      default:
        return 30;
    }
  }
}
