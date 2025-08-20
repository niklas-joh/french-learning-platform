import { ILogger, createLogger } from '../../../../utils/logger.js';
import { AssessmentResult, ResponseType } from '../../../../types/Assessment.js';
import { IAssessmentStrategy } from './IAssessmentStrategy.js';

/**
 * @abstract
 * @class BaseStrategy
 * @description An abstract base class for assessment strategies.
 * It provides common functionality like logging and a standardized fallback mechanism
 * to be shared across all concrete strategy implementations.
 */
export abstract class BaseStrategy implements IAssessmentStrategy {
  protected readonly logger: ILogger;

  /**
   * Creates an instance of BaseStrategy.
   * @param {string} loggerName The name of the logger, typically the class name of the concrete strategy.
   */
  constructor(loggerName: string) {
    this.logger = createLogger(loggerName);
  }

  /**
   * The core assessment method to be implemented by concrete strategies.
   * @abstract
   * @param {...any[]} args The arguments required for the specific assessment.
   * @returns {Promise<AssessmentResult>} A promise that resolves to the assessment result.
   */
  abstract assess(...args: any[]): Promise<AssessmentResult>;

  /**
   * Provides a standardized fallback assessment result in case of an error.
   * @protected
   * @param {string} assessmentType The type of the assessment being performed.
   * @param {string} [errorMessage="An unexpected error occurred."] A description of the error.
   * @returns {AssessmentResult} A structured fallback assessment result.
   */
  protected getFallbackAssessment(
    assessmentType: ResponseType,
    errorMessage: string = "An unexpected error occurred.",
    userResponse: string = ""
  ): AssessmentResult {
    this.logger.warn(`Using fallback assessment for ${assessmentType} due to error: ${errorMessage}`);
    return {
      userResponse,
      score: 0,
      isCorrect: false,
      feedback: {
        message: "We couldn't grade your response automatically at this time. Please try again later.",
        tone: 'neutral',
        suggestions: [],
      },
      confidence: 'low',
      assessmentType,
      isFallback: true,
    };
  }
}
