/**
 * AI Dashboard Loading States Component
 * 
 * Simple, focused loading states for AI dashboard components.
 * Follows established Material-UI patterns and design tokens.
 * 
 * Features:
 * - Consistent loading animations
 * - Accessibility-compliant loading indicators
 * - Multiple loading state types for different contexts
 * - Performance optimized with React.memo
 * - Integration with existing design tokens
 * 
 * @fileoverview Loading States for AI Dashboard Components
 * @version 1.0.0
 * @author French Learning Platform Team
 */

import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Skeleton, 
  Typography, 
  Card, 
  CardContent 
} from '@mui/material';

/**
 * Props for LoadingCard component
 */
interface LoadingCardProps {
  /** Message to display while loading */
  message?: string;
  /** Height of the loading card */
  height?: number | string;
  /** Whether to show animated skeleton */
  showSkeleton?: boolean;
}

/**
 * Generic Loading Card Component
 * 
 * Provides consistent loading states across AI dashboard components.
 * Uses established patterns from existing loading states in the codebase.
 * 
 * @example
 * ```tsx
 * <LoadingCard 
 *   message="Generating your personalized content..." 
 *   height={200}
 *   showSkeleton={true}
 * />
 * ```
 */
export const LoadingCard = React.memo<LoadingCardProps>(({ 
  message = "Loading...", 
  height = 150, 
  showSkeleton = false 
}) => {
  return (
    <Card 
      className="glass-card" 
      sx={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 'var(--border-radius-medium)'
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        {showSkeleton ? (
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Skeleton variant="rounded" width={60} height={28} />
              <Skeleton variant="rounded" width={80} height={28} />
            </Box>
          </Box>
        ) : (
          <>
            <CircularProgress 
              size={40} 
              sx={{ 
                color: 'var(--french-blue)',
                mb: 2 
              }}
              aria-hidden="true"
            />
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: 'var(--font-size-base)' }}
            >
              {message}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
});

LoadingCard.displayName = 'LoadingCard';

/**
 * Props for ContentGenerationLoader component
 */
interface ContentGenerationLoaderProps {
  /** Current generation progress (0-100) */
  progress?: number;
  /** Type of content being generated */
  contentType?: string;
  /** Estimated remaining time in seconds */
  estimatedTime?: number;
}

/**
 * Content Generation Loading Component
 * 
 * Specialized loading state for AI content generation with progress tracking.
 * Provides enhanced UX during longer AI generation processes.
 */
export const ContentGenerationLoader = React.memo<ContentGenerationLoaderProps>(({ 
  progress = 0, 
  contentType = 'content',
  estimatedTime 
}) => {
  /**
   * Format estimated time for display
   */
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  /**
   * Get appropriate message based on progress
   */
  const getProgressMessage = (): string => {
    if (progress < 25) return `Analyzing your ${contentType} request...`;
    if (progress < 50) return `Generating personalized ${contentType}...`;
    if (progress < 75) return `Refining ${contentType} quality...`;
    if (progress < 90) return `Finalizing your ${contentType}...`;
    return `Almost ready!`;
  };

  return (
    <Card 
      className="glass-card" 
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 'var(--border-radius-medium)'
      }}
      role="status"
      aria-live="polite"
      aria-label={`Content generation progress: ${progress}%`}
    >
      <CardContent sx={{ textAlign: 'center', p: 0 }}>
        {/* Main loading animation */}
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={60}
            thickness={4}
            sx={{ 
              color: 'var(--french-blue)',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="caption" 
              component="div" 
              color="text.secondary"
              sx={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>

        {/* Progress message */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            color: 'text.primary',
            fontSize: '1rem'
          }}
        >
          {getProgressMessage()}
        </Typography>

        {/* Estimated time */}
        {estimatedTime && estimatedTime > 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.85rem' }}
          >
            Estimated time remaining: {formatTime(estimatedTime)}
          </Typography>
        )}

        {/* Progress dots animation */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            gap: 0.5
          }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--french-blue)',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`,
                opacity: 0.6,
                '@keyframes pulse': {
                  '0%, 80%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                  '40%': { opacity: 1, transform: 'scale(1)' }
                }
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
});

ContentGenerationLoader.displayName = 'ContentGenerationLoader';

/**
 * Dashboard Skeleton Loader
 * 
 * Provides skeleton loading states that match the dashboard layout structure.
 * Used during initial dashboard data loading.
 */
export const DashboardSkeleton: React.FC = React.memo(() => {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header skeleton */}
      <Card className="glass-card" sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} />
      </Card>

      {/* Content request skeleton */}
      <Card className="glass-card" sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={48} />
      </Card>

      {/* Quick actions skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="glass-card" sx={{ p: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="70%" sx={{ mx: 'auto', mb: 0.5 }} />
            <Skeleton variant="text" width="50%" sx={{ mx: 'auto' }} />
          </Card>
        ))}
      </Box>

      {/* AI tutor card skeleton */}
      <Card className="glass-card" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={48} />
      </Card>
    </Box>
  );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';

/**
 * Inline loading indicator for smaller components
 * Useful for button loading states and inline operations
 */
interface InlineLoaderProps {
  /** Size of the spinner */
  size?: number;
  /** Whether to show alongside text */
  inline?: boolean;
  /** Loading message */
  message?: string;
}

export const InlineLoader = React.memo<InlineLoaderProps>(({ 
  size = 16, 
  inline = true, 
  message 
}) => {
  return (
    <Box 
      sx={{ 
        display: inline ? 'inline-flex' : 'flex', 
        alignItems: 'center',
        gap: 1
      }}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      <CircularProgress 
        size={size} 
        sx={{ color: 'var(--french-blue)' }}
        aria-hidden="true"
      />
      {message && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ fontSize: 'var(--font-size-xs)' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
});

InlineLoader.displayName = 'InlineLoader';
