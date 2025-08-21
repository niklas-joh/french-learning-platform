/**
 * @file AssessmentAnalyticsService - Analytics and insights service for assessment data
 * @description Provides analytical calculations and insights based on assessment data,
 * focusing solely on data analysis without persistence concerns.
 * Follows Single Responsibility Principle by separating analytics from data access.
 * 
 * @author AI Development Team
 * @since Task 3.1.C.3.refactor.2
 */

import { AssessmentQueryService, AssessmentTimeframe, AssessmentStats, AssessmentTypeStats, TopicAssessmentStats } from './AssessmentQueryService.js';
import { AssessmentResult, FrenchLevel, ResponseType } from '../../types/Assessment.js';

/**
 * User weakness analysis result interface
 */
export interface UserWeaknessAnalysis {
  userId: number;
  analyzedAt: Date;
  timeframe: AssessmentTimeframe;
  confidenceLevel: 'low' | 'medium' | 'high';
  overallStats: AssessmentStats;
  assessmentTypeWeaknesses: AssessmentTypeAnalysis[];
  topicWeaknesses: TopicAnalysis[];
  overallTrend: TrendAnalysis;
  recommendations: string[];
  hasInsufficientData: boolean;
}

/**
 * Assessment type analysis with improvement insights
 */
export interface AssessmentTypeAnalysis {
  assessmentType: string;
  averageScore: number;
  attemptCount: number;
  consistency: number; // 0-1, higher = more consistent
  trend: 'improving' | 'stable' | 'declining';
  improvementPotential: number; // 0-1, higher = more potential
  lastAttempt: Date;
}

/**
 * Topic analysis with priority scoring
 */
export interface TopicAnalysis {
  topic: string;
  averageScore: number;
  attemptCount: number;
  priority: number; // 0-1, higher = higher priority for improvement
  lastAttempt: Date;
}

/**
 * Performance trend analysis
 */
export interface TrendAnalysis {
  direction: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  improvementRate: number; // Points per assessment
  confidence: number; // 0-1, higher = more reliable trend
  dataPoints: number;
}

/**
 * Performance trends over time for specific assessment types
 */
export interface PerformanceTrend {
  assessmentType: string;
  dataPoints: {
    date: Date;
    score: number;
    attempts: number;
  }[];
  trendDirection: 'improving' | 'stable' | 'declining';
  improvementRate: number; // Points per time period
  consistency: number; // 0-1, higher = more consistent
  confidence: number; // 0-1, higher = more reliable
}

/**
 * AssessmentAnalyticsService provides intelligent analysis of assessment performance data.
 * 
 * This service follows the Single Responsibility Principle by focusing solely on:
 * - Statistical analysis and calculations
 * - Trend identification and forecasting
 * - Weakness pattern recognition
 * - Personalized recommendation generation
 * 
 * It depends on AssessmentQueryService for data access, maintaining clean separation of concerns.
 * All calculations are performed in JavaScript to avoid complex SQL dependencies.
 * 
 * @example
 * ```typescript
 * const queryService = new AssessmentQueryService();
 * const analyticsService = new AssessmentAnalyticsService(queryService);
 * 
 * const analysis = await analyticsService.analyzeUserWeaknesses(123, 'month');
 * const trends = await analyticsService.calculatePerformanceTrends(123);
 * ```
 */
export class AssessmentAnalyticsService {
  
  /**
   * Creates an instance of AssessmentAnalyticsService.
   * 
   * @param queryService - The query service for data access
   * 
   * @example
   * ```typescript
   * const queryService = new AssessmentQueryService();
   * const analyticsService = new AssessmentAnalyticsService(queryService);
   * ```
   */
  constructor(private readonly queryService: AssessmentQueryService) {}

  /**
   * Analyzes user weaknesses and provides comprehensive insights.
   * 
   * This method identifies patterns in assessment performance to highlight areas
   * where the user needs improvement. It considers both assessment types and topics
   * to provide a holistic view of learning gaps.
   * 
   * @param userId - The ID of the user to analyze
   * @param timeframe - The time period for analysis ('day', 'week', 'month', 'all')
   * @param minAssessments - Minimum assessments required for reliable analysis (default: 5)
   * @returns Promise resolving to comprehensive weakness analysis
   * 
   * @example
   * ```typescript
   * const analysis = await analyticsService.analyzeUserWeaknesses(123, 'month');
   * if (analysis.hasInsufficientData) {
   *   console.log('User needs more assessment data');
   * } else {
   *   console.log(`Weak areas: ${analysis.recommendations.join(', ')}`);
   * }
   * ```
   */
  async analyzeUserWeaknesses(
    userId: number,
    timeframe: AssessmentTimeframe = 'month',
    minAssessments: number = 5
  ): Promise<UserWeaknessAnalysis> {
    try {
      // Check if user has sufficient data for meaningful analysis
      const hasSufficientData = await this.queryService.hasSufficientData(userId, timeframe, minAssessments);
      
      if (!hasSufficientData) {
        return this.createInsufficientDataAnalysis(userId, timeframe);
      }

      // Get comprehensive assessment data
      const [overallStats, typeStats, topicStats] = await Promise.all([
        this.queryService.getBasicAssessmentStats(userId, timeframe),
        this.queryService.getAssessmentTypeStats(userId, timeframe, 3),
        this.queryService.getTopicAssessmentStats(userId, timeframe, 2)
      ]);

      // Perform detailed analysis
      const assessmentTypeWeaknesses = this.analyzeAssessmentTypes(typeStats);
      const topicWeaknesses = this.analyzeTopics(topicStats);
      const overallTrend = await this.calculateOverallTrend(userId, timeframe);
      
      // Generate insights and recommendations
      const recommendations = this.generateRecommendations(
        assessmentTypeWeaknesses,
        topicWeaknesses,
        overallStats,
        overallTrend
      );

      // Calculate confidence level based on data quality
      const confidenceLevel = this.calculateConfidenceLevel(overallStats.totalAssessments, timeframe);

      return {
        userId,
        analyzedAt: new Date(),
        timeframe,
        confidenceLevel,
        overallStats,
        assessmentTypeWeaknesses,
        topicWeaknesses,
        overallTrend,
        recommendations,
        hasInsufficientData: false
      };

    } catch (error) {
      console.error('Error analyzing user weaknesses:', error);
      return this.createInsufficientDataAnalysis(userId, timeframe);
    }
  }

  /**
   * Calculates performance trends for different assessment types over time.
   * 
   * This method analyzes how user performance changes over time for each
   * assessment type, helping identify which areas are improving or declining.
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period for trend analysis (default: 'month')
   * @returns Promise resolving to array of performance trends by assessment type
   * 
   * @example
   * ```typescript
   * const trends = await analyticsService.calculatePerformanceTrends(123);
   * trends.forEach(trend => {
   *   console.log(`${trend.assessmentType}: ${trend.trendDirection} (${trend.confidence})`);
   * });
   * ```
   */
  async calculatePerformanceTrends(
    userId: number,
    timeframe: AssessmentTimeframe = 'month'
  ): Promise<PerformanceTrend[]> {
    try {
      // Get assessment data for trend analysis
      const assessments = await this.queryService.findAssessmentResults(userId, timeframe);
      
      if (assessments.length < 10) {
        return []; // Need sufficient data for trend analysis
      }

      // Group assessments by type for trend calculation
      const typeGroups = this.groupAssessmentsByType(assessments);
      const trends: PerformanceTrend[] = [];

      for (const [assessmentType, typeAssessments] of typeGroups) {
        if (typeAssessments.length >= 5) { // Minimum for trend analysis
          const trend = this.calculateTrendForType(assessmentType, typeAssessments);
          trends.push(trend);
        }
      }

      // Sort by confidence level (most reliable trends first)
      return trends.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('Error calculating performance trends:', error);
      return [];
    }
  }

  /**
   * Generates personalized learning recommendations based on assessment data.
   * 
   * Uses assessment patterns and performance trends to create actionable
   * recommendations for improving learning outcomes.
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period for analysis
   * @returns Promise resolving to array of personalized recommendations
   * 
   * @example
   * ```typescript
   * const recommendations = await analyticsService.getPersonalizedRecommendations(123);
   * recommendations.forEach(rec => console.log(`Recommendation: ${rec}`));
   * ```
   */
  async getPersonalizedRecommendations(
    userId: number,
    timeframe: AssessmentTimeframe = 'month'
  ): Promise<string[]> {
    try {
      const analysis = await this.analyzeUserWeaknesses(userId, timeframe);
      return analysis.recommendations;
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return ['Complete more assessments to receive personalized recommendations'];
    }
  }

  /**
   * Calculates learning consistency score for a user.
   * 
   * Measures how consistent the user's performance is across different
   * assessment types and time periods.
   * 
   * @param userId - The ID of the user
   * @param timeframe - The time period for analysis
   * @returns Promise resolving to consistency score (0-1, higher = more consistent)
   * 
   * @example
   * ```typescript
   * const consistency = await analyticsService.calculateConsistencyScore(123);
   * console.log(`User consistency: ${Math.round(consistency * 100)}%`);
   * ```
   */
  async calculateConsistencyScore(
    userId: number,
    timeframe: AssessmentTimeframe = 'month'
  ): Promise<number> {
    try {
      const assessments = await this.queryService.findAssessmentResults(userId, timeframe);
      
      if (assessments.length < 5) {
        return 0; // Not enough data for consistency measurement
      }

      const scores = assessments.map(a => a.generatedData?.score || 0);
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
      const standardDeviation = Math.sqrt(variance);

      // Lower standard deviation relative to mean indicates higher consistency
      const coefficientOfVariation = standardDeviation / Math.max(mean, 1);
      return Math.max(0, 1 - (coefficientOfVariation / 100)); // Normalize to 0-1 scale

    } catch (error) {
      console.error('Error calculating consistency score:', error);
      return 0;
    }
  }

  // Private helper methods

  /**
   * Analyzes assessment type statistics to identify weaknesses and patterns.
   * @private
   */
  private analyzeAssessmentTypes(typeStats: AssessmentTypeStats[]): AssessmentTypeAnalysis[] {
    return typeStats.map(stat => {
      const consistency = this.calculateTypeConsistency(stat);
      const trend = this.calculateTypeTrend(stat);
      const improvementPotential = this.calculateImprovementPotential(stat.averageScore);

      return {
        assessmentType: stat.assessmentType,
        averageScore: stat.averageScore,
        attemptCount: stat.attemptCount,
        consistency,
        trend,
        improvementPotential,
        lastAttempt: stat.lastAttempt
      };
    });
  }

  /**
   * Analyzes topic statistics to identify learning priorities.
   * @private
   */
  private analyzeTopics(topicStats: TopicAssessmentStats[]): TopicAnalysis[] {
    return topicStats.map(stat => {
      const priority = this.calculateTopicPriority(stat.averageScore, stat.attemptCount);

      return {
        topic: stat.topic,
        averageScore: stat.averageScore,
        attemptCount: stat.attemptCount,
        priority,
        lastAttempt: stat.lastAttempt
      };
    });
  }

  /**
   * Calculates overall performance trend for a user.
   * @private
   */
  private async calculateOverallTrend(userId: number, timeframe: AssessmentTimeframe): Promise<TrendAnalysis> {
    try {
      const assessments = await this.queryService.findAssessmentResults(userId, timeframe);
      
      if (assessments.length < 5) {
        return {
          direction: 'insufficient_data',
          improvementRate: 0,
          confidence: 0,
          dataPoints: assessments.length
        };
      }

      // Calculate linear regression for trend analysis
      const scores = assessments.map((assessment, index) => ({
        x: index, // Time index (reverse chronological)
        y: assessment.generatedData?.score || 0
      }));

      const { slope, confidence } = this.calculateLinearRegression(scores);
      
      return {
        direction: slope > 2 ? 'improving' : slope < -2 ? 'declining' : 'stable',
        improvementRate: slope,
        confidence,
        dataPoints: assessments.length
      };

    } catch (error) {
      console.error('Error calculating overall trend:', error);
      return {
        direction: 'insufficient_data',
        improvementRate: 0,
        confidence: 0,
        dataPoints: 0
      };
    }
  }

  /**
   * Groups assessments by type for trend analysis.
   * @private
   */
  private groupAssessmentsByType(assessments: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();
    
    assessments.forEach(assessment => {
      const type = assessment.metadata?.assessmentStrategy || 'unknown';
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(assessment);
    });

    return groups;
  }

  /**
   * Calculates trend for a specific assessment type.
   * @private
   */
  private calculateTrendForType(assessmentType: string, assessments: any[]): PerformanceTrend {
    // Create data points with dates and scores
    const dataPoints = assessments.map(assessment => ({
      date: new Date(assessment.createdAt),
      score: assessment.generatedData?.score || 0,
      attempts: 1
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate trend direction and rate
    const scores = dataPoints.map((point, index) => ({ x: index, y: point.score }));
    const { slope, confidence: regressionConfidence } = this.calculateLinearRegression(scores);
    
    const trendDirection: 'improving' | 'stable' | 'declining' = 
      slope > 2 ? 'improving' : slope < -2 ? 'declining' : 'stable';

    // Calculate consistency
    const scoresArray = scores.map(s => s.y);
    const mean = scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length;
    const variance = scoresArray.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scoresArray.length;
    const consistency = Math.max(0, 1 - (Math.sqrt(variance) / mean));

    return {
      assessmentType,
      dataPoints,
      trendDirection,
      improvementRate: slope,
      consistency,
      confidence: regressionConfidence
    };
  }

  /**
   * Calculates linear regression for trend analysis.
   * @private
   */
  private calculateLinearRegression(points: { x: number; y: number }[]): { slope: number; confidence: number } {
    const n = points.length;
    if (n < 2) return { slope: 0, confidence: 0 };

    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumY = points.reduce((sum, point) => sum + point.y, 0);
    const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = points.reduce((sum, point) => sum + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Calculate R-squared for confidence
    const yMean = sumY / n;
    const ssTotal = points.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
    const ssRes = points.reduce((sum, point) => {
      const predicted = slope * point.x + (sumY - slope * sumX) / n;
      return sum + Math.pow(point.y - predicted, 2);
    }, 0);
    
    const rSquared = ssTotal > 0 ? Math.max(0, 1 - (ssRes / ssTotal)) : 0;

    return { slope, confidence: rSquared };
  }

  /**
   * Generates personalized recommendations based on analysis results.
   * @private
   */
  private generateRecommendations(
    typeWeaknesses: AssessmentTypeAnalysis[],
    topicWeaknesses: TopicAnalysis[],
    overallStats: AssessmentStats,
    overallTrend: TrendAnalysis
  ): string[] {
    const recommendations: string[] = [];

    // Assessment type recommendations
    const weakestType = typeWeaknesses.find(type => type.averageScore < 60);
    if (weakestType) {
      recommendations.push(`Focus on ${weakestType.assessmentType} practice - current average: ${weakestType.averageScore}%`);
    }

    // Topic recommendations
    const highPriorityTopic = topicWeaknesses.find(topic => topic.priority > 0.7 && topic.averageScore < 70);
    if (highPriorityTopic) {
      recommendations.push(`Review ${highPriorityTopic.topic} concepts - needs improvement`);
    }

    // Trend-based recommendations
    if (overallTrend.direction === 'declining') {
      recommendations.push('Consider reviewing recent lesson materials - performance trend is declining');
    } else if (overallTrend.direction === 'improving') {
      recommendations.push('Great progress! Keep up the consistent practice');
    }

    // General recommendations based on overall performance
    if (overallStats.averageScore < 50) {
      recommendations.push('Focus on understanding concepts before attempting assessments');
    } else if (overallStats.averageScore >= 85) {
      recommendations.push('Excellent performance! Try more challenging exercises');
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('Practice consistently for 15-20 minutes daily');
      recommendations.push('Review mistakes immediately after assessment');
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Calculates consistency score for an assessment type.
   * @private
   */
  private calculateTypeConsistency(stat: AssessmentTypeStats): number {
    // Simplified consistency calculation based on attempt count and score
    // In a real implementation, this would analyze score variance over time
    const baseConsistency = Math.min(stat.attemptCount / 10, 1); // More attempts = potentially more consistent
    const scoreStability = stat.averageScore > 40 ? 0.7 : 0.3; // Higher scores suggest more stable understanding
    return (baseConsistency + scoreStability) / 2;
  }

  /**
   * Calculates trend direction for an assessment type.
   * @private
   */
  private calculateTypeTrend(stat: AssessmentTypeStats): 'improving' | 'stable' | 'declining' {
    // Simplified trend calculation
    // In a real implementation, this would analyze score progression over time
    if (stat.averageScore > 75) return 'improving';
    if (stat.averageScore < 50) return 'declining';
    return 'stable';
  }

  /**
   * Calculates improvement potential for a score.
   * @private
   */
  private calculateImprovementPotential(averageScore: number): number {
    // Higher potential for lower scores
    return Math.max(0, (100 - averageScore) / 100);
  }

  /**
   * Calculates priority score for a topic.
   * @private
   */
  private calculateTopicPriority(averageScore: number, attemptCount: number): number {
    const scoreFactor = (100 - averageScore) / 100; // Lower scores = higher priority
    const volumeFactor = Math.min(attemptCount / 10, 1); // More attempts = higher priority
    return (scoreFactor * 0.7) + (volumeFactor * 0.3);
  }

  /**
   * Calculates confidence level based on data quantity and timeframe.
   * @private
   */
  private calculateConfidenceLevel(assessmentCount: number, timeframe: AssessmentTimeframe): 'low' | 'medium' | 'high' {
    const timeframeMult = timeframe === 'all' ? 1.2 : timeframe === 'month' ? 1.0 : 0.8;
    const adjustedCount = assessmentCount * timeframeMult;

    if (adjustedCount < 10) return 'low';
    if (adjustedCount < 25) return 'medium';
    return 'high';
  }

  /**
   * Creates analysis result for users with insufficient data.
   * @private
   */
  private createInsufficientDataAnalysis(userId: number, timeframe: AssessmentTimeframe): UserWeaknessAnalysis {
    return {
      userId,
      analyzedAt: new Date(),
      timeframe,
      confidenceLevel: 'low',
      overallStats: {
        totalAssessments: 0,
        averageScore: 0,
        lastAssessmentDate: null,
        assessmentTypes: []
      },
      assessmentTypeWeaknesses: [],
      topicWeaknesses: [],
      overallTrend: {
        direction: 'insufficient_data',
        improvementRate: 0,
        confidence: 0,
        dataPoints: 0
      },
      recommendations: [
        'Complete more assessments to build analysis data',
        'Practice regularly for better insights',
        'Focus on consistent daily learning'
      ],
      hasInsufficientData: true
    };
  }
}