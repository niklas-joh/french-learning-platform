/**
 * Quick Action Card Component
 * 
 * Reusable card component for AI dashboard quick actions.
 * Follows established Material-UI patterns from ExploreTopics.tsx
 * and leverages design tokens for consistent styling.
 * 
 * Features:
 * - Performance optimized with React.memo
 * - Accessibility compliant with ARIA support
 * - Responsive design with hover states
 * - Integration with existing design tokens
 * - Keyboard navigation support
 * 
 * @fileoverview Quick Action Card for AI Dashboard
 * @version 1.0.0
 * @author French Learning Platform Team
 */

import React, { useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ContentType } from '../../config/aiDashboardConfig.js';

/**
 * Props for QuickActionCard component
 */
interface QuickActionCardProps {
  /** Icon to display (emoji or icon) */
  icon: string;
  /** Title of the action */
  title: string;
  /** Description of the action */
  description: string;
  /** Click handler for the action */
  onClick?: () => void;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Content type associated with this action */
  contentType?: ContentType;
  /** Estimated time for completion */
  estimatedTime?: number;
  /** Additional CSS styles */
  sx?: object;
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * Quick Action Card Component
 * 
 * A reusable card component that displays quick actions for AI content generation.
 * Follows the established patterns from ExploreTopics.tsx while adding AI-specific
 * enhancements and accessibility features.
 * 
 * @example
 * ```tsx
 * <QuickActionCard
 *   icon="⚡"
 *   title="Quick Lesson"
 *   description="5 min practice"
 *   onClick={handleQuickLesson}
 *   contentType="lesson"
 *   estimatedTime={5}
 * />
 * ```
 */
export const QuickActionCard = React.memo<QuickActionCardProps>(({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  contentType,
  estimatedTime,
  sx,
  'data-testid': testId
}) => {
  /**
   * Handles click events with proper event handling
   * Prevents clicks when disabled and provides keyboard support
   */
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  /**
   * Handles keyboard events for accessibility
   * Supports Enter and Space key activation
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  }, [disabled, onClick]);

  /**
   * Formats estimated time for display
   */
  const formatEstimatedTime = useCallback((time?: number): string => {
    if (!time) return '';
    return time < 60 ? `${time} min` : `${Math.round(time / 60)}h ${time % 60}m`;
  }, []);

  return (
    <Card
      className="glass-card"
      sx={{
        minWidth: 200, // Following ExploreTopics.tsx pattern
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--transition-normal)',
        // Enhanced hover effects using design tokens
        '&:hover': !disabled ? {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-medium)'
        } : undefined,
        // Focus states for accessibility
        '&:focus-visible': {
          outline: '2px solid var(--french-blue)',
          outlineOffset: '2px'
        },
        // Disabled state styling
        ...(disabled && {
          cursor: 'not-allowed',
          backgroundColor: 'action.disabledBackground'
        }),
        ...sx
      }}
      onClick={disabled ? undefined : handleClick}
      onKeyDown={disabled ? undefined : handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`${title}: ${description}${estimatedTime ? `, ${formatEstimatedTime(estimatedTime)}` : ''}`}
      aria-disabled={disabled}
      data-testid={testId}
      data-content-type={contentType}
    >
      <CardContent 
        sx={{ 
          textAlign: 'center', 
          p: 2,
          // Prevent text selection for better UX
          userSelect: 'none',
          // Ensure content is vertically centered
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120 // Consistent height across cards
        }}
      >
        {/* Icon Section */}
        <Typography
          variant="h3"
          sx={{
            mb: 1,
            fontSize: '2rem', // Consistent sizing following critique
            lineHeight: 1,
            transition: 'transform var(--transition-fast)',
            // Icon animation on hover
            transform: disabled ? 'none' : undefined
          }}
          component="div"
          role="img"
          aria-label={`${title} icon`}
        >
          {icon}
        </Typography>

        {/* Title Section */}
        <Typography
          variant="h6"
          component="h3" // Proper semantic structure
          sx={{
            fontWeight: 600,
            mb: 0.5,
            color: disabled ? 'text.disabled' : 'text.primary',
            // Prevent title from wrapping awkwardly
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        {/* Description with Time */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="body2"
            color={disabled ? 'text.disabled' : 'text.secondary'}
            sx={{
              fontSize: '0.875rem',
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            {description}
          </Typography>
          
          {/* Estimated Time Badge */}
          {estimatedTime && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: disabled ? 'action.disabledBackground' : 'primary.main',
                color: disabled ? 'text.disabled' : 'primary.contrastText',
                fontSize: '0.75rem',
                fontWeight: 500,
                opacity: 0.9
              }}
            >
              {formatEstimatedTime(estimatedTime)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for performance optimization
  // Only re-render if essential props change
  return (
    prevProps.icon === nextProps.icon &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.contentType === nextProps.contentType &&
    prevProps.estimatedTime === nextProps.estimatedTime &&
    JSON.stringify(prevProps.sx) === JSON.stringify(nextProps.sx)
  );
});

// Display name for debugging
QuickActionCard.displayName = 'QuickActionCard';

/**
 * Quick Actions Grid Component
 * 
 * Container component for displaying multiple QuickActionCard components
 * in a responsive grid layout following established patterns.
 */
interface QuickActionsGridProps {
  /** Array of quick actions to display */
  actions: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    contentType: ContentType;
    estimatedTime: number;
    disabled?: boolean;
  }>;
  /** Click handler for actions */
  onActionClick?: (actionId: string, contentType: ContentType) => void;
  /** Whether all actions are disabled */
  disabled?: boolean;
}

/**
 * Grid container for quick action cards
 * Provides responsive layout and consistent spacing
 */
export const QuickActionsGrid = React.memo<QuickActionsGridProps>(({
  actions,
  onActionClick,
  disabled = false
}) => {
  const handleActionClick = useCallback((actionId: string, contentType: ContentType) => {
    if (!disabled && onActionClick) {
      onActionClick(actionId, contentType);
    }
  }, [disabled, onActionClick]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 2,
        // Responsive adjustments
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr 1fr', // Two columns on mobile
          gap: 1.5
        }
      }}
      role="group"
      aria-label="Quick learning actions"
    >
      {actions.map((action) => (
        <QuickActionCard
          key={action.id}
          icon={action.icon}
          title={action.title}
          description={action.description}
          contentType={action.contentType}
          estimatedTime={action.estimatedTime}
          disabled={disabled || action.disabled}
          onClick={() => handleActionClick(action.id, action.contentType)}
          data-testid={`quick-action-${action.id}`}
        />
      ))}
    </Box>
  );
});

QuickActionsGrid.displayName = 'QuickActionsGrid';
