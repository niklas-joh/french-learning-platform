import type { Meta, StoryObj } from '@storybook/react';
import { Box, Chip, useTheme } from '@mui/material';
import { getBadgeStyles, getDifficultyColor, getFeatureCategoryColor } from '../../utils/designSystemHelpers';

// Mock function for onClick handlers
const fn = () => () => {};

// Atomic Badge Component using Design System Theme
const AtomicBadge = ({ 
  variant = 'difficulty',
  type = 'beginner',
  children,
  icon,
  size = 'medium',
  onClick,
  ...props 
}: {
  variant?: 'difficulty' | 'xp' | 'streak' | 'rank' | 'achievement' | 'status';
  type?: 'beginner' | 'intermediate' | 'advanced' | 'completed' | 'in-progress' | 'not-started';
  children: React.ReactNode;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}) => {
  const theme = useTheme();

  const getBadgeProps = () => {
    const baseProps = {
      size: (size === 'large' ? 'medium' : 'small') as 'small' | 'medium',
      sx: {
        fontSize: size === 'small' ? '0.625rem' : size === 'large' ? '0.875rem' : '0.75rem',
        fontWeight: 500, // Using design system font weight
        borderRadius: variant === 'streak' || variant === 'rank' ? '8px' : '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        transition: 'all 0.2s ease-in-out', // Design system timing
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'scale(1.05)' } : {},
      }
    };

    switch (variant) {
      case 'difficulty':
        // Use our design system difficulty colors
        const difficultyColors = getDifficultyColor(type as 'beginner' | 'intermediate' | 'advanced', theme);
        return {
          ...baseProps,
          sx: {
            ...baseProps.sx,
            backgroundColor: difficultyColors.bg,
            color: difficultyColors.main,
            border: `1px solid ${difficultyColors.light}`,
          }
        };

      case 'xp':
        // Use purple accent for AI/XP features
        const purpleColors = getFeatureCategoryColor('ai', theme);
        return {
          ...baseProps,
          sx: {
            ...baseProps.sx,
            background: `linear-gradient(45deg, ${purpleColors.main}, ${purpleColors.light})`,
            color: 'white',
            boxShadow: `0 2px 8px ${purpleColors.main}40`, // 40 = 25% opacity
          }
        };

      case 'streak':
        // Use amber for streaks (intermediate-like)
        const amberColors = getDifficultyColor('intermediate', theme);
        return {
          ...baseProps,
          sx: {
            ...baseProps.sx,
            backgroundColor: amberColors.bg,
            color: amberColors.main,
            border: `1px solid ${amberColors.light}`,
          }
        };

      case 'rank':
        // Use amber gradient for ranking
        const rankColors = getDifficultyColor('intermediate', theme);
        return {
          ...baseProps,
          sx: {
            ...baseProps.sx,
            background: `linear-gradient(45deg, ${rankColors.main}, ${rankColors.light})`,
            color: 'white',
            boxShadow: `0 2px 8px ${rankColors.main}40`,
          }
        };

      case 'achievement':
        // Use green for achievements
        const achievementColors = getDifficultyColor('beginner', theme);
        return {
          ...baseProps,
          sx: {
            ...baseProps.sx,
            backgroundColor: achievementColors.bg,
            color: achievementColors.main,
            border: `1px solid ${achievementColors.light}`,
          }
        };

      case 'status':
        switch (type) {
          case 'completed':
            const completedColors = getDifficultyColor('beginner', theme);
            return {
              ...baseProps,
              sx: {
                ...baseProps.sx,
                backgroundColor: completedColors.bg,
                color: completedColors.main,
                border: `1px solid ${completedColors.main}`,
              }
            };
          case 'in-progress':
            const progressColors = getFeatureCategoryColor('interactive', theme);
            return {
              ...baseProps,
              sx: {
                ...baseProps.sx,
                backgroundColor: progressColors.bg,
                color: progressColors.main,
                border: `1px solid ${progressColors.main}`,
              }
            };
          case 'not-started':
            return {
              ...baseProps,
              sx: {
                ...baseProps.sx,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.disabled,
                border: `1px solid ${theme.palette.divider}`,
              }
            };
        }
        break;
    }

    return baseProps;
  };

  const content = icon ? `${icon} ${children}` : children;

  return (
    <Chip
      label={content}
      onClick={onClick}
      {...getBadgeProps()}
      {...props}
    />
  );
};

const meta: Meta<typeof AtomicBadge> = {
  title: 'Atoms/Badge',
  component: AtomicBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Atomic badges used throughout the French learning platform for difficulty levels, achievements, status indicators, and gamification elements.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['difficulty', 'xp', 'streak', 'rank', 'achievement', 'status'],
      description: 'Badge variant type',
    },
    type: {
      control: 'select',
      options: ['beginner', 'intermediate', 'advanced', 'completed', 'in-progress', 'not-started'],
      description: 'Badge sub-type',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Badge size',
    },
    icon: {
      control: 'text',
      description: 'Icon to display (emoji)',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
  args: {
    onClick: fn(),
    children: 'Badge',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Difficulty Badges
export const DifficultyBeginner: Story = {
  args: {
    variant: 'difficulty',
    type: 'beginner',
    children: 'Beginner',
  },
};

export const DifficultyIntermediate: Story = {
  args: {
    variant: 'difficulty',
    type: 'intermediate',
    children: 'Intermediate',
  },
};

export const DifficultyAdvanced: Story = {
  args: {
    variant: 'difficulty',
    type: 'advanced',
    children: 'Advanced',
  },
};

// Gamification Badges
export const XPReward: Story = {
  args: {
    variant: 'xp',
    icon: '⭐',
    children: '50 XP',
  },
};

export const Streak: Story = {
  args: {
    variant: 'streak',
    icon: '🔥',
    children: '7 day streak',
  },
};

export const WeeklyRank: Story = {
  args: {
    variant: 'rank',
    icon: '🏆',
    children: 'Rank #1',
  },
};

// Status Badges
export const Completed: Story = {
  args: {
    variant: 'status',
    type: 'completed',
    icon: '✅',
    children: 'Complete',
  },
};

export const InProgress: Story = {
  args: {
    variant: 'status',
    type: 'in-progress',
    icon: '📊',
    children: 'In Progress',
  },
};

export const NotStarted: Story = {
  args: {
    variant: 'status',
    type: 'not-started',
    children: 'Not Started',
  },
};

// Achievement Badge
export const Achievement: Story = {
  args: {
    variant: 'achievement',
    icon: '🎓',
    children: 'Grammar Master',
  },
};

// Size Variations
export const SmallSize: Story = {
  args: {
    variant: 'difficulty',
    type: 'beginner',
    size: 'small',
    children: 'Small',
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'difficulty',
    type: 'beginner',
    size: 'large',
    children: 'Large',
  },
};

// All Difficulty Badges
export const AllDifficultyBadges: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <AtomicBadge variant="difficulty" type="beginner">Beginner</AtomicBadge>
      <AtomicBadge variant="difficulty" type="intermediate">Intermediate</AtomicBadge>
      <AtomicBadge variant="difficulty" type="advanced">Advanced</AtomicBadge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All difficulty level badges.',
      },
    },
  },
};

// All Gamification Badges
export const AllGamificationBadges: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <AtomicBadge variant="xp" icon="⭐">50 XP</AtomicBadge>
      <AtomicBadge variant="streak" icon="🔥">7 days</AtomicBadge>
      <AtomicBadge variant="rank" icon="🏆">Rank #1</AtomicBadge>
      <AtomicBadge variant="achievement" icon="🎓">Grammar Pro</AtomicBadge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All gamification-related badges.',
      },
    },
  },
};

// All Status Badges
export const AllStatusBadges: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <AtomicBadge variant="status" type="completed" icon="✅">Complete</AtomicBadge>
      <AtomicBadge variant="status" type="in-progress" icon="📊">In Progress</AtomicBadge>
      <AtomicBadge variant="status" type="not-started">Not Started</AtomicBadge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All status indicator badges.',
      },
    },
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <AtomicBadge variant="difficulty" type="beginner" size="small">Small</AtomicBadge>
      <AtomicBadge variant="difficulty" type="beginner" size="medium">Medium</AtomicBadge>
      <AtomicBadge variant="difficulty" type="beginner" size="large">Large</AtomicBadge>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge size variations.',
      },
    },
  },
};

// Lesson Context Example
export const LessonContextExample: Story = {
  render: () => (
    <Box sx={{ 
      background: '#f9fafb', 
      padding: 2, 
      borderRadius: 2, 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '300px'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span style={{ fontSize: '1.5rem' }}>👋</span>
        <Box>
          <div style={{ fontWeight: 600 }}>French Greetings</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Master common greetings</div>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
        <AtomicBadge variant="difficulty" type="beginner" size="small">Beginner</AtomicBadge>
        <AtomicBadge variant="xp" icon="⭐" size="small">50 XP</AtomicBadge>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of badges in a lesson card context.',
      },
    },
  },
};
