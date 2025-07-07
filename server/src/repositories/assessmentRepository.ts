import { Knex } from 'knex';
import { GradingResult } from '../types/Assessment';

export class AssessmentRepository {
  constructor(private db: Knex) {}

  /**
   * Creates a new repository instance with a transaction client.
   * This is crucial for ensuring that all database operations within a single
   * grading process are part of the same atomic transaction.
   * @param trx The Knex transaction object.
   * @returns A new AssessmentRepository instance using the transaction.
   */
  withTransaction(trx: Knex.Transaction): AssessmentRepository {
    return new AssessmentRepository(trx);
  }

  /**
   * Saves the complete result of a grading operation to the database.
   * This method expects to be called within a transaction managed by the service layer.
   * @param userId The ID of the user being assessed.
   * @param result The GradingResult object containing all assessment details.
   * @returns A promise that resolves when the data is saved.
   */
  async saveGradingResult(userId: number, result: GradingResult): Promise<void> {
    // TODO: Implement logic to insert into userAssessments and other related tables.
    // This will be wrapped in the transaction from the service layer in Task 3.1.C.4.
    // Example:
    // for (const assessment of result.results) {
    //   await this.db('userAssessments').insert({
    //      userId,
    //      userContentCompletionId: result.userContentCompletionId,
    //      ...
    //   });
    // }
    console.log(`Saving grading result for user ${userId}`, result);
    return Promise.resolve();
  }

  /**
   * Fetches the most recent weakness analysis for a given user.
   * @param userId The ID of the user.
   * @returns A promise that resolves to the latest analysis object or null if none exists.
   */
  async getLatestWeaknessAnalysis(userId: number): Promise<any | null> {
    // TODO: Implement query to fetch the latest analysis from userWeaknessAnalyses.
    // This will be used by the async worker in Task 3.1.C.7.
    return this.db('userWeaknessAnalyses')
      .where({ userId })
      .orderBy('analyzedAt', 'desc')
      .first();
  }
}
