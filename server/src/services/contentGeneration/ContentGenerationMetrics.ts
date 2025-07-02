import { IContentGenerationMetrics } from './interfaces';
import { ContentRequest, ContentValidation } from '../../types/Content';
import { ILogger } from '../../types/ILogger';

export class ContentGenerationMetrics implements IContentGenerationMetrics {
  constructor(private logger: ILogger) {}

  private log(level: 'info' | 'warn' | 'error', event: string, data: Record<string, any>) {
    const logObject = {
      service: 'ContentGenerationMetrics',
      event,
      ...data,
    };
    this.logger[level](JSON.stringify(logObject));
  }

  recordGenerationAttempt(request: ContentRequest): void {
    this.log('info', 'generationAttempt', {
      userId: request.userId,
      contentType: request.type,
      level: request.level,
      topics: request.topics,
    });
  }

  recordGenerationSuccess(request: ContentRequest, duration: number, validationScore: number): void {
    this.log('info', 'generationSuccess', {
      userId: request.userId,
      contentType: request.type,
      durationMs: duration,
      validationScore,
    });
  }

  recordGenerationFailure(request: ContentRequest, duration: number, error: Error): void {
    this.log('error', 'generationFailure', {
      userId: request.userId,
      contentType: request.type,
      durationMs: duration,
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }

  recordValidationFailure(request: ContentRequest, validation: ContentValidation): void {
    this.log('warn', 'validationFailure', {
      userId: request.userId,
      contentType: request.type,
      issues: validation.issues,
      score: validation.score,
    });
  }

  recordFallbackUsed(request: ContentRequest, error: Error): void {
    this.log('warn', 'fallbackUsed', {
      userId: request.userId,
      contentType: request.type,
      triggeringError: error.message,
    });
  }
}
