import type { Meta, StoryObj } from '@storybook/react';
import { Box, LinearProgress, CircularProgress, useTheme } from '@mui/material';
import { getDifficultyColor, getFeatureCategoryColor } from '../../utils/designSystemHelpers';

// Mock function for onClick handlers
const fn = () => () => {};

// Atomic Progress Indicator Component based on design mockups
const AtomicProgressIndicator = ({ 
  type = 'circular',
  variant = 'determinate',
  value = 50,
  size = 'medium',
  color = 'primary',
  showLabel = false,
  labelPosition = 'center',
  thickness = 4,
  ...props 
}: {
  type?: 'circular' | 'linear' | 'ring';
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'lesson';
  showLabel?: boolean;
  labelPosition?: 'center' | 'bottom' | 'right';
  thickness?: number;
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return type === 'circular' ? 40 : { height: 6 };
      case 'large': return type === 'circular' ? 80 : { height: 12 };
      default: return type === 'circular' ? 60 : { height: 8 };
    }
  };

  const theme = useTheme();
  
  const getColor = () => {
    switch (color) {
      case 'primary': return theme.palette.primary.main;
      case 'success': return getDifficultyColor('beginner', theme).main;
      case 'warning': return getFeatureCategoryColor('grammar', theme).main;
      case 'error': return getDifficultyColor('advanced', theme).main;
      case 'lesson': return getFeatureCategoryColor('ai', theme).main;
      default: return theme.palette.primary.main;
    }
  };

  const getSizeValue = getSize();
  const colorValue = getColor();

  if (type === 'circular' || type === 'ring') {
    const diameter = typeof getSizeValue === 'number' ? getSizeValue : 60;
    const radius = (diameter - thickness * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = variant === 'determinate' ? circumference - (value / 100) * circumference : 0;

    return (
      <Box 
        sx={{ 
          position: 'relative', 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Custom SVG Progress Ring */}
        <svg width={diameter} height={diameter} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={theme.palette.background.default}
            strokeWidth={thickness}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={colorValue}
            strokeWidth={thickness}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: variant === 'determinate' ? 'stroke-dashoffset 1s ease-in-out' : 'none',
              animation: variant === 'indeterminate' ? 'spin 2s linear infinite' : 'none'
            }}
          />
        </svg>
        
        {/* Label */}
        {showLabel && labelPosition === 'center' && (
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem',
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            {variant === 'determinate' ? `${value}%` : '...'}
          </Box>
        )}
        
        {showLabel && labelPosition === 'bottom' && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              mt: 0.5,
              fontSize: '0.75rem',
              fontWeight: 500,
              color: theme.palette.text.secondary
            }}
          >
            {variant === 'determinate' ? `${value}%` : 'Loading...'}
          </Box>
        )}
      </Box>
    );
  }

  // Linear Progress
  const linearSize = typeof getSizeValue === 'object' ? getSizeValue : { height: 8 };
  
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <LinearProgress
        variant={variant}
        value={value}
        sx={{
          ...linearSize,
          borderRadius: (theme.shape.borderRadius as number) / 2 || 4,
          backgroundColor: theme.palette.background.default,
          '& .MuiLinearProgress-bar': {
            backgroundColor: colorValue,
            borderRadius: (theme.shape.borderRadius as number) / 2 || 4,
            transition: 'transform 1s ease-in-out'
          }
        }}
        {...(props as any)}
      />
      
      {showLabel && (
        <Box
          sx={{
            position: labelPosition === 'right' ? 'absolute' : 'relative',
            right: labelPosition === 'right' ? -60 : 'auto',
            top: labelPosition === 'right' ? '50%' : 8,
            transform: labelPosition === 'right' ? 'translateY(-50%)' : 'none',
            textAlign: labelPosition === 'right' ? 'left' : 'right',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: theme.palette.text.secondary
          }}
        >
          {variant === 'determinate' ? `${value}%` : 'Loading...'}
        </Box>
      )}
    </Box>
  );
};

const meta: Meta<typeof AtomicProgressIndicator> = {
  title: 'Atoms/ProgressIndicator',
  component: AtomicProgressIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Progress indicators used throughout the French learning platform for lesson progress, loading states, and goal tracking. Based on design mockups with smooth animations.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['circular', 'linear', 'ring'],
      description: 'Progress indicator type',
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description: 'Progress variant',
    },
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Progress value (0-100)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Progress indicator size',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'lesson'],
      description: 'Progress color',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show progress label',
    },
    labelPosition: {
      control: 'select',
      options: ['center', 'bottom', 'right'],
      description: 'Label position',
    },
    thickness: {
      control: { type: 'range', min: 2, max: 8 },
      description: 'Ring thickness',
    },
  },
  args: {
    value: 50,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Circular Progress Indicators
export const CircularPrimary: Story = {
  args: {
    type: 'circular',
    value: 75,
    showLabel: true,
  },
};

export const CircularSmall: Story = {
  args: {
    type: 'circular',
    size: 'small',
    value: 60,
    showLabel: true,
  },
};

export const CircularLarge: Story = {
  args: {
    type: 'circular',
    size: 'large',
    value: 90,
    showLabel: true,
  },
};

// Linear Progress Indicators
export const LinearPrimary: Story = {
  args: {
    type: 'linear',
    value: 65,
    showLabel: true,
    labelPosition: 'right',
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '300px' }}>
        <Story />
      </Box>
    ),
  ],
};

export const LinearSmall: Story = {
  args: {
    type: 'linear',
    size: 'small',
    value: 40,
    showLabel: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '250px' }}>
        <Story />
      </Box>
    ),
  ],
};

export const LinearLarge: Story = {
  args: {
    type: 'linear',
    size: 'large',
    value: 80,
    showLabel: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '350px' }}>
        <Story />
      </Box>
    ),
  ],
};

// Color Variations
export const ColorSuccess: Story = {
  args: {
    type: 'circular',
    color: 'success',
    value: 100,
    showLabel: true,
  },
};

export const ColorWarning: Story = {
  args: {
    type: 'circular',
    color: 'warning',
    value: 45,
    showLabel: true,
  },
};

export const ColorError: Story = {
  args: {
    type: 'circular',
    color: 'error',
    value: 25,
    showLabel: true,
  },
};

export const ColorLesson: Story = {
  args: {
    type: 'circular',
    color: 'lesson',
    value: 88,
    showLabel: true,
  },
};

// Indeterminate (Loading)
export const IndeterminateCircular: Story = {
  args: {
    type: 'circular',
    variant: 'indeterminate',
    showLabel: true,
  },
};

export const IndeterminateLinear: Story = {
  args: {
    type: 'linear',
    variant: 'indeterminate',
    showLabel: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '300px' }}>
        <Story />
      </Box>
    ),
  ],
};

// All Circular Sizes
export const AllCircularSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <AtomicProgressIndicator type="circular" size="small" value={75} showLabel />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: '#6b7280' }}>Small</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <AtomicProgressIndicator type="circular" size="medium" value={75} showLabel />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: '#6b7280' }}>Medium</Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <AtomicProgressIndicator type="circular" size="large" value={75} showLabel />
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: '#6b7280' }}>Large</Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All circular progress indicator sizes.',
      },
    },
  },
};

// All Colors
export const AllColors: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <AtomicProgressIndicator type="circular" color="primary" value={75} showLabel />
      <AtomicProgressIndicator type="circular" color="success" value={100} showLabel />
      <AtomicProgressIndicator type="circular" color="warning" value={45} showLabel />
      <AtomicProgressIndicator type="circular" color="error" value={25} showLabel />
      <AtomicProgressIndicator type="circular" color="lesson" value={88} showLabel />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All progress indicator color variations.',
      },
    },
  },
};

// Lesson Context Example
export const LessonProgressExample: Story = {
  render: () => (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: 3,
      borderRadius: 2,
      position: 'relative',
      maxWidth: '400px'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>Bonjour! 🇫🇷</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Ready for your French lesson today?</p>
        </Box>
        <AtomicProgressIndicator 
          type="circular" 
          value={75} 
          showLabel 
          color="primary" 
          size="medium"
        />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of progress indicator in lesson header context.',
      },
    },
  },
};

// Daily Goals Progress Example
export const DailyGoalsExample: Story = {
  render: () => (
    <Box sx={{ 
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 2,
      padding: 2,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', color: '#1f2937' }}>
        🎯 Daily Goals
      </h3>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>⭐ XP</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>150/200</span>
        </Box>
        <AtomicProgressIndicator type="linear" value={75} />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>📚 Lessons</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>2/3</span>
        </Box>
        <AtomicProgressIndicator type="linear" value={67} color="success" />
      </Box>
      
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>⏱️ Time</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>45/60min</span>
        </Box>
        <AtomicProgressIndicator type="linear" value={75} color="warning" />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of progress indicators in daily goals sidebar.',
      },
    },
  },
};
