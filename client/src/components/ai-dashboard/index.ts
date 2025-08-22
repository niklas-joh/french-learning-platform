/**
 * AI Dashboard Components - Barrel Export
 * 
 * Centralized export file for all AI dashboard components following
 * the established component export patterns from the codebase.
 * 
 * This approach:
 * - Provides clean import paths for consumers
 * - Follows established patterns from existing component directories
 * - Enables better tree-shaking and optimization
 * - Maintains consistency with development principles
 * 
 * @fileoverview Barrel export for AI Dashboard Components
 * @version 1.0.0
 * @author French Learning Platform Team
 */

// Main Layout Components
export { AIDashboardLayout, AIEnhancedHeader } from './AIDashboardLayout.js';

// Interactive Components
export { AIContentRequest } from './AIContentRequest.js';
export { QuickActionCard, QuickActionsGrid } from './QuickActionCard.js';
export { AITutorCard } from './AITutorCard.js';

// Error Handling Components
export { 
  AIComponentErrorBoundary, 
  withAIErrorBoundary, 
  AIDashboardErrorFallback 
} from './AIComponentErrorBoundary.js';

// Loading State Components
export {
  LoadingCard,
  ContentGenerationLoader,
  DashboardSkeleton,
  InlineLoader
} from './LoadingStates.js';

// Re-export types for convenience (following established patterns)
export type {
  DailyLearningPlan,
  ContentRecommendation,
  AIGenerationJob,
  ContentGenerationRequest,
  AIDashboardState,
  AIDashboardAction
} from '../../types/AIDashboard.js';

// Re-export configuration types for convenience
export type {
  ContentType,
  SuggestedTopic,
  QuickActionId,
  Priority
} from '../../config/aiDashboardConfig.js';
