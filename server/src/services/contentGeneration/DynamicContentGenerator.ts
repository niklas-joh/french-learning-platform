// Dynamic Content Generator - Main Service Implementation
// Follows dependency injection patterns with clear separation of concerns

import { AIOrchestrator } from '../ai/AIOrchestrator';
import { PromptTemplateEngine } from '../ai/PromptTemplateEngine';
import { 
  IContentGenerator,
  IContentValidatorFactory,
  IContentEnhancerFactory,
  IContentTemplateManager,
  ILearningContextService,
  IContentFallbackHandler,
  IContentGenerationMetrics
} from './interfaces';
import { 
  ContentRequest, 
  GeneratedContent, 
  LearningContext,
  ContentValidation,
  StructuredContent,
  generateContentId,
  ContentType
} from '../../types/Content';
import { AI_CONTENT_CONFIG, DEFAULT_AI_CONFIG, AIModelConfig } from '../../config/aiContentConfig';
import { AIGenerationError } from '../../utils/errors';
import { ContentStructurerFactory } from './ContentStructurerFactory';

/**
 * Main implementation of dynamic content generation
 * TODO: Reference Future Implementation #28 - Asynchronous Content Generation Workflow
 * TODO: Reference Future Implementation #23 - Centralized Dependency Injection (DI) Container
 */
export class DynamicContentGenerator implements IContentGenerator {
  private static readonly MAX_RETRIES = 2;
  private static readonly DEFAULT_COMPLETION_TIME = 15; // minutes

  constructor(
    private aiOrchestrator: AIOrchestrator,
    private promptEngine: PromptTemplateEngine,
    private validatorFactory: IContentValidatorFactory,
    private enhancerFactory: IContentEnhancerFactory,
    private templateManager: IContentTemplateManager,
    private contextService: ILearningContextService,
    private fallbackHandler: IContentFallbackHandler,
    private metricsService: IContentGenerationMetrics,
    private structurerFactory: ContentStructurerFactory
  ) {}

  /**
   * Generate content based on request parameters
   * TODO: Reference Future Implementation #28 - Asynchronous Content Generation Workflow
   * Current implementation is synchronous but should return 202 Accepted and process in background
   */
  async generateContent(request: ContentRequest, retryCount = 0): Promise<GeneratedContent> {
    const startTime = Date.now();
    
    // Record generation attempt for monitoring
    this.metricsService.recordGenerationAttempt(request);
    
    try {
      // Load user learning context
      // TODO: Reference Future Implementation #18 - AI Context Service Optimization Strategy
      const learningContext = await this.contextService.getUserContext(request.userId);
      
      // Get content template for the requested type
      const template = this.templateManager.getTemplate(request.type, learningContext);
      
      // Generate raw content using AI orchestrator
      // TODO: Reference Future Implementation #21 - AI Type System Schema Validation Integration
      const rawContent = await this.generateRawContent(request, template, learningContext);
      
      // Validate the generated content
      const validator = this.validatorFactory.getValidator(request.type);
      const validation = await validator.validate(rawContent, request);
      
      // Handle validation failures with retry logic
      if (!validation.isValid && retryCount < DynamicContentGenerator.MAX_RETRIES) {
        // TODO: Reference Future Implementation #24 - Implement Structured Logging
        console.warn(`Content validation failed on attempt ${retryCount + 1}:`, {
          userId: request.userId,
          type: request.type,
          issues: validation.issues,
          retryCount
        });
        
        this.metricsService.recordValidationFailure(request, validation);
        
        // Adjust request based on validation feedback and retry
        const adjustedRequest = this.adjustRequestFromValidation(request, validation);
        return this.generateContent(adjustedRequest, retryCount + 1);
      }
      
      // If validation still fails after retries, log but continue with fallback
      if (!validation.isValid) {
        // TODO: Reference Future Implementation #24 - Implement Structured Logging
        console.error(`Content validation failed after ${retryCount} retries, using fallback:`, {
          userId: request.userId,
          type: request.type,
          finalValidation: validation
        });
      }
      
      // Enhance content with personalization
      const enhancer = this.enhancerFactory.getEnhancer(request.type);
      const enhancedContent = await enhancer.enhance(rawContent, learningContext);
      
      // Structure the final content
      const structuredContent = await this.structureContent(enhancedContent, request.type);
      
      // Generate final response
      const generatedContent: GeneratedContent = {
        id: generateContentId(),
        type: request.type,
        content: structuredContent,
        metadata: {
          userId: request.userId,
          generatedAt: new Date(),
          level: learningContext.currentLevel,
          topics: request.topics || [],
          aiGenerated: true,
          version: '1.0',
          fallback: !validation.isValid,
          generationTime: Date.now() - startTime,
          // TODO: Add token usage and model tracking from AI orchestrator response
        },
        validation,
        estimatedCompletionTime: this.estimateCompletionTime(structuredContent, request),
        learningObjectives: this.extractLearningObjectives(structuredContent),
      };
      
      // Record successful generation
      this.metricsService.recordGenerationSuccess(request, Date.now() - startTime);
      
      return generatedContent;
      
    } catch (error) {
      // TODO: Reference Future Implementation #24 - Implement Structured Logging
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Critical error in content generation:', {
        userId: request.userId,
        type: request.type,
        error: errorMessage,
        retryCount
      });
      
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.metricsService.recordGenerationFailure(request, errorObj);
      
      // Attempt fallback content if retries are exhausted
      if (retryCount >= DynamicContentGenerator.MAX_RETRIES) {
        return this.fallbackHandler.getFallbackContent(request, errorObj);
      }
      
      // If we should retry, do so
      if (this.fallbackHandler.shouldRetry(errorObj, retryCount)) {
        return this.generateContent(request, retryCount + 1);
      }
      
      // If no retry should be attempted, return fallback
      return this.fallbackHandler.getFallbackContent(request, errorObj);
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Generate raw content using AI orchestrator
   * Implemented in Task 3.1.B.3.a
   */
  private async generateRawContent(
    request: ContentRequest,
    template: any,
    context: LearningContext
  ): Promise<any> {
    // TODO: #28 - Refactor to an async job queue. This synchronous approach is a major bottleneck.
    // The API should return a job ID immediately, and a worker should handle this process.
    const startTime = Date.now();
    
    try {
      const prompt = await this.promptEngine.generateContentPrompt({
        request,
        template,
        context,
      });

      const aiConfig = this.getAIConfigForType(request.type);
      
      // TODO: Implement AbortController signal in AIOrchestrator to prevent floating promises.
      const aiResponse = await this.executeAIRequestWithTimeout(request, prompt, aiConfig);

      if (!aiResponse.success) {
        throw new AIGenerationError(`AI generation failed: ${aiResponse.error}`, { request });
      }

      // The raw response data (likely a string) is returned directly.
      // The responsibility of parsing and validating is now with the structurer.
      return aiResponse.data;
    } catch (error) {
      const generationTime = Date.now() - startTime;
      
      // TODO: #24 - Implement a dedicated, structured Logger service (e.g., Pino).
      console.error('Raw content generation failed:', {
        // correlationId: request.correlationId, // Add for traceability
        userId: request.userId,
        type: request.type,
        duration: generationTime,
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Re-throw a more specific error
      throw new AIGenerationError('Failed to generate raw content', { originalError: error });
    }
  }

  /**
   * Execute AI request with timeout handling
   */
  private async executeAIRequestWithTimeout(request: ContentRequest, prompt: string, aiConfig: AIModelConfig): Promise<any> {
    return Promise.race([
      this.aiOrchestrator.generateContent(
        String(request.userId),
        request.type,
        {
          prompt,
          maxTokens: aiConfig.maxTokens,
          temperature: aiConfig.temperature,
          model: aiConfig.model,
        }
      ),
      this.createTimeoutPromise(aiConfig.timeout)
    ]);
  }

  /**
   * Add generation metadata to raw content
   */
  private addGenerationMetadata(rawContent: any, metadata: { generationTime: number, tokenUsage: any, model: string, promptLength: number }): void {
    rawContent._metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get AI configuration for content type
   */
  private getAIConfigForType(type: ContentType): AIModelConfig {
    return AI_CONTENT_CONFIG[type] || DEFAULT_AI_CONFIG;
  }


  /**
   * Create timeout promise for AI requests
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`AI generation timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Adjust request parameters based on validation feedback
   * TODO: Implementation in subsequent task 3.1.B.2
   */
  private adjustRequestFromValidation(
    request: ContentRequest, 
    validation: ContentValidation
  ): ContentRequest {
    // Create adjusted request based on validation issues
    // This will include logic to modify request parameters to address common validation failures
    return {
      ...request,
      // TODO: Add intelligent request adjustment logic based on validation.issues
    };
  }

  /**
   * Structure raw content into typed format using a factory-based approach.
   */
  private async structureContent(rawContent: string, contentType: ContentType): Promise<StructuredContent> {
    // TODO: Implement a caching layer here. See future implementation consideration #39.
    try {
      const structurer = this.structurerFactory.getStructurer(contentType);
      return await structurer.structure(rawContent);
    } catch (error) {
      console.error(`Structuring content of type '${contentType}' failed. Using fallback.`, {
        error: (error as Error).message,
      });
      const fallback = await this.fallbackHandler.getFallbackContent({ type: contentType } as ContentRequest, error as Error);
      return fallback.content;
    }
  }

  /**
   * Estimate completion time based on content analysis
   * Uses heuristics based on content type and complexity
   */
  private estimateCompletionTime(content: StructuredContent, request: ContentRequest): number {
    // Basic estimation logic - can be enhanced with more sophisticated analysis
    let baseTime = DynamicContentGenerator.DEFAULT_COMPLETION_TIME;
    
    // Adjust based on content type
    switch (request.type) {
      case 'lesson':
        baseTime = 20;
        break;
      case 'vocabulary_drill':
        baseTime = 10;
        break;
      case 'grammar_exercise':
        baseTime = 15;
        break;
      case 'cultural_content':
        baseTime = 25;
        break;
      case 'personalized_exercise':
        baseTime = 12;
        break;
      default:
        baseTime = DynamicContentGenerator.DEFAULT_COMPLETION_TIME;
    }
    
    // Adjust based on difficulty
    if (request.difficulty === 'hard') {
      baseTime *= 1.3;
    } else if (request.difficulty === 'easy') {
      baseTime *= 0.8;
    }
    
    // Adjust based on exercise count
    if (request.exerciseCount && request.exerciseCount > 5) {
      baseTime += (request.exerciseCount - 5) * 2;
    }
    
    return Math.round(baseTime);
  }

  /**
   * Extract learning objectives from structured content
   */
  private extractLearningObjectives(content: StructuredContent): string[] {
    // Extract learning objectives from the content
    if ('learningObjectives' in content && Array.isArray(content.learningObjectives)) {
      return content.learningObjectives;
    }
    
    // Fallback objectives based on content type
    const fallbackObjectives = {
      lesson: ['Practice French language skills', 'Improve comprehension'],
      vocabulary_drill: ['Learn new vocabulary', 'Practice word recognition'],
      grammar_exercise: ['Master grammar rules', 'Apply grammar in context'],
      cultural_content: ['Understand French culture', 'Develop cultural awareness'],
      personalized_exercise: ['Address learning gaps', 'Reinforce weak areas'],
      pronunciation_drill: ['Improve pronunciation', 'Practice phonetics'],
      conversation_practice: ['Practice speaking', 'Improve conversational skills']
    };
    
    return fallbackObjectives[content.type] || ['Practice French language skills'];
  }
}
