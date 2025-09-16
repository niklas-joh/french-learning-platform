/**
 * AI Tutor Card Stories
 * 
 * Comprehensive stories for the AITutorCard component demonstrating all variants,
 * states, and interactive behaviors following atomic design methodology.
 * 
 * @fileoverview AITutorCard component stories
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AITutorCard } from '../../../components/ai-dashboard/AITutorCard';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';

// Mock function for onClick handlers
const fn = () => () => {};

const meta: Meta<typeof AITutorCard> = {
  title: 'Existing Components/Molecules/AITutorCard',
  component: AITutorCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced AI tutor interaction card with offline support and personalized greetings. Features time-based greetings, progress-based contextual messages, and adaptive functionality based on online/offline status.',
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
  argTypes: {
    isOffline: {
      control: 'boolean',
      description: 'Whether the component is in offline mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    userName: {
      control: 'text',
      description: 'User name for personalized greetings',
      table: {
        type: { summary: 'string' },
      },
    },
    progressPercentage: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'User progress percentage (affects contextual messages and tutor selection)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '75' },
      },
    },
    onInteractionStart: {
      description: 'Callback function when user starts interaction with AI tutor',
      table: {
        type: { summary: 'function' },
      },
    },
    sx: {
      control: 'object',
      description: 'Additional Material-UI sx prop styling',
      table: {
        type: { summary: 'object' },
      },
    },
  },
  args: {
    onInteractionStart: fn(),
    progressPercentage: 75,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AI Tutor Card
 * Standard online state with moderate progress
 */
export const Default: Story = {
  args: {
    userName: 'Marie',
    progressPercentage: 45,
  },
};

/**
 * Online State
 * Full functionality with AI assistance available
 */
export const Online: Story = {
  args: {
    isOffline: false,
    userName: 'Pierre',
    progressPercentage: 65,
  },
};

/**
 * Offline State
 * Limited functionality with offline content access
 */
export const Offline: Story = {
  args: {
    isOffline: true,
    userName: 'Sophie',
    progressPercentage: 30,
  },
};

/**
 * Beginner User
 * Low progress percentage showing beginner-level messages
 */
export const BeginnerUser: Story = {
  args: {
    userName: 'Alex',
    progressPercentage: 15,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Beginner users (0-29% progress) receive encouraging basic-level messages and guidance.',
      },
    },
  },
};

/**
 * Intermediate User  
 * Moderate progress percentage showing intermediate-level content
 */
export const IntermediateUser: Story = {
  args: {
    userName: 'Camille',
    progressPercentage: 50,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Intermediate users (30-69% progress) receive more challenging content and advanced topics.',
      },
    },
  },
};

/**
 * Advanced User
 * High progress percentage showing advanced French content
 */
export const AdvancedUser: Story = {
  args: {
    userName: 'François',
    progressPercentage: 85,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced users (70%+ progress) receive messages in French and complex learning content.',
      },
    },
  },
};

/**
 * Without User Name
 * Anonymous user experience without personalization
 */
export const WithoutUserName: Story = {
  args: {
    progressPercentage: 40,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card adapts gracefully when no user name is provided, showing generic friendly greetings.',
      },
    },
  },
};

/**
 * Complete Beginner
 * Zero progress showing initial learning encouragement
 */
export const CompleteBeginner: Story = {
  args: {
    userName: 'Emma',
    progressPercentage: 0,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Users at 0% progress receive the most basic and encouraging messages to start their French journey.',
      },
    },
  },
};

/**
 * Expert Level
 * Maximum progress showing fluency-level interaction
 */
export const ExpertLevel: Story = {
  args: {
    userName: 'Jean-Claude',
    progressPercentage: 100,
    isOffline: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Expert users at 100% progress receive completely French messages and advanced cultural content.',
      },
    },
  },
};

/**
 * Offline Beginner
 * Offline mode for new users with limited functionality
 */
export const OfflineBeginner: Story = {
  args: {
    isOffline: true,
    userName: 'Luna',
    progressPercentage: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Beginner users in offline mode still have access to downloaded content and basic functionality.',
      },
    },
  },
};

/**
 * Custom Styling
 * Demonstrates custom styling capabilities using sx prop
 */
export const CustomStyling: Story = {
  args: {
    userName: 'Artistic',
    progressPercentage: 60,
    sx: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.02)',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Card can be customized with additional styling using the sx prop for brand-specific designs.',
      },
    },
  },
};

/**
 * Interactive Demo
 * Demonstrates all interactive states and behaviors
 */
export const InteractiveDemo: Story = {
  args: {
    userName: 'Interactive',
    progressPercentage: 55,
    onInteractionStart: () => {
      alert('AI Tutor interaction started! This would normally launch the AI conversation interface.');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the interaction button to see the callback functionality. In real implementation, this would launch the AI tutor interface.',
      },
    },
  },
};

/**
 * Responsive Demo
 * Shows how the card adapts to different container sizes
 */
export const ResponsiveDemo: Story = {
  args: {
    userName: 'Responsive',
    progressPercentage: 70,
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            padding: '20px',
            maxWidth: '1200px'
          }}>
            <div style={{ width: '300px' }}>
              <h4>Mobile (300px)</h4>
              <Story />
            </div>
            <div style={{ width: '400px' }}>
              <h4>Tablet (400px)</h4>
              <Story />
            </div>
            <div style={{ width: '500px' }}>
              <h4>Desktop (500px)</h4>
              <Story />
            </div>
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Card responsively adapts to different container widths while maintaining optimal proportions.',
      },
    },
  },
};

/**
 * All States Showcase
 * Comprehensive overview of all possible states
 */
export const AllStatesShowcase: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <div style={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          padding: '20px',
          maxWidth: '1400px'
        }}>
          <div>
            <h4>Beginner - Online</h4>
            <AITutorCard 
              userName="Alex" 
              progressPercentage={15} 
              isOffline={false}
              onInteractionStart={fn()} 
            />
          </div>
          <div>
            <h4>Intermediate - Online</h4>
            <AITutorCard 
              userName="Marie" 
              progressPercentage={50} 
              isOffline={false}
              onInteractionStart={fn()} 
            />
          </div>
          <div>
            <h4>Advanced - Online</h4>
            <AITutorCard 
              userName="Pierre" 
              progressPercentage={85} 
              isOffline={false}
              onInteractionStart={fn()} 
            />
          </div>
          <div>
            <h4>Beginner - Offline</h4>
            <AITutorCard 
              userName="Luna" 
              progressPercentage={20} 
              isOffline={true}
              onInteractionStart={fn()} 
            />
          </div>
          <div>
            <h4>Intermediate - Offline</h4>
            <AITutorCard 
              userName="Sophie" 
              progressPercentage={45} 
              isOffline={true}
              onInteractionStart={fn()} 
            />
          </div>
          <div>
            <h4>Advanced - Offline</h4>
            <AITutorCard 
              userName="François" 
              progressPercentage={90} 
              isOffline={true}
              onInteractionStart={fn()} 
            />
          </div>
        </div>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Comprehensive showcase of all AI Tutor Card states across different user levels and connection statuses.',
      },
    },
  },
};
