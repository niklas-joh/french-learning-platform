/**
 * Quick Action Card Component
 * 
 * Enhanced reusable card component supporting both AI dashboard quick actions
 * and sophisticated lesson cards with gamification elements.
 * Follows established Material-UI patterns while adding modern lesson card features.
 * 
 * Features:
 * - Performance optimized with React.memo
 * - Accessibility compliant with ARIA support
 * - Responsive design with hover states
 * - Integration with existing design tokens
 * - Keyboard navigation support
 * - Modern lesson card rendering with progress rings
 * - Difficulty badge system with color coding
 * - XP reward display with gamification
 * - SVG progress animations
 * 
 * @fileoverview Enhanced Quick Action Card for AI Dashboard & Lesson Cards
 * @version 2.0.0
 * @author French Learning Platform Team
 */

import React, { useCallback } from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress, Button } from '@mui/material';
import { ContentType } from '../../config/aiDashboardConfig.js';
import { 
  LessonStatus, 
  DifficultyLevel, 
  getStatusContent, 
  getDifficultyContent,
  getComponentDataAttributes 
} from '../../config/contentConfiguration';


/**
 * Render modes for the card component
 */
export type RenderMode = 'quick-action' | 'lesson-card';

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

  // Enhanced lesson card props
  /** Render mode - determines card layout and features */
  renderMode?: RenderMode;
  /** Progress percentage (0-100) for lesson cards */
  progress?: number;
  /** XP reward amount for lesson cards */
  xpReward?: number;
  /** Difficulty level for lesson cards */
  difficulty?: DifficultyLevel;
  /** Lesson completion status */
  status?: LessonStatus;
  /** AI personalization message */
  aiPersonalization?: string;
  /** Show progress indicator */
  showProgress?: boolean;
}

// Anti-pattern functions removed - using CSS-first architecture instead
// All styling is now handled by CSS via data attributes
// Content is handled by pure configuration objects

/**
 * Progress Ring SVG Component
 * Displays animated circular progress indicator
 * 
 * @param progress - Progress percentage (0-100)
 * @param size - Size of the progress ring in pixels
 * @param strokeWidth - Width of the progress stroke
 * @param color - Color of the progress ring
 */
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ progress, size = 48, strokeWidth = 4, color = 'var(--accent-blue)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute' }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${progress}% complete`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--gray-200)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.5s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: `${size / 2}px ${size / 2}px`
          }}
        />
      </svg>
      {/* Progress text */}
  <Typography
    variant="caption"
    sx={{
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      color: '#374151',
      zIndex: 1
    }}
  >
    {Math.round(progress)}%
      </Typography>
    </Box>
  );
};

/**
 * Enhanced Quick Action Card Component
 * 
 * A versatile card component that supports both quick actions and sophisticated
 * lesson cards with progress tracking, difficulty badges, and gamification elements.
 * Maintains backward compatibility while adding modern lesson card features.
 * 
 * @example Quick Action Mode:
 * ```tsx
 * <QuickActionCard
 *   icon="⚡"
 *   title="Quick Lesson"
 *   description="5 min practice"
 *   onClick={handleQuickLesson}
 *   contentType="lesson"
 *   estimatedTime={5}
 *   renderMode="quick-action"
 * />
 * ```
 * 
 * @example Lesson Card Mode:
 * ```tsx
 * <QuickActionCard
 *   icon="👋"
 *   title="French Greetings"
 *   description="Master common French greetings"
 *   onClick={handleLessonStart}
 *   renderMode="lesson-card"
 *   progress={75}
 *   xpReward={50}
 *   difficulty="beginner"
 *   status="in_progress"
 *   estimatedTime={15}
 *   showProgress={true}
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
  'data-testid': testId,
  renderMode = 'quick-action',
  progress = 0,
  xpReward,
  difficulty = 'beginner',
  status = 'not_started',
  aiPersonalization,
  showProgress = false
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

  /**
   * Get appropriate ARIA label based on render mode
   */
  const getAriaLabel = useCallback((): string => {
    const timeText = estimatedTime ? `, ${formatEstimatedTime(estimatedTime)}` : '';
    const xpText = xpReward ? `, ${xpReward} XP reward` : '';
    const progressText = showProgress && progress > 0 ? `, ${progress}% complete` : '';
    const difficultyText = renderMode === 'lesson-card' ? `, ${difficulty} level` : '';
    
    return `${title}: ${description}${timeText}${xpText}${progressText}${difficultyText}`;
  }, [title, description, estimatedTime, xpReward, progress, showProgress, difficulty, renderMode]);

  // Get pure content configuration - no styling logic
  const statusContent = getStatusContent(status);
  const difficultyContent = getDifficultyContent(difficulty);
  
  // Generate data attributes for CSS styling
  const cardDataAttrs = getComponentDataAttributes({
    'data-status': status,
    'data-difficulty': difficulty,
    'data-render-mode': renderMode,
    'data-disabled': disabled
  });
  
  return (
    <Card
      className={renderMode === 'quick-action' ? "glass-card" : "lesson-card"}
      sx={{
        // Use design tokens for consistent sizing
        minWidth: renderMode === 'lesson-card' ? 'var(--card-min-width)' : 200,
        minHeight: renderMode === 'lesson-card' ? 'var(--card-min-height)' : 120,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--transition-normal)',
        
        // Lesson card styling - Clean modern design matching mockup
        ...(renderMode === 'lesson-card' && {
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
        }),
        
        // Enhanced hover effects using design tokens
        '&:hover': !disabled ? {
          transform: renderMode === 'lesson-card' ? 'translateY(-4px)' : 'translateY(-2px)',
          boxShadow: renderMode === 'lesson-card' ? 'var(--shadow-heavy)' : 'var(--shadow-medium)',
          '& .progress-ring': renderMode === 'lesson-card' ? {
            transform: 'scale(1.05)',
            transition: 'transform var(--transition-fast)'
          } : undefined
        } : undefined,
        
        // Focus states for accessibility using design tokens
        '&:focus-visible': {
          outline: '2px solid var(--focus-ring-color)',
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
      aria-label={getAriaLabel()}
      aria-disabled={disabled}
      data-testid={testId}
      data-content-type={contentType}
      data-render-mode={renderMode}
      data-lesson-status={status}
    >
      {renderMode === 'lesson-card' ? (
        // Modern Lesson Card Layout - Matching Mockup Design
        <CardContent sx={{ p: 3, position: 'relative', minHeight: 160 }}>
          {/* Card Header with Icon and Progress Ring */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            mb: 1.5 
          }}>
            {/* Lesson Icon */}
            <Typography
              variant="h3"
              sx={{
                fontSize: 'var(--font-size-h3)',
                lineHeight: 1,
                mb: 0
              }}
              component="div"
              role="img"
              aria-label={`${title} lesson icon`}
            >
              {icon}
            </Typography>

            {/* Progress Ring */}
            {showProgress && (
              <div className="progress-ring">
                <ProgressRing
                  progress={progress}
                  size={48}
                  strokeWidth={4}
                  // Color will be controlled by CSS via data attributes
                />
              </div>
            )}
          </Box>

          {/* Lesson Title */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'var(--font-weight-semibold)',
              mb: 1,
              color: disabled ? 'text.disabled' : 'text.primary',
              lineHeight: 1.2,
              fontSize: 'var(--font-size-h5)'
            }}
          >
            {title}
          </Typography>

          {/* Lesson Description */}
          <Typography
            variant="body2"
            color={disabled ? 'text.disabled' : 'text.secondary'}
            sx={{
              fontSize: 'var(--font-size-sm)',
              lineHeight: 1.4,
              mb: 1.5,
              minHeight: '2.4em' // Ensure consistent spacing
            }}
          >
            {description}
          </Typography>

          {/* Badges and Metadata Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 1.5, 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {/* Difficulty Badge - styled via CSS data attributes */}
            <Chip
              size="small"
              label={difficultyContent.label}
              className="difficulty-badge"
              data-difficulty={difficulty}
              sx={{
                fontSize: 'var(--font-size-xs)',
                height: 24,
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />

            {/* Time Badge */}
            {estimatedTime && (
              <Chip
                size="small"
                icon={<span style={{ fontSize: 'var(--font-size-xs)' }}>⏱️</span>}
                label={`${estimatedTime} min`}
                variant="outlined"
                sx={{
                  fontSize: 'var(--font-size-xs)',
                  height: 24,
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            )}

            {/* XP Reward Badge */}
            {xpReward && (
              <Chip
                size="small"
                icon={<span style={{ fontSize: 'var(--font-size-xs)' }}>⭐</span>}
                label={`${xpReward} XP`}
                variant="outlined"
                sx={{
                  fontSize: 'var(--font-size-xs)',
                  height: 24,
                  color: 'var(--accent-amber)',
                  borderColor: 'var(--accent-amber)',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            )}
          </Box>

          {/* Progress Bar (Alternative to Ring) - styled via CSS data attributes */}
          {!showProgress && progress > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                className="lesson-progress-bar"
                data-status={status}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'var(--gray-200)',
                  // Color controlled by CSS via data-status attribute
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3
                  }
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
                Progress: {progress}%
              </Typography>
            </Box>
          )}

          {/* AI Personalization Message */}
          {aiPersonalization && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontStyle: 'italic',
                color: 'text.secondary',
                mb: 1.5,
                fontSize: 'var(--font-size-xs)',
                lineHeight: 1.3
              }}
            >
              💡 {aiPersonalization}
            </Typography>
          )}

          {/* Action Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 'auto'
          }}>
            <Button
              variant={status === 'completed' ? 'outlined' : 'contained'}
              size="small"
              disabled={status === 'locked' || disabled}
              startIcon={<span style={{ fontSize: '14px' }}>{statusContent.icon}</span>}
              className="status-button"
              data-status={status}
              sx={{
                minWidth: 80,
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                '&.Mui-disabled': {
                  opacity: 0.6,
                }
              }}
            >
              {statusContent.buttonText}
            </Button>
          </Box>
        </CardContent>
      ) : (
        // Original Quick Action Layout (Maintained for backward compatibility)
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
              fontSize: 'var(--font-size-h2)', // tokenized size
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
              fontWeight: 'var(--font-weight-semibold)',
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
                fontSize: 'var(--font-size-sm)',
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
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 500,
                  opacity: 0.9
                }}
              >
                {formatEstimatedTime(estimatedTime)}
              </Typography>
            )}
          </Box>
        </CardContent>
      )}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Enhanced custom comparison for performance optimization
  // Only re-render if essential props change
  return (
    prevProps.icon === nextProps.icon &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.contentType === nextProps.contentType &&
    prevProps.estimatedTime === nextProps.estimatedTime &&
    prevProps.renderMode === nextProps.renderMode &&
    prevProps.progress === nextProps.progress &&
    prevProps.xpReward === nextProps.xpReward &&
    prevProps.difficulty === nextProps.difficulty &&
    prevProps.status === nextProps.status &&
    prevProps.aiPersonalization === nextProps.aiPersonalization &&
    prevProps.showProgress === nextProps.showProgress &&
    JSON.stringify(prevProps.sx) === JSON.stringify(nextProps.sx)
  );
});

// Display name for debugging
QuickActionCard.displayName = 'QuickActionCard';

/**
 * Enhanced Quick Actions Grid Component
 * 
 * Container component for displaying multiple QuickActionCard components
 * in a responsive grid layout. Supports both quick actions and lesson cards
 * with modern grid system that automatically adapts to content type.
 */
interface QuickActionsGridProps {
  /** Array of actions/lessons to display */
  actions: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    contentType: ContentType;
    estimatedTime: number;
    disabled?: boolean;
    // Enhanced lesson card properties
    progress?: number;
    xpReward?: number;
    difficulty?: DifficultyLevel;
    status?: LessonStatus;
    aiPersonalization?: string;
  }>;
  /** Click handler for actions */
  onActionClick?: (actionId: string, contentType: ContentType) => void;
  /** Whether all actions are disabled */
  disabled?: boolean;
  /** Render mode for all cards in the grid */
  renderMode?: RenderMode;
  /** Show progress indicators for lesson cards */
  showProgress?: boolean;
  /** Additional CSS styles for the grid container */
  sx?: object;
}

/**
 * Enhanced grid container for action/lesson cards
 * Provides responsive layout with automatic grid sizing based on render mode
 * 
 * @example Quick Actions Grid:
 * ```tsx
 * <QuickActionsGrid
 *   actions={quickActions}
 *   onActionClick={handleActionClick}
 *   renderMode="quick-action"
 * />
 * ```
 * 
 * @example Lesson Cards Grid:
 * ```tsx
 * <QuickActionsGrid
 *   actions={lessonData}
 *   onActionClick={handleLessonClick}
 *   renderMode="lesson-card"
 *   showProgress={true}
 * />
 * ```
 */
export const QuickActionsGrid = React.memo<QuickActionsGridProps>(({
  actions,
  onActionClick,
  disabled = false,
  renderMode = 'quick-action',
  showProgress = false,
  sx
}) => {
  /**
   * Handles action/lesson click events
   * Passes through action ID and content type for routing
   */
  const handleActionClick = useCallback((actionId: string, contentType: ContentType) => {
    if (!disabled && onActionClick) {
      onActionClick(actionId, contentType);
    }
  }, [disabled, onActionClick]);

  /**
   * Get responsive grid configuration based on render mode
   * Lesson cards need more space than quick action cards
   */
  const getGridConfig = useCallback(() => {
    if (renderMode === 'lesson-card') {
      return {
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 2,
        // Responsive breakpoints for lesson cards
        '@media (max-width: 640px)': {
          gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns on mobile
          gap: 1.5
        },
        '@media (min-width: 641px) and (max-width: 1024px)': {
          gridTemplateColumns: 'repeat(3, 1fr)' // 3 columns on tablet
        },
        '@media (min-width: 1025px)': {
          gridTemplateColumns: 'repeat(2, 1fr)' // 2 columns on desktop
        }
      };
    } else {
      // Quick action cards - original configuration
      return {
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 2,
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr 1fr', // Two columns on mobile
          gap: 1.5
        }
      };
    }
  }, [renderMode]);

  const gridConfig = getGridConfig();

  return (
    <Box
      sx={{
        display: 'grid',
        ...gridConfig,
        ...sx
      }}
      role="group"
      aria-label={renderMode === 'lesson-card' ? 'Lesson cards' : 'Quick learning actions'}
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
          data-testid={`${renderMode}-${action.id}`}
          // Enhanced lesson card props
          renderMode={renderMode}
          progress={action.progress}
          xpReward={action.xpReward}
          difficulty={action.difficulty}
          status={action.status}
          aiPersonalization={action.aiPersonalization}
          showProgress={showProgress}
        />
      ))}
    </Box>
  );
});

QuickActionsGrid.displayName = 'QuickActionsGrid';
