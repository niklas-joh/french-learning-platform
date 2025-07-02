import { BaseValidator } from './BaseValidator';
import { ContentRequest, ContentValidation, IStructuredVocabularyDrill, ContentType } from '../../../types/Content';
import { ILogger } from '../../../types/ILogger';

/**
 * Concrete validator for VocabularyDrill content.
 */
export class VocabularyValidator extends BaseValidator {
  protected readonly contentType: ContentType = 'vocabulary_drill';

  constructor(logger: ILogger) {
    super(logger);
  }

  /**
   * Validates the structure and content of a vocabulary drill.
   * @param content - The vocabulary drill content to validate.
   * @param request - The original content generation request.
   * @returns A promise that resolves to a ContentValidation object.
   */
  async validate(content: IStructuredVocabularyDrill, request: ContentRequest): Promise<ContentValidation> {
    this.logger.info(`[Validation] Running VocabularyValidator for topics: ${request.topics?.join(', ')}`);
    const issues: string[] = [];

    this.checkNonEmpty('title', content.title, issues, 5);
    this.checkArrayNonEmpty('vocabulary', content.vocabulary, issues, 1);

    if (content.vocabulary) {
      content.vocabulary.forEach((item, index) => {
        this.checkNonEmpty(`vocabulary[${index}].word`, item.word, issues);
        this.checkNonEmpty(`vocabulary[${index}].definition`, item.definition, issues);
        this.checkArrayNonEmpty(`vocabulary[${index}].examples`, item.examples, issues, 1);
      });
    }

    const isValid = issues.length === 0;
    const score = 100 - (issues.length * 15);

    this.logger.info(`[Validation] VocabularyValidator completed. isValid: ${isValid}, score: ${score}, issues: ${issues.length}`);

    return {
      isValid,
      score: Math.max(0, score),
      issues,
    };
  }
}
