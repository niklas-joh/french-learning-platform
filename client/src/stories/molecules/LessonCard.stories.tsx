import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import React from 'react';

// Import our atomic components
import { Chip } from '@mui/material';
import { getDifficultyColor, getFeatureCategoryColor } from '../../utils/designSystemHelpers';

// Mock function for onClick handlers
const fn = () => () => {};

// Atomic components (simplified versions for this story)
const AtomicBadge = ({ variant, type, children, icon, size = 'small' }: any) => {
  const theme = useTheme();
  
  const getProps = () => {
    const baseProps = { size: size === 'large' ? 'medium' : 'small' as 'small' | 'medium' };
    switch (variant) {
      case 'difficulty':
        const difficultyColors = getDifficultyColor(type, theme);
        return { 
          ...baseProps, 
          sx: { 
            backgroundColor: difficultyColors.bg, 
            color: difficultyColors.main, 
            fontSize: '0.75rem' 
          } 
        };
      case 'xp': {
        const aiColors = getFeatureCategoryColor('ai', theme);
        return { 
          ...baseProps, 
          sx: { 
            background: `linear-gradient(45deg, ${aiColors.main}, ${aiColors.palette?.dark || theme.palette.primary.dark})`, 
            color: theme.palette.common.white, 
            fontSize: '0.75rem' 
          } 
        };
      }
    }
    return baseProps;
  };
  const content = icon ? `${icon} ${children}` : children;
  return <Chip label={content} {...getProps()} />;
};

const AtomicProgressIndicator = ({ type, value, size, showLabel }: any) => {
  const theme = useTheme();
  
  if (type === 'circular') {
    const diameter = size === 'small' ? 40 : size === 'large' ? 60 : 48;
    const radius = (diameter - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <svg width={diameter} height={diameter} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={diameter / 2} cy={diameter / 2} r={radius} stroke={theme.palette.background.default} strokeWidth="3" fill="transparent" />
          <circle 
            cx={diameter / 2} 
            cy={diameter / 2} 
            r={radius} 
            stroke={theme.palette.primary.main} 
            strokeWidth="3" 
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        {showLabel && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            {value}%
          </Box>
        )}
      </Box>
    );
  }
  return null;
};

// Molecular Lesson Card Component based on design mockups
const MolecularLessonCard = ({ 
  icon = '📚',
  title = 'French Lesson',
  description = 'Learn French basics',
  difficulty = 'beginner',
  progress = 0,
  estimatedTime = 15,
  xpReward = 50,
  completionStatus = 'not_started',
  onClick,
  variant = 'default',
  ...props 
}: {
  icon?: string;
  title?: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  estimatedTime?: number;
  xpReward?: number;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
}) => {
  const theme = useTheme();
  
  const getCardProps = () => {
    const baseProps = {
      sx: {
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.spacing(1.5),
        boxShadow: theme.shadows[1],
        cursor: 'pointer',
        transition: theme.transitions.create(['transform', 'box-shadow']),
        position: 'relative',
        minHeight: variant === 'compact' ? '120px' : variant === 'detailed' ? '200px' : '160px',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2],
        },
      }
    };

    if (completionStatus === 'completed') {
      const successColors = getDifficultyColor('beginner', theme);
      baseProps.sx.background = `linear-gradient(135deg, ${successColors.light}, ${theme.palette.background.paper})`;
      baseProps.sx.border = `1px solid ${successColors.main}`;
    }

    return baseProps;
  };

  return (
    <Card {...getCardProps()} onClick={onClick} {...props}>
      <CardContent sx={{ 
        p: variant === 'compact' ? 2 : 2.5, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Header with icon and progress */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '1.75rem', lineHeight: 1 }}>
              {icon}
            </Typography>
            <AtomicBadge 
              variant="difficulty" 
              type={difficulty}
              size="small"
            >
              {difficulty === 'beginner' ? 'Beginner' : difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
            </AtomicBadge>
          </Box>
          
          <AtomicProgressIndicator 
            type="circular" 
            value={progress} 
            size="small" 
            showLabel={progress > 0}
          />
        </Box>

        {/* Title and Description */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 0.5,
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
            lineHeight: 1.4,
            mb: 'auto',
            flexGrow: 1
          }}
        >
          {description}
        </Typography>

        {/* Footer with metadata */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2,
          pt: 1,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span style={{ fontSize: '0.75rem' }}>⏱️</span>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                {estimatedTime}min
              </Typography>
            </Box>
          </Box>
          
          <AtomicBadge variant="xp" icon="⭐" size="small">
            {xpReward} XP
          </AtomicBadge>
        </Box>

        {/* Completion status overlay for completed lessons */}
        {completionStatus === 'completed' && (
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: getDifficultyColor('beginner', theme).main,
            color: theme.palette.common.white,
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem'
          }}>
            ✓
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const meta: Meta<typeof MolecularLessonCard> = {
  title: 'Molecules/LessonCard',
  component: MolecularLessonCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lesson card molecules that combine atomic components (badges, progress indicators) to create cohesive lesson cards for the French learning platform.',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Lesson icon (emoji)',
    },
    title: {
      control: 'text',
      description: 'Lesson title',
    },
    description: {
      control: 'text',
      description: 'Lesson description',
    },
    difficulty: {
      control: 'select',
      options: ['beginner', 'intermediate', 'advanced'],
      description: 'Lesson difficulty level',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Lesson progress percentage',
    },
    estimatedTime: {
      control: { type: 'number', min: 5, max: 60 },
      description: 'Estimated completion time in minutes',
    },
    xpReward: {
      control: { type: 'number', min: 10, max: 200 },
      description: 'XP reward for completing lesson',
    },
    completionStatus: {
      control: 'select',
      options: ['not_started', 'in_progress', 'completed'],
      description: 'Lesson completion status',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Card variant',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic States
export const NotStarted: Story = {
  args: {
    icon: '👋',
    title: 'French Greetings',
    description: 'Master common French greetings and introductions',
    difficulty: 'beginner',
    progress: 0,
    estimatedTime: 15,
    xpReward: 50,
    completionStatus: 'not_started',
  },
};

export const InProgress: Story = {
  args: {
    icon: '📅',
    title: 'Past Tense Mastery',
    description: 'Learn passé composé and imparfait usage',
    difficulty: 'intermediate',
    progress: 75,
    estimatedTime: 25,
    xpReward: 75,
    completionStatus: 'in_progress',
  },
};

export const Completed: Story = {
  args: {
    icon: '💬',
    title: 'Conversation Practice',
    description: 'Real-world French conversation scenarios',
    difficulty: 'intermediate',
    progress: 100,
    estimatedTime: 20,
    xpReward: 60,
    completionStatus: 'completed',
  },
};

// Difficulty Levels
export const BeginnerLesson: Story = {
  args: {
    icon: '🌟',
    title: 'Basic Vocabulary',
    description: 'Essential French words for everyday use',
    difficulty: 'beginner',
    progress: 30,
    estimatedTime: 10,
    xpReward: 25,
  },
};

export const IntermediateLesson: Story = {
  args: {
    icon: '🎯',
    title: 'Grammar Patterns',
    description: 'Complex French grammar structures',
    difficulty: 'intermediate',
    progress: 50,
    estimatedTime: 30,
    xpReward: 75,
  },
};

export const AdvancedLesson: Story = {
  args: {
    icon: '🤔',
    title: 'Subjunctive Practice',
    description: 'Master the French subjunctive mood',
    difficulty: 'advanced',
    progress: 0,
    estimatedTime: 45,
    xpReward: 100,
  },
};

// Card Variants
export const CompactVariant: Story = {
  args: {
    icon: '📚',
    title: 'Quick Review',
    description: 'Short vocabulary practice',
    difficulty: 'beginner',
    progress: 80,
    estimatedTime: 5,
    xpReward: 20,
    variant: 'compact',
  },
};

export const DetailedVariant: Story = {
  args: {
    icon: '🎓',
    title: 'Comprehensive Grammar',
    description: 'Deep dive into French grammar rules with examples and practice exercises',
    difficulty: 'advanced',
    progress: 25,
    estimatedTime: 60,
    xpReward: 150,
    variant: 'detailed',
  },
};

// Grid Layout Example
export const LessonCardGrid: Story = {
  render: () => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 2,
      maxWidth: '900px'
    }}>
      <MolecularLessonCard
        icon="👋"
        title="French Greetings"
        description="Master common greetings"
        difficulty="beginner"
        progress={0}
        estimatedTime={15}
        xpReward={50}
      />
      <MolecularLessonCard
        icon="📅"
        title="Past Tense"
        description="Learn past tense usage"
        difficulty="intermediate"
        progress={75}
        estimatedTime={25}
        xpReward={75}
      />
      <MolecularLessonCard
        icon="💬"
        title="Conversation"
        description="Practice real conversations"
        difficulty="intermediate"
        progress={100}
        estimatedTime={20}
        xpReward={60}
        completionStatus="completed"
      />
      <MolecularLessonCard
        icon="🤔"
        title="Subjunctive"
        description="Advanced grammar concepts"
        difficulty="advanced"
        progress={0}
        estimatedTime={45}
        xpReward={100}
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of lesson cards in a responsive grid layout.',
      },
    },
  },
};

// Interactive States Demo
export const InteractiveStatesDemo: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center', minWidth: '280px' }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '0.875rem', color: (theme) => theme.palette.text.secondary }}>
          Not Started
        </Typography>
        <MolecularLessonCard
          icon="📚"
          title="New Lesson"
          description="Ready to start learning"
          difficulty="beginner"
          progress={0}
          estimatedTime={15}
          xpReward={50}
          completionStatus="not_started"
        />
      </Box>
      
      <Box sx={{ textAlign: 'center', minWidth: '280px' }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '0.875rem', color: (theme) => theme.palette.text.secondary }}>
          In Progress
        </Typography>
        <MolecularLessonCard
          icon="⚡"
          title="Active Lesson"
          description="Continue your progress"
          difficulty="intermediate"
          progress={60}
          estimatedTime={20}
          xpReward={75}
          completionStatus="in_progress"
        />
      </Box>
      
      <Box sx={{ textAlign: 'center', minWidth: '280px' }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '0.875rem', color: (theme) => theme.palette.text.secondary }}>
          Completed
        </Typography>
        <MolecularLessonCard
          icon="🎉"
          title="Finished Lesson"
          description="Great job completing this"
          difficulty="intermediate"
          progress={100}
          estimatedTime={25}
          xpReward={80}
          completionStatus="completed"
        />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive states showing different lesson completion levels.',
      },
    },
  },
};
