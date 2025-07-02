import { IContentGenerationMetrics } from './interfaces';
import { ContentRequest, ContentValidation } from '../../types/Content';

export class ContentGenerationMetrics implements IContentGenerationMetrics {
  recordGenerationAttempt(request: ContentRequest): void {
    console.log(`[Metrics] Generation attempt for ${request.type} by user ${request.userId}`);
  }

  recordGenerationSuccess(request: ContentRequest, duration: number): void {
    console.log(`[Metrics] Generation success for ${request.type} by user ${request.userId} in ${duration}ms`);
  }

  recordGenerationFailure(request: ContentRequest, error: Error): void {
    console.error(`[Metrics] Generation failure for ${request.type} by user ${request.userId}`, error);
  }

  recordValidationFailure(request: ContentRequest, validation: ContentValidation): void {
    console.warn(`[Metrics] Validation failure for ${request.type} by user ${request.userId}`, validation.issues);
  }
}
