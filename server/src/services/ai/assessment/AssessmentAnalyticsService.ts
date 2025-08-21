import { AssessmentRepository } from '../../../repositories/assessmentRepository.js';
import Knex from 'knex';
import { 
  AssessmentRequest, 
  AssessmentResult, 
  BatchAssessmentResult,
  FrenchLevel,
  ResponseType
} from '../../../types/Assessment.js';
import { ILogger, createLogger } from '../../../utils/logger.js';

/**
 * Options for retrieving assessment history
 */
export interface AssessmentHistoryOptions {
  /** Maximum number of assessments to retrieve (default: 50) */
  limit?: number;
  /** Skip the first N assessments for pagination (default: 0) */
  offset?: number;
  /** Filter by specific response type */
  responseType?: ResponseType;
  /** Filter by skill area */
  skillArea?: string;
  /** Filter by French level */
  frenchLevel?: FrenchLevel;
  /** Include only successful assessments (default: false) */
  successfulOnly?: boolean;
  /** Date range start for filtering */
  startDate?: Date;
  /** Date range end for filtering */
  endDate?: Date;
}

/**
 * Assessment performance analytics data
 */
export interface AssessmentAnalytics {
  totalAssessments: number;
  successfulAssessments: number;
  failedAssessments: number;
  averageScore: number;
  accuracy: number;
  responseTypeBreakdown: Record<ResponseType, {
    count: number;
    averageScore: number;
    accuracy: number;
  }>;
  skillAreaBreakdown: Record<string, {
    count: number;
    averageScore: number;
    accuracy: number;
  }>;
  progressTrend: {
    period: string;
    averageScore: number;
    assessmentCount: number;
  }[];
  weakAreas: string[];
  strengths: string[];
  recommendations: string[];
}

/**
 * @class AssessmentAnalyticsService
 * @description A focused service for assessment analytics, history retrieval, and performance tracking.
 * Handles recording assessment data and generating insights while following existing patterns.
 * 
 * Follows Single Responsibility Principle - ONLY handles analytics and history concerns.
 * 
 * @example
 * ```typescript
 * const analyticsService = new AssessmentAnalyticsService(assessmentRepo, AIGeneratedContent);
 * 
 * // Record an assessment
 * await analyticsService.recordAssessment(request, result);
 * 
 * // Get assessment history
 * const history = await analyticsService.getAssessmentHistory(123, { limit: 20 });
 * 
 * // Get analytics
 * const analytics = await analyticsService.getAssessmentAnalytics(123);
 * ```
 */
export class AssessmentAnalyticsService {
  private readonly logger: ILogger;

  /**
   * Creates an instance of AssessmentAnalyticsService.
   * @param {AssessmentRepository} assessmentRepository The assessment repository for data access
   * @param {Knex} db The database instance for direct queries
   * @param {ILogger} [logger] Optional logger instance
   */
  constructor(
    private readonly assessmentRepository: AssessmentRepository,
    private readonly db: Knex,
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('AssessmentAnalyticsService');
  }

  /**
   * Records an assessment result for analytics and history tracking.
   * Uses existing database tables following established patterns.
   * 
   * @param {AssessmentRequest} request The original assessment request
   * @param {AssessmentResult} result The assessment result to record
   * @returns {Promise<void>} Promise that resolves when recording is complete
   * 
   * @example
   * ```typescript
   * await analyticsService.recordAssessment(
   *   { userId: 123, userResponse: "Bonjour", ... },
   *   { score: 95, isCorrect: true, ... }
   * );
   * ```
   */
  public async recordAssessment(request: AssessmentRequest, result: AssessmentResult): Promise<void> {
    try {
      this.logger.debug('Recording assessment for analytics', {
        userId: request.userId,
        responseType: request.responseType,
        score: result.score,
        isCorrect: result.isCorrect
      });

      // Insert directly into userAssessments table following existing patterns
      await this.db('userAssessments').insert({
        userId: request.userId,
        assessmentTypeId: result.assessmentTypeId || null,
        userResponse: request.userResponse,
        isCorrect: result.isCorrect,
        score: result.score,
        feedback: JSON.stringify(result.feedback),
        confidence: result.confidence,
        metadata: JSON.stringify({
          responseType: request.responseType,
          skillArea: request.context.skillArea,
          userLevel: request.context.userLevel,
          isFallback: result.isFallback,
          exerciseId: request.context.exerciseId,
          lessonId: request.context.lessonId,
          batchIndex: request.context.batchIndex,
          processingTime: result.processingTime,
        })
      });

      this.logger.debug('Assessment recorded successfully', {
        userId: request.userId,
        responseType: request.responseType
      });

    } catch (error) {
      this.logger.error('Failed to record assessment', { 
        error, 
        userId: request.userId,
        responseType: request.responseType 
      });
      // Don't throw - analytics recording shouldn't break assessment flow
    }
  }

  /**
   * Records a batch assessment result for analytics tracking.
   * Creates a completion record for the batch exercise.
   * 
   * @param {BatchAssessmentResult} batchResult The batch assessment result to record
   * @param {number} userId The user ID for the batch assessment
   * @returns {Promise<void>} Promise that resolves when recording is complete
   */
  public async recordBatchAssessment(batchResult: BatchAssessmentResult, userId: number): Promise<void> {
    try {
      this.logger.debug('Recording batch assessment for analytics', {
        userId,
        exerciseId: batchResult.exerciseId,
        totalQuestions: batchResult.totalQuestions,
        successful: batchResult.successfulAssessments,
        overallScore: batchResult.overallScore
      });

      // Create a completion record for the batch exercise
      // Note: Individual assessments should be recorded separately via recordAssessment
      await this.db('userContentCompletions').insert({
        userId,
        contentId: parseInt(batchResult.exerciseId) || 0, // Convert to number or use default
        completedAt: batchResult.timestamp,
        score: batchResult.overallScore,
        metadata: JSON.stringify({
          type: 'batch_completion',
          accuracy: batchResult.accuracy,
          totalQuestions: batchResult.totalQuestions,
          successfulAssessments: batchResult.successfulAssessments,
          failedAssessments: batchResult.failedAssessments,
          processingTime: batchResult.processingTime,
          lessonId: batchResult.lessonId,
        })
      });

      this.logger.debug('Batch assessment recorded successfully', {
        userId,
        exerciseId: batchResult.exerciseId
      });

    } catch (error) {
      this.logger.error('Failed to record batch assessment', { error, batchResult, userId });
      // Don't throw - analytics recording shouldn't break assessment flow
    }
  }

  /**
   * Retrieves assessment history for a user with filtering and pagination.
   * 
   * @param {number} userId The user ID to get history for
   * @param {AssessmentHistoryOptions} [options] Options for filtering and pagination
   * @returns {Promise<AssessmentResult[]>} Array of assessment results
   * 
   * @example
   * ```typescript
   * const history = await analyticsService.getAssessmentHistory(123, {
   *   limit: 20,
   *   responseType: 'fill-in-blank',
   *   successfulOnly: true
   * });
   * ```
   */
  public async getAssessmentHistory(
    userId: number, 
    options: AssessmentHistoryOptions = {}
  ): Promise<AssessmentResult[]> {
    const {
      limit = 50,
      offset = 0,
      responseType,
      skillArea,
      frenchLevel,
      successfulOnly = false,
      startDate,
      endDate
    } = options;

    try {
      this.logger.debug('Retrieving assessment history', {
        userId,
        limit,
        offset,
        responseType,
        skillArea,
        successfulOnly
      });

      // Build query using existing database tables
      let query = this.db('userAssessments')
        .where('userId', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset);

      // Apply filters using JSON metadata fields
      if (responseType) {
        query = query.whereRaw("metadata->>'responseType' = ?", [responseType]);
      }

      if (skillArea) {
        query = query.whereRaw("metadata->>'skillArea' = ?", [skillArea]);
      }

      if (frenchLevel) {
        query = query.whereRaw("metadata->>'userLevel' = ?", [frenchLevel]);
      }

      if (successfulOnly) {
        query = query.where('isCorrect', true);
      }

      if (startDate) {
        query = query.where('createdAt', '>=', startDate);
      }

      if (endDate) {
        query = query.where('createdAt', '<=', endDate);
      }

      const assessmentRecords = await query;

      // Map to AssessmentResult format
      const results = assessmentRecords.map((record: any) => {
        const metadata = typeof record.metadata === 'string' 
          ? JSON.parse(record.metadata) 
          : record.metadata || {};
        const feedback = typeof record.feedback === 'string'
          ? JSON.parse(record.feedback)
          : record.feedback || {};

        return {
          assessmentTypeId: record.assessmentTypeId,
          userResponse: record.userResponse,
          isCorrect: record.isCorrect,
          score: record.score,
          feedback,
          confidence: record.confidence,
          assessmentType: metadata.responseType || 'unknown',
          isFallback: metadata.isFallback || false,
          processingTime: metadata.processingTime,
          metadata: {
            ...metadata,
            recordId: record.id,
            createdAt: record.createdAt,
            fromHistory: true,
          },
        } as AssessmentResult;
      });

      this.logger.debug('Assessment history retrieved', {
        userId,
        recordCount: results.length
      });

      return results;

    } catch (error) {
      this.logger.error('Error retrieving assessment history', { error, userId, options });
      return []; // Return empty array on error
    }
  }

  /**
   * Generates comprehensive analytics for a user's assessment performance.
   * 
   * @param {number} userId The user ID to generate analytics for
   * @param {Date} [since] Optional date to filter analytics from
   * @returns {Promise<AssessmentAnalytics>} Comprehensive analytics data
   * 
   * @example
   * ```typescript
   * const analytics = await analyticsService.getAssessmentAnalytics(123);
   * console.log(`Average score: ${analytics.averageScore}`);
   * console.log(`Weak areas: ${analytics.weakAreas.join(', ')}`);
   * ```
   * 
   * @todo Implement advanced analytics with ML insights (see future_implementation_considerations.md #37)
   */
  public async getAssessmentAnalytics(userId: number, since?: Date): Promise<AssessmentAnalytics> {
    try {
      this.logger.debug('Generating assessment analytics', { userId, since });

      // Get all assessments for the user
      const historyOptions: AssessmentHistoryOptions = {
        limit: 1000, // Large limit for comprehensive analytics
        startDate: since,
      };

      const assessments = await this.getAssessmentHistory(userId, historyOptions);

      if (assessments.length === 0) {
        return this.createEmptyAnalytics();
      }

      // Calculate basic metrics
      const totalAssessments = assessments.length;
      const successfulAssessments = assessments.filter(a => a.isCorrect).length;
      const failedAssessments = totalAssessments - successfulAssessments;
      const averageScore = Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments);
      const accuracy = Math.round((successfulAssessments / totalAssessments) * 100);

      // Generate breakdowns
      const responseTypeBreakdown = this.generateResponseTypeBreakdown(assessments);
      const skillAreaBreakdown = this.generateSkillAreaBreakdown(assessments);
      const progressTrend = this.generateProgressTrend(assessments);

      // Analyze performance patterns
      const weakAreas = this.identifyWeakAreas(skillAreaBreakdown);
      const strengths = this.identifyStrengths(skillAreaBreakdown);
      const recommendations = this.generateRecommendations(weakAreas, strengths, accuracy);

      const analytics: AssessmentAnalytics = {
        totalAssessments,
        successfulAssessments,
        failedAssessments,
        averageScore,
        accuracy,
        responseTypeBreakdown,
        skillAreaBreakdown,
        progressTrend,
        weakAreas,
        strengths,
        recommendations,
      };

      this.logger.debug('Assessment analytics generated', {
        userId,
        totalAssessments,
        averageScore,
        accuracy
      });

      return analytics;

    } catch (error) {
      this.logger.error('Error generating assessment analytics', { error, userId });
      return this.createEmptyAnalytics();
    }
  }

  /**
   * Gets analytics service health and statistics.
   * 
   * @returns {object} Service statistics and health information
   */
  public getServiceStats(): object {
    return {
      service: 'AssessmentAnalyticsService',
      features: [
        'assessment_recording',
        'history_retrieval',
        'performance_analytics',
        'batch_assessment_tracking',
        'trend_analysis'
      ],
      supportedFilters: [
        'responseType',
        'skillArea', 
        'frenchLevel',
        'dateRange',
        'successfulOnly'
      ],
      analyticsCapabilities: [
        'response_type_breakdown',
        'skill_area_analysis',
        'progress_trending',
        'weakness_identification',
        'strength_analysis',
        'personalized_recommendations'
      ]
    };
  }

  // Private helper methods

  /**
   * Sanitizes assessment request for storage, removing sensitive data.
   * @private
   */
  private sanitizeRequestForStorage(request: AssessmentRequest): any {
    return {
      responseType: request.responseType,
      context: {
        skillArea: request.context.skillArea,
        userLevel: request.context.userLevel,
        exerciseId: request.context.exerciseId,
        lessonId: request.context.lessonId,
        batchIndex: request.context.batchIndex,
      },
      // Exclude userResponse and expectedAnswer for privacy
    };
  }

  /**
   * Sanitizes assessment result for storage.
   * @private
   */
  private sanitizeResultForStorage(result: AssessmentResult): any {
    return {
      score: result.score,
      isCorrect: result.isCorrect,
      confidence: result.confidence,
      assessmentType: result.assessmentType,
      isFallback: result.isFallback,
      processingTime: result.processingTime,
      feedback: {
        tone: result.feedback.tone,
        // Exclude detailed feedback messages for storage efficiency
      },
      // Exclude detailed metadata to reduce storage size
    };
  }

  /**
   * Maps confidence level to numerical score for analytics.
   * @private
   */
  private mapConfidenceToScore(confidence: string): number {
    switch (confidence) {
      case 'high': return 0.9;
      case 'medium': return 0.7;
      case 'low': return 0.5;
      default: return 0.5;
    }
  }

  /**
   * Creates empty analytics structure for users with no assessment history.
   * @private
   */
  private createEmptyAnalytics(): AssessmentAnalytics {
    return {
      totalAssessments: 0,
      successfulAssessments: 0,
      failedAssessments: 0,
      averageScore: 0,
      accuracy: 0,
      responseTypeBreakdown: {} as any,
      skillAreaBreakdown: {} as any,
      progressTrend: [],
      weakAreas: [],
      strengths: [],
      recommendations: ['Complete some assessments to see personalized analytics!'],
    };
  }

  /**
   * Generates response type breakdown analytics.
   * @private
   */
  private generateResponseTypeBreakdown(assessments: AssessmentResult[]): Record<ResponseType, any> {
    const breakdown: Record<string, any> = {};

    const responseTypes = [...new Set(assessments.map(a => a.assessmentType))];
    
    for (const type of responseTypes) {
      const typeAssessments = assessments.filter(a => a.assessmentType === type);
      const averageScore = Math.round(typeAssessments.reduce((sum, a) => sum + a.score, 0) / typeAssessments.length);
      const accuracy = Math.round((typeAssessments.filter(a => a.isCorrect).length / typeAssessments.length) * 100);

      breakdown[type] = {
        count: typeAssessments.length,
        averageScore,
        accuracy,
      };
    }

    return breakdown as Record<ResponseType, any>;
  }

  /**
   * Generates skill area breakdown analytics.
   * @private
   */
  private generateSkillAreaBreakdown(assessments: AssessmentResult[]): Record<string, any> {
    const breakdown: Record<string, any> = {};

    // Extract skill areas from metadata
    const skillAreas = [...new Set(assessments
      .map(a => a.metadata?.skillArea)
      .filter(Boolean)
    )];

    for (const skillArea of skillAreas) {
      const skillAssessments = assessments.filter(a => a.metadata?.skillArea === skillArea);
      const averageScore = Math.round(skillAssessments.reduce((sum, a) => sum + a.score, 0) / skillAssessments.length);
      const accuracy = Math.round((skillAssessments.filter(a => a.isCorrect).length / skillAssessments.length) * 100);

      breakdown[skillArea] = {
        count: skillAssessments.length,
        averageScore,
        accuracy,
      };
    }

    return breakdown;
  }

  /**
   * Generates progress trend over time.
   * @private
   */
  private generateProgressTrend(assessments: AssessmentResult[]): any[] {
    // Group assessments by week for trend analysis
    const weeklyData: Record<string, { scores: number[], count: number }> = {};

    assessments.forEach(assessment => {
      const date = new Date(assessment.metadata?.createdAt || Date.now());
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { scores: [], count: 0 };
      }
      
      weeklyData[weekKey].scores.push(assessment.score);
      weeklyData[weekKey].count++;
    });

    return Object.entries(weeklyData)
      .map(([period, data]) => ({
        period,
        averageScore: Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length),
        assessmentCount: data.count,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Identifies weak areas from skill breakdown.
   * @private
   */
  private identifyWeakAreas(skillBreakdown: Record<string, any>): string[] {
    return Object.entries(skillBreakdown)
      .filter(([_, data]) => data.accuracy < 70)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 3)
      .map(([skillArea]) => skillArea);
  }

  /**
   * Identifies strengths from skill breakdown.
   * @private
   */
  private identifyStrengths(skillBreakdown: Record<string, any>): string[] {
    return Object.entries(skillBreakdown)
      .filter(([_, data]) => data.accuracy >= 85)
      .sort((a, b) => b[1].accuracy - a[1].accuracy)
      .slice(0, 3)
      .map(([skillArea]) => skillArea);
  }

  /**
   * Generates personalized recommendations based on performance.
   * @private
   */
  private generateRecommendations(weakAreas: string[], strengths: string[], accuracy: number): string[] {
    const recommendations: string[] = [];

    if (weakAreas.length > 0) {
      recommendations.push(`Focus on improving: ${weakAreas.join(', ')}`);
    }

    if (strengths.length > 0) {
      recommendations.push(`Great work in: ${strengths.join(', ')}`);
    }

    if (accuracy < 50) {
      recommendations.push('Consider reviewing lesson materials before attempting assessments');
    } else if (accuracy < 70) {
      recommendations.push('Keep practicing - you\'re making good progress!');
    } else if (accuracy >= 85) {
      recommendations.push('Excellent performance! Try more challenging exercises');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue practicing to see personalized recommendations');
    }

    return recommendations;
  }
}