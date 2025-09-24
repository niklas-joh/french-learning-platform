/**
 * Loading States Stories
 * 
 * Comprehensive stories for the AI Dashboard Loading States components demonstrating
 * all loading variants, progress states, and skeleton patterns following atomic design methodology.
 * 
 * @fileoverview Loading States component stories
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { 
  LoadingCard, 
  ContentGenerationLoader, 
  DashboardSkeleton, 
  InlineLoader 
} from '../../../components/ai-dashboard/LoadingStates';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// Mock function for callbacks
const fn = () => () => {};

const meta: Meta<typeof LoadingCard> = {
  title: 'Existing Components/Atoms/LoadingStates',
  component: LoadingCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Collection of loading state components for AI dashboard with consistent animations, accessibility features, and multiple loading patterns for different contexts.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ width: '400px', padding: '20px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Loading Card
 * Basic loading state with spinner and message
 */
export const DefaultLoadingCard: Story = {
  args: {
    message: 'Loading your content...',
    height: 150,
    showSkeleton: false,
  },
};

/**
 * Loading Card with Skeleton
 * Loading state using skeleton placeholders
 */
export const LoadingCardSkeleton: Story = {
  args: {
    message: 'Preparing your dashboard...',
    height: 200,
    showSkeleton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading card with animated skeleton placeholders instead of spinner for better perceived performance.',
      },
    },
  },
};

/**
 * Tall Loading Card
 * Loading state with increased height for larger content areas
 */
export const TallLoadingCard: Story = {
  args: {
    message: 'Generating comprehensive learning content...',
    height: 300,
    showSkeleton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Taller loading card suitable for larger content areas or detailed loading processes.',
      },
    },
  },
};

/**
 * Content Generation Loader - Progress Demo
 * Animated progress loader for AI content generation
 */
export const ContentGenerationProgressDemo: StoryObj<typeof ContentGenerationLoader> = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isRunning && progress < 100) {
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              setIsRunning(false);
              return 100;
            }
            return prev + Math.random() * 10;
          });
        }, 500);
      }
      return () => clearInterval(interval);
    }, [isRunning, progress]);

    const handleStart = () => {
      setProgress(0);
      setIsRunning(true);
    };

    const handleReset = () => {
      setProgress(0);
      setIsRunning(false);
    };

    return (
      <MemoryRouter>
        <ThemeProvider>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={handleStart}
                disabled={isRunning}
                size="small"
              >
                Start Generation
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleReset}
                size="small"
              >
                Reset
              </Button>
            </Box>
            <ContentGenerationLoader
              progress={Math.min(progress, 100)}
              contentType="lesson"
              estimatedTime={Math.max(0, Math.round((100 - progress) * 0.3))}
            />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Interactive demo showing AI content generation progress with dynamic messages and time estimates. Click "Start Generation" to see the animation.',
      },
    },
  },
};

/**
 * Content Generation Loader - Different Content Types
 */
export const ContentGenerationTypes: StoryObj<typeof ContentGenerationLoader> = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          padding: '20px',
          maxWidth: '1400px'
        }}>
          <div>
            <Typography variant="h6" gutterBottom>Lesson Generation</Typography>
            <ContentGenerationLoader
              progress={25}
              contentType="lesson"
              estimatedTime={45}
            />
          </div>
          <div>
            <Typography variant="h6" gutterBottom>Exercise Generation</Typography>
            <ContentGenerationLoader
              progress={60}
              contentType="exercise"
              estimatedTime={20}
            />
          </div>
          <div>
            <Typography variant="h6" gutterBottom>Vocabulary Generation</Typography>
            <ContentGenerationLoader
              progress={80}
              contentType="vocabulary"
              estimatedTime={8}
            />
          </div>
          <div>
            <Typography variant="h6" gutterBottom>Conversation Generation</Typography>
            <ContentGenerationLoader
              progress={95}
              contentType="conversation"
              estimatedTime={2}
            />
          </div>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Different content types being generated with varying progress levels and contextual messages.',
      },
    },
  },
};

/**
 * Dashboard Skeleton Loader
 * Complete dashboard skeleton for initial page load
 */
export const DashboardSkeletonDemo: StoryObj<typeof DashboardSkeleton> = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ width: '800px', height: '600px', overflow: 'auto' }}>
          <DashboardSkeleton />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Complete dashboard skeleton matching the actual dashboard layout structure for initial page loading.',
      },
    },
  },
};

/**
 * Inline Loader - Small
 * Compact inline loading indicator
 */
export const InlineLoaderSmall: StoryObj<typeof InlineLoader> = {
  args: {
    size: 16,
    inline: true,
    message: 'Loading...',
  },
};

/**
 * Inline Loader - Medium
 * Standard size inline loading indicator
 */
export const InlineLoaderMedium: StoryObj<typeof InlineLoader> = {
  args: {
    size: 24,
    inline: true,
    message: 'Processing request...',
  },
};

/**
 * Inline Loader - Large
 * Larger inline loading indicator
 */
export const InlineLoaderLarge: StoryObj<typeof InlineLoader> = {
  args: {
    size: 32,
    inline: false,
    message: 'Generating content...',
  },
};

/**
 * Button Loading States
 * Demonstration of loading states in button contexts
 */
export const ButtonLoadingStates: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
          <Button 
            variant="contained" 
            disabled 
            startIcon={<InlineLoader size={16} />}
          >
            Generating Content
          </Button>
          <Button 
            variant="outlined" 
            disabled 
            startIcon={<InlineLoader size={16} />}
          >
            Saving Progress
          </Button>
          <Button 
            variant="text" 
            disabled
          >
            <InlineLoader size={16} message="Loading..." />
          </Button>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states integrated into buttons for various user actions and form submissions.',
      },
    },
  },
};

/**
 * Progress Stages Demo
 * Different stages of content generation progress
 */
export const ProgressStagesDemo: StoryObj<typeof ContentGenerationLoader> = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          padding: '20px',
          maxWidth: '1400px'
        }}>
          <div>
            <Typography variant="subtitle2" gutterBottom>Starting (15%)</Typography>
            <ContentGenerationLoader
              progress={15}
              contentType="lesson"
              estimatedTime={85}
            />
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>Processing (35%)</Typography>
            <ContentGenerationLoader
              progress={35}
              contentType="lesson"
              estimatedTime={65}
            />
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>Generating (65%)</Typography>
            <ContentGenerationLoader
              progress={65}
              contentType="lesson"
              estimatedTime={35}
            />
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>Finalizing (85%)</Typography>
            <ContentGenerationLoader
              progress={85}
              contentType="lesson"
              estimatedTime={15}
            />
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>Complete (100%)</Typography>
            <ContentGenerationLoader
              progress={100}
              contentType="lesson"
              estimatedTime={0}
            />
          </div>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Different stages of the content generation process with appropriate messages and time estimates.',
      },
    },
  },
};

/**
 * All Loading States Showcase
 * Comprehensive overview of all loading state variations
 */
export const AllLoadingStatesShowcase: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          display: 'grid', 
          gap: '30px',
          padding: '20px',
          maxWidth: '1400px'
        }}>
          {/* Loading Cards */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Loading Cards</Typography>
            <Box sx={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <LoadingCard message="Default loading..." height={150} />
              <LoadingCard message="Skeleton loading..." height={150} showSkeleton={true} />
              <LoadingCard message="Tall content loading..." height={200} />
            </Box>
          </Box>

          {/* Content Generation */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Content Generation</Typography>
            <Box sx={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
              <ContentGenerationLoader progress={45} contentType="lesson" estimatedTime={30} />
              <ContentGenerationLoader progress={78} contentType="exercise" estimatedTime={12} />
            </Box>
          </Box>

          {/* Inline Loaders */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Inline Loaders</Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <InlineLoader size={16} message="Small" />
              <InlineLoader size={24} message="Medium" />
              <InlineLoader size={32} message="Large" inline={false} />
            </Box>
          </Box>

          {/* Button States */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Button Loading States</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" disabled startIcon={<InlineLoader size={16} />}>
                Generating
              </Button>
              <Button variant="outlined" disabled startIcon={<InlineLoader size={16} />}>
                Processing
              </Button>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all loading state components and their various applications throughout the AI dashboard.',
      },
    },
  },
};

/**
 * Responsive Loading States
 * How loading states adapt to different screen sizes
 */
export const ResponsiveLoadingStates: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          padding: '20px',
          maxWidth: '1400px'
        }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Mobile (250px)</Typography>
            <Box sx={{ width: '250px' }}>
              <LoadingCard message="Mobile loading..." height={120} />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Tablet (400px)</Typography>
            <Box sx={{ width: '400px' }}>
              <ContentGenerationLoader progress={60} contentType="lesson" estimatedTime={25} />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Desktop (600px)</Typography>
            <Box sx={{ width: '600px' }}>
              <LoadingCard message="Desktop loading..." height={180} showSkeleton={true} />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Loading states responsive behavior across different screen sizes and container widths.',
      },
    },
  },
};
