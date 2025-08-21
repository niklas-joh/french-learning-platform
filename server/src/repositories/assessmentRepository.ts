import Knex from 'knex';
import { GradingResult, AssessmentResult, ConfidenceLevel } from '../types/Assessment.js';

/**
 * Interface for weakness analysis result data structure
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
 * @class AssessmentRepository
 * @description Handles all database operations related to assessments, grading, and analysis.
 */
export class AssessmentRepository {
  private db: Knex;

  /**
   * @constructor
   * @param {Knex} db - The Knex database instance.
   */
  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Returns a new instance of the repository that is bound to a specific database transaction.
   * @param {Knex.Transaction} trx - The Knex transaction object.
   * @returns {AssessmentRepository} A new repository instance with the transaction context.
   */
  withTransaction(trx: Knex.Transaction): AssessmentRepository {
    return new AssessmentRepository(trx);
  }

  /**
   * Saves the complete result of an exercise grading session to the database.
   * This method performs multiple inserts within a transaction to ensure atomicity.
   * 1. It creates a `userContentCompletions` record for the exercise.
   * 2. It inserts a `userAssessments` record for each individual response.
   * @param {number} userId - The ID of the user.
   * @param {number} exerciseId - The ID of the content/exercise being graded.
   * @param {GradingResult} result - The complete grading result object.
   * @returns {Promise<void>}
   */
  async saveGradingResult(userId: number, exerciseId: number, result: GradingResult): Promise<void> {
    // Step 1: Create the master completion record for the exercise.
    // Note: We assume the 'content' table has an 'id' that corresponds to exerciseId.
    // The column name in the archived migration was `content_id`, we use `contentId` as per principles.
    const [completion] = await this.db('userContentCompletions')
      .insert({
        userId: userId,
        contentId: exerciseId,
        completedAt: result.completedAt,
        score: result.overallScore,
        // attempt_number is not available in GradingResult, defaults in DB.
      })
      .returning(['id', 'completedAt']);

    if (!completion) {
      throw new Error('Failed to create user content completion record.');
    }

    // Step 2: Prepare and insert all individual assessment records.
    const assessmentsToInsert = result.individualGrades.map((grade: AssessmentResult) => ({
      userId: userId,
      userContentCompletionId: completion.id,
      // assessmentTypeId needs to be resolved from the 'type' string.
      // This is a simplification for now. A real implementation would look up the ID.
      // For now, we'll leave it null if not directly provided.
      assessmentTypeId: grade.assessmentTypeId || null,
      userResponse: grade.userResponse,
      isCorrect: grade.isCorrect,
      score: grade.score,
      feedback: JSON.stringify(grade.feedback), // Ensure feedback is stringified for jsonb
      confidence: grade.confidence,
      metadata: grade.metadata ? JSON.stringify(grade.metadata) : null,
      createdAt: completion.completedAt,
    }));

    if (assessmentsToInsert.length > 0) {
      await this.db('userAssessments').insert(assessmentsToInsert);
    }

    // Step 3: (Future) Update userProgress table.
    // This logic could be complex (e.g., calculating new XP, updating streak)
    // and might be better handled by a separate service or a database trigger.
    // For now, we leave this as a placeholder for a future task.
    // await this.db('userProgress').where({ userId }).increment('totalXp', calculateXp(result));
  }

  /**
   * Retrieves recent assessment data for a user within a specified timeframe.
   * Used for weakness analysis pattern recognition.
   * @param {number} userId - The ID of the user.
   * @param {number} timeframeDays - Number of days to look back from current date.
   * @returns {Promise<AssessmentResult[]>} Array of assessment results with user context.
   */
  async getAssessmentsForUser(userId: number, timeframeDays: number = 30): Promise<AssessmentResult[]> {
    const cutoffDate = new Date(Date.now() - (timeframeDays * 24 * 60 * 60 * 1000));
    
    const rawResults = await this.db('userAssessments')
      .join('userContentCompletions', 'userAssessments.userContentCompletionId', 'userContentCompletions.id')
      .leftJoin('assessmentTypes', 'userAssessments.assessmentTypeId', 'assessmentTypes.id')
      .select(
        'userAssessments.userResponse',
        'userAssessments.isCorrect',
        'userAssessments.score',
        'userAssessments.feedback',
        'userAssessments.confidence',
        'userAssessments.metadata',
        'userAssessments.createdAt',
        'assessmentTypes.name as assessmentType',
        'userContentCompletions.contentId'
      )
      .where('userAssessments.userId', userId)
      .where('userAssessments.createdAt', '>=', cutoffDate)
      .orderBy('userAssessments.createdAt', 'desc');

    // Transform raw results to AssessmentResult format
    return rawResults.map(row => ({
      userResponse: row.userResponse,
      isCorrect: row.isCorrect,
      score: row.score,
      feedback: typeof row.feedback === 'string' ? JSON.parse(row.feedback) : row.feedback,
      confidence: row.confidence as ConfidenceLevel,
      assessmentType: (row.assessmentType || 'unknown') as any,
      metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : undefined,
      processingTime: undefined, // Not stored in current schema
      assessmentTypeId: undefined // Will be resolved from assessmentType if needed
    }));
  }

  /**
   * Saves a weakness analysis result to the database.
   * Follows camelCase naming convention as per development principles.
   * @param {number} userId - The ID of the user.
   * @param {WeaknessAnalysisResult} analysis - The analysis result to save.
   * @returns {Promise<void>}
   */
  async saveWeaknessAnalysis(userId: number, analysis: WeaknessAnalysisResult): Promise<void> {
    await this.db('userWeaknessAnalyses').insert({
      userId,
      analyzedAt: analysis.analyzedAt,
      timeframeDays: analysis.timeframeDays,
      confidenceLevel: analysis.confidenceLevel,
      primaryWeaknesses: JSON.stringify(analysis.primaryWeaknesses),
      improvementAreas: JSON.stringify(analysis.improvementAreas),
      strengthAreas: JSON.stringify(analysis.strengthAreas),
      recommendations: JSON.stringify(analysis.recommendations)
    });
  }

  /**
   * Retrieves the most recent weakness analysis for a user.
   * Used by the analysis endpoint to provide cached results.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<WeaknessAnalysisResult | null>} The most recent analysis or null if none exists.
   */
  async getLatestWeaknessAnalysis(userId: number): Promise<WeaknessAnalysisResult | null> {
    const result = await this.db('userWeaknessAnalyses')
      .select(
        'analyzedAt',
        'timeframeDays',
        'confidenceLevel',
        'primaryWeaknesses',
        'improvementAreas',
        'strengthAreas',
        'recommendations'
      )
      .where({ userId })
      .orderBy('analyzedAt', 'desc')
      .first();

    if (!result) {
      return null;
    }

    return {
      analyzedAt: result.analyzedAt,
      timeframeDays: result.timeframeDays,
      confidenceLevel: result.confidenceLevel as ConfidenceLevel,
      primaryWeaknesses: typeof result.primaryWeaknesses === 'string' 
        ? JSON.parse(result.primaryWeaknesses) 
        : result.primaryWeaknesses,
      improvementAreas: typeof result.improvementAreas === 'string' 
        ? JSON.parse(result.improvementAreas) 
        : result.improvementAreas,
      strengthAreas: typeof result.strengthAreas === 'string' 
        ? JSON.parse(result.strengthAreas) 
        : result.strengthAreas,
      recommendations: typeof result.recommendations === 'string' 
        ? JSON.parse(result.recommendations) 
        : result.recommendations
    };
  }
}
