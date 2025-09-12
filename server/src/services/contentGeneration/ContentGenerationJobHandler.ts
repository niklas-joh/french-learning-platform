import { AIOrchestrator } from '../ai/AIOrchestrator';
import { PromptTemplateEngine } from '../ai/PromptTemplateEngine';
import {
  IContentValidatorFactory,
  IContentEnhancerFactory,
  IContentTemplateManager,
  ILearningContextService,
  IContentFallbackHandler,
  IContentGenerationMetrics,
} from './interfaces';
import {
  ContentRequest,
  GeneratedContent,
  LearningContext,
  ContentValidation,
  StructuredContent,
  generateContentId,
  ContentType,
} from '../../types/Content';
import { ILogger } from '../../types/ILogger';
import { AIGenerationError } from '../../utils/errors';
import { ContentStructurerFactory } from './ContentStructurerFactory';
import { AI_CONTENT_CONFIG, DEFAULT_AI_CONFIG, AIModelConfig } from '../../config/aiContentConfig';
import { AiGenerationJob } from '../../models/AiGenerationJob';
import { AIGeneratedContent } from '../../models/AIGeneratedContent';
import { v4 as uuidv4 } from 'uuid';
import type { Knex as KnexTypes } from 'knex';

/**
 * Handles the processing of a single content generation job.
 * This class encapsulates the core logic of generating content,
 * moving it from the synchronous `DynamicContentGenerator` to a
 * job-based asynchronous workflow.
 */
export class ContentGenerationJobHandler {
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
    private structurerFactory: ContentStructurerFactory,
    private logger: ILogger
  ) {}

  /**
   * Processes a single content generation job.
   * @param job The AI generation job to process.
   * @returns The structured content in frontend-compatible format.
   * @throws {AIGenerationError} If a non-recoverable error occurs during generation.
   */
  public async handleJob(job: AiGenerationJob): Promise<StructuredContent> {
    const startTime = Date.now();
    
    // Parse the JSON payload if it's a string, otherwise use as-is
    const request: ContentRequest = typeof job.payload === 'string' 
      ? JSON.parse(job.payload) 
      : job.payload as ContentRequest;

    this.metricsService.recordGenerationAttempt(request);
    this.logger.info(`Starting content generation job`, { 
      jobId: job.id, 
      requestType: request.type,
      userId: request.userId // Add userId to logging for debugging
    });

    try {
      const learningContext = await this.contextService.getUserContext(request.userId);
      const template = this.templateManager.getTemplate(request.type, learningContext);
      const rawContent = await this.generateRawContent(request, template, learningContext);

      const validator = this.validatorFactory.getValidator(request.type);
      
      // ✅ ENHANCED LOGGING: Log content being sent to validator
      this.logger.info('[VALIDATION_DEBUG] Content being validated', {
        jobId: job.id,
        userId: request.userId,
        contentType: request.type,
        validatorType: validator.constructor.name,
        contentKeys: rawContent && typeof rawContent === 'object' 
          ? Object.keys(rawContent) 
          : 'not_object',
        contentStructure: this.getResponseStructureDescription(rawContent),
        contentSample: JSON.stringify(rawContent, null, 2).substring(0, 500) + '...'
      });

      const validation = await validator.validate(rawContent, request);

      // ✅ ENHANCED LOGGING: Detailed validation results
      this.logger.info('[VALIDATION_DEBUG] Validation completed', {
        jobId: job.id,
        userId: request.userId,
        contentType: request.type,
        isValid: validation.isValid,
        score: validation.score,
        confidence: validation.confidence,
        issuesCount: validation.issues?.length || 0,
        suggestionsCount: validation.suggestions?.length || 0,
        validationDetails: {
          issues: validation.issues || [],
          suggestions: validation.suggestions || []
        }
      });

      if (!validation.isValid) {
        this.logger.error('[VALIDATION_DEBUG] Content validation failed - detailed analysis', { 
          jobId: job.id,
          userId: request.userId,
          contentType: request.type,
          validationScore: validation.score,
          failedIssues: validation.issues,
          suggestions: validation.suggestions,
          confidence: validation.confidence,
          // Include the actual content that failed validation for debugging
          failedContent: {
            structure: this.getResponseStructureDescription(rawContent),
            sample: JSON.stringify(rawContent, null, 2).substring(0, 1000) + '...',
            requiredFields: this.getRequiredFieldsForType(request.type),
            missingFields: this.identifyMissingFields(rawContent, request.type)
          }
        });
        
        // In the job system, retry logic is handled by the worker,
        // so we throw an error to signal failure for this attempt.
        throw new AIGenerationError('Content validation failed', { validation, job });
      }

      const enhancer = this.enhancerFactory.getEnhancer(request.type);
      const enhancedContent = await enhancer.enhance(rawContent, learningContext);
      const structuredContent = await this.structureContent(enhancedContent, request.type);

      // NEW: Integrate AI-generated content into user's learning path
      const contentId = await this.saveGeneratedContent(
        structuredContent, 
        request, 
        validation, // From existing validation pipeline
        Date.now() - startTime, // Pre-calculated generation time
        undefined // Optional transaction for atomic operations
      );
      const { integrateGeneratedContent } = await import('../learningPathService.js');
      await integrateGeneratedContent(request.userId, contentId, request.type as 'lesson' | 'exercise' | 'vocabulary');

      const generatedContent = this.createGeneratedContent(
        request,
        structuredContent,
        learningContext,
        validation,
        startTime
      );

      this.metricsService.recordGenerationSuccess(request, Date.now() - startTime, validation.score);
      this.logger.info(`Successfully completed content generation job`, { jobId: job.id });

      // ✅ FRONTEND COMPATIBILITY FIX: Return structured content directly for frontend consumption
      // Frontend components expect content properties directly (e.g., vocabulary: [...])
      // rather than wrapped in GeneratedContent format (content: { vocabulary: [...] })
      return structuredContent;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.metricsService.recordGenerationFailure(request, duration, errorObj);
      this.logger.error(`Critical error in content generation job`, {
        jobId: job.id,
        error: errorObj.message,
        stack: errorObj.stack,
      });

      // Re-throw to be caught by the worker for retry/failure handling.
      // The worker will decide whether to use the fallback handler.
      throw error;
    }
  }

  private async generateRawContent(
    request: ContentRequest,
    template: any,
    context: LearningContext
  ): Promise<any> {
    const startTime = Date.now();
    try {
      const prompt = await this.promptEngine.generateContentPrompt({
        request,
        template,
        context,
      });

      // Log the prompt being sent to AI for correlation
      this.logger.info('[AI_DEBUG] Generated prompt for AI request', {
        userId: request.userId,
        type: request.type,
        promptLength: prompt.length,
        promptPreview: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
        template: template ? Object.keys(template) : 'null',
        contextLevel: context.currentLevel
      });

      const aiConfig = this.getAIConfigForType(request.type);
      const aiResponse = await this.executeAIRequestWithTimeout(request, prompt, aiConfig);

      if (!aiResponse.success) {
        this.logger.error('[AI_DEBUG] AI generation failed - no success flag', {
          userId: request.userId,
          type: request.type,
          error: aiResponse.error,
          aiConfig: {
            model: aiConfig.model,
            maxTokens: aiConfig.maxTokens,
            temperature: aiConfig.temperature
          }
        });
        throw new AIGenerationError(`AI generation failed: ${aiResponse.error}`, { request });
      }

      // ✅ ENHANCED LOGGING: Log exact AI response structure for debugging
      this.logger.info('[AI_DEBUG] Raw AI response received', {
        userId: request.userId,
        type: request.type,
        responseType: typeof aiResponse.data,
        responseKeys: aiResponse.data && typeof aiResponse.data === 'object' 
          ? Object.keys(aiResponse.data) 
          : 'not_object',
        responseSize: JSON.stringify(aiResponse.data || {}).length,
        tokenUsage: aiResponse.tokenUsage,
        // Log first level structure for debugging
        responseStructure: this.getResponseStructureDescription(aiResponse.data),
        // Sample of actual content for inspection
        responseSample: JSON.stringify(aiResponse.data, null, 2).substring(0, 500) + '...'
      });

      // Check if response is valid JSON structure
      if (!aiResponse.data || typeof aiResponse.data !== 'object') {
        this.logger.warn('[AI_DEBUG] AI returned non-object response', {
          userId: request.userId,
          type: request.type,
          actualResponse: aiResponse.data,
          responseType: typeof aiResponse.data
        });
      }

      return aiResponse.data;
    } catch (error) {
      this.logger.error('[AI_DEBUG] Raw content generation failed with exception', {
        userId: request.userId,
        type: request.type,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw new AIGenerationError('Failed to generate raw content', { originalError: error });
    }
  }

  private async executeAIRequestWithTimeout(request: ContentRequest, prompt: string, aiConfig: AIModelConfig): Promise<any> {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`AI generation timeout after ${aiConfig.timeout}ms`));
      }, aiConfig.timeout);
    });

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
      timeoutPromise,
    ]);
  }

  private getAIConfigForType(type: ContentType): AIModelConfig {
    return AI_CONTENT_CONFIG[type] || DEFAULT_AI_CONFIG;
  }

  /**
   * Structures raw content into the appropriate structured format.
   * Supports both string (legacy JSON) and object (AIOrchestrator) inputs.
   * 
   * @param rawContent - The content to structure (string or object from AIOrchestrator)
   * @param contentType - The type of content being structured
   * @returns Promise<StructuredContent> - The structured content
   * @throws {AIGenerationError} If structuring fails
   */
  private async structureContent(rawContent: string | object, contentType: ContentType): Promise<StructuredContent> {
    try {
      // ✅ ENHANCED LOGGING: Log content before structuring
      this.logger.info('[STRUCTURE_DEBUG] Content before structuring', {
        contentType,
        inputType: typeof rawContent,
        inputKeys: rawContent && typeof rawContent === 'object' 
          ? Object.keys(rawContent) 
          : 'not_object',
        inputSize: JSON.stringify(rawContent || {}).length,
        inputStructure: this.getResponseStructureDescription(rawContent),
        inputSample: typeof rawContent === 'string' 
          ? rawContent.substring(0, 300) + (rawContent.length > 300 ? '...' : '')
          : JSON.stringify(rawContent, null, 2).substring(0, 500) + '...'
      });

      const structurer = this.structurerFactory.getStructurer(contentType);
      const structuredContent = await structurer.structure(rawContent);

      // ✅ ENHANCED LOGGING: Log content after structuring and compare
      this.logger.info('[STRUCTURE_DEBUG] Content after structuring', {
        contentType,
        outputType: typeof structuredContent,
        outputKeys: structuredContent && typeof structuredContent === 'object' 
          ? Object.keys(structuredContent) 
          : 'not_object',
        outputSize: JSON.stringify(structuredContent || {}).length,
        outputStructure: this.getResponseStructureDescription(structuredContent),
        // Key fields that often cause validation issues
        hasTitle: 'title' in structuredContent,
        hasDescription: 'description' in structuredContent,
        hasLearningObjectives: 'learningObjectives' in structuredContent,
        hasEstimatedTime: 'estimatedTime' in structuredContent,
        hasType: 'type' in structuredContent,
        actualType: structuredContent.type,
        // Content type specific checks
        contentTypeSpecificFields: this.getContentTypeSpecificFields(structuredContent, contentType)
      });

      return structuredContent;
    } catch (error) {
      this.logger.error('[STRUCTURE_DEBUG] Structuring content failed', {
        contentType,
        inputType: typeof rawContent,
        error: (error as Error).message,
        errorStack: (error as Error).stack,
        rawContentSample: typeof rawContent === 'object' 
          ? JSON.stringify(rawContent, null, 2).substring(0, 500)
          : String(rawContent).substring(0, 500)
      });
      // Let the main error handler decide on fallback logic
      throw new AIGenerationError('Failed to structure content', { originalError: error });
    }
  }

  /**
   * Helper method to check content-type specific fields for debugging
   */
  private getContentTypeSpecificFields(content: any, contentType: ContentType): any {
    if (!content || typeof content !== 'object') {
      return { error: 'content_not_object' };
    }

    switch (contentType) {
      case 'lesson':
        return {
          hasSections: 'sections' in content,
          sectionsType: Array.isArray(content.sections) ? 'array' : typeof content.sections,
          sectionsLength: Array.isArray(content.sections) ? content.sections.length : 0,
          hasVocabulary: 'vocabulary' in content,
          vocabularyType: Array.isArray(content.vocabulary) ? 'array' : typeof content.vocabulary,
          vocabularyLength: Array.isArray(content.vocabulary) ? content.vocabulary.length : 0
        };
      
      case 'vocabulary_drill':
        return {
          hasVocabulary: 'vocabulary' in content,
          vocabularyType: Array.isArray(content.vocabulary) ? 'array' : typeof content.vocabulary,
          vocabularyLength: Array.isArray(content.vocabulary) ? content.vocabulary.length : 0,
          firstVocabKeys: Array.isArray(content.vocabulary) && content.vocabulary.length > 0
            ? Object.keys(content.vocabulary[0] || {})
            : []
        };
      
      case 'grammar_exercise':
        return {
          hasGrammarRule: 'grammarRule' in content,
          hasExplanation: 'explanation' in content,
          hasExamples: 'examples' in content,
          examplesType: Array.isArray(content.examples) ? 'array' : typeof content.examples,
          hasExercises: 'exercises' in content,
          exercisesType: Array.isArray(content.exercises) ? 'array' : typeof content.exercises
        };
      
      default:
        return { contentType, availableFields: Object.keys(content) };
    }
  }

  /**
   * Helper method to identify required fields for each content type
   */
  private getRequiredFieldsForType(contentType: ContentType): string[] {
    const commonRequiredFields = ['title', 'description', 'learningObjectives', 'estimatedTime', 'type'];
    
    switch (contentType) {
      case 'lesson':
        return [...commonRequiredFields, 'sections', 'vocabulary'];
      case 'vocabulary_drill':
        return [...commonRequiredFields, 'vocabulary'];
      case 'grammar_exercise':
        return [...commonRequiredFields, 'grammarRule', 'explanation', 'examples', 'exercises'];
      case 'cultural_content':
        return [...commonRequiredFields, 'topic', 'keyPoints', 'discussionQuestions'];
      case 'personalized_exercise':
        return [...commonRequiredFields, 'focusAreas', 'exercises'];
      default:
        return commonRequiredFields;
    }
  }

  /**
   * Helper method to identify which required fields are missing from content
   */
  private identifyMissingFields(content: any, contentType: ContentType): string[] {
    if (!content || typeof content !== 'object') {
      return ['content_not_object'];
    }

    const requiredFields = this.getRequiredFieldsForType(contentType);
    const missingFields: string[] = [];
    const contentKeys = Object.keys(content);

    for (const field of requiredFields) {
      if (!contentKeys.includes(field)) {
        missingFields.push(field);
      } else {
        // Check if field is empty or invalid
        const value = content[field];
        if (value === null || value === undefined) {
          missingFields.push(`${field}_null_or_undefined`);
        } else if (typeof value === 'string' && value.trim().length === 0) {
          missingFields.push(`${field}_empty_string`);
        } else if (Array.isArray(value) && value.length === 0) {
          missingFields.push(`${field}_empty_array`);
        }
      }
    }

    return missingFields;
  }

  private createGeneratedContent(
    request: ContentRequest,
    structuredContent: StructuredContent,
    learningContext: LearningContext,
    validation: ContentValidation,
    startTime: number
  ): GeneratedContent {
    return {
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
      },
      validation,
      estimatedCompletionTime: this.estimateCompletionTime(structuredContent, request),
      learningObjectives: this.extractLearningObjectives(structuredContent),
    };
  }

  private estimateCompletionTime(content: StructuredContent, request: ContentRequest): number {
    let baseTime = ContentGenerationJobHandler.DEFAULT_COMPLETION_TIME;
    switch (request.type) {
      case 'lesson': baseTime = 20; break;
      case 'vocabulary_drill': baseTime = 10; break;
      case 'grammar_exercise': baseTime = 15; break;
      case 'cultural_content': baseTime = 25; break;
      case 'personalized_exercise': baseTime = 12; break;
    }
    if (request.difficulty === 'advanced') baseTime *= 1.3;
    else if (request.difficulty === 'beginner') baseTime *= 0.8;
    if (request.exerciseCount && request.exerciseCount > 5) {
      baseTime += (request.exerciseCount - 5) * 2;
    }
    return Math.round(baseTime);
  }

  private extractLearningObjectives(content: StructuredContent): string[] {
    if ('learningObjectives' in content && Array.isArray(content.learningObjectives)) {
      return content.learningObjectives;
    }
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

  /**
   * Helper method to analyze and describe the structure of AI response for debugging
   */
  private getResponseStructureDescription(data: any): any {
    if (!data || typeof data !== 'object') {
      return { type: typeof data, value: data };
    }

    const structure: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        structure[key] = {
          type: 'array',
          length: value.length,
          firstItemType: value.length > 0 ? typeof value[0] : 'empty',
          firstItemKeys: value.length > 0 && typeof value[0] === 'object' && value[0] !== null
            ? Object.keys(value[0])
            : 'not_object'
        };
      } else if (value && typeof value === 'object') {
        structure[key] = {
          type: 'object',
          keys: Object.keys(value),
          keyCount: Object.keys(value).length
        };
      } else {
        structure[key] = {
          type: typeof value,
          length: typeof value === 'string' ? value.length : undefined,
          value: typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value
        };
      }
    }
    return structure;
  }

  /**
   * Saves generated content using existing infrastructure and validation context.
   * Optimized for performance by leveraging existing data and supporting transactions.
   * Addresses critical type safety by returning UUID string for proper integration.
   * 
   * @param structuredContent - Already validated content from generation pipeline  
   * @param request - Original content request with all metadata
   * @param validation - Existing validation results from pipeline
   * @param generationTimeMs - Time taken for generation (pre-calculated)
   * @param trx - Optional transaction for atomic operations with learning path integration
   * @returns Promise<string> - UUID for learning path integration (not parsed number)
   * @throws {AIGenerationError} - If content saving fails with comprehensive error context
   */
  private async saveGeneratedContent(
    structuredContent: StructuredContent,
    request: ContentRequest,
    validation: ContentValidation,
    generationTimeMs: number,
    trx?: KnexTypes.Transaction
  ): Promise<string> {
    try {
      // ✅ Transaction support for atomic operations
      const queryBuilder = trx ? AIGeneratedContent.query(trx) : AIGeneratedContent.query();
      
      const savedContent = await queryBuilder.insert({
        userId: request.userId,
        type: request.type,
        status: 'completed',
        requestPayload: request, // ✅ Reuse existing data (no helper method needed)
        generatedData: structuredContent,
        validationResults: validation, // ✅ Use existing validation context  
        metadata: {
          aiGenerated: true,
          version: '1.0',
          // TODO: Get modelUsed from AI config instead of hardcoding
          modelUsed: 'gpt-4',
          contentType: structuredContent.type
        },
        level: request.level,
        topics: request.topics || [],
        focusAreas: request.focusAreas || [],
        estimatedCompletionTime: structuredContent.estimatedTime || request.duration || 15,
        validationScore: validation.score,
        generationTimeMs, // ✅ Use pre-calculated value
        usageCount: 0,
        lastAccessedAt: new Date().toISOString()
      });

      this.logger.info('Generated content saved successfully', {
        contentId: savedContent.id,
        userId: request.userId,
        type: request.type
      });

      return savedContent.id; // ✅ Return UUID string, not parsed number
    } catch (error) {
      this.logger.error('Failed to save generated content', {
        userId: request.userId,
        type: request.type,
        error: error instanceof Error ? error.message : String(error)
      });
      throw new AIGenerationError('Content saving failed', { originalError: error });
    }
  }
}
