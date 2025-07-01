// Enhanced Content Types for AI-Driven Dynamic Content Generation
// Follows existing codebase patterns and implements strict type safety

import { v4 as uuidv4 } from 'uuid';

// ========================================
// CONTENT REQUEST TYPES
// ========================================

/**
 * Groups content generation options for better organization
 * TODO: Reference Future Implementation #29 - Enhanced Exercise Type System
 */
export interface ContentGenerationOptions {
  includeExercises?: boolean;
  includeCulturalContext?: boolean;
  includeAudio?: boolean;
  includeExamples?: boolean;
  adaptToWeaknesses?: boolean;
  reinforcePreviousLearning?: boolean;
  includeMoreExamples?: boolean;
}

/**
 * Content generation request with improved organization and validation
 * TODO: Reference Future Implementation #21 - AI Type System Schema Validation Integration
 */
export interface ContentRequest {
  userId: number;
  type: ContentType;
  level?: string;
  topics?: string[];
  duration?: number; // in minutes
  focusAreas?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  vocabulary?: string[];
  context?: string;
  grammarFocus?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  exerciseCount?: number;
  culturalTopic?: string;
  options?: ContentGenerationOptions;
}

// ========================================
// CONTENT RESPONSE TYPES
// ========================================

/**
 * Generated content with robust ID generation and metadata
 */
export interface GeneratedContent {
  id: string; // Generated using UUID for guaranteed uniqueness
  type: ContentType;
  content: StructuredContent;
  metadata: ContentMetadata;
  validation: ContentValidation;
  estimatedCompletionTime: number; // in minutes
  learningObjectives: string[];
}

export interface ContentMetadata {
  userId: number;
  generatedAt: Date;
  level: string;
  topics: string[];
  aiGenerated: boolean;
  version: string;
  fallback?: boolean;
  generationTime?: number; // milliseconds
  tokenUsage?: number;
  modelUsed?: string;
}

export interface ContentValidation {
  isValid: boolean;
  /** A score from 0 to 1 indicating the quality and relevance of the content */
  score: number;
  issues: string[];
  suggestions?: string[];
  /** A score from 0 to 1 indicating the AI's confidence in its own validation */
  confidence?: number;
}

// ========================================
// CONTENT TEMPLATES & CONTEXT
// ========================================

export interface ContentTemplate {
  structure: Record<string, string>;
  requirements: Record<string, any>;
  adaptations?: Record<string, string>;
  prompts?: Record<string, string>;
}

export interface LearningContext {
  userId: number;
  currentLevel: string;
  learningStyle: string;
  weakAreas: string[];
  strengths: string[];
  interests: string[];
  recentTopics: string[];
  performanceHistory: any[]; // TODO: Define proper type for performance records
  lastActivity?: Date;
  streakDays?: number;
  totalLessons?: number;
}

// ========================================
// CONTENT TYPE DEFINITIONS
// ========================================

export type ContentType =
  | 'lesson'
  | 'vocabulary_drill'
  | 'grammar_exercise'
  | 'cultural_content'
  | 'personalized_exercise'
  | 'pronunciation_drill'
  | 'conversation_practice';

// ========================================
// STRUCTURED CONTENT TYPES
// ========================================

/**
 * Base interface for all structured content types (DRY principle)
 */
export interface BaseStructuredContent {
  type: ContentType;
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedTime: number; // in minutes
}

/**
 * Discriminated union for type-safe content structures
 */
export type StructuredContent =
  | IStructuredLesson
  | IStructuredVocabularyDrill
  | IStructuredGrammarExercise
  | IStructuredCulturalContent
  | IStructuredPersonalizedExercise;

export interface IStructuredLesson extends BaseStructuredContent {
  type: 'lesson';
  sections: LessonSection[];
  vocabulary: VocabularyItem[];
  grammar?: GrammarConcept;
  culturalNotes?: CulturalNote[];
}

export interface IStructuredVocabularyDrill extends BaseStructuredContent {
  type: 'vocabulary_drill';
  context: string;
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  culturalContext?: string;
}

export interface IStructuredGrammarExercise extends BaseStructuredContent {
  type: 'grammar_exercise';
  grammarRule: string;
  explanation: string;
  examples: string[];
  exercises: Exercise[];
  tips: string[];
  commonMistakes: string[];
}

export interface IStructuredCulturalContent extends BaseStructuredContent {
  type: 'cultural_content';
  topic: string;
  keyPoints: string[];
  vocabulary: VocabularyItem[];
  discussionQuestions: string[];
  multimedia?: MultimediaItem[];
  connections: string[];
}

export interface IStructuredPersonalizedExercise extends BaseStructuredContent {
  type: 'personalized_exercise';
  focusAreas: string[];
  exercises: Exercise[];
  adaptiveElements: AdaptiveElement[];
}

// ========================================
// SUPPORTING CONTENT INTERFACES
// ========================================

export interface LessonSection {
  type: 'introduction' | 'presentation' | 'practice' | 'wrap_up';
  title: string;
  content: string;
  duration: number; // in minutes
  vocabulary?: VocabularyItem[];
  grammar?: GrammarConcept;
  exercises?: Exercise[];
}

export interface VocabularyItem {
  word: string;
  definition: string;
  pronunciation: string;
  ipa?: string;
  examples: string[];
  image?: string;
  audio?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  culturalContext?: string;
  regionalVariations?: string[];
}

export interface GrammarConcept {
  rule: string;
  explanation: string;
  examples: string[];
  exceptions?: string[];
}

export interface CulturalNote {
  title: string;
  content: string;
  relevance: string;
}

export interface MultimediaItem {
  type: 'image' | 'audio' | 'video';
  url: string;
  description: string;
  alt?: string;
}

export interface AdaptiveElement {
  condition: string;
  content: any;
  trigger: string;
}

// ========================================
// ENHANCED EXERCISE TYPE SYSTEM
// ========================================

/**
 * Exercise interface with strongly-typed items
 * Addresses Future Implementation #29 - Enhanced Exercise Type System
 */
export interface Exercise {
  type: ExerciseType;
  instruction: string;
  items: ExerciseItem[];
  feedback: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: number; // in minutes
}

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_in_blank'
  | 'matching'
  | 'ordering'
  | 'true_false'
  | 'drag_drop'
  | 'listening_comprehension'
  | 'pronunciation_practice';

/**
 * Discriminated union for strongly-typed exercise items
 * Replaces the problematic `any[]` from original design
 */
export type ExerciseItem =
  | MultipleChoiceItem
  | FillInBlankItem
  | MatchingItem
  | OrderingItem
  | TrueFalseItem
  | DragDropItem
  | ListeningComprehensionItem
  | PronunciationPracticeItem;

export interface MultipleChoiceItem {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface FillInBlankItem {
  type: 'fill_in_blank';
  sentence: string;
  blanks: BlankPosition[];
  correctAnswers: string[];
  hints?: string[];
}

export interface BlankPosition {
  position: number; // character position in sentence
  length: number; // expected answer length
}

export interface MatchingItem {
  type: 'matching';
  leftColumn: string[];
  rightColumn: string[];
  correctMatches: MatchPair[];
}

export interface MatchPair {
  leftIndex: number;
  rightIndex: number;
}

export interface OrderingItem {
  type: 'ordering';
  items: string[];
  correctOrder: number[]; // indices representing correct sequence
}

export interface TrueFalseItem {
  type: 'true_false';
  statement: string;
  correctAnswer: boolean;
  explanation?: string;
}

export interface DragDropItem {
  type: 'drag_drop';
  instruction: string;
  draggableItems: DraggableItem[];
  dropZones: DropZone[];
}

export interface DraggableItem {
  id: string;
  content: string;
  correctZoneId: string;
}

export interface DropZone {
  id: string;
  label: string;
  acceptsMultiple?: boolean;
}

export interface ListeningComprehensionItem {
  type: 'listening_comprehension';
  audioUrl: string;
  transcript?: string; // for validation, not shown to user
  questions: MultipleChoiceItem[] | FillInBlankItem[];
}

export interface PronunciationPracticeItem {
  type: 'pronunciation_practice';
  targetPhrase: string;
  ipa: string;
  audioExample: string;
  hints: string[];
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generates a unique content ID using UUID
 * Replaces the insecure Date.now() + Math.random() approach
 */
export function generateContentId(): string {
  return `content_${uuidv4()}`;
}

/**
 * Type guard functions for content type checking
 */
export function isLesson(content: StructuredContent): content is IStructuredLesson {
  return content.type === 'lesson';
}

export function isVocabularyDrill(content: StructuredContent): content is IStructuredVocabularyDrill {
  return content.type === 'vocabulary_drill';
}

export function isGrammarExercise(content: StructuredContent): content is IStructuredGrammarExercise {
  return content.type === 'grammar_exercise';
}

export function isCulturalContent(content: StructuredContent): content is IStructuredCulturalContent {
  return content.type === 'cultural_content';
}

export function isPersonalizedExercise(content: StructuredContent): content is IStructuredPersonalizedExercise {
  return content.type === 'personalized_exercise';
}
