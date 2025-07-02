import { IContentValidatorFactory, IContentValidator } from './interfaces';
import { ContentType } from '../../types/Content';
import { ILogger } from '../../types/ILogger';
import { LessonValidator } from './validators/LessonValidator';
import { ExerciseValidator } from './validators/ExerciseValidator';
import { VocabularyValidator } from './validators/VocabularyValidator';

export class ContentValidatorFactory implements IContentValidatorFactory {
  private validators: Map<ContentType, IContentValidator>;

  constructor(private logger: ILogger) {
    this.validators = new Map<ContentType, IContentValidator>([
      ['lesson', new LessonValidator(this.logger)],
      ['grammar_exercise', new ExerciseValidator(this.logger)],
      ['vocabulary_drill', new VocabularyValidator(this.logger)],
      // Future validators for other content types can be added here
    ]);
    this.logger.info('[ContentValidatorFactory] Initialized with validators for:', [...this.validators.keys()]);
  }

  getValidator(type: ContentType): IContentValidator {
    const validator = this.validators.get(type);
    if (!validator) {
      this.logger.warn(`[ContentValidatorFactory] No validator found for content type: '${type}'. Using a default pass-through validator.`);
      // Return a default validator that always passes for unknown types
      return {
        validate: (content, request) => Promise.resolve({ isValid: true, score: 100, issues: [] })
      };
    }
    this.logger.info(`[ContentValidatorFactory] Providing validator for type: '${type}'`);
    return validator;
  }
}
