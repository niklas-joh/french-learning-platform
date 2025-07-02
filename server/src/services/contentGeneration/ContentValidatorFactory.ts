import { IContentValidatorFactory, IContentValidator } from './interfaces';
import { ContentType, ContentRequest, ContentValidation } from '../../types/Content';

class StubValidator implements IContentValidator {
  validate(content: any, request: ContentRequest): Promise<ContentValidation> {
    return Promise.resolve({ 
      isValid: true,
      score: 100,
      issues: []
    });
  }
}

export class ContentValidatorFactory implements IContentValidatorFactory {
  getValidator(type: ContentType): IContentValidator {
    return new StubValidator();
  }
}
