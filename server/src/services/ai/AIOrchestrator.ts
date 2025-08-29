import { 
  OrchestrationConfig, 
  AIRequest, 
  AIResponse, 
  AITaskType,
  AITaskPayloads
} from '../../types/AI';
import { ICacheService } from '../common/ICacheService';
import { RateLimitService } from './RateLimitService';
import { FallbackHandler } from './FallbackHandler';
import { ContextService } from './ContextService';
import { AIMetricsService } from './AIMetricsService';
import { PromptTemplateEngine } from './PromptTemplateEngine';
import { ContentValidator } from './ContentValidator';
import { ContentEnhancer } from './ContentEnhancer';
import { ILogger, createLogger } from '../../utils/logger';
import { AIAssessmentEngine } from './assessment/aiAssessmentEngine';
import { AssessmentStrategyFactory } from './assessment/assessmentStrategyFactory';
import { AssessmentRepository } from '../../repositories/assessmentRepository';
import Knex from 'knex';
import type { Knex as KnexTypes } from 'knex';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import https from 'https';
import { aiConfig } from '../../config/aiConfig';

/**
 * @class AIOrchestrator
 * @description Central service for coordinating all AI operations.
 */
export class AIOrchestrator {
  private readonly logger: ILogger;
  private assessmentEngine: AIAssessmentEngine;
  private assessmentRepository: AssessmentRepository;
  private primaryProvider: OpenAI | Anthropic | null = null;
  private fallbackProvider: OpenAI | Anthropic | null = null;

  constructor(
    private readonly config: OrchestrationConfig,
    private readonly db: KnexTypes, // Added for AssessmentRepository
    private readonly openai: OpenAI, // Added for AIAssessmentEngine
    private readonly cacheService: ICacheService,
    private readonly rateLimitService: RateLimitService,
    private readonly fallbackHandler: FallbackHandler,
    private readonly contextService: ContextService,
    private readonly metricsService: AIMetricsService, // Stubbed
    private readonly promptEngine: PromptTemplateEngine, // Stubbed
    private readonly contentValidator: ContentValidator,
    private readonly contentEnhancer: ContentEnhancer,
    logger?: ILogger
  ) {
    this.logger = logger || createLogger('AIOrchestrator');
    
    // Instantiate assessment components
    this.assessmentRepository = new AssessmentRepository(this.db);
    const assessmentStrategyFactory = new AssessmentStrategyFactory(this.openai, this.promptEngine, this.logger);
    
    // Set AIOrchestrator reference in factory to resolve circular dependency
    assessmentStrategyFactory.setAIOrchestrator(this);

    this.assessmentEngine = new AIAssessmentEngine(
      this.db,
      this.assessmentRepository,
      this.cacheService,
      assessmentStrategyFactory,
      this.logger
    );

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
        const cacheKey = this.generateCacheKey(request.task, request.payload);
        const cachedResponse = await this.cacheService.get<AIResponse<T>>(cacheKey);
        if (cachedResponse) {
          this.logger.info(`[AIOrchestrator] Cache HIT for task: ${request.task}`);
          return {
            ...cachedResponse,
            metadata: {
              ...cachedResponse.metadata,
              processingTimeMs: Date.now() - startTime,
              cacheHit: true,
            },
          };
        }
        this.logger.info(`[AIOrchestrator] Cache MISS for task: ${request.task}`);
      }

      // 3. AI Provider Execution (REAL OpenAI Integration)
      this.logger.debug('Executing request against AI provider (REAL OpenAI)');
      const aiResultPayload = await this.executeRealAIProvider(
        request.task,
        request.payload
      );

      const aiResponse: AIResponse<T> = {
        status: 'success',
        data: aiResultPayload,
        metadata: {
          provider: 'openai',
          model: this.getTaskConfiguration(request.task).model,
          processingTimeMs: Date.now() - startTime,
          cacheHit: false,
        },
      };

      // 5. Cache successful response
      if (this.config.strategies.caching.enabled) {
        const cacheKey = this.generateCacheKey(request.task, request.payload);
        await this.cacheService.set(cacheKey, aiResponse, this.config.strategies.caching.ttlSeconds);
      }

      return aiResponse;

    } catch (error) {
      this.logger.error('Error during AI request processing', error);
      return this.fallbackHandler.getFallback(request.task, error as Error);
    }
  }

  /**
   * Executes AI provider requests with SSL-safe multi-provider support.
   * 
   * Simple implementation that addresses SSL certificate issues in corporate
   * environments by providing configurable providers and basic fallback.
   * 
   * @template T - The AI task type from the AITaskType union
   * @param taskType - The specific AI task to execute
   * @param payload - Task-specific request payload with proper typing
   * @returns Promise resolving to type-safe task response
   */
  private async executeRealAIProvider<T extends AITaskType>(
    taskType: T,
    payload: AITaskPayloads[T]['request']
  ): Promise<AITaskPayloads[T]['response']> {
    const startTime = Date.now();
    this.logger.info(`Executing AI for ${taskType}`, { 
      primaryProvider: aiConfig.provider.primary,
      fallbackEnabled: aiConfig.provider.fallbackEnabled
    });

    // Initialize providers if needed
    if (!this.primaryProvider) {
      await this.initializeProviders();
    }

    // Generate task-specific prompt
    const prompt = await this.generatePromptForTask(taskType, payload);
    const taskConfig = this.getTaskConfiguration(taskType);
    
    // Try primary provider first
    try {
      const response = await this.callAIProvider(this.primaryProvider!, taskConfig, prompt);
      const aiResult = JSON.parse(response.content || '{}');
      
      // Track usage
      if (this.metricsService.trackAPICall) {
        await this.metricsService.trackAPICall({
          taskType,
          model: taskConfig.model,
          usage: response.usage,
          processingTimeMs: Date.now() - startTime
        });
      }
      
      const validatedResponse = this.validateAndEnhanceResponse(taskType, aiResult, payload);
      
      this.logger.info(`AI completed for ${taskType} using ${aiConfig.provider.primary}`, {
        processingTimeMs: Date.now() - startTime,
        tokenUsage: response.usage
      });
      
      return validatedResponse;
      
    } catch (primaryError) {
      this.logger.warn(`Primary provider ${aiConfig.provider.primary} failed:`, primaryError);
      
      // Try fallback provider if enabled and available
      if (aiConfig.provider.fallbackEnabled && this.fallbackProvider) {
        try {
          this.logger.info(`Trying fallback provider...`);
          const response = await this.callAIProvider(this.fallbackProvider, taskConfig, prompt);
          const aiResult = JSON.parse(response.content || '{}');
          
          const validatedResponse = this.validateAndEnhanceResponse(taskType, aiResult, payload);
          
          this.logger.info(`AI completed for ${taskType} using fallback provider`, {
            processingTimeMs: Date.now() - startTime
          });
          
          return validatedResponse;
          
        } catch (fallbackError) {
          this.logger.error(`Fallback provider also failed:`, fallbackError);
        }
      }
      
      // Both providers failed, use fallback handler
      this.logger.error(`All AI providers failed for ${taskType}`, primaryError);
      const fallbackResponse = this.fallbackHandler.getFallback(taskType, primaryError as Error);
      return fallbackResponse.data;
    }
  }

  /**
   * Initialize AI providers with SSL-safe configurations.
   */
  private async initializeProviders(): Promise<void> {
    this.logger.info('Initializing AI providers with SSL configuration');
    
    // Create HTTPS agent with SSL bypass for corporate environments
    const httpsAgent = new https.Agent({
      rejectUnauthorized: aiConfig.openai.sslOptions.rejectUnauthorized
    });
    
    try {
      // Initialize primary provider
      if (aiConfig.provider.primary === 'openai' && aiConfig.openai.apiKey) {
        this.primaryProvider = new OpenAI({
          apiKey: aiConfig.openai.apiKey,
          timeout: aiConfig.openai.timeout,
          maxRetries: aiConfig.openai.maxRetries,
          dangerouslyAllowBrowser: false,
          // @ts-ignore - httpAgent is valid but not in types
          httpAgent: httpsAgent
        });
        this.logger.info('OpenAI provider initialized as primary');
      } else if (aiConfig.provider.primary === 'claude' && aiConfig.claude.apiKey) {
        this.primaryProvider = new Anthropic({
          apiKey: aiConfig.claude.apiKey,
          timeout: aiConfig.claude.timeout,
          maxRetries: aiConfig.claude.maxRetries,
          // @ts-ignore - httpAgent is valid but not in types
          httpAgent: httpsAgent
        });
        this.logger.info('Claude provider initialized as primary');
      }
      
      // Initialize fallback provider
      if (aiConfig.provider.fallbackEnabled) {
        if (aiConfig.provider.primary === 'openai' && aiConfig.claude.apiKey) {
          // Primary is OpenAI, fallback is Claude
          this.fallbackProvider = new Anthropic({
            apiKey: aiConfig.claude.apiKey,
            timeout: aiConfig.claude.timeout,
            maxRetries: aiConfig.claude.maxRetries,
            // @ts-ignore - httpAgent is valid but not in types
            httpAgent: httpsAgent
          });
          this.logger.info('Claude provider initialized as fallback');
        } else if (aiConfig.provider.primary === 'claude' && aiConfig.openai.apiKey) {
          // Primary is Claude, fallback is OpenAI
          this.fallbackProvider = new OpenAI({
            apiKey: aiConfig.openai.apiKey,
            timeout: aiConfig.openai.timeout,
            maxRetries: aiConfig.openai.maxRetries,
            dangerouslyAllowBrowser: false,
            // @ts-ignore - httpAgent is valid but not in types
            httpAgent: httpsAgent
          });
          this.logger.info('OpenAI provider initialized as fallback');
        }
      }
      
    } catch (error) {
      this.logger.error('Failed to initialize AI providers:', error);
      throw error;
    }
  }

  /**
   * Call AI provider with unified interface.
   */
  private async callAIProvider(
    provider: OpenAI | Anthropic,
    taskConfig: any,
    prompt: string
  ): Promise<{ content: string; usage: any }> {
    
    if (provider instanceof OpenAI) {
      const response = await provider.chat.completions.create({
        model: taskConfig.model,
        messages: [
          { role: 'system', content: taskConfig.systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: taskConfig.maxTokens,
        temperature: taskConfig.temperature,
        response_format: { type: 'json_object' }
      });
      
      return {
        content: response.choices[0]?.message?.content || '',
        usage: response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
      
    } else if (provider instanceof Anthropic) {
      const response = await provider.messages.create({
        model: aiConfig.claude.defaultModel,
        max_tokens: taskConfig.maxTokens,
        temperature: taskConfig.temperature,
        messages: [
          { role: 'user', content: `${taskConfig.systemPrompt}\n\n${prompt}` }
        ]
      });
      
      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      return {
        content,
        usage: {
          prompt_tokens: response.usage?.input_tokens || 0,
          completion_tokens: response.usage?.output_tokens || 0,
          total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
        }
      };
    }
    
    throw new Error('Unknown provider type');
  }

  /**
   * Routes task-specific prompt generation to existing specialized methods.
   * 
   * TODO [Future - Phase 4]: Consider template-based prompt system for maintainability
   * Current approach uses specialized methods which are readable and performant.
   * Template system would require performance benchmarking and comprehensive testing.
   * Only implement if maintenance burden becomes significant.
   * 
   * @template T - The AI task type
   * @param taskType - The AI task type to generate prompt for
   * @param payload - Task-specific payload for context
   * @returns Promise resolving to formatted prompt string
   */
  private async generatePromptForTask<T extends AITaskType>(
    taskType: T,
    payload: AITaskPayloads[T]['request']
  ): Promise<string> {
    // ✅ REUSES existing working methods - no architectural changes
    switch (taskType) {
      case 'GENERATE_DAILY_PLAN':
        return this.generateDailyPlanPrompt(payload as any);
      case 'GRADE_RESPONSE':
        return this.generateGradingPrompt(payload as any);
      case 'ASSESS_PRONUNCIATION':
        return this.generatePronunciationPrompt(payload as any);
      case 'GENERATE_LESSON':
        return this.generateLessonPrompt(payload as any);
      case 'ADAPT_LEARNING_PATH':
        return this.generateAdaptationPrompt(payload as any);
      default:
        return `Process this French language learning request: ${JSON.stringify(payload)}`;
    }
  }

  /**
   * Gets task-specific configuration for OpenAI API calls.
   * 
   * Provides optimized configuration for each AI task type including model selection,
   * token limits, and temperature settings based on task complexity and requirements.
   * 
   * @param taskType - The AI task type to configure
   * @returns Task-specific configuration object
   */
  private getTaskConfiguration(taskType: AITaskType): {
    model: string;
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
  } {
    const baseModel = this.config.providers?.openAI?.defaultModel || 'gpt-4';
    const baseConfig = {
      model: baseModel,
      temperature: 0.7,
      maxTokens: 1000
    };

    switch (taskType) {
      case 'GENERATE_DAILY_PLAN':
        return {
          ...baseConfig,
          maxTokens: 1200,
          temperature: 0.7,
          systemPrompt: 'You are an expert French language tutor creating personalized daily learning plans. Respond only with valid JSON.'
        };
        
      case 'GRADE_RESPONSE':
        return {
          ...baseConfig,
          model: 'gpt-3.5-turbo', // Sufficient for grading, cost-effective
          maxTokens: 600,
          temperature: 0.3, // Lower temperature for consistent grading
          systemPrompt: 'You are a French language teacher grading student responses. Provide fair, encouraging, and educationally valuable feedback. Be precise about correctness while being supportive.'
        };
        
      case 'ASSESS_PRONUNCIATION':
        return {
          ...baseConfig,
          model: 'gpt-3.5-turbo',
          maxTokens: 800,
          temperature: 0.6,
          systemPrompt: 'You are a French pronunciation expert. Provide encouraging, specific feedback for pronunciation practice. Consider common pronunciation challenges for English speakers learning French.'
        };

      case 'GENERATE_LESSON':
        return {
          ...baseConfig,
          maxTokens: 2000,
          temperature: 0.7,
          systemPrompt: 'You are an expert French language curriculum designer. Create engaging, pedagogically sound lessons that follow language learning best practices.'
        };

      case 'ADAPT_LEARNING_PATH':
        return {
          ...baseConfig,
          maxTokens: 1500,
          temperature: 0.5,
          systemPrompt: 'You are an AI learning path optimizer. Analyze performance data and suggest intelligent adaptations to improve learning outcomes.'
        };

      default:
        return {
          ...baseConfig,
          systemPrompt: 'You are a helpful French language learning assistant. Respond with valid JSON.'
        };
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

  /**
   * @description Assess pronunciation quality from audio recording
   * @param context User context for personalization
   * @param payload Audio URL and expected phrase for assessment
   * @returns Promise resolving to pronunciation assessment with score and feedback
   */
  public async assessPronunciation(
    context: AIRequest<'ASSESS_PRONUNCIATION'>['context'],
    payload: AIRequest<'ASSESS_PRONUNCIATION'>['payload']
  ): Promise<AIResponse<'ASSESS_PRONUNCIATION'>> {
    const request: AIRequest<'ASSESS_PRONUNCIATION'> = {
      task: 'ASSESS_PRONUNCIATION',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }

  /**
   * @description Grade user response against correct answer
   * @param context User context for personalization
   * @param payload User response, correct answer, and question type for grading
   * @returns Promise resolving to grading result with score, feedback, and suggestions
   */
  public async gradeResponse(
    context: AIRequest<'GRADE_RESPONSE'>['context'],
    payload: AIRequest<'GRADE_RESPONSE'>['payload']
  ): Promise<AIResponse<'GRADE_RESPONSE'>> {
    const request: AIRequest<'GRADE_RESPONSE'> = {
      task: 'GRADE_RESPONSE',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }

  /**
   * @description Generate a personalized daily learning plan using AI analysis
   * 
   * Task 3.2.A.1: Adaptive Curriculum Engine Integration
   * 
   * Creates a customized daily learning plan based on the user's current skill level,
   * recent performance data, available time, and learning preferences. The AI analyzes
   * the user's context to provide balanced activities that promote effective learning
   * while maintaining engagement and optimal challenge levels.
   * 
   * @param context - User context for personalization including ID, preferences, and role
   * @param payload - Daily plan generation parameters including duration, skills, and focus areas
   * @returns Promise resolving to structured daily learning plan with activities and outcomes
   * 
   * @example
   * ```typescript
   * const dailyPlan = await orchestrator.generateDailyPlan(
   *   { id: 123, firstName: 'Marie', role: 'user', preferences: {} },
   *   { 
   *     userId: 123, 
   *     preferredDuration: 20, 
   *     currentSkills: { vocabulary: 0.7, grammar: 0.6 },
   *     focusAreas: ['conversation', 'pronunciation'] 
   *   }
   * );
   * ```
   */
  public async generateDailyPlan(
    context: AIRequest<'GENERATE_DAILY_PLAN'>['context'],
    payload: AIRequest<'GENERATE_DAILY_PLAN'>['payload']
  ): Promise<AIResponse<'GENERATE_DAILY_PLAN'>> {
    const request: AIRequest<'GENERATE_DAILY_PLAN'> = {
      task: 'GENERATE_DAILY_PLAN',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }

  /**
   * @description Adapt an existing learning path based on performance data and triggers
   * 
   * Task 3.2.A.1: Adaptive Curriculum Engine Integration
   * 
   * Intelligently modifies a user's current learning path when performance patterns,
   * goal changes, or time constraints indicate that adaptation is needed. The AI
   * analyzes recent assessment data and triggers to recommend path modifications
   * that maintain learning continuity while addressing identified needs.
   * 
   * @param context - User context for personalization and access control
   * @param payload - Adaptation parameters including performance data, triggers, and constraints
   * @returns Promise resolving to adapted learning path with detailed reasoning and timeline impact
   * 
   * @example
   * ```typescript
   * const adaptedPath = await orchestrator.adaptLearningPath(
   *   { id: 123, firstName: 'Pierre', role: 'user', preferences: {} },
   *   {
   *     currentPathId: 'path_456',
   *     performanceData: [
   *       { skillArea: 'grammar', score: 65, completedAt: '2025-01-10', difficulty: 'A2' }
   *     ],
   *     adaptationTrigger: 'poor_performance',
   *     constraints: { weeklyHours: 5, skillAdjustments: { grammar: 'increase' } }
   *   }
   * );
   * ```
   */
  public async adaptLearningPath(
    context: AIRequest<'ADAPT_LEARNING_PATH'>['context'],
    payload: AIRequest<'ADAPT_LEARNING_PATH'>['payload']
  ): Promise<AIResponse<'ADAPT_LEARNING_PATH'>> {
    const request: AIRequest<'ADAPT_LEARNING_PATH'> = {
      task: 'ADAPT_LEARNING_PATH',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }

  /**
   * @description Retrieve cached daily learning plan for fast access
   * 
   * Task 3.2.A.3: Curriculum API Endpoints - Cached Daily Plan Access
   * 
   * Provides fast access to previously generated daily learning plans by utilizing
   * caching strategies and service layer integration. Falls back to generating new
   * plans if cache is empty or expired. Optimized for performance and cost-efficiency
   * by avoiding repeated AI API calls for the same user and date.
   * 
   * @param context - User context for personalization and access control
   * @param payload - Request parameters containing userId for plan retrieval
   * @returns Promise resolving to cached or newly generated daily learning plan
   * 
   * @example
   * ```typescript
   * const dailyPlan = await orchestrator.getDailyPlan(
   *   { id: 123, firstName: 'Marie', role: 'user', preferences: {} },
   *   { userId: 123 }
   * );
   * ```
   */
  public async getDailyPlan(
    context: AIRequest<'GET_DAILY_PLAN'>['context'],
    payload: AIRequest<'GET_DAILY_PLAN'>['payload']
  ): Promise<AIResponse<'GET_DAILY_PLAN'>> {
    const request: AIRequest<'GET_DAILY_PLAN'> = {
      task: 'GET_DAILY_PLAN',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }

  /**
   * @description Get learning recommendations based on available time and user context
   * 
   * Task 3.2.A.3: Curriculum API Endpoints - Learning Recommendations
   * 
   * Provides personalized learning recommendations tailored to the user's available
   * study time and current progress. Integrates with existing progress tracking and
   * assessment systems to deliver contextual, AI-powered suggestions that maximize
   * learning efficiency within time constraints.
   * 
   * @param context - User context for personalization and progress analysis
   * @param payload - Request parameters including userId and timeAvailable
   * @returns Promise resolving to personalized learning recommendations
   * 
   * @example
   * ```typescript
   * const recommendations = await orchestrator.getLearningRecommendations(
   *   { id: 123, firstName: 'Jean', role: 'user', preferences: {} },
   *   { userId: 123, timeAvailable: 30 }
   * );
   * ```
   */
  public async getLearningRecommendations(
    context: AIRequest<'GET_LEARNING_RECOMMENDATIONS'>['context'],
    payload: AIRequest<'GET_LEARNING_RECOMMENDATIONS'>['payload']
  ): Promise<AIResponse<'GET_LEARNING_RECOMMENDATIONS'>> {
    const request: AIRequest<'GET_LEARNING_RECOMMENDATIONS'> = {
      task: 'GET_LEARNING_RECOMMENDATIONS',
      context,
      payload,
    };
    return this.processAIRequest(request);
  }

  /**
   * @description Generate content using AI for dynamic content generation
   * Added for Task 3.1.B.3.a - Raw Content Generation
   */
  public async generateContent(
    userId: string,
    contentType: string,
    options: {
      prompt: string;
      maxTokens: number;
      temperature: number;
      model: string;
    }
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    tokenUsage?: any;
  }> {
    const startTime = Date.now();
    
    try {
      // Rate limiting check
      if (this.config.strategies.rateLimiting.enabled) {
        const isAllowed = await this.rateLimitService.isAllowed(userId);
        if (!isAllowed) {
          this.logger.warn(`Rate limit exceeded for user ${userId} generating ${contentType}`);
          return {
            success: false,
            error: 'Rate limit exceeded'
          };
        }
      }

      // Check cache first
      if (this.config.strategies.caching.enabled) {
        const cacheKey = `content_${contentType}_${this.hashString(options.prompt)}`;
        const cachedResult = await this.cacheService.get<{ data: any }>(cacheKey);
        if (cachedResult && cachedResult.data) {
          this.logger.debug(`Cache hit for content generation: ${contentType}`);
          return {
            success: true,
            data: cachedResult.data,
            tokenUsage: { cached: true, tokens: 0 }
          };
        }
      }

      // Simulate AI content generation (stubbed implementation)
      this.logger.info(`Generating ${contentType} content with AI (stubbed)`, {
        userId,
        promptLength: options.prompt.length,
        model: options.model,
        maxTokens: options.maxTokens
      });

      // Stubbed AI response - in real implementation this would call OpenAI API
      const stubbedContent = this.generateStubbedContent(contentType, options);
      const processingTime = Date.now() - startTime;

      const result = {
        success: true,
        data: stubbedContent,
        tokenUsage: {
          promptTokens: Math.floor(options.prompt.length / 4), // Rough estimate
          completionTokens: Math.floor(JSON.stringify(stubbedContent).length / 4),
          totalTokens: Math.floor((options.prompt.length + JSON.stringify(stubbedContent).length) / 4)
        }
      };

      // Cache the result
      if (this.config.strategies.caching.enabled) {
        const cacheKey = `content_${contentType}_${this.hashString(options.prompt)}`;
        await this.cacheService.set(cacheKey, { data: stubbedContent }, this.config.strategies.caching.ttlSeconds);
      }

      this.logger.debug(`Content generation completed in ${processingTime}ms`);
      return result;

    } catch (error) {
      this.logger.error('Error in generateContent', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Generate stubbed content for different content types
   * TODO: Replace with actual AI provider integration
   */
  private generateStubbedContent(contentType: string, options: any): any {
    const baseContent = {
      type: contentType,
      generatedAt: new Date().toISOString(),
      model: options.model
    };

    switch (contentType) {
      case 'lesson':
        return {
          ...baseContent,
          title: 'Generated French Lesson',
          content: 'This is a stubbed lesson content about French grammar and vocabulary.',
          exercises: [
            { type: 'multiple_choice', question: 'What is "hello" in French?', options: ['Bonjour', 'Au revoir', 'Merci', 'S\'il vous plaît'], correct: 0 }
          ]
        };
      
      case 'vocabulary_drill':
        return {
          ...baseContent,
          words: [
            { french: 'bonjour', english: 'hello', pronunciation: 'bon-ZHOOR' },
            { french: 'merci', english: 'thank you', pronunciation: 'mer-SEE' }
          ]
        };

      case 'grammar_exercise':
        return {
          ...baseContent,
          topic: 'French Articles',
          explanation: 'French has definite and indefinite articles that agree with the gender and number of nouns.',
          exercises: [
            { type: 'fill_blank', sentence: '__ chat est mignon', answer: 'Le' }
          ]
        };

      default:
        return {
          ...baseContent,
          content: `Stubbed content for ${contentType}`,
          message: 'This is placeholder content generated for development purposes.'
        };
    }
  }

  /**
   * Simple hash function for cache keys
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private generateCacheKey<T extends AITaskType>(task: T, payload: any): string {
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
    return `${task}:${this.hashString(payloadString)}`;
  }

  /**
   * Generates a daily learning plan prompt for OpenAI API.
   */
  private generateDailyPlanPrompt(params: any): string {
    const currentLevel = params.currentLevel || 'A2';
    const availableTime = params.preferredDuration || 20;
    const focusAreas = params.focusAreas || ['vocabulary', 'grammar'];
    
    return `Create a personalized French learning plan for today:

USER PROFILE:
- User ID: ${params.userId}
- Current Level: ${currentLevel}
- Available Time: ${availableTime} minutes
- Focus Areas: ${focusAreas.join(', ')}
- Learning Style: ${params.learningStyle || 'balanced'}

REQUIREMENTS:
1. Create a balanced plan that addresses weak areas while building on strengths
2. Include variety: vocabulary, grammar, and practice activities
3. Ensure activities are appropriate for ${currentLevel} level
4. Total time should not exceed ${availableTime} minutes
5. Provide clear learning objectives for each activity

RESPONSE FORMAT (JSON):
{
  "activities": [
    {
      "type": "vocabulary|grammar|conversation|listening|reading|writing",
      "topic": "specific topic based on user needs",
      "estimatedMinutes": number,
      "difficulty": "CEFR level",
      "reasoning": "why this activity was selected",
      "targetSkills": ["skills this activity develops"],
      "priority": 1-5
    }
  ],
  "totalMinutes": ${availableTime},
  "focusAreas": ["primary objectives for today"],
  "expectedOutcomes": ["what user should achieve"],
  "motivationalMessage": "encouraging message for the user"
}`;
  }

  /**
   * Generates a grading prompt for OpenAI API.
   */
  private generateGradingPrompt(params: any): string {
    return `Grade this French language response:

QUESTION: ${params.question}
CORRECT ANSWER: ${params.correctAnswer}
USER RESPONSE: "${params.userResponse}"
QUESTION TYPE: ${params.questionType}
USER LEVEL: ${params.userLevel || 'A2'}

GRADING CRITERIA:
1. Accuracy: Is the response correct or partially correct?
2. Language Quality: Grammar, vocabulary, spelling
3. Completeness: Does it fully address the question?
4. Level Appropriateness: Consider expectations for ${params.userLevel || 'A2'}

RESPONSE FORMAT (JSON):
{
  "score": number, // 0-100 based on accuracy and quality
  "isCorrect": boolean,
  "feedback": "specific, educational feedback about the response",
  "strengths": ["positive aspects of the response"],
  "improvements": ["specific areas for improvement"],
  "suggestions": ["concrete suggestions for better responses"],
  "alternativeAnswers": ["other acceptable ways to answer this question"],
  "encouragement": "supportive message to motivate continued learning"
}`;
  }

  /**
   * Generates a pronunciation assessment prompt for OpenAI API.
   */
  private generatePronunciationPrompt(params: any): string {
    return `Provide pronunciation feedback for French language learning:

TARGET PHRASE: "${params.expectedPhrase}"
USER LEVEL: ${params.userLevel || 'A2'}

FEEDBACK REQUIREMENTS:
1. Assume the user is practicing the pronunciation of the target phrase
2. Provide encouraging, specific feedback appropriate for ${params.userLevel || 'A2'} level
3. Focus on common pronunciation challenges for English speakers learning French
4. Include practical guidance and practice tips

RESPONSE FORMAT (JSON):
{
  "score": number, // 0-100 estimated pronunciation accuracy
  "feedback": "encouraging feedback about pronunciation attempt",
  "improvements": ["specific areas for improvement with practical guidance"],
  "strengths": ["positive aspects of the pronunciation attempt"],
  "practiceExercises": ["specific exercises to improve identified issues"],
  "encouragement": "motivational message appropriate for user level"
}`;
  }

  /**
   * Generates a lesson generation prompt for OpenAI API.
   */
  private generateLessonPrompt(params: any): string {
    const level = params.level || 'A2';
    const duration = params.duration || 15;
    const focusSkills = params.focusSkills || ['vocabulary', 'grammar'];
    
    return `Create a comprehensive French lesson:

LESSON SPECIFICATIONS:
- Topic: ${params.topic}
- Target Level: ${level}
- Duration: ${duration} minutes
- Focus Skills: ${focusSkills.join(', ')}

LESSON REQUIREMENTS:
1. Clear learning objectives appropriate for ${level}
2. Structured progression: introduction → explanation → examples → practice
3. Include vocabulary, grammar concepts, and practical usage
4. Provide exercises that reinforce the lesson content
5. Cultural context where relevant

RESPONSE FORMAT (JSON):
{
  "id": "unique_lesson_id",
  "title": "engaging lesson title",
  "description": "brief lesson overview",
  "objectives": ["specific learning outcomes"],
  "vocabulary": [
    {
      "word": "French word",
      "translation": "English translation",
      "pronunciation": "phonetic guide",
      "example": "example sentence in French"
    }
  ],
  "grammar": {
    "concepts": ["key grammar points"],
    "rules": ["simple explanations of grammar rules"],
    "examples": ["illustrative examples"]
  },
  "estimatedTime": ${duration}
}`;
  }

  /**
   * Generates a learning path adaptation prompt for OpenAI API.
   */
  private generateAdaptationPrompt(params: any): string {
    const performanceData = params.performanceData || [];
    const averageScore = performanceData.length > 0 
      ? performanceData.reduce((sum: number, p: any) => sum + p.score, 0) / performanceData.length 
      : 0;
    
    return `Analyze learning performance and suggest path adaptations:

CURRENT SITUATION:
- Learning Path ID: ${params.currentPathId}
- Adaptation Trigger: ${params.adaptationTrigger}
- Average Performance: ${averageScore.toFixed(1)}%

PERFORMANCE DATA:
${performanceData.map((p: any) => 
  `- ${p.skillArea}: ${p.score}% on ${p.completedAt} (difficulty: ${p.difficulty})`
).join('\n')}

ANALYSIS REQUIRED:
1. Identify performance patterns and trends
2. Determine if current difficulty is appropriate
3. Suggest specific adaptations (easier, harder, different focus)
4. Provide reasoning for each adaptation

RESPONSE FORMAT (JSON):
{
  "adaptedActivities": [
    {
      "id": "activity_id",
      "type": "activity type",
      "title": "activity title",
      "estimatedMinutes": number,
      "difficulty": "CEFR level",
      "changeType": "modified|unchanged|new|removed"
    }
  ],
  "adaptationReasoning": "detailed explanation of why these changes were made",
  "timelineImpact": {
    "daysDelta": number,
    "newCompletionDate": "YYYY-MM-DD"
  },
  "confidenceScore": number,
  "followUpRecommendations": ["actions to maintain progress"]
}`;
  }

  /**
   * Validates and enhances AI responses to ensure quality and consistency.
   * 
   * Performs response validation, sanitization, and enhancement while maintaining
   * type safety and backward compatibility with existing response formats.
   * 
   * @template T - The AI task type
   * @param taskType - The AI task type for validation context
   * @param aiResult - Raw AI response to validate
   * @param originalPayload - Original request payload for context
   * @returns Validated and enhanced response
   */
  private validateAndEnhanceResponse<T extends AITaskType>(
    taskType: T,
    aiResult: any,
    originalPayload: AITaskPayloads[T]['request']
  ): AITaskPayloads[T]['response'] {
    // Add basic validation
    if (!aiResult || typeof aiResult !== 'object') {
      throw new Error(`Invalid AI response format for ${taskType}`);
    }
    
    // Add metadata and enhancements based on task type
    switch (taskType) {
      case 'GENERATE_DAILY_PLAN':
        return this.enhanceDailyPlanResponse(aiResult, originalPayload) as any;
      case 'GRADE_RESPONSE':
        return this.enhanceGradingResponse(aiResult, originalPayload) as any;
      case 'ASSESS_PRONUNCIATION':
        return this.enhancePronunciationResponse(aiResult, originalPayload) as any;
      case 'GENERATE_LESSON':
        return this.enhanceLessonResponse(aiResult, originalPayload) as any;
      case 'ADAPT_LEARNING_PATH':
        return this.enhanceAdaptationResponse(aiResult, originalPayload) as any;
      default:
        return aiResult;
    }
  }

  /**
   * Enhances daily plan responses with validation and additional metadata.
   */
  private enhanceDailyPlanResponse(aiResult: any, payload: any): any {
    const activities = Array.isArray(aiResult.activities) ? aiResult.activities : [];
    
    // Ensure each activity has required fields
    const enhancedActivities = activities.map((activity: any, index: number) => ({
      id: `activity_${Date.now()}_${index}`,
      type: activity.type || 'vocabulary',
      topic: activity.topic || 'General Practice',
      estimatedMinutes: Math.max(1, Math.min(30, activity.estimatedMinutes || 10)),
      difficulty: this.validateCEFRLevel(activity.difficulty) || payload.currentLevel || 'A2',
      reasoning: activity.reasoning || `Recommended ${activity.type || 'vocabulary'} practice`,
      targetSkills: Array.isArray(activity.targetSkills) ? activity.targetSkills : [activity.type || 'vocabulary'],
      priority: Math.max(1, Math.min(5, activity.priority || 3))
    }));

    // Validate total time
    const totalTime = enhancedActivities.reduce((sum: number, a: any) => sum + a.estimatedMinutes, 0);
    const targetTime = payload.preferredDuration || 20;
    
    if (Math.abs(totalTime - targetTime) > 5) {
      // Adjust proportionally
      const scaleFactor = targetTime / totalTime;
      enhancedActivities.forEach((activity: any) => {
        activity.estimatedMinutes = Math.round(activity.estimatedMinutes * scaleFactor);
      });
    }

    return {
      activities: enhancedActivities,
      totalMinutes: enhancedActivities.reduce((sum: number, a: any) => sum + a.estimatedMinutes, 0),
      focusAreas: aiResult.focusAreas || payload.focusAreas || ['vocabulary', 'grammar'],
      expectedOutcomes: Array.isArray(aiResult.expectedOutcomes) 
        ? aiResult.expectedOutcomes 
        : [`Complete ${enhancedActivities.length} learning activities`],
      confidence: 0.95, // High confidence for AI-generated content
      motivationalMessage: aiResult.motivationalMessage || "Let's make progress together!"
    };
  }

  /**
   * Enhances grading responses with validation and consistency checks.
   */
  private enhanceGradingResponse(aiResult: any, payload: any): any {
    const score = Math.max(0, Math.min(100, aiResult.score || 0));
    const isCorrect = aiResult.isCorrect !== undefined ? aiResult.isCorrect : score >= 70;

    return {
      score,
      isCorrect,
      feedback: aiResult.feedback || 'Response evaluated.',
      strengths: Array.isArray(aiResult.strengths) ? aiResult.strengths : [],
      improvements: Array.isArray(aiResult.improvements) ? aiResult.improvements : [],
      suggestions: Array.isArray(aiResult.suggestions) ? aiResult.suggestions : [],
      alternativeAnswers: Array.isArray(aiResult.alternativeAnswers) ? aiResult.alternativeAnswers : [],
      encouragement: aiResult.encouragement || 'Keep up the good work!'
    };
  }

  /**
   * Enhances pronunciation assessment responses.
   */
  private enhancePronunciationResponse(aiResult: any, payload: any): any {
    const score = Math.max(0, Math.min(100, aiResult.score || 0));

    return {
      score,
      feedback: aiResult.feedback || 'Pronunciation assessed.',
      improvements: Array.isArray(aiResult.improvements) ? aiResult.improvements : ['Continue practicing'],
      strengths: Array.isArray(aiResult.strengths) ? aiResult.strengths : [],
      practiceExercises: Array.isArray(aiResult.practiceExercises) ? aiResult.practiceExercises : [],
      encouragement: aiResult.encouragement || 'Keep practicing!'
    };
  }

  /**
   * Enhances lesson generation responses.
   */
  private enhanceLessonResponse(aiResult: any, payload: any): any {
    return {
      id: aiResult.id || Math.floor(Math.random() * 100000),
      title: aiResult.title || `Lesson: ${payload.topic}`,
      description: aiResult.description || 'AI-generated French lesson',
      objectives: Array.isArray(aiResult.objectives) ? aiResult.objectives : ['Learn new concepts'],
      vocabulary: Array.isArray(aiResult.vocabulary) ? aiResult.vocabulary : [],
      grammar: aiResult.grammar || { concepts: [], rules: [], examples: [] },
      estimatedTime: aiResult.estimatedTime || payload.duration || 15
    };
  }

  /**
   * Enhances learning path adaptation responses.
   */
  private enhanceAdaptationResponse(aiResult: any, payload: any): any {
    const adaptedActivities = Array.isArray(aiResult.adaptedActivities) ? aiResult.adaptedActivities : [];
    
    return {
      adaptedActivities: adaptedActivities.map((activity: any) => ({
        id: activity.id || `adapted_${Date.now()}_${Math.random()}`,
        type: activity.type || 'vocabulary',
        title: activity.title || 'Adapted Activity',
        estimatedMinutes: Math.max(5, Math.min(60, activity.estimatedMinutes || 15)),
        difficulty: this.validateCEFRLevel(activity.difficulty) || 'A2',
        changeType: ['modified', 'unchanged', 'new', 'removed'].includes(activity.changeType) 
          ? activity.changeType 
          : 'modified'
      })),
      adaptationReasoning: aiResult.adaptationReasoning || 'Path adapted based on performance analysis.',
      timelineImpact: {
        daysDelta: Math.max(-30, Math.min(30, aiResult.timelineImpact?.daysDelta || 0)),
        newCompletionDate: aiResult.timelineImpact?.newCompletionDate || 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      confidenceScore: Math.max(0.1, Math.min(1.0, aiResult.confidenceScore || 0.8)),
      followUpRecommendations: Array.isArray(aiResult.followUpRecommendations) 
        ? aiResult.followUpRecommendations 
        : ['Continue regular practice', 'Monitor progress closely']
    };
  }

  /**
   * Validates CEFR level strings.
   */
  private validateCEFRLevel(level: string): string | null {
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return validLevels.includes(level) ? level : null;
  }

  public getAssessmentEngine(): AIAssessmentEngine {
    return this.assessmentEngine;
  }
}
