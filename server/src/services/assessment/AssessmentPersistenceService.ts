/**
 * @file AssessmentPersistenceService - Focused persistence service for assessment data
 * @description Provides clean, focused persistence operations for assessment results,
 * following Single Responsibility Principle by handling only data storage concerns.
 * Uses the existing AIGeneratedContent model and integrates with the assessment services.
 * 
 * @author AI Development Team
 * @since Task 3.1.C.3.refactor.3
 */

import { AIGeneratedContent } from '../../models/AIGeneratedContent.js';
import { AssessmentResult, AssessmentContext, AssessmentRequest } from '../../types/Assessment.js';

/**
 * Configuration options for assessment persistence
 */
export interface AssessmentPersistenceConfig {
  /** Enable automatic user progress updates (default: true) */
  updateUserProgress: boolean;
  /** Cache assessment results for reuse (default: true) */
  enableCaching: boolean;
  /** Log persistence operations (default: false) */
  enableLogging: boolean;
}

/**
 * Result of a save operation
 */
export interface SaveResult {
  /** The ID of the saved assessment record */
  assessmentId: string;
  /** Whether the record was cached or newly created */
  wasCached: boolean;
  /** Timestamp of the save operation */
  savedAt: Date;
}

/**
 * AssessmentPersistenceService provides focused, reliable persistence for assessment data.
 * 
 * This service follows the Single Responsibility Principle by handling ONLY:
 * - Saving assessment results to storage
 * - Basic retrieval operations
 * - Integration with existing data models
 * 
 * It does NOT handle:
 * - Complex analytics calculations (use AssessmentAnalyticsService)
 * - Database querying logic (use AssessmentQueryService)
 * - Business logic beyond persistence
 * 
 * The service reuses the existing AIGeneratedContent model with type='assessment_result'
 * to maintain consistency with the established architecture patterns.
 * 
 * @example
 * ```typescript
 * const persistenceService = new AssessmentPersistenceService();
 * 
 * // Save assessment result
 * const saveResult = await persistenceService.saveAssessmentResult(result, context);
 * console.log(`Saved assessment: ${saveResult.assessmentId}`);
 * 
 * // Retrieve assessment
 * const saved = await persistenceService.getAssessmentById(saveResult.assessmentId);
 * ```
 */
export class AssessmentPersistenceService {
  private readonly config: AssessmentPersistenceConfig;

  /**
   * Creates an instance of AssessmentPersistenceService.
   * 
   * @param config - Configuration options for persistence behavior
   * 
   * @example
   * ```typescript
   * const service = new AssessmentPersistenceService({
   *   updateUserProgress: true,
   *   enableCaching: true,
   *   enableLogging: false
   * });
   * ```
   */
  constructor(config: Partial<AssessmentPersistenceConfig> = {}) {
    this.config = {
      updateUserProgress: true,
      enableCaching: true,
      enableLogging: false,
      ...config
    };
  }

  /**
   * Saves an assessment result to persistent storage.
   * 
   * This method stores the assessment result using the existing AIGeneratedContent
   * model with type='assessment_result'. It follows the established patterns in
   * the codebase for data storage and error handling.
   * 
   * @param result - The assessment result to save
   * @param context - The assessment context for additional metadata
   * @returns Promise resolving to save operation result
   * 
   * @example
   * ```typescript
   * const result = {
   *   score: 85,
   *   isCorrect: true,
   *   feedback: { message: "Good work!", tone: "encouraging" },
   *   confidence: "high",
   *   assessmentType: "multiple-choice"
   * };
   * 
   * const context = {
   *   userId: 123,
   *   userResponse: "Bonjour",
   *   expectedAnswer: "Bonjour",
   *   assessmentType: "multiple-choice",
   *   userLevel: "A2",
   *   skillArea: "greeting"
   * };
   * 
   * const saveResult = await persistenceService.saveAssessmentResult(result, context);
   * ```
   */
  async saveAssessmentResult(
    result: AssessmentResult,
    context: AssessmentContext & { userResponse?: string; expectedAnswer?: string; assessmentType?: string; metadata?: any }
  ): Promise<SaveResult> {
    try {
      if (this.config.enableLogging) {
        console.log('Saving assessment result:', {
          userId: context.userId,
          score: result.score,
          assessmentType: result.assessmentType
        });
      }

      // Create assessment record using existing AIGeneratedContent model
      // Using 'personalized_exercise' as the closest matching type for assessment results
      const assessmentRecord = await AIGeneratedContent.query().insert({
        userId: context.userId,
        type: 'personalized_exercise',
        status: 'completed',
        requestPayload: {
          userResponse: context.userResponse || '',
          expectedAnswer: context.expectedAnswer || '',
          assessmentType: result.assessmentType,
          skillArea: context.skillArea,
          questionContext: context.questionContext,
          culturalContext: context.culturalContext || false,
          previousAttempts: context.previousAttempts || 0,
          batchIndex: context.batchIndex
        },
        generatedData: {
          score: result.score,
          isCorrect: result.isCorrect,
          feedback: result.feedback,
          confidence: this.mapConfidenceToNumber(result.confidence),
          reasoning: result.metadata?.reasoning || '',
          corrections: result.metadata?.corrections || [],
          suggestions: result.metadata?.suggestions || [],
          assessmentType: result.assessmentType,
          isFallback: result.isFallback || false,
          processingTime: result.processingTime || 0
        },
        validationResults: {
          isValid: true,
          score: this.mapConfidenceToNumber(result.confidence),
          issues: []
        },
        metadata: {
          assessmentStrategy: result.assessmentType,
          processingTime: result.processingTime || 0,
          aiModel: result.metadata?.aiModel || 'assessment-engine',
          culturalContext: context.culturalContext,
          difficultyLevel: context.metadata?.difficulty,
          userLevel: context.userLevel,
          exerciseId: context.exerciseId,
          lessonId: context.lessonId,
          batchIndex: context.batchIndex,
          timestamp: new Date().toISOString()
        },
        level: context.userLevel,
        topics: this.extractTopics(context),
        focusAreas: this.extractFocusAreas(context),
        estimatedCompletionTime: Math.ceil((result.processingTime || 1000) / 60000), // Convert ms to minutes
        validationScore: this.mapConfidenceToNumber(result.confidence),
        generationTimeMs: result.processingTime || 0,
        tokenUsage: result.metadata?.tokenUsage || 0,
        modelUsed: result.metadata?.aiModel || 'assessment-engine',
        usageCount: 1,
        lastAccessedAt: new Date().toISOString()
      });

      // Update user progress asynchronously if enabled
      if (this.config.updateUserProgress) {
        this.updateUserProgressAsync(context.userId, result).catch(error => {
          console.error('Error updating user progress:', error);
          // Don't throw - progress update failures shouldn't block assessment saving
        });
      }

      const saveResult: SaveResult = {
        assessmentId: assessmentRecord.id,
        wasCached: false, // Always fresh saves in this implementation
        savedAt: new Date()
      };

      if (this.config.enableLogging) {
        console.log('Assessment result saved successfully:', {
          assessmentId: saveResult.assessmentId,
          userId: context.userId
        });
      }

      return saveResult;

    } catch (error) {
      console.error('Error saving assessment result:', error);
      throw new Error(`Failed to persist assessment result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieves a saved assessment result by its ID.
   * 
   * @param assessmentId - The ID of the assessment to retrieve
   * @returns Promise resolving to the assessment record or null if not found
   * 
   * @example
   * ```typescript
   * const assessment = await persistenceService.getAssessmentById('123e4567-e89b-12d3-a456-426614174000');
   * if (assessment) {
   *   console.log(`Score: ${assessment.generatedData.score}`);
   * }
   * ```
   */
  async getAssessmentById(assessmentId: string): Promise<AIGeneratedContent | null> {
    try {
      const assessment = await AIGeneratedContent.query()
        .findById(assessmentId)
        .where('type', 'personalized_exercise');

      return assessment || null;

    } catch (error) {
      console.error('Error retrieving assessment by ID:', error);
      return null;
    }
  }

  /**
   * Retrieves the most recent assessment for a user.
   * 
   * @param userId - The ID of the user
   * @param assessmentType - Optional filter for specific assessment type
   * @returns Promise resolving to the most recent assessment or null
   * 
   * @example
   * ```typescript
   * const lastAssessment = await persistenceService.getLastAssessment(123, 'pronunciation');
   * ```
   */
  async getLastAssessment(
    userId: number,
    assessmentType?: string
  ): Promise<AIGeneratedContent | null> {
    try {
      let query = AIGeneratedContent.query()
        .where('userId', userId)
        .where('type', 'personalized_exercise')
        .where('status', 'completed')
        .orderBy('createdAt', 'desc')
        .limit(1);

      if (assessmentType) {
        query = query.whereJsonSupersetOf('metadata', { assessmentStrategy: assessmentType });
      }

      const results = await query;
      return results.length > 0 ? results[0] : null;

    } catch (error) {
      console.error('Error retrieving last assessment:', error);
      return null;
    }
  }

  /**
   * Checks if an assessment result exists for specific criteria.
   * 
   * Useful for preventing duplicate assessments or checking completion status.
   * 
   * @param userId - The ID of the user
   * @param exerciseId - The exercise ID to check
   * @param batchIndex - Optional batch index for specific question
   * @returns Promise resolving to boolean indicating existence
   * 
   * @example
   * ```typescript
   * const exists = await persistenceService.assessmentExists(123, 'exercise-456', 0);
   * if (exists) {
   *   console.log('User has already completed this assessment');
   * }
   * ```
   */
  async assessmentExists(
    userId: number,
    exerciseId: string,
    batchIndex?: number
  ): Promise<boolean> {
    try {
      let query = AIGeneratedContent.query()
        .where('userId', userId)
        .where('type', 'personalized_exercise')
        .where('status', 'completed')
        .whereJsonSupersetOf('metadata', { exerciseId });

      if (batchIndex !== undefined) {
        query = query.whereJsonSupersetOf('metadata', { batchIndex });
      }

      const countResult = await query.count('* as count').first() as { count: string | number } | undefined;
      return (parseInt(String(countResult?.count || 0)) || 0) > 0;

    } catch (error) {
      console.error('Error checking assessment existence:', error);
      return false;
    }
  }

  /**
   * Batch saves multiple assessment results efficiently.
   * 
   * This method optimizes the saving of multiple assessments by using
   * database batch operations where possible.
   * 
   * @param results - Array of assessment results to save
   * @param contexts - Array of corresponding assessment contexts
   * @returns Promise resolving to array of save results
   * 
   * @example
   * ```typescript
   * const saveResults = await persistenceService.batchSaveAssessments(results, contexts);
   * console.log(`Saved ${saveResults.length} assessments`);
   * ```
   */
  async batchSaveAssessments(
    results: AssessmentResult[],
    contexts: AssessmentContext[]
  ): Promise<SaveResult[]> {
    if (results.length !== contexts.length) {
      throw new Error('Results and contexts arrays must have the same length');
    }

    const saveResults: SaveResult[] = [];

    // Process in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < results.length; i += batchSize) {
      const resultBatch = results.slice(i, i + batchSize);
      const contextBatch = contexts.slice(i, i + batchSize);

      // Save each assessment in the batch
      const batchPromises = resultBatch.map((result, index) =>
        this.saveAssessmentResult(result, contextBatch[index])
      );

      try {
        const batchResults = await Promise.all(batchPromises);
        saveResults.push(...batchResults);
      } catch (error) {
        console.error('Error in batch save operation:', error);
        // Continue with remaining batches
      }
    }

    return saveResults;
  }

  /**
   * Gets service configuration and statistics.
   * 
   * @returns Service configuration and operational statistics
   */
  getServiceInfo() {
    return {
      service: 'AssessmentPersistenceService',
      version: '1.0.0',
      configuration: this.config,
      features: [
        'assessment_result_persistence',
        'batch_operations',
        'user_progress_integration',
        'existence_checking',
        'retrieval_operations'
      ],
      dataModel: {
        storageTable: 'ai_generated_content',
        recordType: 'assessment_result',
        keyFields: ['userId', 'type', 'status'],
        indexedFields: ['createdAt', 'level', 'topics']
      }
    };
  }

  // Private helper methods

  /**
   * Maps confidence level to numerical value for storage.
   * @private
   */
  private mapConfidenceToNumber(confidence: string | number): number {
    if (typeof confidence === 'number') return confidence;
    
    switch (confidence) {
      case 'high': return 0.9;
      case 'medium': return 0.7;
      case 'low': return 0.5;
      default: return 0.5;
    }
  }

  /**
   * Extracts topics from assessment context.
   * @private
   */
  private extractTopics(context: AssessmentContext & { metadata?: any }): string[] {
    const topics: string[] = [];
    
    // Add skill area as a topic
    if (context.skillArea) {
      topics.push(context.skillArea);
    }

    // Add any topics from metadata
    if (context.metadata?.topics && Array.isArray(context.metadata.topics)) {
      topics.push(...context.metadata.topics);
    }

    // Remove duplicates and return
    return Array.from(new Set(topics));
  }

  /**
   * Extracts focus areas from assessment context.
   * @private
   */
  private extractFocusAreas(context: AssessmentContext & { assessmentType?: string; metadata?: any }): string[] {
    const focusAreas: string[] = [];

    // Add assessment type as focus area
    if (context.assessmentType) {
      focusAreas.push(context.assessmentType);
    }

    // Add any focus areas from metadata
    if (context.metadata?.focusAreas && Array.isArray(context.metadata.focusAreas)) {
      focusAreas.push(...context.metadata.focusAreas);
    }

    // Add cultural context if relevant
    if (context.culturalContext) {
      focusAreas.push('cultural_context');
    }

    return Array.from(new Set(focusAreas));
  }

  /**
   * Updates user progress asynchronously after assessment save.
   * @private
   */
  private async updateUserProgressAsync(userId: number, result: AssessmentResult): Promise<void> {
    try {
      // This would integrate with the existing UserProgress model
      // For now, this is a placeholder that demonstrates the pattern
      
      if (this.config.enableLogging) {
        console.log('Updating user progress for assessment:', {
          userId,
          score: result.score,
          isCorrect: result.isCorrect
        });
      }

      // TODO: Integrate with existing UserProgress model
      // await UserProgress.query()
      //   .findOne({ userId })
      //   .patch({
      //     lastActivityDate: new Date(),
      //     accuracyRate: calculateNewAccuracyRate(result)
      //   });

      // Track performance streaks for gamification
      if (result.score >= 80) {
        await this.updatePerformanceStreak(userId);
      }

    } catch (error) {
      console.error('Error updating user progress:', error);
      // Don't throw - this is a non-critical operation
    }
  }

  /**
   * Updates performance streak information for gamification.
   * @private
   */
  private async updatePerformanceStreak(userId: number): Promise<void> {
    try {
      // Count recent high-scoring assessments for streak calculation
      const recentHighScores = await AIGeneratedContent.query()
        .where('userId', userId)
        .where('type', 'personalized_exercise')
        .whereRaw('CAST(JSON_UNQUOTE(JSON_EXTRACT(generatedData, "$.score")) AS DECIMAL(5,2)) >= 80')
        .where('createdAt', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .count('* as count')
        .first() as { count: string | number } | undefined;

      const streakCount = parseInt(String(recentHighScores?.count || 0)) || 0;
      
      if (streakCount >= 5) {
        // Trigger achievement or notification
        if (this.config.enableLogging) {
          console.log(`User ${userId} achieved performance streak of ${streakCount}`);
        }
        // TODO: Integrate with gamification system
      }

    } catch (error) {
      console.error('Error updating performance streak:', error);
      // Don't throw - this is a non-critical operation
    }
  }
}
