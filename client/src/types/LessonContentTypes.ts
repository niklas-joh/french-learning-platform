import { z } from 'zod';

export enum LessonType {
  Vocabulary = 'vocabulary',
  Grammar = 'grammar',
  Conversation = 'conversation',
}

// For vocabulary lessons
export interface VocabularyItem {
  word: string;
  translation: string;
  example_sentence: string;
}
export interface VocabularyContent {
  items: VocabularyItem[];
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
}

/**
 * A generic props interface for all lesson content components.
 * This ensures that each lesson component receives a `content` prop
 * with the appropriate data structure.
 */
export interface LessonComponentProps<T> {
  content: T;
}

// Zod schemas for runtime validation
export const VocabularyItemSchema = z.object({
  word: z.string().min(1, 'Word cannot be empty'),
  translation: z.string().min(1, 'Translation cannot be empty'),
  example_sentence: z.string().min(1, 'Example sentence cannot be empty'),
});

export const VocabularyContentSchema = z.object({
  items: z.array(VocabularyItemSchema).min(1, 'Vocabulary lesson must have at least one item'),
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
});

// Map lesson types to their corresponding schemas
export const lessonContentSchemaMap = {
  [LessonType.Vocabulary]: VocabularyContentSchema,
  [LessonType.Grammar]: GrammarContentSchema,
  [LessonType.Conversation]: ConversationContentSchema,
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
