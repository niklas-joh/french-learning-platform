/**
 * Core TypeScript types and interfaces for the AI Orchestration system.
 * 
 * This file serves as the single source of truth for all AI-related data structures,
 * ensuring type safety and consistency across the entire AI service ecosystem.
 * 
 * Following established codebase patterns:
 * - Uses Pick utility types for efficient data selection
 * - Separates concerns between schema, application data, and API types  
 * - Provides comprehensive JSDoc documentation
 * - Implements centralized payload mapping for type safety
 */

// Importing existing models to maintain consistency with established patterns
import { UserApplicationData } from '../models/User';
import { UserPreference } from '../models/UserPreference';
import { Lesson } from '../models/Lesson';

// =================================================================
// AI TASK DEFINITIONS
// =================================================================

/**
 * @description Defines the types of tasks the AI Orchestrator can handle.
 *              Using string literal union for type safety and autocompletion.
 */
export type AITaskType =
  | 'GENERATE_LESSON'
  | 'ASSESS_PRONUNCIATION' 
  | 'GRADE_RESPONSE'
  | 'GENERATE_CURRICULUM_PATH'
  | 'CONVERSATIONAL_TUTOR_RESPONSE';

// =================================================================
// EFFICIENT USER CONTEXT TYPES
// =================================================================

/**
 * @description A lean, performance-optimized representation of user context for AI personalization.
 *              Uses Pick utility to select only necessary fields from larger models,
 *              reducing database queries and network payload size.
 */
export type AIUserContext = Pick<UserApplicationData, 'id' | 'firstName' | 'role'> & {
  preferences: any; // Parsed JSON object from UserPreference.preferences string
  // TODO: Task 3.2.C - Add lean progress summary when Performance Analytics is implemented
  // progressSummary?: {
  //   recentScores: number[];
  //   weakTopics: string[];
  //   learningStreak: number;
  // };
};

// =================================================================
// TYPE-SAFE ORCHESTRATION CONFIGURATION
// =================================================================

/**
 * @description Configuration for AI caching strategy with specific type constraints.
 */
export interface CacheStrategyConfig {
  /** Whether caching is enabled */
  enabled: boolean;
  /** Time-to-live for cached responses in seconds */
  ttlSeconds: number;
}

/**
 * @description Configuration for AI request rate limiting with specific type constraints.
 */
export interface RateLimitStrategyConfig {
  /** Whether rate limiting is enabled */
  enabled: boolean;
  /** Time window for rate limiting in minutes */
  windowMinutes: number;
  /** Maximum requests allowed per window */
  maxRequests: number;
}

/**
 * @description Configuration for AI fallback strategy with specific type constraints.
 */
export interface FallbackStrategyConfig {
  /** Whether fallback is enabled */
  enabled: boolean;
  /** Type-safe static content fallbacks for each AI task type */
  staticContent: {
    [K in AITaskType]?: Partial<AITaskResponsePayload<K>>;
  };
  // TODO: Task 3.1.A.3 - Add fallback provider configuration when supporting services are implemented
  // fallbackProvider?: 'OpenAI' | 'Azure' | 'Gemini';
}

/**
 * @description Master configuration for the AI Orchestrator with full type safety.
 *              Replaces generic configuration objects with specific, type-safe interfaces.
 */
export interface OrchestrationConfig {
  /** Default AI provider to use */
  defaultProvider: 'OpenAI' | 'Azure' | 'Gemini';
  /** Redis connection URL for caching and session management */
  redisUrl: string;
  /** Provider-specific configuration */
  providers: {
    openAI: {
      /** OpenAI API key */
      apiKey: string;
      /** Default model to use for requests */
      defaultModel: string;
    };
    // TODO: Task 3.1.A.3 - Add other provider configs as they are integrated
  };
  /** Strategy configurations with type safety */
  strategies: {
    caching: CacheStrategyConfig;
    rateLimiting: RateLimitStrategyConfig;
    fallback: FallbackStrategyConfig;
  };
}

// =================================================================
// CENTRALIZED PAYLOAD MAPPING FOR ULTIMATE TYPE SAFETY
// =================================================================

/**
 * @description Central registry of all AI tasks and their associated request/response payload types.
 *              This creates a single source of truth and enables powerful type inference,
 *              preventing payload mismatches and reducing developer errors.
 */
export interface AITaskPayloads {
  GENERATE_LESSON: {
    request: {
      /** The topic for lesson generation */
      topic: string;
      /** Difficulty level for the lesson */
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      /** Estimated duration in minutes */
      estimatedTime?: number;
    };
    response: Lesson; // Reusing established Lesson model for consistency
  };
  
  ASSESS_PRONUNCIATION: {
    request: {
      /** URL to the audio recording */
      audioUrl: string;
      /** The phrase that should have been pronounced */
      expectedPhrase: string;
    };
    response: {
      /** Pronunciation accuracy score (0-100) */
      score: number;
      /** Detailed feedback for improvement */
      feedback: string;
      /** Specific areas that need work */
      improvements?: string[];
    };
  };
  
  GRADE_RESPONSE: {
    request: {
      /** The user's response to grade */
      userResponse: string;
      /** The correct or expected answer */
      correctAnswer: string;
      /** Type of question being graded */
      questionType: 'multiple_choice' | 'fill_blank' | 'translation' | 'essay';
    };
    response: {
      /** Grade score (0-100) */
      score: number;
      /** Detailed feedback on the response */
      feedback: string;
      /** Whether the response is correct */
      isCorrect: boolean;
      /** Suggestions for improvement */
      suggestions?: string[];
    };
  };
  
  // TODO: Task 3.2.A - Define GENERATE_CURRICULUM_PATH payload when Adaptive Curriculum Engine is implemented
  GENERATE_CURRICULUM_PATH: {
    request: {
      /** Current user level */
      currentLevel: string;
      /** Learning goals */
      goals: string[];
    };
    response: {
      /** Generated learning path */
      path: any[]; // Will be refined when curriculum engine is built
    };
  };
  
  // TODO: Task 3.2.B - Define CONVERSATIONAL_TUTOR_RESPONSE payload when Conversational AI Tutor is implemented  
  CONVERSATIONAL_TUTOR_RESPONSE: {
    request: {
      /** User's message to the tutor */
      message: string;
      /** Conversation context */
      conversationHistory?: any[];
    };
    response: {
      /** Tutor's response */
      response: string;
      /** Follow-up suggestions */
      suggestions?: string[];
    };
  };
}

/**
 * @description Utility type to extract the request payload for a given AI task.
 * @template T The AI task type
 * @example AITaskRequestPayload<'GENERATE_LESSON'> // { topic: string; difficulty: 'beginner' | 'intermediate' | 'advanced'; }
 */
export type AITaskRequestPayload<T extends keyof AITaskPayloads> = AITaskPayloads[T]['request'];

/**
 * @description Utility type to extract the response payload for a given AI task.
 * @template T The AI task type  
 * @example AITaskResponsePayload<'GENERATE_LESSON'> // Lesson
 */
export type AITaskResponsePayload<T extends keyof AITaskPayloads> = AITaskPayloads[T]['response'];

// =================================================================
// CORE REQUEST/RESPONSE INTERFACES
// =================================================================

/**
 * @description Standardized, fully type-safe request structure for the AI Orchestrator.
 *              The payload type is automatically inferred from the task type,
 *              preventing mismatched data and enabling better developer experience.
 * @template T The specific AI task type, which determines the payload structure
 */
export interface AIRequest<T extends keyof AITaskPayloads> {
  /** The specific AI task to be performed */
  task: T;
  /** User context for personalization, optimized for performance */
  context: AIUserContext;
  /** Task-specific payload data, type-safe based on the task */
  payload: AITaskRequestPayload<T>;
}

/**
 * @description Standardized, fully type-safe response structure from the AI Orchestrator.
 *              Includes comprehensive metadata for performance monitoring, cost tracking,
 *              and reliability analysis.
 * @template T The specific AI task type, which determines the response data structure
 */
export interface AIResponse<T extends keyof AITaskPayloads> {
  /** Outcome of the AI request */
  status: 'success' | 'error' | 'fallback';
  /** Task-specific response data, type-safe based on the task */
  data: AITaskResponsePayload<T>;
  /** Metadata for monitoring, analytics, and cost tracking */
  metadata: {
    /** AI provider that handled the request */
    provider: string;
    /** Specific model used for the request */
    model: string;
    /** Confidence score for content validation (0-1) */
    confidenceScore?: number;
    /** Request processing time in milliseconds */
    processingTimeMs: number;
    /** Whether the response came from cache */
    cacheHit: boolean;
    /** Cost of the request in USD for budget tracking */
    cost?: number;
  };
  /** Error details if status is 'error' */
  error?: {
    /** Human-readable error message */
    message: string;
    /** Machine-readable error code */
    code?: string;
  };
}

// =================================================================
// HELPER TYPES FOR COMMON USE CASES
// =================================================================

/**
 * @description Helper type for creating strongly-typed AI service methods.
 * @template T The AI task type
 * @example 
 * async generateLesson(request: AIServiceMethod<'GENERATE_LESSON'>['request']): Promise<AIServiceMethod<'GENERATE_LESSON'>['response']>
 */
export type AIServiceMethod<T extends keyof AITaskPayloads> = {
  request: AIRequest<T>;
  response: AIResponse<T>;
};

/**
 * @description Union type of all possible AI request types for generic handling.
 */
export type AnyAIRequest = {
  [K in keyof AITaskPayloads]: AIRequest<K>;
}[keyof AITaskPayloads];

/**
 * @description Union type of all possible AI response types for generic handling.
 */  
export type AnyAIResponse = {
  [K in keyof AITaskPayloads]: AIResponse<K>;
}[keyof AITaskPayloads];
