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
   * @returns The generated content.
   * @throws {AIGenerationError} If a non-recoverable error occurs during generation.
   */
  public async handleJob(job: AiGenerationJob): Promise<GeneratedContent> {
    const startTime = Date.now();
    const request = job.payload as ContentRequest;

    this.metricsService.recordGenerationAttempt(request);
    this.logger.info(`Starting content generation job`, { jobId: job.id, requestType: request.type });

    try {
      const learningContext = await this.contextService.getUserContext(request.userId);
      const template = this.templateManager.getTemplate(request.type, learningContext);
      const rawContent = await this.generateRawContent(request, template, learningContext);

      const validator = this.validatorFactory.getValidator(request.type);
      const validation = await validator.validate(rawContent, request);

      if (!validation.isValid) {
        this.logger.warn(`Content validation failed for job`, { jobId: job.id, issues: validation.issues });
        // In the job system, retry logic is handled by the worker,
        // so we throw an error to signal failure for this attempt.
        throw new AIGenerationError('Content validation failed', { validation, job });
      }

      const enhancer = this.enhancerFactory.getEnhancer(request.type);
      const enhancedContent = await enhancer.enhance(rawContent, learningContext);
      const structuredContent = await this.structureContent(enhancedContent, request.type);

      const generatedContent = this.createGeneratedContent(
        request,
        structuredContent,
        learningContext,
        validation,
        startTime
      );

      this.metricsService.recordGenerationSuccess(request, Date.now() - startTime, validation.score);
      this.logger.info(`Successfully completed content generation job`, { jobId: job.id });

      return generatedContent;
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

      const aiConfig = this.getAIConfigForType(request.type);
      const aiResponse = await this.executeAIRequestWithTimeout(request, prompt, aiConfig);

      if (!aiResponse.success) {
        throw new AIGenerationError(`AI generation failed: ${aiResponse.error}`, { request });
      }
      return aiResponse.data;
    } catch (error) {
      this.logger.error('Raw content generation failed', {
        userId: request.userId,
        type: request.type,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
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

  private async structureContent(rawContent: string, contentType: ContentType): Promise<StructuredContent> {
    try {
      const structurer = this.structurerFactory.getStructurer(contentType);
      return await structurer.structure(rawContent);
    } catch (error) {
      this.logger.error(`Structuring content of type '${contentType}' failed.`, {
        error: (error as Error).message,
      });
      // Let the main error handler decide on fallback logic
      throw new AIGenerationError('Failed to structure content', { originalError: error });
    }
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
    if (request.difficulty === 'hard') baseTime *= 1.3;
    else if (request.difficulty === 'easy') baseTime *= 0.8;
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
}
