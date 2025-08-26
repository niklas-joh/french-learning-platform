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
import { UserApplicationData } from '../models/User.js';
import { UserPreference } from '../models/UserPreference.js';
import { Lesson } from '../models/Lesson.js';

// =================================================================
// AI TASK DEFINITIONS
// =================================================================

/**
 * @description Defines the types of tasks the AI Orchestrator can handle.
 *              Using string literal union for type safety and autocompletion.
 */
export type AITaskType =
  | 'GENERATE_CONTENT'
  | 'GENERATE_LESSON'
  | 'ASSESS_PRONUNCIATION' 
  | 'GRADE_RESPONSE'
  | 'GENERATE_CURRICULUM_PATH'
  | 'CONVERSATIONAL_TUTOR_RESPONSE'
  // Task 3.2.A.1: Curriculum feature task types
  | 'GENERATE_DAILY_PLAN'
  | 'ADAPT_LEARNING_PATH'
  // Task 3.2.A.3: Additional curriculum API task types
  | 'GET_DAILY_PLAN'
  | 'GET_LEARNING_RECOMMENDATIONS';

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
  GENERATE_CONTENT: {
    request: 
      | {
          contentType: 'lesson';
          level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
          topics: string[];
          duration?: number;
          focusAreas?: string[];
          learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
        }
      | {
          contentType: 'vocabulary_drill';
          level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
          topics: string[];
          duration?: number;
        }
      | {
          contentType: 'grammar_exercise';
          level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
          topics: string[];
          grammarFocus: string;
          duration?: number;
        };
    response: any; // The response will be structured content, can be defined later
  };

  GENERATE_LESSON: {
    request: {
      /** Topic for the lesson */
      topic: string;
      /** CEFR level for the lesson */
      level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
      /** Duration in minutes */
      duration?: number;
      /** Specific areas to focus on */
      focusAreas?: string[];
      /** Whether to include exercises */
      includeExercises?: boolean;
    };
    response: {
      /** Generated lesson ID */
      id: number;
      /** Lesson title */
      title: string;
      /** Lesson content */
      content?: string;
      /** Associated exercises */
      exercises?: any[];
      /** Lesson metadata */
      metadata?: {
        level: string;
        estimatedDuration: number;
        topics: string[];
      };
    };
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
  
  /**
   * Task 3.2.A.1: Generate daily learning plan based on user context and preferences
   * 
   * This task type generates personalized daily learning activities using AI analysis
   * of the user's current skill level, recent performance, and available study time.
   * Integrates with existing progress tracking and assessment systems for context.
   */
  GENERATE_DAILY_PLAN: {
    request: {
      /** User ID for personalization context */
      userId: number;
      /** Preferred session duration in minutes */
      preferredDuration: number;
      /** Current skill levels across different areas (0-1 scale) */
      currentSkills?: Record<string, number>;
      /** Recent performance scores for context */
      recentPerformance?: number[];
      /** Specific focus areas requested by user */
      focusAreas?: string[];
    };
    response: {
      /** Generated learning activities for the day */
      activities: Array<{
        /** Type of learning activity */
        type: ActivityType;
        /** Specific topic or content area */
        topic: string;
        /** Estimated time to complete in minutes */
        estimatedMinutes: number;
        /** CEFR difficulty level */
        difficulty: CEFRLevel;
        /** Brief explanation of why this activity was recommended */
        reasoning?: string;
        /** Skills this activity will develop */
        targetSkills: string[];
        /** Priority ranking (1-5, higher = more important) */
        priority: number;
      }>;
      /** Total estimated time for all activities */
      totalMinutes: number;
      /** Primary skills this plan focuses on developing */
      focusAreas: string[];
      /** Expected learning outcomes from completing this plan */
      expectedOutcomes: string[];
      /** AI confidence in this recommendation (0-1) */
      confidence: number;
    };
  };

  /**
   * Task 3.2.A.1: Adapt learning path based on performance triggers
   * 
   * This task type modifies an existing learning path based on user performance
   * patterns, goal changes, or time constraints. Provides intelligent adaptation
   * while maintaining learning continuity and pedagogical soundness.
   */
  ADAPT_LEARNING_PATH: {
    request: {
      /** ID of the current learning path to adapt */
      currentPathId: string;
      /** User's recent assessment results for analysis */
      performanceData: Array<{
        skillArea: string;
        score: number;
        completedAt: string;
        difficulty: CEFRLevel;
      }>;
      /** Reason for adaptation request */
      adaptationTrigger: 'poor_performance' | 'excellent_progress' | 'goal_change' | 'time_constraint' | 'user_request';
      /** New constraints or preferences */
      constraints?: {
        /** Available study time per week in hours */
        weeklyHours?: number;
        /** Updated learning goals */
        newGoals?: string[];
        /** Skills to emphasize or de-emphasize */
        skillAdjustments?: Record<string, 'increase' | 'decrease' | 'maintain'>;
      };
    };
    response: {
      /** Adapted learning activities to replace current plan */
      adaptedActivities: Array<{
        /** Activity identifier */
        id: string;
        /** Type of learning activity */
        type: ActivityType;
        /** Activity title */
        title: string;
        /** Estimated completion time in minutes */
        estimatedMinutes: number;
        /** Difficulty level */
        difficulty: CEFRLevel;
        /** Whether this is a new addition, modification, or removal */
        changeType: 'added' | 'modified' | 'removed' | 'unchanged';
      }>;
      /** Detailed explanation of adaptation reasoning */
      adaptationReasoning: string;
      /** Estimated impact on learning timeline */
      timelineImpact: {
        /** Change in estimated completion time (days) */
        daysDelta: number;
        /** New estimated completion date */
        newCompletionDate: string;
      };
      /** AI confidence in the adaptation (0-1) */
      confidenceScore: number;
      /** Recommended follow-up actions */
      followUpRecommendations?: string[];
    };
  };

  // TODO: Task 3.2.A - Keep existing GENERATE_CURRICULUM_PATH for backward compatibility
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
  
  /**
   * Task 3.2.A.3: Get cached daily learning plan
   * 
   * Retrieves previously generated daily learning plans from cache for fast access.
   * This endpoint focuses on performance optimization by serving cached AI-generated
   * plans while falling back to generation if cache is empty or expired.
   */
  GET_DAILY_PLAN: {
    request: {
      /** User ID from URL parameters */
      userId: number;
    };
    response: {
      /** Cached daily learning plan */
      planId: string;
      /** User identifier */
      userId: number;
      /** Plan generation date */
      date: string;
      /** Learning activities for the day */
      activities: Array<{
        /** Activity identifier */
        id: string;
        /** Activity type */
        type: ActivityType;
        /** Activity title */
        title: string;
        /** Estimated completion time */
        estimatedMinutes: number;
        /** Difficulty level */
        difficulty: CEFRLevel;
        /** Priority ranking */
        priority: number;
      }>;
      /** Total estimated time for all activities */
      totalMinutes: number;
      /** When the plan was generated */
      generatedAt: string;
      /** Whether this plan was AI-generated adaptively */
      isAdaptive: boolean;
    };
  };
  
  /**
   * Task 3.2.A.3: Get learning recommendations based on available time
   * 
   * Provides learning recommendations tailored to user's available study time
   * and current progress. Integrates with existing progress tracking and
   * assessment systems for contextual suggestions.
   */
  GET_LEARNING_RECOMMENDATIONS: {
    request: {
      /** User ID from URL parameters */
      userId: number;
      /** Available study time in minutes from query parameters */
      timeAvailable: number;
    };
    response: {
      /** Array of learning recommendations */
      recommendations: Array<{
        /** Recommendation identifier */
        id: string;
        /** Learning path this recommendation belongs to */
        pathId: number;
        /** Recommendation title */
        title: string;
        /** Type of learning activity */
        type: ActivityType;
        /** Estimated completion time */
        estimatedMinutes: number;
        /** Difficulty level */
        difficulty: CEFRLevel;
        /** Explanation for why this is recommended */
        reasoning: string;
        /** Priority ranking (1-5) */
        priority: number;
        /** Skills this recommendation targets */
        targetSkills: string[];
      }>;
      /** Total estimated time for all recommendations */
      totalMinutes: number;
      /** When these recommendations were generated */
      generatedAt: string;
      /** Whether recommendations are AI-powered adaptive suggestions */
      isAdaptive: boolean;
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

// =================================================================
// CURRICULUM FEATURE TYPE DEFINITIONS
// =================================================================

/**
 * Task 3.2.A.1: Activity types supported by the curriculum engine
 * 
 * Defines the different types of learning activities that can be generated
 * and adapted by the AI curriculum system. Each type represents a distinct
 * category of language learning with specific pedagogical objectives.
 */
export type ActivityType = 
  | 'vocabulary'    // Word learning and expansion
  | 'grammar'       // Language structure and rules
  | 'conversation'  // Speaking and dialogue practice
  | 'listening'     // Audio comprehension skills
  | 'reading'       // Text comprehension and analysis
  | 'writing'       // Written expression and composition
  | 'pronunciation' // Speech articulation and phonetics
  | 'culture';      // Cultural context and understanding

/**
 * Task 3.2.A.1: CEFR (Common European Framework of Reference) level definitions
 * 
 * Standardized language proficiency levels used throughout the curriculum system
 * for difficulty assessment, content generation, and progress tracking.
 * Ensures consistent skill level mapping across all AI-generated content.
 */
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
