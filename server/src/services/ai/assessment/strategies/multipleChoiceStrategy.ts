import { BaseStrategy } from './BaseStrategy';
import { AssessmentRequest, AssessmentResult, PersonalizedFeedback } from '../../../../types/Assessment';
import { IAssessmentStrategy } from './IAssessmentStrategy';

/**
 * @class MultipleChoiceStrategy
 * @extends BaseStrategy
 * @description A deterministic strategy for assessing multiple-choice questions.
 * It performs a simple string comparison and does not require an AI call.
 */
export class MultipleChoiceStrategy extends BaseStrategy implements IAssessmentStrategy {
  /**
   * Creates an instance of MultipleChoiceStrategy.
   */
  constructor() {
    super('MultipleChoiceStrategy');
  }

  /**
   * Assesses a multiple-choice response.
   * @param {AssessmentRequest} request The assessment request containing the user's response and the expected answer.
   * @returns {Promise<AssessmentResult>} A promise that resolves to the assessment result.
   */
  public async assess(request: AssessmentRequest): Promise<AssessmentResult> {
    if (typeof request.userResponse !== 'string' || typeof request.expectedAnswer !== 'string') {
      this.logger.error('Invalid request for MultipleChoiceStrategy', { request });
      return this.getFallbackAssessment('multiple-choice', 'Invalid request payload.');
    }

    const isCorrect = this.normalize(request.userResponse) === this.normalize(request.expectedAnswer);

    const feedback: PersonalizedFeedback = isCorrect
      ? {
          message: 'Excellent! That is the correct answer.',
          tone: 'congratulatory',
          suggestions: [],
        }
      : {
          message: `Not quite. The correct answer is "${request.expectedAnswer}". Keep trying!`,
          tone: 'encouraging',
          suggestions: ['Review the related lesson material.', 'Pay close attention to the details in the question.'],
        };

    return {
      score: isCorrect ? 100 : 0,
      isCorrect,
      feedback,
      confidence: 'high',
      assessmentType: 'multiple-choice',
      isFallback: false,
    };
  }

  /**
   * Normalizes a string for comparison by converting it to lowercase, trimming whitespace,
   * and removing common trailing punctuation.
   * @private
   * @param {string} answer The string to normalize.
   * @returns {string} The normalized string.
   */
  private normalize(answer: string): string {
    return answer
      .toLowerCase()
      .trim()
      .replace(/[.!?]$/, ''); // Remove trailing period, exclamation mark, or question mark
  }
}
