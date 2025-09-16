import { Theme } from '@mui/material/styles';

/**
 * Design System Helper Utilities
 * 
 * These utilities provide easy access to design system tokens from the theme
 * Use these instead of hardcoded colors in your components
 */

// Difficulty level colors for badges and lesson cards
export const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced', theme: Theme): {
  main: string;
  light: string;
  bg: string;
  palette: any;
} => {
  // Fallback colors if designSystem is not available
  const fallbackColors = {
    beginner: { main: '#16A34A', light: '#22C55E', bg: '#F0FDF4' },
    intermediate: { main: '#D97706', light: '#F59E0B', bg: '#FFFBEB' },
    advanced: { main: '#DC2626', light: '#EF4444', bg: '#FEF2F2' }
  };

  switch (difficulty) {
    case 'beginner':
      const greenColors = theme.designSystem?.colors?.accent?.green || fallbackColors.beginner;
      return {
        main: greenColors.main,
        light: greenColors.light,
        bg: greenColors.bg,
        // For MUI components that expect standard palette colors
        palette: theme.palette.success,
      };
    case 'intermediate':
      const amberColors = theme.designSystem?.colors?.accent?.amber || fallbackColors.intermediate;
      return {
        main: amberColors.main,
        light: amberColors.light,
        bg: amberColors.bg,
        palette: theme.palette.warning,
      };
    case 'advanced':
      const redColors = theme.designSystem?.colors?.accent?.red || fallbackColors.advanced;
      return {
        main: redColors.main,
        light: redColors.light,
        bg: redColors.bg,
        palette: theme.palette.error,
      };
    default:
      return {
        main: theme.palette.text.secondary,
        light: theme.palette.text.secondary,
        bg: theme.palette.background.default,
        palette: theme.palette.grey,
      };
  }
};

// Feature category colors for different learning types
export const getFeatureCategoryColor = (category: 'grammar' | 'ai' | 'interactive', theme: Theme): {
  main: string;
  light: string;
  bg: string;
  palette: {
    main: string;
    light: string;
    dark: string;
  };
} => {
  // Fallback colors if designSystem is not available
  const fallbackColors = {
    grammar: { main: '#EA580C', light: '#F97316', bg: '#FFF7ED' },
    ai: { main: '#7C3AED', light: '#8B5CF6', bg: '#F5F3FF' },
    interactive: { main: '#2563EB', light: '#3B82F6', bg: '#EFF6FF' }
  };

  switch (category) {
    case 'grammar':
      const orangeColors = theme.designSystem?.colors?.accent?.orange || fallbackColors.grammar;
      return {
        main: orangeColors.main,
        light: orangeColors.light,
        bg: orangeColors.bg,
        // For MUI components that expect standard palette colors
        palette: {
          main: orangeColors.main,
          light: orangeColors.light,
          dark: '#C2410C', // Darker orange
        },
      };
    case 'ai':
      const purpleColors = theme.designSystem?.colors?.accent?.purple || fallbackColors.ai;
      return {
        main: purpleColors.main,
        light: purpleColors.light,
        bg: purpleColors.bg,
        palette: {
          main: purpleColors.main,
          light: purpleColors.light,
          dark: '#5B21B6', // Darker purple
        },
      };
    case 'interactive':
      const blueColors = theme.designSystem?.colors?.accent?.blue || fallbackColors.interactive;
      return {
        main: blueColors.main,
        light: blueColors.light,
        bg: blueColors.bg,
        palette: {
          main: blueColors.main,
          light: blueColors.light,
          dark: '#1E40AF', // Darker blue
        },
      };
    default:
      return {
        main: theme.palette.text.secondary,
        light: theme.palette.text.secondary,
        bg: theme.palette.background.default,
        palette: {
          main: theme.palette.text.secondary,
          light: theme.palette.text.secondary,
          dark: theme.palette.text.primary,
        },
      };
  }
};

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

// Badge/Chip styles with difficulty-based colors
export const getBadgeStyles = (
  theme: Theme,
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
  category?: 'grammar' | 'ai' | 'interactive'
) => {
  if (difficulty) {
    const colors = getDifficultyColor(difficulty, theme);
    return {
      backgroundColor: colors.bg,
      color: colors.main,
      border: `1px solid ${colors.light}`,
      borderRadius: 6,
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
      padding: '4px 8px',
    };
  }
  
  if (category) {
    const colors = getFeatureCategoryColor(category, theme);
    return {
      backgroundColor: colors.bg,
      color: colors.main,
      border: `1px solid ${colors.light}`,
      borderRadius: 6,
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
      padding: '4px 8px',
    };
  }
  
  // Default badge style
  return {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 6,
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    padding: '4px 8px',
  };
};

// Progress indicator colors
export const getProgressColor = (progress: number, theme: Theme) => {
  // Fallback colors if designSystem is not available
  const fallbackColors = {
    blue: '#2563EB',
    amber: '#D97706', 
    orange: '#EA580C'
  };

  if (progress === 100) {
    return theme.palette.success.main;
  } else if (progress >= 75) {
    return theme.designSystem?.colors?.accent?.blue?.main || fallbackColors.blue;
  } else if (progress >= 50) {
    return theme.designSystem?.colors?.accent?.amber?.main || fallbackColors.amber;
  } else if (progress > 0) {
    return theme.designSystem?.colors?.accent?.orange?.main || fallbackColors.orange;
  } else {
    return theme.palette.grey[300];
  }
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
