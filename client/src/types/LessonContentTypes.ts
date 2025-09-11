import { z } from 'zod';

export enum LessonType {
  Vocabulary = 'vocabulary',
  Grammar = 'grammar',
  Conversation = 'conversation',
  Quiz = 'quiz',
  Practice = 'practice',
}

// CEFR Level type - aligned with existing server infrastructure
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// For vocabulary lessons - Updated to match AI content generation format
export interface VocabularyItem {
  word: string;
  definition: string;      // Changed from 'translation' to match AI format
  examples: string[];      // Changed from single 'example_sentence' to array
  pronunciation?: string;  // AI enhancement - optional
  difficulty?: CEFRLevel;  // AI enhancement - using existing CEFR infrastructure
}
export interface VocabularyContent {
  vocabulary: VocabularyItem[];  // Changed from 'items' to match AI format
}

// For grammar lessons
export interface GrammarContent {
  rule: string;
  explanation: string;
  examples: string[];
}

// For conversation lessons
export interface ConversationLine {
  speaker: string;
  line: string;
}
export interface ConversationContent {
  title: string;
  dialogue: ConversationLine[];
  keyPhrases?: string[];
}

// For quiz/practice lessons - Interactive content
export interface InteractiveFeedback {
  correct: string;
  incorrect: string;
}
export interface QuizContent {
  question: string;
  options?: string[];
  answer: string;
  feedback: InteractiveFeedback;
  explanation?: string;
}
export interface PracticeContent {
  question: string;
  answer: string;
  feedback: InteractiveFeedback;
  explanation?: string;
}

/**
 * A generic props interface for all lesson content components.
 * This ensures that each lesson component receives a `content` prop
 * with the appropriate data structure.
 */
export interface LessonComponentProps<T> {
  content: T;
}

// Zod schemas for runtime validation - Updated to match AI format and existing CEFR patterns
export const VocabularyItemSchema = z.object({
  word: z.string().min(1, 'Word cannot be empty'),
  definition: z.string().min(1, 'Definition cannot be empty'),
  examples: z.array(z.string().min(1, 'Example cannot be empty')).min(1, 'At least one example required'),
  pronunciation: z.string().optional(),
  difficulty: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(), // Using existing CEFR validation pattern
});

export const VocabularyContentSchema = z.object({
  vocabulary: z.array(VocabularyItemSchema).min(1, 'Vocabulary lesson must have at least one item'),
});

export const GrammarContentSchema = z.object({
  rule: z.string().min(1, 'Grammar rule cannot be empty'),
  explanation: z.string().min(1, 'Grammar explanation cannot be empty'),
  examples: z.array(z.string().min(1)).min(1, 'Grammar lesson must have at least one example'),
});

export const ConversationLineSchema = z.object({
  speaker: z.string().min(1, 'Speaker name cannot be empty'),
  line: z.string().min(1, 'Conversation line cannot be empty'),
});

export const ConversationContentSchema = z.object({
  title: z.string().min(1, 'Conversation title cannot be empty'),
  dialogue: z.array(ConversationLineSchema).min(2, 'Conversation must have at least two lines'),
  keyPhrases: z.array(z.string()).optional(),
});

export const InteractiveFeedbackSchema = z.object({
  correct: z.string().min(1, 'Correct feedback cannot be empty'),
  incorrect: z.string().min(1, 'Incorrect feedback cannot be empty'),
});

export const QuizContentSchema = z.object({
  question: z.string().min(1, 'Quiz question cannot be empty'),
  options: z.array(z.string().min(1)).optional(),
  answer: z.string().min(1, 'Quiz answer cannot be empty'),
  feedback: InteractiveFeedbackSchema,
  explanation: z.string().optional(),
});

export const PracticeContentSchema = z.object({
  question: z.string().min(1, 'Practice question cannot be empty'),
  answer: z.string().min(1, 'Practice answer cannot be empty'),
  feedback: InteractiveFeedbackSchema,
  explanation: z.string().optional(),
});

// Map lesson types to their corresponding schemas
export const lessonContentSchemaMap = {
  [LessonType.Vocabulary]: VocabularyContentSchema,
  [LessonType.Grammar]: GrammarContentSchema,
  [LessonType.Conversation]: ConversationContentSchema,
  [LessonType.Quiz]: QuizContentSchema,
  [LessonType.Practice]: PracticeContentSchema,
} as const;

// Type for validation results
export interface ContentValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates lesson content data against the appropriate schema based on lesson type.
 * @param lessonType The type of lesson (vocabulary, grammar, conversation)
 * @param contentData The raw content data to validate
 * @returns Validation result with parsed data or error message
 */
export function validateLessonContent(
  lessonType: LessonType,
  contentData: unknown
): ContentValidationResult {
  const schema = lessonContentSchemaMap[lessonType];
  if (!schema) {
    return {
      success: false,
      error: `Unknown lesson type: ${lessonType}`,
    };
  }

  try {
    const validatedData = schema.parse(contentData);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return {
        success: false,
        error: `Invalid content data: ${errorMessages.join(', ')}`,
      };
    }
    return {
      success: false,
      error: 'Unknown validation error occurred',
    };
  }
}
