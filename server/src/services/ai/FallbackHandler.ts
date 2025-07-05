/**
 * FallbackHandler - Type-Safe AI Fallback Response Management
 * 
 * Provides graceful degradation for AI services by returning structured, type-safe
 * fallback responses when primary AI providers fail. Ensures the application continues
 * to function even during AI service outages or errors.
 * 
 * Key improvements from initial design:
 * - Type-safe fallback content using the centralized AI type system
 * - Structured fallback responses that match expected client data shapes
 * - Graceful error handling with meaningful fallback content
 * - Full integration with the AI orchestration metadata system
 */

import { 
  FallbackStrategyConfig, 
  AIResponse, 
  AITaskType, 
  AITaskResponsePayload 
} from '../../types/AI';
import { ILogger } from '../../types/logger';

/**
 * @class FallbackHandler
 * @description Provides type-safe, structured fallback responses when AI services fail.
 *              Ensures client applications receive valid data structures even during failures.
 */
export class FallbackHandler {
  private config: FallbackStrategyConfig;
  private logger: ILogger;

  /**
   * @constructor
   * @param config - Fallback strategy configuration with type-safe static content
   * @param logger - Logger instance (defaults to console for now)
   */
  constructor(config: FallbackStrategyConfig, logger: ILogger = console) {
    this.config = config;
    this.logger = logger;
    this.logger.info('[FallbackHandler] Initialized with type-safe fallback responses');
  }

  /**
   * Generates a type-safe fallback response for a specific AI task that failed.
   * 
   * The response maintains the same structure as a successful AI response but with
   * status 'fallback' and uses predefined static content when available, or
   * generates a safe default structure for the specific task type.
   * 
   * @param taskType - The AI task type that failed
   * @param error - The error that triggered the fallback
   * @returns A properly structured AIResponse with fallback content
   */
  getFallback<T extends AITaskType>(
    taskType: T, 
    error: Error
  ): AIResponse<T> {
    this.logger.error(`[FallbackHandler] Generating fallback for task ${taskType}`, { 
      error: error.message,
      stack: error.stack 
    });

    // Get configured static content for this task type
    const staticContent = this.config.staticContent[taskType];
    
    // Generate fallback data based on task type and available static content
    const fallbackData = this.generateFallbackData(taskType, staticContent, error);

    return {
      status: 'fallback',
      data: fallbackData as AITaskResponsePayload<T>,
      metadata: {
        provider: 'fallback',
        model: 'none',
        confidenceScore: 0, // Fallback responses have no confidence
        processingTimeMs: 0,
        cacheHit: false,
        cost: 0, // Fallbacks are free
      },
      error: {
        message: error.message,
        code: 'FALLBACK_ACTIVATED',
      },
    } as AIResponse<T>;
  }

  /**
   * Generates appropriate fallback data based on the task type and configuration.
   * 
   * This method provides sensible defaults for each AI task type while allowing
   * customization through the static content configuration.
   * 
   * @private
   * @param taskType - The AI task type
   * @param staticContent - Configured static content (if any)
   * @param error - The original error for context
   * @returns Fallback data structure appropriate for the task type
   */
  private generateFallbackData<T extends AITaskType>(
    taskType: T,
    staticContent: any,
    error: Error
  ): any {
    // If we have configured static content, merge it with defaults
    if (staticContent) {
      return this.mergeWithDefaults(taskType, staticContent);
    }

    // Generate sensible defaults based on task type
    switch (taskType) {
      case 'GENERATE_LESSON':
        return {
          id: 0,
          title: 'Service Temporarily Unavailable',
          description: 'We are experiencing technical difficulties. Please try again later.',
          type: 'fallback',
          estimatedTime: 0,
          orderIndex: 0,
          contentData: JSON.stringify({
            message: 'Lesson generation is temporarily unavailable. Please try again later.',
            type: 'fallback'
          }),
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          learningUnitId: 0
        };

      case 'ASSESS_PRONUNCIATION':
        return {
          score: 0,
          feedback: 'Pronunciation assessment is temporarily unavailable. Please try again later.',
          improvements: ['Service temporarily unavailable']
        };

      case 'GRADE_RESPONSE':
        return {
          score: 0,
          feedback: 'Response grading is temporarily unavailable. Please try again later.',
          isCorrect: false,
          suggestions: ['Please try again when the service is restored']
        };

      case 'GENERATE_CURRICULUM_PATH':
        return {
          path: [{
            message: 'Curriculum generation is temporarily unavailable',
            type: 'fallback'
          }]
        };

      case 'CONVERSATIONAL_TUTOR_RESPONSE':
        return {
          response: "I'm sorry, but I'm temporarily unavailable. Please try again in a few moments.",
          suggestions: ['Check your connection', 'Try again later']
        };

      default:
        return {
          message: 'AI service is temporarily unavailable. Please try again later.',
          type: 'fallback',
          error: error.message
        };
    }
  }

  /**
   * Merges configured static content with sensible defaults for the task type.
   * 
   * @private
   * @param taskType - The AI task type
   * @param staticContent - User-configured static content
   * @returns Merged fallback data
   */
  private mergeWithDefaults<T extends AITaskType>(
    taskType: T,
    staticContent: any
  ): any {
    const defaults = this.generateFallbackData(taskType, null, new Error('Fallback'));
    
    // Deep merge static content with defaults
    return this.deepMerge(defaults, staticContent);
  }

  /**
   * Performs a deep merge of two objects, with source overriding target values.
   * 
   * @private
   * @param target - The target object (defaults)
   * @param source - The source object (static content)
   * @returns Merged object
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' && 
          source[key] !== null && 
          !Array.isArray(source[key]) &&
          typeof target[key] === 'object' &&
          target[key] !== null &&
          !Array.isArray(target[key])
        ) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Validates that the fallback configuration contains valid data for a task type.
   * Useful for configuration validation during startup.
   * 
   * @param taskType - The AI task type to validate
   * @returns true if configuration is valid, false otherwise
   */
  validateFallbackConfig<T extends AITaskType>(taskType: T): boolean {
    try {
      const staticContent = this.config.staticContent[taskType];
      if (!staticContent) {
        return true; // No configuration is valid (will use defaults)
      }

      // Generate a test fallback to ensure it doesn't throw
      this.generateFallbackData(taskType, staticContent, new Error('Test'));
      return true;

    } catch (error) {
      this.logger.error(`[FallbackHandler] Invalid fallback configuration for task ${taskType}`, error);
      return false;
    }
  }

  /**
   * Gets a summary of configured fallback content for monitoring and debugging.
   * 
   * @returns Object describing configured fallbacks
   */
  getConfigurationSummary(): {
    enabled: boolean;
    configuredTasks: AITaskType[];
    totalConfigurations: number;
  } {
    const configuredTasks = Object.keys(this.config.staticContent) as AITaskType[];
    
    return {
      enabled: this.config.enabled,
      configuredTasks,
      totalConfigurations: configuredTasks.length
    };
  }

  /**
   * Tests all configured fallbacks to ensure they generate valid responses.
   * Useful for startup validation and health checks.
   * 
   * @returns Array of validation results for each configured task type
   */
  validateAllConfigurations(): Array<{
    taskType: AITaskType;
    isValid: boolean;
    error?: string;
  }> {
    const results: Array<{
      taskType: AITaskType;
      isValid: boolean;
      error?: string;
    }> = [];

    // Test all possible task types
    const allTaskTypes: AITaskType[] = [
      'GENERATE_LESSON',
      'ASSESS_PRONUNCIATION',
      'GRADE_RESPONSE',
      'GENERATE_CURRICULUM_PATH',
      'CONVERSATIONAL_TUTOR_RESPONSE'
    ];

    for (const taskType of allTaskTypes) {
      try {
        const isValid = this.validateFallbackConfig(taskType);
        results.push({ taskType, isValid });
      } catch (error) {
        results.push({ 
          taskType, 
          isValid: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }
}
