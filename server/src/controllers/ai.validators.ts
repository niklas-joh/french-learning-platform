/**
 * AI Request Validation Schemas using Zod
 * 
 * Provides runtime validation for AI API requests to ensure data integrity
 * and security. These schemas correspond to the AI task payload types defined
 * in the centralized AI type system.
 * 
 * Key benefits:
 * - Runtime protection against malformed client requests
 * - Type-safe validation with automatic TypeScript inference
 * - Clear error messages for debugging and API responses
 * - Single source of truth alignment with AI.ts type definitions
 * 
 * TODO: Integrate with centralized schema validation strategy as per #21 in future_implementation_considerations.md
 */

import { z } from 'zod';

/**
 * Schemas for each specific content type, extending the base.
 * Using discriminated union for type-safe validation based on the 'contentType' field.
 */
export const generateContentPayloadSchema = z.discriminatedUnion('contentType', [
  z.object({
    contentType: z.literal('lesson'),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    topics: z.array(z.string()).min(1),
    duration: z.number().int().min(1).max(60).optional(),
    focusAreas: z.array(z.string()).optional(),
    learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'mixed']).optional(),
  }),
  z.object({
    contentType: z.literal('vocabulary_drill'),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    topics: z.array(z.string()).min(1),
    duration: z.number().int().min(1).max(60).optional(),
  }),
  z.object({
    contentType: z.literal('grammar_exercise'),
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    topics: z.array(z.string()).min(1),
    grammarFocus: z.string(),
    duration: z.number().int().min(1).max(60).optional(),
  }),
]);

/**
 * Validation schema for pronunciation assessment requests
 * Corresponds to AITaskPayloads['ASSESS_PRONUNCIATION']['request']
 */
export const assessPronunciationPayloadSchema = z.object({
  audioUrl: z.string()
    .url('Audio URL must be a valid URL')
    .min(1, 'Audio URL is required'),
  expectedPhrase: z.string()
    .min(1, 'Expected phrase is required')
    .max(500, 'Expected phrase must be less than 500 characters'),
});

/**
 * Validation schema for response grading requests
 * Corresponds to AITaskPayloads['GRADE_RESPONSE']['request']
 */
export const gradeResponsePayloadSchema = z.object({
  userResponse: z.string()
    .min(1, 'User response is required')
    .max(1000, 'User response must be less than 1000 characters'),
  correctAnswer: z.string()
    .min(1, 'Correct answer is required')
  .max(1000, 'Correct answer must be less than 1000 characters'),
  questionType: z.enum(['multiple_choice', 'fill_blank', 'translation', 'essay'], {
    errorMap: () => ({ message: 'Question type must be multiple_choice, fill_blank, translation, or essay' })
  }),
});

/**
 * Validation schema for lesson generation requests
 * Corresponds to AITaskPayloads['GENERATE_LESSON']['request']
 */
export const generateLessonPayloadSchema = z.object({
  topic: z.string()
    .min(1, 'Topic is required')
    .max(200, 'Topic must be less than 200 characters'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .optional()
    .default('A1'),
  duration: z.number()
    .int('Duration must be an integer')
    .min(5, 'Duration must be at least 5 minutes')
    .max(120, 'Duration must be less than 120 minutes')
    .optional()
    .default(30),
  focusAreas: z.array(z.string())
    .optional()
    .default([]),
  includeExercises: z.boolean()
    .optional()
    .default(true),
});

/**
 * Validation schema for pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Task 3.2.A.1: Validation schema for daily learning plan generation
 * 
 * Validates parameters for AI-generated personalized daily learning plans.
 * Ensures proper data types, ranges, and business rule constraints for
 * curriculum generation requests.
 */
export const generateDailyPlanPayloadSchema = z.object({
  userId: z.number()
    .int('User ID must be an integer')
    .positive('User ID must be positive'),
  preferredDuration: z.number()
    .int('Duration must be an integer')
    .min(5, 'Duration must be at least 5 minutes')
    .max(120, 'Duration must be less than 120 minutes'),
  currentSkills: z.record(z.string(), z.number().min(0).max(1))
    .optional()
    .describe('Current skill levels (0-1 scale) across different areas'),
  recentPerformance: z.array(z.number().min(0).max(100))
    .optional()
    .describe('Recent performance scores for context'),
  focusAreas: z.array(z.string().min(1))
    .optional()
    .default([])
    .describe('Specific learning areas to emphasize'),
});

/**
 * Task 3.2.A.1: Validation schema for learning path adaptation
 * 
 * Validates parameters for AI-driven learning path adaptation based on
 * performance triggers, goal changes, or constraint modifications.
 * Ensures data integrity for complex adaptation scenarios.
 */
export const adaptLearningPathPayloadSchema = z.object({
  currentPathId: z.string()
    .min(1, 'Path ID is required')
    .describe('ID of the learning path to adapt'),
  performanceData: z.array(z.object({
    skillArea: z.string()
      .min(1, 'Skill area is required'),
    score: z.number()
      .min(0, 'Score must be non-negative')
      .max(100, 'Score must not exceed 100'),
    completedAt: z.string()
      .datetime('Invalid date format')
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format')),
    difficulty: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
      .describe('CEFR difficulty level')
  }))
    .min(1, 'At least one performance data point is required')
    .max(50, 'Too many performance data points (max 50)'),
  adaptationTrigger: z.enum([
    'poor_performance', 
    'excellent_progress', 
    'goal_change', 
    'time_constraint', 
    'user_request'
  ])
    .describe('Reason for requesting path adaptation'),
  constraints: z.object({
    weeklyHours: z.number()
      .min(1, 'Weekly hours must be at least 1')
      .max(40, 'Weekly hours must be reasonable (max 40)')
      .optional(),
    newGoals: z.array(z.string().min(1))
      .optional(),
    skillAdjustments: z.record(
      z.string(), 
      z.enum(['increase', 'decrease', 'maintain'])
    )
      .optional()
  })
    .optional()
    .describe('New constraints or preferences for adaptation')
});

/**
 * Task 3.2.A.3: Validation schema for retrieving cached daily learning plans
 * 
 * Validates URL parameters for GET endpoint that retrieves previously generated
 * daily learning plans. Focuses on user ID validation to ensure data access
 * security and proper type conversion from string parameters.
 */
export const getDailyPlanParamsSchema = z.object({
  userId: z.coerce.number()
    .int('User ID must be an integer')
    .positive('User ID must be positive')
    .describe('User identifier for retrieving cached daily plan'),
});

/**
 * Task 3.2.A.3: Validation schema for learning recommendations endpoint
 * 
 * Validates both URL parameters and query parameters for the learning
 * recommendations endpoint. Ensures proper time constraints and user
 * identification for generating contextual learning suggestions.
 */
export const getLearningRecommendationsSchema = z.object({
  userId: z.coerce.number()
    .int('User ID must be an integer')
    .positive('User ID must be positive')
    .describe('User identifier for personalization'),
  timeAvailable: z.coerce.number()
    .int('Time available must be an integer')
    .min(5, 'Minimum study time is 5 minutes')
    .max(120, 'Maximum study time is 120 minutes')
    .default(20)
    .describe('Available study time in minutes for recommendations'),
});

/**
 * Future validation schemas for upcoming AI tasks
 * TODO: Implement these when the corresponding features are developed
 */

// TODO: Task 3.2.A - Keep existing generateCurriculumPathPayloadSchema for backward compatibility
// export const generateCurriculumPathPayloadSchema = z.object({
//   currentLevel: z.string().min(1, 'Current level is required'),
//   goals: z.array(z.string().min(1)).min(1, 'At least one goal is required'),
// });

// TODO: Task 3.2.B - Add conversationalTutorPayloadSchema when Conversational AI Tutor is implemented
// export const conversationalTutorPayloadSchema = z.object({
//   message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
//   conversationHistory: z.array(z.unknown()).optional(),
// });

/**
 * Map of AI task types to their corresponding validation schemas
 * This provides a type-safe way to access validators based on task type
 */
export const validationSchemaMap = {
  GENERATE_CONTENT: generateContentPayloadSchema,
  GENERATE_LESSON: generateLessonPayloadSchema,
  ASSESS_PRONUNCIATION: assessPronunciationPayloadSchema,
  GRADE_RESPONSE: gradeResponsePayloadSchema,
  // Task 3.2.A.1: Curriculum feature validation schemas
  GENERATE_DAILY_PLAN: generateDailyPlanPayloadSchema,
  ADAPT_LEARNING_PATH: adaptLearningPathPayloadSchema,
  // Task 3.2.A.3: Additional curriculum endpoint validation schemas
  GET_DAILY_PLAN: getDailyPlanParamsSchema,
  GET_LEARNING_RECOMMENDATIONS: getLearningRecommendationsSchema,
  // TODO: Add future schemas as they are implemented
} as const;

/**
 * Type for extracting schema keys (for type safety)
 */
export type ValidatedAITask = keyof typeof validationSchemaMap;

/**
 * Utility function to validate a payload against its corresponding schema
 * 
 * @param taskType - The AI task type
 * @param payload - The payload to validate
 * @returns Validation result with parsed data or error details
 */
export function validateAIPayload<T extends ValidatedAITask>(
  taskType: T,
  payload: unknown
): {
  success: true;
  data: z.infer<typeof validationSchemaMap[T]>;
} | {
  success: false;
  error: z.ZodError;
} {
  const schema = validationSchemaMap[taskType];
  const result = schema.safeParse(payload);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}

/**
 * Formats Zod validation errors for API responses
 * 
 * @param error - The Zod validation error
 * @returns User-friendly error message and details
 */
export function formatValidationError(error: z.ZodError): {
  message: string;
  details: Array<{
    field: string;
    message: string;
  }>;
} {
  const details = error.issues.map(issue => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));

  return {
    message: 'Request validation failed',
    details,
  };
}
