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
export type FeedbackTone = 'encouraging' | 'neutral' | 'needs-improvement' | 'congratulatory' | 'motivational' | 'corrective' | 'supportive' | 'gentle' | 'enthusiastic';

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
  batchIndex?: number; // Index in batch processing for analytics and debugging
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
}

/**
 * Batch assessment request for processing multiple assessments
 */
export interface BatchAssessmentRequest {
  userId: number;
  requests: AssessmentRequest[];
  exerciseId?: string;
  lessonId?: string;
  exerciseType?: string;
  metadata?: {
    timeSpent?: number;
    hintsUsed?: number;
    attempts?: number;
  };
}

/**
 * Batch assessment result with comprehensive metrics
 * Enhanced to match Task 3.1.C.4 specification requirements
 */
export interface BatchAssessmentResult {
  batchId: string;
  exerciseId: string;
  lessonId: string;
  totalAssessments: number;
  successfulAssessments: number;
  failedAssessments: number;
  overallScore: number;
  processingTimeMs: number;
  individualResults: AssessmentResult[];
  exerciseAnalytics: ExerciseAnalytics;
  exerciseFeedback: ExerciseFeedback;
  errors: Array<{
    message: string;
    stack?: string;
  }>;
  metadata: {
    concurrency: number;
    chunkCount: number;
    averageAssessmentTime: number;
  };
  // Legacy fields for backward compatibility
  accuracy?: number;
  totalQuestions?: number;
  results?: AssessmentResult[];
  failures?: { request: AssessmentRequest; error: string }[];
  batchFeedback?: PersonalizedFeedback;
  processingTime?: number;
  timestamp?: Date;
  fallback?: boolean;
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

/**
 * Exercise batch request structure for comprehensive exercise assessment
 * Following the specification in Task 3.1.C.4
 * 
 * Note: Corrected assessmentRequests type from AssessmentContext[] to AssessmentRequest[]
 * to align with actual usage patterns and implementation requirements.
 */
export interface ExerciseBatch {
  assessmentRequests: AssessmentRequest[];
  exerciseContext: {
    exerciseId: string;
    userId: number;
    exerciseType: string;
    timeLimit?: number;
    skillAreas?: string[];
    difficultyLevel?: string;
  };
}

/**
 * Batch processing options for configuring performance and behavior
 */
export interface BatchProcessingOptions {
  concurrency?: number;
  priority?: 'low' | 'normal' | 'high';
  notifyOnCompletion?: boolean;
}

/**
 * Batch progress status for tracking async processing
 */
export interface BatchProgressStatus {
  batchId: string;
  status: BatchStatus;
  progress: number; // 0-100 percentage
  totalItems: number;
  processedItems: number;
  estimatedTimeRemaining: number;
  createdAt: Date;
  updatedAt: Date;
  results?: any; // Available when status is 'completed'
}

/**
 * Batch status enumeration for job tracking
 */
export type BatchStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'unknown';

/**
 * Exercise analytics with comprehensive performance metrics
 */
export interface ExerciseAnalytics {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageScore: number;
  averageConfidence: number;
  performanceByType: Record<string, TypePerformance>;
  difficultyAnalysis: DifficultyAnalysis;
  timeMetrics: TimeMetrics;
  skillAreas: string[];
  recommendations: string[];
}

/**
 * Performance metrics by assessment type
 */
export interface TypePerformance {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageScore: number;
  averageConfidence: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Difficulty analysis with distribution breakdown
 */
export interface DifficultyAnalysis {
  easy: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  hard: { count: number; percentage: number };
  overallDifficulty: 'easy' | 'appropriate' | 'challenging';
}

/**
 * Time-based performance metrics
 */
export interface TimeMetrics {
  averageTime: number;
  minTime: number;
  maxTime: number;
  totalTime: number;
}

/**
 * Comprehensive exercise-level feedback
 */
export interface ExerciseFeedback {
  overallFeedback: {
    message: string;
    tone: FeedbackTone;
    score: number;
    accuracy: number;
  };
  strengthAreas: string[];
  improvementAreas: string[];
  specificSuggestions: string[];
  nextSteps: string[];
  motivationalMessage: string;
  studyPlan: StudyPlanSuggestion;
}

/**
 * Personalized study plan recommendations
 */
export interface StudyPlanSuggestion {
  immediateAction: string;
  weeklyGoal: string;
  recommendedPracticeTime: number; // minutes
  suggestedResources: string[];
}

/**
 * Progress tracker for batch processing
 */
export interface ProgressTracker {
  batchId: string;
  totalItems: number;
  processedItems: number;
  startTime: number;
  lastUpdateTime: number;
}
