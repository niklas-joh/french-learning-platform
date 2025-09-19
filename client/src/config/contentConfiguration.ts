/**
 * Content Configuration - Pure Data Objects
 * 
 * This file contains pure content data with NO presentation logic.
 * All styling is handled by CSS via data attributes.
 * This separation follows web standards for proper separation of concerns:
 * - CSS handles ALL presentation
 * - React handles structure and state
 * - Configuration objects contain pure content data
 * 
 * @fileoverview Pure content configuration objects
 * @version 1.0.0
 * @author French Learning Platform Team
 */

/**
 * Lesson completion status types
 */
export type LessonStatus = 'not_started' | 'in_progress' | 'completed' | 'locked' | 'review';

/**
 * Difficulty levels for lessons
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Feature categories for landing page cards
 */
export type FeatureCategory = 'ai' | 'gamification' | 'content' | 'social';

/**
 * Pure content data for status configurations
 * Contains ONLY content data - no presentation logic
 */
export interface StatusContentConfig {
  readonly icon: string;
  readonly buttonText: string;
  readonly ariaLabel: string;
  readonly description: string;
}

/**
 * Pure content data for difficulty configurations  
 * Contains ONLY content data - no presentation logic
 */
export interface DifficultyContentConfig {
  readonly label: string;
  readonly description: string;
  readonly ariaLabel: string;
}

/**
 * Pure content data for feature categories
 * Contains ONLY content data - no presentation logic
 */
export interface FeatureCategoryContentConfig {
  readonly name: string;
  readonly description: string;
  readonly ariaLabel: string;
}

/**
 * Status content configuration - Pure data only
 * All presentation logic is handled by CSS via data-status attributes
 */
export const STATUS_CONTENT: Record<LessonStatus, StatusContentConfig> = {
  not_started: {
    icon: '▶️',
    buttonText: 'Start',
    ariaLabel: 'Start lesson',
    description: 'Ready to begin this lesson'
  },
  in_progress: {
    icon: '⏯️',
    buttonText: 'Continue',
    ariaLabel: 'Continue lesson',
    description: 'Continue where you left off'
  },
  completed: {
    icon: '✅',
    buttonText: 'Review',
    ariaLabel: 'Review completed lesson',
    description: 'Lesson completed - review anytime'
  },
  locked: {
    icon: '🔒',
    buttonText: 'Locked',
    ariaLabel: 'Lesson locked',
    description: 'Complete previous lessons to unlock'
  },
  review: {
    icon: '🔄',
    buttonText: 'Review',
    ariaLabel: 'Review lesson',
    description: 'Review this lesson for reinforcement'
  }
} as const;

/**
 * Difficulty content configuration - Pure data only
 * All presentation logic is handled by CSS via data-difficulty attributes
 */
export const DIFFICULTY_CONTENT: Record<DifficultyLevel, DifficultyContentConfig> = {
  beginner: {
    label: 'Beginner',
    description: 'Perfect for those just starting out',
    ariaLabel: 'Beginner difficulty level'
  },
  intermediate: {
    label: 'Intermediate', 
    description: 'For learners with some experience',
    ariaLabel: 'Intermediate difficulty level'
  },
  advanced: {
    label: 'Advanced',
    description: 'Challenging content for experienced learners',
    ariaLabel: 'Advanced difficulty level'
  }
} as const;

/**
 * Feature category content configuration - Pure data only
 * All presentation logic is handled by CSS via data-category attributes
 */
export const FEATURE_CATEGORY_CONTENT: Record<FeatureCategory, FeatureCategoryContentConfig> = {
  ai: {
    name: 'AI-Powered Learning',
    description: 'Personalized learning experience with AI assistance',
    ariaLabel: 'AI-powered learning features'
  },
  gamification: {
    name: 'Gamified Experience',
    description: 'Earn XP, unlock achievements, and track progress',
    ariaLabel: 'Gamification features'
  },
  content: {
    name: 'Rich Content',
    description: 'Comprehensive lessons, exercises, and materials',
    ariaLabel: 'Learning content features'
  },
  social: {
    name: 'Social Learning',
    description: 'Connect with other learners and compete on leaderboards',
    ariaLabel: 'Social learning features'
  }
} as const;

/**
 * Helper function to get status content - Pure data retrieval
 * @param status - The lesson status
 * @returns Pure content configuration object
 */
export const getStatusContent = (status: LessonStatus): StatusContentConfig => {
  return STATUS_CONTENT[status] || STATUS_CONTENT.not_started;
};

/**
 * Helper function to get difficulty content - Pure data retrieval
 * @param difficulty - The difficulty level
 * @returns Pure content configuration object
 */
export const getDifficultyContent = (difficulty: DifficultyLevel): DifficultyContentConfig => {
  return DIFFICULTY_CONTENT[difficulty] || DIFFICULTY_CONTENT.beginner;
};

/**
 * Helper function to get feature category content - Pure data retrieval
 * @param category - The feature category
 * @returns Pure content configuration object
 */
export const getFeatureCategoryContent = (category: FeatureCategory): FeatureCategoryContentConfig => {
  return FEATURE_CATEGORY_CONTENT[category] || FEATURE_CATEGORY_CONTENT.content;
};

/**
 * TypeScript utility types for component data attributes
 * These ensure type safety when applying data attributes for CSS targeting
 */
export interface ComponentDataAttributes {
  'data-status'?: LessonStatus;
  'data-difficulty'?: DifficultyLevel;
  'data-category'?: FeatureCategory;
  'data-render-mode'?: 'quick-action' | 'lesson-card' | 'feature-card';
  'data-theme'?: 'light' | 'dark';
  'data-disabled'?: boolean;
  'data-completed'?: boolean;
  'data-locked'?: boolean;
}

/**
 * Utility function to generate data attributes for components
 * @param attributes - Object with data attribute values
 * @returns Object with properly formatted data attributes
 */
export const getComponentDataAttributes = (attributes: Partial<ComponentDataAttributes>): ComponentDataAttributes => {
  // Filter out undefined values to keep DOM clean
  const filtered: ComponentDataAttributes = {};
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      filtered[key as keyof ComponentDataAttributes] = value as any;
    }
  });
  
  return filtered;
};
