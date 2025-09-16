import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { QuickActionCard, QuickActionsGrid } from '../../../components/ai-dashboard/QuickActionCard';
import { ContentType } from '../../../config/aiDashboardConfig';

// Mock function for onClick handlers
const fn = () => () => {};

const meta: Meta<typeof QuickActionCard> = {
  title: 'Existing Components/Molecules/QuickActionCard',
  component: QuickActionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Existing QuickActionCard component from the AI dashboard. This is the actual production component used in the French learning platform.',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon to display (emoji or icon)',
    },
    title: {
      control: 'text',
      description: 'Title of the action',
    },
    description: {
      control: 'text',
      description: 'Description of the action',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
    contentType: {
      control: 'select',
      options: ['lesson', 'exercise', 'vocabulary', 'conversation'],
      description: 'Content type associated with this action',
    },
    estimatedTime: {
      control: { type: 'number', min: 1, max: 120 },
      description: 'Estimated time for completion in minutes',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Quick Action Cards
export const Default: Story = {
  args: {
    icon: '⚡',
    title: 'Quick Lesson',
    description: '5 min practice session',
    contentType: 'lesson' as ContentType,
    estimatedTime: 5,
  },
};

export const Vocabulary: Story = {
  args: {
    icon: '📚',
    title: 'Vocabulary Practice',
    description: 'Learn new French words',
    contentType: 'vocabulary' as ContentType,
    estimatedTime: 10,
  },
};

export const Conversation: Story = {
  args: {
    icon: '💬',
    title: 'Conversation Practice',
    description: 'Practice speaking French',
    contentType: 'conversation' as ContentType,
    estimatedTime: 15,
  },
};

export const Exercise: Story = {
  args: {
    icon: '🎯',
    title: 'Grammar Exercise',
    description: 'Test your grammar knowledge',
    contentType: 'exercise' as ContentType,
    estimatedTime: 20,
  },
};

// States
export const Disabled: Story = {
  args: {
    icon: '🔒',
    title: 'Locked Content',
    description: 'Complete previous lessons to unlock',
    disabled: true,
    contentType: 'lesson' as ContentType,
    estimatedTime: 25,
  },
};

export const LongDescription: Story = {
  args: {
    icon: '📖',
    title: 'Comprehensive French Grammar',
    description: 'Master complex French grammar rules with detailed explanations and interactive exercises',
    contentType: 'lesson' as ContentType,
    estimatedTime: 45,
  },
};

// Without Estimated Time
export const NoEstimatedTime: Story = {
  args: {
    icon: '🎮',
    title: 'Fun Quiz',
    description: 'Test your knowledge',
    contentType: 'exercise' as ContentType,
  },
};

// Custom Styling Example
export const CustomStyling: Story = {
  args: {
    icon: '🌟',
    title: 'Premium Lesson',
    description: 'Exclusive content for advanced learners',
    contentType: 'lesson' as ContentType,
    estimatedTime: 30,
    sx: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      '&:hover': {
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      }
    }
  },
};

// QuickActionsGrid Stories
const actionsGridMeta: Meta<typeof QuickActionsGrid> = {
  title: 'Existing Components/Molecules/QuickActionsGrid',
  component: QuickActionsGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Existing QuickActionsGrid component that displays multiple QuickActionCard components in a responsive grid layout.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether all actions are disabled',
    },
  },
  args: {
    onActionClick: fn(),
  },
};

export const QuickActionsGridDefault: StoryObj<typeof QuickActionsGrid> = {
  ...actionsGridMeta,
  args: {
    actions: [
      {
        id: 'quick-lesson',
        icon: '⚡',
        title: 'Quick Lesson',
        description: '5 min practice',
        contentType: 'lesson' as ContentType,
        estimatedTime: 5,
      },
      {
        id: 'vocabulary',
        icon: '📚',
        title: 'Vocabulary',
        description: 'Learn new words',
        contentType: 'vocabulary' as ContentType,
        estimatedTime: 10,
      },
      {
        id: 'conversation',
        icon: '💬',
        title: 'Conversation',
        description: 'Practice speaking',
        contentType: 'conversation' as ContentType,
        estimatedTime: 15,
      },
      {
        id: 'exercise',
        icon: '🎯',
        title: 'Exercise',
        description: 'Test knowledge',
        contentType: 'exercise' as ContentType,
        estimatedTime: 20,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default grid layout with multiple action cards.',
      },
    },
  },
};

export const QuickActionsGridDisabled: StoryObj<typeof QuickActionsGrid> = {
  ...actionsGridMeta,
  args: {
    disabled: true,
    actions: [
      {
        id: 'lesson1',
        icon: '📚',
        title: 'Disabled Lesson',
        description: 'This lesson is disabled',
        contentType: 'lesson' as ContentType,
        estimatedTime: 15,
      },
      {
        id: 'lesson2',
        icon: '🎯',
        title: 'Disabled Exercise',
        description: 'This exercise is disabled',
        contentType: 'exercise' as ContentType,
        estimatedTime: 10,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid with all actions disabled.',
      },
    },
  },
};

// Responsive Grid Demo
export const ResponsiveGridDemo: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Box sx={{ textAlign: 'center', mb: 2, fontSize: '1.125rem', fontWeight: 600, color: '#6b7280' }}>
          Desktop View (4 columns)
        </Box>
        <Box sx={{ width: '800px' }}>
          <QuickActionsGrid
            actions={[
              { id: '1', icon: '⚡', title: 'Quick Lesson', description: '5 min', contentType: 'lesson' as ContentType, estimatedTime: 5 },
              { id: '2', icon: '📚', title: 'Vocabulary', description: 'Learn words', contentType: 'vocabulary' as ContentType, estimatedTime: 10 },
              { id: '3', icon: '💬', title: 'Conversation', description: 'Practice speaking', contentType: 'conversation' as ContentType, estimatedTime: 15 },
              { id: '4', icon: '🎯', title: 'Exercise', description: 'Test knowledge', contentType: 'exercise' as ContentType, estimatedTime: 20 },
            ]}
          />
        </Box>
      </Box>
      
      <Box>
        <Box sx={{ textAlign: 'center', mb: 2, fontSize: '1.125rem', fontWeight: 600, color: '#6b7280' }}>
          Mobile View (2 columns)
        </Box>
        <Box sx={{ width: '350px' }}>
          <QuickActionsGrid
            actions={[
              { id: '1', icon: '⚡', title: 'Quick Lesson', description: '5 min', contentType: 'lesson' as ContentType, estimatedTime: 5 },
              { id: '2', icon: '📚', title: 'Vocabulary', description: 'Learn words', contentType: 'vocabulary' as ContentType, estimatedTime: 10 },
              { id: '3', icon: '💬', title: 'Conversation', description: 'Practice speaking', contentType: 'conversation' as ContentType, estimatedTime: 15 },
              { id: '4', icon: '🎯', title: 'Exercise', description: 'Test knowledge', contentType: 'exercise' as ContentType, estimatedTime: 20 },
            ]}
          />
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive behavior demonstration for different screen sizes.',
      },
    },
  },
};
