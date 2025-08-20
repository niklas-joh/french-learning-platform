/**
 * @file Defines the core types used in the AI Assessment and Grading Engine.
 * Enhanced with strong typing, French language support, and ESM compliance.
 */

/**
 * Strongly-typed response types for assessment strategies
 */
export type ResponseType = 
  | 'multiple-choice' 
  | 'fill-in-blank' 
  | 'open-ended' 
  | 'pronunciation' 
  | 'conversation'
  | 'listening-comprehension';

/**
 * French language proficiency levels according to CEFR standard
 */
export type FrenchLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/**
 * Confidence levels for AI assessments
 */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * Feedback tone types for personalized responses
 */
export type FeedbackTone = 'encouraging' | 'neutral' | 'needs-improvement' | 'congratulatory' | 'motivational' | 'corrective';

/**
 * Assessment request structure with comprehensive context
 */
export interface AssessmentRequest {
  userId: number;
  userResponse: string;
  expectedAnswer: string | any;
  responseType: ResponseType;
  context: AssessmentContext;
  metadata?: AssessmentMetadata;
}

/**
 * Context information for personalized assessment
 */
export interface AssessmentContext {
  userId: number;
  lessonId?: string;
  exerciseId?: string;
  skillArea: string;
  userLevel: FrenchLevel;
  questionContext?: string;
  culturalContext?: boolean;
  previousAttempts?: number;
}

/**
 * Additional metadata for assessment processing
 */
export interface AssessmentMetadata {
  timeSpent?: number; // in seconds
  attempts?: number;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Enhanced personalized feedback with French language considerations
 */
export interface PersonalizedFeedback {
  message: string;
  tone: FeedbackTone;
  suggestions: string[];
  motivationalQuote?: string;
  grammarTip?: string;
  culturalNote?: string;
  corrections?: string[];
  explanations?: string[];
  encouragement?: string;
}

/**
 * Result of assessing a single user response with enhanced metadata
 */
export interface AssessmentResult {
  assessmentTypeId?: number; // Foreign key to assessmentTypes table
  userResponse: string;
  isCorrect: boolean;
  score: number; // A score from 0 to 100
  feedback: PersonalizedFeedback;
  confidence: ConfidenceLevel;
  assessmentType: ResponseType;
  isFallback?: boolean;
  processingTime?: number;
  metadata?: Record<string, any>;
}

/**
 * Legacy UserResponse interface - kept for backward compatibility
 * @deprecated Use AssessmentRequest instead
 */
export interface UserResponse {
  answer: string;
  expected: string;
  type: string; // Corresponds to an assessment type name
  questionContext: string;
  category?: string;
}

/**
 * Exercise context for comprehensive grading
 */
export interface ExerciseContext {
  exerciseId: number;
  learningContext: string;
  timeSpent: number; // in seconds
}

/**
 * Final aggregated result of grading an entire exercise
 */
export interface GradingResult {
  overallScore: number;
  individualGrades: AssessmentResult[];
  categoryBreakdown: Record<string, number>; // e.g., { "Grammar": 85, "Vocabulary": 92 }
  feedback: PersonalizedFeedback;
  timeSpent: number;
  completedAt: Date;
  strengths: string[];
  weaknesses: string[];
  nextRecommendations: string[];
}

/**
 * French language similarity score with detailed breakdown
 */
export interface FrenchSimilarityScore {
  overall: number; // 0-1 similarity score
  phonetic: number; // Phonetic similarity
  semantic: number; // Meaning similarity
  structural: number; // Grammar structure similarity
  confidence: ConfidenceLevel;
  details: {
    accentHandled: boolean;
    liaisonConsidered: boolean;
    genderVariationAllowed: boolean;
  };
}
