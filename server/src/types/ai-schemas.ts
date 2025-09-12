import { z } from 'zod';

/**
 * Defines the expected structure of a single vocabulary item from the AI.
 * This schema is used to validate the raw AI output before transforming it
 * into our internal `VocabularyItem` domain model.
 */
export const AIVocabularyItemSchema = z.object({
  word: z.string().min(1, { message: "Vocabulary word cannot be empty." }),
  translation: z.string().min(1, { message: "Translation cannot be empty." }),
  example: z.object({
    french: z.string().min(1, { message: "French example sentence cannot be empty." }),
    english: z.string().min(1, { message: "English example sentence cannot be empty." }),
  }),
});

/**
 * Defines the expected structure for a list of vocabulary items.
 */
export const AIVocabularyListSchema = z.array(AIVocabularyItemSchema);

/**
 * Defines the expected structure for lesson sections from the AI.
 */
export const AILessonSectionSchema = z.object({
  type: z.enum(['introduction', 'presentation', 'practice', 'wrap_up']),
  title: z.string().min(1, { message: "Section title cannot be empty." }),
  content: z.string().min(1, { message: "Section content cannot be empty." }),
  duration: z.number().min(0.5, { message: "Section duration must be at least 30 seconds." }),
});

/**
 * Defines the expected structure for vocabulary items from the AI in lesson context.
 */
export const AILessonVocabularySchema = z.object({
  word: z.string().min(1, { message: "Vocabulary word cannot be empty." }),
  definition: z.string().min(1, { message: "Definition cannot be empty." }),
  examples: z.array(z.string().min(1)).min(1, { message: "At least one example is required." }),
});

/**
 * Defines the expected structure of a complete lesson from the AI.
 * This schema is used to validate the raw AI output before transforming it
 * into our internal `IStructuredLesson` domain model.
 */
export const AILessonSchema = z.object({
  title: z.string().min(1, { message: "Lesson title cannot be empty." }),
  description: z.string().min(20, { message: "Lesson description must be at least 20 characters." }),
  sections: z.array(AILessonSectionSchema).min(1, { message: "Lesson must contain at least 1 section." }),
  learningObjectives: z.array(z.string().min(1)).min(1, { message: "At least one learning objective is required." }),
  estimatedTime: z.number().min(5, { message: "Estimated time must be at least 5 minutes." }),
  vocabulary: z.array(AILessonVocabularySchema).optional(),
});

/**
 * Defines the expected structure of a single fill-in-blank exercise item from the AI.
 * Used for grammar exercises where users complete sentences with missing words.
 */
export const AIGrammarExerciseItemSchema = z.object({
  type: z.literal('fill_in_blank'),
  sentence: z.string().min(1, { message: "Exercise sentence cannot be empty." }),
  correctAnswers: z.array(z.string().min(1)).min(1, { message: "At least one correct answer required." }),
  blanks: z.array(z.object({
    position: z.number().min(0, { message: "Blank position must be non-negative." }),
    length: z.number().min(1, { message: "Blank length must be at least 1." })
  })).min(1, { message: "At least one blank position required." }),
  hints: z.array(z.string()).optional()
});

/**
 * Defines the expected structure for exercises within grammar exercise content from the AI.
 * Used to validate the exercise array within the full grammar exercise structure.
 */
export const AIGrammarExerciseWithItemsSchema = z.object({
  type: z.literal('fill_in_blank'),
  instruction: z.string().min(1, { message: "Exercise instruction cannot be empty." }),
  items: z.array(AIGrammarExerciseItemSchema).min(1, { message: "At least one exercise item required." }),
  feedback: z.string().min(1, { message: "Exercise feedback cannot be empty." }),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  estimatedTime: z.number().min(1).optional()
});

/**
 * Defines the expected structure for complete grammar exercises from the AI.
 * This schema validates the full AI output to match the IStructuredGrammarExercise format
 * that AI actually generates, following the same pattern as AILessonSchema.
 * 
 * **Schema Pattern Consistency**: 
 * - Follows AILessonSchema pattern for full object validation
 * - Matches actual AI output format (not simplified format)
 * - Enables direct pass-through transformation for optimal performance
 */
export const AIGrammarExerciseSchema = z.object({
  type: z.literal('grammar_exercise'),
  title: z.string().min(1, { message: "Grammar exercise title cannot be empty." }),
  description: z.string().min(1, { message: "Grammar exercise description cannot be empty." }),
  learningObjectives: z.array(z.string().min(1)).min(1, { message: "At least one learning objective required." }),
  estimatedTime: z.number().min(1, { message: "Estimated time must be at least 1 minute." }),
  grammarRule: z.string().min(1, { message: "Grammar rule cannot be empty." }),
  explanation: z.string().min(1, { message: "Explanation cannot be empty." }),
  examples: z.array(z.string()),
  exercises: z.array(AIGrammarExerciseWithItemsSchema).min(1, { message: "At least one exercise required." }),
  tips: z.array(z.string()),
  commonMistakes: z.array(z.string())
});

// TODO: Add Zod schemas for other content types as they are implemented.
