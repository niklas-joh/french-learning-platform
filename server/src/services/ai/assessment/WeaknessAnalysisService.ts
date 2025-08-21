// server/src/services/ai/assessment/WeaknessAnalysisService.ts

import type { OpenAI } from 'openai';
import { AssessmentRepository } from '../../../repositories/assessmentRepository.js';
import { PromptTemplateEngine } from '../PromptTemplateEngine.js';
import { AssessmentAnalyticsService } from './AssessmentAnalyticsService.js';
import { FrenchLanguageUtils } from './utils/FrenchLanguageUtils.js';
import { AssessmentResult, ConfidenceLevel, FrenchLevel } from '../../../types/Assessment.js';
import { ILogger } from '../../../types/ILogger.js';

/**
 * Interface for weakness analysis result following database schema
 * @interface WeaknessAnalysisResult
 */
interface WeaknessAnalysisResult {
  analyzedAt: Date;
  timeframeDays: number;
  confidenceLevel: ConfidenceLevel;
  primaryWeaknesses: string[];
  improvementAreas: string[];
  strengthAreas: string[];
  recommendations: string[];
}

/**
 * Interface for AI response structure with validation
 * @interface AIWeaknessAnalysis
 */
interface AIWeaknessAnalysis {
  primaryWeaknesses: string[];
  improvementAreas: string[];
  strengthAreas: string[];
  recommendations: string[];
}

/**
 * @class WeaknessAnalysisService
 * @description Service for asynchronous analysis of user learning patterns and weaknesses.
 * Integrates with existing assessment infrastructure following established patterns.
 * 
 * This service addresses the performance issue identified in Task 3.1.C.7 by moving
 * heavy analytical processing off the synchronous API request path.
 */
export class WeaknessAnalysisService {
  /** Minimum number of assessments required for meaningful analysis */
  private readonly MINIMUM_DATA_POINTS = 10;
  
  /** Default timeframe for assessment analysis in days */
  private readonly DEFAULT_TIMEFRAME = 30;

  /**
   * Creates an instance of WeaknessAnalysisService.
   * Follows dependency injection patterns established in the codebase.
   * 
   * @param {AssessmentRepository} assessmentRepo - Repository for assessment data operations
   * @param {PromptTemplateEngine} promptEngine - Service for generating AI prompts
   * @param {AssessmentAnalyticsService} analyticsService - Service for assessment pattern analysis
   * @param {FrenchLanguageUtils} frenchUtils - French language-specific utilities
   * @param {OpenAI} openai - OpenAI API client for AI analysis
   * @param {ILogger} logger - Logger service for structured logging
   */
  constructor(
    private readonly assessmentRepo: AssessmentRepository,
    private readonly promptEngine: PromptTemplateEngine,
    private readonly analyticsService: AssessmentAnalyticsService,
    private readonly frenchUtils: FrenchLanguageUtils,
    private readonly openai: OpenAI,
    private readonly logger: ILogger
  ) {}

  /**
   * Performs comprehensive weakness analysis for a user.
   * Main entry point for the async worker processing.
   * 
   * Follows YAGNI principle by exiting early if insufficient data.
   * Leverages existing services for consistency and code reuse.
   * 
   * @param {number} userId - The ID of the user to analyze
   * @param {number} timeframeDays - Optional timeframe override (defaults to 30 days)
   * @returns {Promise<void>} Resolves when analysis is complete and saved
   * @throws {Error} When analysis fails or user has insufficient data
   */
  async performAnalysis(userId: number, timeframeDays: number = this.DEFAULT_TIMEFRAME): Promise<void> {
    this.logger.info(`Starting weakness analysis for user ${userId}, timeframe: ${timeframeDays} days`);

    try {
      // Step 1: Fetch recent assessments using existing repository patterns
      const assessments = await this.assessmentRepo.getAssessmentsForUser(userId, timeframeDays);
      
      // Step 2: Early exit if insufficient data (YAGNI principle)
      if (assessments.length < this.MINIMUM_DATA_POINTS) {
        this.logger.warn(`Insufficient data for user ${userId}: ${assessments.length} assessments (min: ${this.MINIMUM_DATA_POINTS})`);
        return;
      }

      // Step 3: Analyze patterns using existing analytics service
      const patterns = this.analyzeMistakePatterns(assessments);
      const frenchSpecificIssues = this.frenchUtils.identifyCommonPatterns(assessments.map(a => a.userResponse));
      
      // Step 4: Calculate statistics for context
      const correctAnswers = assessments.filter(a => a.isCorrect).length;
      const userLevel = this.inferUserLevel(assessments);
      
      // Step 5: Generate AI analysis using enhanced prompt template
      const aiAnalysis = await this.generateAIAnalysis({
        mistakePatterns: { ...patterns, ...frenchSpecificIssues },
        timeframe: timeframeDays,
        userLevel,
        totalAssessments: assessments.length,
        correctAnswers
      });

      // Step 6: Create analysis result with confidence scoring
      const analysisResult: WeaknessAnalysisResult = {
        analyzedAt: new Date(),
        timeframeDays,
        confidenceLevel: this.calculateConfidenceLevel(assessments.length),
        primaryWeaknesses: aiAnalysis.primaryWeaknesses,
        improvementAreas: aiAnalysis.improvementAreas,
        strengthAreas: aiAnalysis.strengthAreas,
        recommendations: aiAnalysis.recommendations
      };

      // Step 7: Save results using existing repository methods
      await this.assessmentRepo.saveWeaknessAnalysis(userId, analysisResult);
      
      this.logger.info(`Weakness analysis completed for user ${userId}: ${aiAnalysis.primaryWeaknesses.length} weaknesses identified`);
      
    } catch (error) {
      this.logger.error(`Weakness analysis failed for user ${userId}:`, error);
      throw error; // Re-throw for worker error handling
    }
  }

  /**
   * Analyzes mistake patterns from assessment results.
   * Reuses existing analytics patterns for consistency.
   * 
   * @param {AssessmentResult[]} assessments - Array of user assessments
   * @returns {Record<string, number>} Mistake patterns by category
   * @private
   */
  private analyzeMistakePatterns(assessments: AssessmentResult[]): Record<string, number> {
    const patterns: Record<string, number> = {};
    
    // Group mistakes by assessment type and feedback categories
    assessments
      .filter(assessment => !assessment.isCorrect)
      .forEach(assessment => {
        const category = assessment.assessmentType || 'unknown';
        patterns[category] = (patterns[category] || 0) + 1;
        
        // Extract additional patterns from feedback if available
        if (assessment.feedback?.suggestions) {
          assessment.feedback.suggestions.forEach(suggestion => {
            // Simple pattern extraction - could be enhanced with ML
            if (suggestion.toLowerCase().includes('grammar')) {
              patterns['grammar'] = (patterns['grammar'] || 0) + 1;
            }
            if (suggestion.toLowerCase().includes('vocabulary')) {
              patterns['vocabulary'] = (patterns['vocabulary'] || 0) + 1;
            }
          });
        }
      });

    return patterns;
  }

  /**
   * Infers user's French proficiency level from assessment results.
   * Uses simple heuristic that could be enhanced with ML in the future.
   * 
   * @param {AssessmentResult[]} assessments - Array of user assessments
   * @returns {FrenchLevel} Inferred CEFR level
   * @private
   */
  private inferUserLevel(assessments: AssessmentResult[]): FrenchLevel {
    const correctAnswers = assessments.filter(a => a.isCorrect).length;
    const accuracy = correctAnswers / assessments.length;
    const averageScore = assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length;

    // Simple heuristic - TODO: Replace with sophisticated level detection
    if (accuracy >= 0.9 && averageScore >= 85) return 'C1';
    if (accuracy >= 0.8 && averageScore >= 75) return 'B2';
    if (accuracy >= 0.7 && averageScore >= 65) return 'B1';
    if (accuracy >= 0.6 && averageScore >= 55) return 'A2';
    return 'A1';
  }

  /**
   * Generates AI-based weakness analysis using OpenAI.
   * Includes proper error handling and response validation.
   * 
   * @param {object} analysisParams - Parameters for AI analysis
   * @returns {Promise<AIWeaknessAnalysis>} AI analysis result
   * @private
   * @throws {Error} When AI request fails or returns invalid response
   */
  private async generateAIAnalysis(analysisParams: {
    mistakePatterns: Record<string, number>;
    timeframe: number;
    userLevel: FrenchLevel;
    totalAssessments: number;
    correctAnswers: number;
  }): Promise<AIWeaknessAnalysis> {
    
    const prompt = this.promptEngine.generateWeaknessAnalysisPrompt(analysisParams);
    
    this.logger.info('Requesting AI analysis with OpenAI');
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        temperature: 0.1, // Low temperature for consistent analysis
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return this.parseAndValidateAIResponse(content);
      
    } catch (error) {
      this.logger.error('OpenAI request failed:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parses and validates AI response to ensure proper structure.
   * Provides fallback values if parsing fails to maintain system reliability.
   * 
   * @param {string} content - Raw AI response content
   * @returns {AIWeaknessAnalysis} Parsed and validated analysis
   * @private
   */
  private parseAndValidateAIResponse(content: string): AIWeaknessAnalysis {
    try {
      // Clean up response (remove markdown code blocks if present)
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanContent);

      // Validate required fields and provide fallbacks
      const result: AIWeaknessAnalysis = {
        primaryWeaknesses: Array.isArray(parsed.primaryWeaknesses) ? parsed.primaryWeaknesses : ['General comprehension needs improvement'],
        improvementAreas: Array.isArray(parsed.improvementAreas) ? parsed.improvementAreas : ['Continue regular practice'],
        strengthAreas: Array.isArray(parsed.strengthAreas) ? parsed.strengthAreas : ['Shows consistent effort'],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ['Regular practice and review']
      };

      return result;
      
    } catch (error) {
      this.logger.warn('Failed to parse AI response, using fallback values:', error);
      
      // Fallback response to maintain service reliability
      return {
        primaryWeaknesses: ['Analysis temporarily unavailable'],
        improvementAreas: ['Continue regular practice'],
        strengthAreas: ['Shows learning progress'],
        recommendations: ['Regular practice recommended']
      };
    }
  }

  /**
   * Calculates confidence level based on available data points.
   * Follows existing confidence level patterns in the assessment system.
   * 
   * @param {number} dataPoints - Number of assessments analyzed
   * @returns {ConfidenceLevel} Confidence level for the analysis
   * @private
   */
  private calculateConfidenceLevel(dataPoints: number): ConfidenceLevel {
    if (dataPoints >= 50) return 'high';
    if (dataPoints >= 20) return 'medium';
    return 'low';
  }
}