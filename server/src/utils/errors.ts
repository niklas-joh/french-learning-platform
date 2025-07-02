/**
 * Custom error classes for the French learning platform
 */

export class AIGenerationError extends Error {
  public readonly details?: any;
  
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'AIGenerationError';
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AIGenerationError);
    }
  }
}

export class ContentValidationError extends Error {
  public readonly validationIssues: string[];
  
  constructor(message: string, issues: string[] = []) {
    super(message);
    this.name = 'ContentValidationError';
    this.validationIssues = issues;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentValidationError);
    }
  }
}

export class UserContextError extends Error {
  public readonly userId: string;
  
  constructor(message: string, userId: string) {
    super(message);
    this.name = 'UserContextError';
    this.userId = userId;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserContextError);
    }
  }
}
