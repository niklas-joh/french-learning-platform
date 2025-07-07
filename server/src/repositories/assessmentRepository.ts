import { Knex } from 'knex';
import { GradingResult, AssessmentResult } from '../types/Assessment.js';

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
}
