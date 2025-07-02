import { BaseValidator } from './BaseValidator';
import { ContentRequest, ContentValidation, IStructuredGrammarExercise, ContentType } from '../../../types/Content';
import { ILogger } from '../../../types/ILogger';

/**
 * Concrete validator for Exercise content.
 * This validator can be used for various exercise types.
 */
export class ExerciseValidator extends BaseValidator {
  // Note: This uses 'grammar_exercise' as a stand-in. The factory can map multiple
  // exercise types to this same validator if the core structure is similar.
  protected readonly contentType: ContentType = 'grammar_exercise';

  constructor(logger: ILogger) {
    super(logger);
  }

  /**
   * Validates the structure and content of an exercise.
   * @param content - The exercise content to validate.
   * @param request - The original content generation request.
   * @returns A promise that resolves to a ContentValidation object.
   */
  async validate(content: IStructuredGrammarExercise, request: ContentRequest): Promise<ContentValidation> {
    this.logger.info(`[Validation] Running ExerciseValidator for topics: ${request.topics?.join(', ')}`);
    const issues: string[] = [];

    this.checkNonEmpty('title', content.title, issues, 5);
    this.checkNonEmpty('description', content.description, issues, 10);
    this.checkArrayNonEmpty('exercises', content.exercises, issues, 1);

    if (content.exercises) {
      content.exercises.forEach((exercise, index) => {
        this.checkNonEmpty(`exercise[${index}].instruction`, exercise.instruction, issues, 5);
        this.checkArrayNonEmpty(`exercise[${index}].items`, exercise.items, issues, 1);
      });
    }

    const isValid = issues.length === 0;
    const score = 100 - (issues.length * 20);

    this.logger.info(`[Validation] ExerciseValidator completed. isValid: ${isValid}, score: ${score}, issues: ${issues.length}`);

    return {
      isValid,
      score: Math.max(0, score),
      issues,
    };
  }
}
