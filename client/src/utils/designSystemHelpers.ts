import { Theme } from '@mui/material/styles';

/**
 * Design System Helper Utilities
 * 
 * Layout and spacing utilities only - presentation logic handled by CSS
 * Color calculations removed in favor of CSS-first architecture with data attributes
 */

// NOTE: Color calculation functions removed - now handled by CSS via data attributes
// Use data-difficulty, data-category, data-status attributes for styling instead

// Standard design system card styles
export const getCardStyles = (variant: 'standard' | 'lesson' | 'progress' | 'feature' = 'standard', theme: Theme) => {
  const baseStyles = {
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[2],
      borderColor: theme.palette.grey[300],
    },
  };

  switch (variant) {
    case 'lesson':
      return {
        ...baseStyles,
        position: 'relative' as const,
        // Accent borders will be added per difficulty
      };
    case 'progress':
      return {
        ...baseStyles,
        background: theme.designSystem?.colors?.backgrounds?.tertiary || theme.palette.grey[50],
      };
    case 'feature':
      return {
        ...baseStyles,
        // Clean white with potential for colorful icons
      };
    default:
      return baseStyles;
  }
};

// Button style variants following design system
export const getButtonStyles = (variant: 'primary' | 'secondary' | 'text' = 'primary', theme: Theme) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: 12, // Slightly less rounded than cards
        fontWeight: 500,
        textTransform: 'none' as const,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          boxShadow: theme.shadows[2],
        },
      };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 12,
        fontWeight: 500,
        textTransform: 'none' as const,
        '&:hover': {
          backgroundColor: theme.designSystem?.colors?.backgrounds?.secondary || theme.palette.grey[50],
          borderColor: theme.palette.grey[300],
        },
      };
    case 'text':
      return {
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        borderRadius: 12,
        fontWeight: 500,
        textTransform: 'none' as const,
        '&:hover': {
          backgroundColor: theme.designSystem?.colors?.backgrounds?.secondary || theme.palette.grey[50],
        },
      };
    default:
      return {};
  }
};

// Legacy functions maintained for story compatibility
// These return basic styles - full styling handled by CSS via data attributes

export const getBadgeStyles = (variant: 'difficulty' | 'category' | 'status' = 'difficulty', theme: Theme) => {
  return {
    borderRadius: borderRadius.sm,
    padding: `${spacing.xs}px ${spacing.sm}px`,
    fontSize: '0.75rem',
    fontWeight: 500,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
  };
};

export const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner', theme?: Theme) => {
  // Return color object structure for story compatibility - actual colors handled by CSS data attributes
  // Theme parameter accepted for compatibility but not used (CSS handles styling)
  const colors = {
    beginner: {
      main: '#10B981',
      light: '#34D399',
      bg: '#D1FAE5'
    },
    intermediate: {
      main: '#F59E0B',
      light: '#FBBF24', 
      bg: '#FEF3C7'
    },
    advanced: {
      main: '#EF4444',
      light: '#F87171',
      bg: '#FEE2E2'
    }
  };
  return colors[difficulty];
};

export const getFeatureCategoryColor = (category: string = 'general', theme?: Theme) => {
  // Return color object structure for story compatibility - actual colors handled by CSS data attributes
  // Theme parameter accepted for compatibility but not used (CSS handles styling)
  const categoryColors: Record<string, any> = {
    ai: {
      main: '#6366F1',
      light: '#818CF8',
      bg: '#EEF2FF'
    },
    language: {
      main: '#8B5CF6',
      light: '#A78BFA', 
      bg: '#F3E8FF'
    },
    social: {
      main: '#06B6D4',
      light: '#22D3EE',
      bg: '#CFFAFE'
    },
    progress: {
      main: '#10B981',
      light: '#34D399',
      bg: '#D1FAE5'
    },
    content: {
      main: '#F59E0B',
      light: '#FBBF24',
      bg: '#FEF3C7'
    },
    grammar: {
      main: '#8B5CF6',
      light: '#A78BFA',
      bg: '#F3E8FF'
    },
    interactive: {
      main: '#06B6D4',
      light: '#22D3EE',
      bg: '#CFFAFE'
    },
    general: {
      main: '#64748B',
      light: '#94A3B8',
      bg: '#F1F5F9'
    }
  };
  return categoryColors[category] || categoryColors.general;
};

// Common spacing values from design system (multiples of 8px base)
export const spacing = {
  xs: 4,   // 0.5 * 8
  sm: 8,   // 1 * 8  
  md: 16,  // 2 * 8
  lg: 24,  // 3 * 8
  xl: 32,  // 4 * 8
  xxl: 48, // 6 * 8
} as const;

// Common border radius values
export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
} as const;

// Typography helpers
export const getTextColor = (variant: 'primary' | 'secondary' | 'disabled' = 'primary', theme: Theme) => {
  switch (variant) {
    case 'primary':
      return theme.palette.text.primary;
    case 'secondary':
      return theme.palette.text.secondary;
    case 'disabled':
      return theme.palette.text.disabled;
    default:
      return theme.palette.text.primary;
  }
};
