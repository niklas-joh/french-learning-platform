import { AssessmentRequest, AssessmentResult } from '../../../../types/Assessment.js';

/**
 * Interface that all assessment strategies must implement.
 * This allows the system to handle different types of assessments (multiple choice, open-ended, etc.)
 * in a modular and extensible way.
 */
export interface IAssessmentStrategy {
  /**
   * Assesses a user's response according to the specific strategy.
   * @param request The assessment request containing user response and context
   * @param options Optional parameters including abort signal for cancellation
   * @returns Promise resolving to the assessment result
   */
  assess(request: AssessmentRequest, options?: { signal?: AbortSignal }): Promise<AssessmentResult>;
}
