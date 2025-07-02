import { BaseValidator } from './BaseValidator';
import { ContentRequest, ContentValidation, IStructuredLesson, ContentType } from '../../../types/Content';
import { ILogger } from '../../../types/ILogger';

/**
 * Concrete validator for Lesson content.
 */
export class LessonValidator extends BaseValidator {
  protected readonly contentType: ContentType = 'lesson';

  constructor(logger: ILogger) {
    super(logger);
  }

  /**
   * Validates the structure and content of a lesson.
   * @param content - The lesson content to validate.
   * @param request - The original content generation request.
   * @returns A promise that resolves to a ContentValidation object.
   */
  async validate(content: IStructuredLesson, request: ContentRequest): Promise<ContentValidation> {
    this.logger.info(`[Validation] Running LessonValidator for topics: ${request.topics?.join(', ')}`);
    const issues: string[] = [];

    this.checkNonEmpty('title', content.title, issues, 5);
    this.checkNonEmpty('description', content.description, issues, 20);
    this.checkArrayNonEmpty('sections', content.sections, issues, 1);
    
    if (content.sections) {
      content.sections.forEach((section, index) => {
        this.checkNonEmpty(`section[${index}].title`, section.title, issues, 3);
        this.checkNonEmpty(`section[${index}].content`, section.content, issues, 20);
      });
    }

    const isValid = issues.length === 0;
    const score = 100 - (issues.length * 25); // Simple scoring logic

    this.logger.info(`[Validation] LessonValidator completed. isValid: ${isValid}, score: ${score}, issues: ${issues.length}`);

    return {
      isValid,
      score: Math.max(0, score), // Ensure score is not negative
      issues,
    };
  }
}
