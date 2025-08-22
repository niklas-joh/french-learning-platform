/**
 * AI Dashboard Configuration
 * 
 * Centralizes all AI dashboard constants, configuration values,
 * and feature flags following established configuration patterns.
 * 
 * This configuration leverages existing patterns and provides a single
 * source of truth for AI dashboard behavior, content types, and performance settings.
 * 
 * @fileoverview Centralized configuration for AI Dashboard Components
 * @version 1.0.0
 * @author French Learning Platform Team
 */

/**
 * Available content types for AI generation
 */
export const AI_DASHBOARD_CONFIG = {
  /**
   * Content types available for AI generation
   * Following established content patterns from existing types
   */
  CONTENT_TYPES: [
    { value: 'lesson' as const, label: 'Interactive Lesson', icon: '📚', description: 'Structured learning content with exercises' },
    { value: 'vocabulary_drill' as const, label: 'Vocabulary Practice', icon: '🔤', description: 'Focused vocabulary exercises' },
    { value: 'grammar_exercise' as const, label: 'Grammar Exercise', icon: '✏️', description: 'Grammar rules and practice' },
    { value: 'conversation_practice' as const, label: 'Conversation', icon: '💬', description: 'Speaking and dialogue practice' }
  ] as const,
  
  /**
   * Popular topic suggestions based on user engagement patterns
   * These are curated to match French learning curriculum standards
   */
  SUGGESTED_TOPICS: [
    'French greetings',
    'Ordering food', 
    'Past tense verbs',
    'French culture',
    'Travel phrases',
    'Business French',
    'Family vocabulary',
    'Weather and seasons',
    'Shopping dialogue',
    'Restaurant conversation'
  ] as const,
  
  /**
   * Default configuration values
   * Aligned with existing learning path patterns
   */
  DEFAULTS: {
    DIFFICULTY: 'A1' as const,
    ESTIMATED_TIME: 15, // minutes
    MAX_RECOMMENDATIONS: 4,
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_DAILY_PLAN_ITEMS: 6,
    MAX_TOPIC_SUGGESTIONS: 6,
    /**
     * Polling intervals for different job types
     * Leveraging existing aiPolling.ts infrastructure
     */
    POLLING_INTERVALS: {
      FAST_JOBS: 2000,    // Assessment jobs - quick feedback
      SLOW_JOBS: 5000,    // Content generation - moderate
      BATCH_JOBS: 10000   // Batch processing - patient
    }
  },
  
  /**
   * Performance optimization settings
   * Based on AI-specific interaction patterns
   */
  PERFORMANCE: {
    VIRTUAL_SCROLLING_THRESHOLD: 10, // Items before virtual scrolling kicks in
    MEMOIZATION_ENABLED: true,
    ERROR_BOUNDARY_ENABLED: true,
    DEBOUNCE_SEARCH_MS: 300,
    CACHE_TTL_MS: 300000 // 5 minutes
  },
  
  /**
   * Quick action definitions for homepage
   * Following existing card component patterns
   */
  QUICK_ACTIONS: [
    {
      id: 'quick-lesson',
      title: 'Quick Lesson',
      description: '5 min practice',
      icon: '⚡',
      contentType: 'lesson' as const,
      estimatedTime: 5
    },
    {
      id: 'vocabulary-drill',
      title: 'Vocabulary',
      description: 'Learn new words',
      icon: '🔤',
      contentType: 'vocabulary_drill' as const,
      estimatedTime: 10
    },
    {
      id: 'speaking-practice',
      title: 'Speaking',
      description: 'Conversation practice',
      icon: '🎤',
      contentType: 'conversation_practice' as const,
      estimatedTime: 8
    },
    {
      id: 'grammar-exercise',
      title: 'Grammar',
      description: 'Rules & practice',
      icon: '✏️',
      contentType: 'grammar_exercise' as const,
      estimatedTime: 12
    }
  ] as const,
  
  /**
   * Learning plan priorities
   * Used for sorting and display order
   */
  PRIORITY_ORDER: {
    high: 3,
    medium: 2,
    low: 1
  } as const,
  
  /**
   * Error messages and user feedback
   * Centralized for consistency and i18n preparation
   */
  MESSAGES: {
    ERRORS: {
      GENERATION_FAILED: 'Content generation temporarily unavailable. Please try again.',
      NETWORK_ERROR: 'Connection issue. Please check your internet connection.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      QUOTA_EXCEEDED: 'Daily generation limit reached. Try again tomorrow.',
      GENERIC_ERROR: 'Something went wrong. Please refresh and try again.'
    },
    LOADING: {
      GENERATING_CONTENT: 'Creating your personalized content...',
      LOADING_PLAN: 'Loading your daily learning plan...',
      SAVING_PROGRESS: 'Saving your progress...',
      ANALYZING_PERFORMANCE: 'Analyzing your learning patterns...'
    },
    SUCCESS: {
      CONTENT_GENERATED: 'Content ready! Starting your lesson...',
      PROGRESS_SAVED: 'Progress saved successfully!',
      PLAN_UPDATED: 'Learning plan updated with your preferences.'
    }
  } as const
} as const;

/**
 * Type definitions derived from configuration
 * Ensures type safety across all AI dashboard components
 */
export type ContentType = typeof AI_DASHBOARD_CONFIG.CONTENT_TYPES[number]['value'];
export type SuggestedTopic = typeof AI_DASHBOARD_CONFIG.SUGGESTED_TOPICS[number];
export type QuickActionId = typeof AI_DASHBOARD_CONFIG.QUICK_ACTIONS[number]['id'];
export type Priority = keyof typeof AI_DASHBOARD_CONFIG.PRIORITY_ORDER;

/**
 * Utility function to get content type configuration
 * @param contentType - The content type to look up
 * @returns Content type configuration object
 */
export const getContentTypeConfig = (contentType: ContentType) => {
  return AI_DASHBOARD_CONFIG.CONTENT_TYPES.find(ct => ct.value === contentType);
};

/**
 * Utility function to get quick action configuration
 * @param actionId - The quick action ID to look up
 * @returns Quick action configuration object
 */
export const getQuickActionConfig = (actionId: QuickActionId) => {
  return AI_DASHBOARD_CONFIG.QUICK_ACTIONS.find(qa => qa.id === actionId);
};

/**
 * Utility function to validate if virtual scrolling should be enabled
 * @param itemCount - Number of items to render
 * @returns Whether virtual scrolling should be used
 */
export const shouldUseVirtualScrolling = (itemCount: number): boolean => {
  return AI_DASHBOARD_CONFIG.PERFORMANCE.MEMOIZATION_ENABLED && 
         itemCount > AI_DASHBOARD_CONFIG.PERFORMANCE.VIRTUAL_SCROLLING_THRESHOLD;
};
