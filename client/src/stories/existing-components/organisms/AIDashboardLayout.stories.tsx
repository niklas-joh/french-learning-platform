import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Alert } from '@mui/material';
import { AIDashboardLayout, AIEnhancedHeader } from '../../../components/ai-dashboard/AIDashboardLayout';
import { QuickActionsGrid } from '../../../components/ai-dashboard/QuickActionCard';
import { ContentType } from '../../../config/aiDashboardConfig';

// Mock function for onClick handlers
const fn = () => () => {};

// Mock content for examples
const mockQuickActions = [
  {
    id: 'lesson',
    icon: '📚',
    title: 'Start Lesson',
    description: 'Begin your French learning',
    contentType: 'lesson' as ContentType,
    estimatedTime: 15,
  },
  {
    id: 'vocabulary',
    icon: '📝',
    title: 'Practice Vocabulary',
    description: 'Review French words',
    contentType: 'vocabulary' as ContentType,
    estimatedTime: 10,
  },
  {
    id: 'conversation',
    icon: '💬',
    title: 'Conversation Practice',
    description: 'Practice speaking',
    contentType: 'conversation' as ContentType,
    estimatedTime: 20,
  },
];

const meta: Meta<typeof AIDashboardLayout> = {
  title: 'Existing Components/Organisms/AIDashboardLayout',
  component: AIDashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Existing AIDashboardLayout component that provides the structural layout for AI dashboard components. This is the actual production component used in the French learning platform.',
      },
    },
  },
  argTypes: {
    showOfflineBanner: {
      control: 'boolean',
      description: 'Whether to show offline banner',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Layout
export const Default: Story = {
  args: {
    showOfflineBanner: true,
  },
  render: (args) => (
    <AIDashboardLayout {...args}>
      <AIEnhancedHeader userName="Sarah" progressPercentage={75} currentStreak={7} />
      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <QuickActionsGrid 
          actions={mockQuickActions}
          onActionClick={(actionId, contentType) => console.log('Action clicked:', actionId, contentType)}
        />
      </Box>
    </AIDashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default AI Dashboard layout with header and quick actions grid.',
      },
    },
  },
};

// Without Offline Banner
export const WithoutOfflineBanner: Story = {
  args: {
    showOfflineBanner: false,
  },
  render: (args) => (
    <AIDashboardLayout {...args}>
      <AIEnhancedHeader userName="Marie" progressPercentage={90} currentStreak={14} />
      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Learning Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your French learning dashboard. Choose an action below to continue your learning journey.
        </Typography>
      </Box>
    </AIDashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Layout without offline banner for clean appearance.',
      },
    },
  },
};

// Multiple Content Sections
export const MultipleContentSections: Story = {
  args: {
    showOfflineBanner: true,
  },
  render: (args) => (
    <AIDashboardLayout {...args}>
      <AIEnhancedHeader userName="Alex" progressPercentage={45} currentStreak={3} />
      
      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Continue Learning
        </Typography>
        <QuickActionsGrid 
          actions={mockQuickActions}
          onActionClick={fn()}
        />
      </Box>

      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Today's Progress
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ 
            background: '#f0f9ff',
            border: '1px solid #e0f2fe',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <Typography variant="h4" color="primary">
              2
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lessons
            </Typography>
          </Box>
          <Box sx={{ 
            background: '#f0fdf4',
            border: '1px solid #dcfce7',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <Typography variant="h4" sx={{ color: '#16a34a' }}>
              150
            </Typography>
            <Typography variant="body2" color="text.secondary">
              XP Earned
            </Typography>
          </Box>
          <Box sx={{ 
            background: '#fefce8',
            border: '1px solid #fef3c7',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <Typography variant="h4" sx={{ color: '#ca8a04' }}>
              45
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Minutes
            </Typography>
          </Box>
        </Box>
      </Box>
    </AIDashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Layout with multiple content sections showing dashboard functionality.',
      },
    },
  },
};

// Mobile Layout
export const Mobile: Story = {
  args: {
    showOfflineBanner: true,
  },
  render: (args) => (
    <AIDashboardLayout {...args} sx={{ p: 1.5 }}>
      <AIEnhancedHeader userName="Emma" progressPercentage={60} currentStreak={5} />
      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <QuickActionsGrid 
          actions={mockQuickActions.slice(0, 2)} // Fewer actions on mobile
          onActionClick={fn()}
        />
      </Box>
    </AIDashboardLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized layout with condensed content.',
      },
    },
  },
};

// Error State Demo
export const WithErrorContent: Story = {
  args: {
    showOfflineBanner: false,
  },
  render: (args) => (
    <AIDashboardLayout {...args}>
      <AIEnhancedHeader userName="Thomas" progressPercentage={30} currentStreak={1} />
      
      <Alert severity="error" sx={{ mb: 2 }}>
        Unable to load lesson content. Please check your connection.
      </Alert>
      
      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Content Temporarily Unavailable
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We're having trouble loading your lessons. Please try again in a moment.
        </Typography>
        <Box sx={{ 
          background: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          display: 'inline-block',
          cursor: 'pointer',
          '&:hover': {
            background: '#2563eb'
          }
        }}>
          Retry Loading
        </Box>
      </Box>
    </AIDashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Layout handling error states and offline scenarios.',
      },
    },
  },
};

// Loading State Demo
export const WithLoadingContent: Story = {
  args: {
    showOfflineBanner: false,
  },
  render: (args) => (
    <AIDashboardLayout {...args}>
      <AIEnhancedHeader userName="Sophie" progressPercentage={85} currentStreak={12} />
      
      <Box sx={{ 
        background: 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading Your Personalized Content...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{
            width: 40,
            height: 40,
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          AI is preparing your personalized lessons...
        </Typography>
      </Box>
    </AIDashboardLayout>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Layout with loading states for AI content generation.',
      },
    },
  },
};
