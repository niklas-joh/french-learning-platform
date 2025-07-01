import { 
  OrchestrationConfig, 
  AIRequest, 
  AIResponse, 
  AITaskType,
  AITaskPayloads
} from '../../types/AI';
import { CacheService } from './CacheService';
import { RateLimitService } from './RateLimitService';
import { FallbackHandler } from './FallbackHandler';
import { ContextService } from './ContextService';
import { AIMetricsService } from './AIMetricsService';
import { PromptTemplateEngine } from './PromptTemplateEngine';
import { ILogger, createLogger } from '../../utils/logger';

/**
 * @class AIOrchestrator
 * @description Central service for coordinating all AI operations.
 */
export class AIOrchestrator {
  private readonly logger: ILogger;

  constructor(
    private readonly config: OrchestrationConfig,
    private readonly cacheService: CacheService,
    private readonly rateLimitService: RateLimitService,
    private readonly fallbackHandler: FallbackHandler,
    private readonly contextService: ContextService,
    private readonly metricsService: AIMetricsService, // Stubbed
    private readonly promptEngine: PromptTemplateEngine, // Stubbed
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('AIOrchestrator');
    this.logger.info('AIOrchestrator initialized');
  }

  private async processAIRequest<T extends AITaskType>(
    request: AIRequest<T>
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();
    this.logger.debug(`Processing AI request for task: ${request.task}`);

    try {
      // 1. Rate Limiting
      if (this.config.strategies.rateLimiting.enabled) {
        const isAllowed = await this.rateLimitService.isAllowed(String(request.context.id));
        if (!isAllowed) {
          this.logger.warn(`Rate limit exceeded for user ${request.context.id} on task ${request.task}`);
          return this.fallbackHandler.getFallback(request.task, new Error('Rate limit exceeded'));
        }
      }

      // 2. Caching
      if (this.config.strategies.caching.enabled) {
        const cachedResponse = await this.cacheService.get(request.task, request.payload);
        if (cachedResponse) {
          return {
            ...cachedResponse,
            metadata: {
              ...cachedResponse.metadata,
              processingTimeMs: Date.now() - startTime,
              cacheHit: true,
            },
          };
        }
      }

      // 3. AI Provider Execution (Stubbed)
      this.logger.debug('Executing request against AI provider (stubbed)');
      const aiResultPayload = this.executeStubbedAIProvider(request.task, request.payload);

      const aiResponse: AIResponse<T> = {
        status: 'success',
        data: aiResultPayload as AITaskPayloads[T]['response'],
        metadata: {
          provider: 'stub',
          model: 'stub-model-v1',
          processingTimeMs: Date.now() - startTime,
          cacheHit: false,
        },
      };

      // 4. Cache successful response
      if (this.config.strategies.caching.enabled) {
        await this.cacheService.set(request.task, request.payload, aiResponse);
      }

      return aiResponse;

    } catch (error) {
      this.logger.error('Error during AI request processing', error);
      return this.fallbackHandler.getFallback(request.task, error as Error);
    }
  }

  private executeStubbedAIProvider<T extends AITaskType>(
    taskType: T,
    payload: AITaskPayloads[T]['request']
  ): AITaskPayloads[T]['response'] {
    // This is a stub. In a real scenario, this would call the actual AI provider.
    this.logger.info(`Executing stub for ${taskType} with payload:`, payload);
    switch (taskType) {
      case 'GENERATE_LESSON':
        return {
          id: 123,
          title: `Generated Lesson on ${(payload as AITaskPayloads['GENERATE_LESSON']['request']).topic}`,
          // ... other Lesson fields
        } as any; // Using 'any' here is acceptable for a stub
      default:
        return {
          message: `This is a stubbed response for task ${taskType}.`,
        } as any; // Using 'any' here is acceptable for a stub
    }
  }

  public async generateLesson(
    context: AIRequest<'GENERATE_LESSON'>['context'],
    payload: AIRequest<'GENERATE_LESSON'>['payload']
  ): Promise<AIResponse<'GENERATE_LESSON'>> {
    const request: AIRequest<'GENERATE_LESSON'> = {
      task: 'GENERATE_LESSON',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }
}
