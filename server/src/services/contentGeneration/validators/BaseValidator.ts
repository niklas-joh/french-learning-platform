import { IContentValidator } from '../interfaces';
import { ContentRequest, ContentValidation, ContentType } from '../../../types/Content';
import { ILogger } from '../../../types/ILogger';

/**
 * Abstract base class for content validators.
 * Provides common utility methods and a consistent structure for all validator implementations.
 */
export abstract class BaseValidator implements IContentValidator {
  protected abstract readonly contentType: ContentType;

  constructor(protected logger: ILogger) {}

  /**
   * Abstract method to be implemented by concrete validator classes.
   * @param content - The content to validate, specific to the content type.
   * @param request - The original content generation request.
   * @returns A promise that resolves to a ContentValidation object.
   */
  abstract validate(content: any, request: ContentRequest): Promise<ContentValidation>;

  /**
   * Checks if a given string value is null, undefined, or empty.
   * @param fieldName - The name of the field being checked (for logging purposes).
   * @param value - The string value to check.
   * @param issues - The array of validation issues to append to if the check fails.
   * @param minLength - The minimum required length for the string.
   */
  protected checkNonEmpty(fieldName: string, value: any, issues: string[], minLength = 1): void {
    if (value === null || value === undefined || typeof value !== 'string' || value.trim().length < minLength) {
      const message = `${this.contentType} '${fieldName}' is missing or too short. Required minimum length: ${minLength}.`;
      issues.push(message);
      this.logger.warn(`[Validation] ${message}`);
    }
  }

  /**
   * Checks if an array is null, undefined, or empty.
   * @param fieldName - The name of the field being checked.
   * @param value - The array to check.
   * @param issues - The array of validation issues to append to if the check fails.
   * @param minLength - The minimum required length for the array.
   */
  protected checkArrayNonEmpty(fieldName: string, value: any[], issues: string[], minLength = 1): void {
    if (!Array.isArray(value) || value.length < minLength) {
      const message = `${this.contentType} '${fieldName}' array must contain at least ${minLength} item(s).`;
      issues.push(message);
      this.logger.warn(`[Validation] ${message}`);
    }
  }
}
