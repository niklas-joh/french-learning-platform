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

/**
 * @class AIOrchestrator
 * @description Central service for coordinating all AI operations.
 */
export class AIOrchestrator {
  private readonly logger: ILogger;
  private assessmentEngine: AIAssessmentEngine;
  private assessmentRepository: AssessmentRepository;

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

      // 3. AI Provider Execution (Stubbed)
      this.logger.debug('Executing request against AI provider (stubbed)');
      const aiResultPayload = this.executeStubbedAIProvider(
        request.task,
        request.payload
      );

      const aiResponse: AIResponse<T> = {
        status: 'success',
        data: aiResultPayload,
        metadata: {
          provider: 'stub',
          model: 'stub-model-v1',
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
      
      case 'ASSESS_PRONUNCIATION':
        const pronunciationPayload = payload as AITaskPayloads['ASSESS_PRONUNCIATION']['request'];
        return {
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          feedback: `Your pronunciation of "${pronunciationPayload.expectedPhrase}" was quite good overall. Focus on clearer consonant pronunciation.`,
          improvements: ['Work on consonant clarity', 'Practice tongue positioning for French R sounds']
        } as any;
      
      case 'GRADE_RESPONSE':
        const gradingPayload = payload as AITaskPayloads['GRADE_RESPONSE']['request'];
        const isCorrect = gradingPayload.userResponse.toLowerCase().includes(gradingPayload.correctAnswer.toLowerCase());
        return {
          score: isCorrect ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 30,
          feedback: isCorrect 
            ? 'Excellent work! Your response demonstrates good understanding of the concept.'
            : 'Your response shows some understanding, but could be improved. Review the key concepts.',
          isCorrect,
          suggestions: isCorrect 
            ? ['Try practicing more complex variations of this concept']
            : ['Review the lesson material', 'Practice similar exercises', 'Focus on key vocabulary']
        } as any;

      case 'GENERATE_DAILY_PLAN':
        const dailyPlanPayload = payload as any;
        return {
          activities: [
            {
              type: 'vocabulary',
              topic: 'Daily Routines',
              estimatedMinutes: Math.floor(dailyPlanPayload.preferredDuration * 0.4),
              difficulty: 'A2',
              reasoning: 'Vocabulary building strengthens your foundation',
              targetSkills: ['vocabulary', 'reading'],
              priority: 5
            },
            {
              type: 'grammar',
              topic: 'Present Tense',
              estimatedMinutes: Math.floor(dailyPlanPayload.preferredDuration * 0.4),
              difficulty: 'A2',
              reasoning: 'Grammar practice improves sentence structure',
              targetSkills: ['grammar', 'writing'],
              priority: 4
            },
            {
              type: 'conversation',
              topic: 'Greetings',
              estimatedMinutes: Math.floor(dailyPlanPayload.preferredDuration * 0.2),
              difficulty: 'A1',
              reasoning: 'Speaking practice builds confidence',
              targetSkills: ['speaking', 'listening'],
              priority: 3
            }
          ],
          totalMinutes: dailyPlanPayload.preferredDuration,
          focusAreas: dailyPlanPayload.focusAreas || ['vocabulary', 'grammar'],
          expectedOutcomes: ['Learn 8-10 new vocabulary words', 'Practice present tense conjugation', 'Improve pronunciation confidence'],
          confidence: 0.85
        } as any;

      case 'ADAPT_LEARNING_PATH':
        const adaptPayload = payload as any;
        const averageScore = adaptPayload.performanceData.reduce((sum: number, p: any) => sum + p.score, 0) / adaptPayload.performanceData.length;
        const needsRemediation = averageScore < 70;
        
        return {
          adaptedActivities: [
            {
              id: 'activity_1',
              type: needsRemediation ? 'grammar' : 'conversation',
              title: needsRemediation ? 'Grammar Review Session' : 'Advanced Conversation Practice',
              estimatedMinutes: 25,
              difficulty: needsRemediation ? 'A1' : 'B1',
              changeType: 'modified'
            },
            {
              id: 'activity_2', 
              type: 'vocabulary',
              title: 'Vocabulary Reinforcement',
              estimatedMinutes: 15,
              difficulty: 'A2',
              changeType: 'unchanged'
            }
          ],
          adaptationReasoning: needsRemediation 
            ? `Based on recent performance (average: ${averageScore.toFixed(1)}%), focusing on foundational skills before advancing.`
            : `Great progress detected (average: ${averageScore.toFixed(1)}%)! Moving to more challenging material.`,
          timelineImpact: {
            daysDelta: needsRemediation ? 3 : -2,
            newCompletionDate: new Date(Date.now() + (needsRemediation ? 7 : 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          confidenceScore: 0.78,
          followUpRecommendations: needsRemediation 
            ? ['Schedule extra grammar review sessions', 'Consider one-on-one tutoring'] 
            : ['Explore advanced topics', 'Join conversation groups']
        } as any;
      
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

  public getAssessmentEngine(): AIAssessmentEngine {
    return this.assessmentEngine;
  }
}
