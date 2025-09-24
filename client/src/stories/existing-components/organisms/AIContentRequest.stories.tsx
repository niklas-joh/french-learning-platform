/**
 * AI Content Request Stories
 * 
 * Comprehensive stories for the AIContentRequest component demonstrating all variants,
 * states, and interactive behaviors following atomic design methodology.
 * 
 * @fileoverview AIContentRequest component stories
 * @version 1.0.0
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AIContentRequest } from '../../../components/ai-dashboard/AIContentRequest';
import { ContentType } from '../../../config/aiDashboardConfig';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';

// Mock function for callbacks
const fn = () => () => {};

const meta: Meta<typeof AIContentRequest> = {
  title: 'Existing Components/Organisms/AIContentRequest',
  component: AIContentRequest,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Performance-optimized AI content request form with topic suggestions, form validation, and accessibility features. Integrates with useAIContentGeneration hook for generating personalized learning content.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ width: '500px', padding: '20px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled (e.g., offline mode)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultContentType: {
      control: 'select',
      options: ['lesson', 'exercise', 'vocabulary', 'conversation'],
      description: 'Default content type selection',
      table: {
        type: { summary: 'ContentType' },
        defaultValue: { summary: 'lesson' },
      },
    },
    onGenerationStart: {
      description: 'Callback when content generation starts',
      table: {
        type: { summary: 'function' },
      },
    },
    onGenerationComplete: {
      description: 'Callback when content generation completes',
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
    onGenerationStart: fn(),
    onGenerationComplete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AI Content Request
 * Standard form for requesting AI-generated learning content
 */
export const Default: Story = {
  args: {
    defaultContentType: 'lesson' as ContentType,
  },
};

/**
 * Lesson Content Type
 * Form configured for generating lesson content
 */
export const LessonContentType: Story = {
  args: {
    defaultContentType: 'lesson' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form configured for generating interactive French lessons with comprehensive explanations and examples.',
      },
    },
  },
};

/**
 * Exercise Content Type
 * Form configured for generating exercise content
 */
export const ExerciseContentType: Story = {
  args: {
    defaultContentType: 'exercise' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form configured for generating practice exercises with various question types and difficulty levels.',
      },
    },
  },
};

/**
 * Vocabulary Content Type
 * Form configured for generating vocabulary content
 */
export const VocabularyContentType: Story = {
  args: {
    defaultContentType: 'vocabulary' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form configured for generating vocabulary lessons with word lists, definitions, and usage examples.',
      },
    },
  },
};

/**
 * Conversation Content Type
 * Form configured for generating conversation practice
 */
export const ConversationContentType: Story = {
  args: {
    defaultContentType: 'conversation' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form configured for generating conversation practice scenarios with dialogue examples and role-playing exercises.',
      },
    },
  },
};

/**
 * Disabled State
 * Form disabled for offline or restricted access
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultContentType: 'lesson' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state typically shown when offline or when user has exceeded content generation limits.',
      },
    },
  },
};

/**
 * Custom Styling
 * Demonstrates custom styling capabilities
 */
export const CustomStyling: Story = {
  args: {
    defaultContentType: 'conversation' as ContentType,
    sx: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      '& .MuiTextField-root': {
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.7)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        '& .MuiInputBase-input': {
          color: 'white',
        },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Form with custom gradient styling and white text overlay for premium or special content sections.',
      },
    },
  },
};

/**
 * Interactive Demo
 * Fully functional form with callback demonstrations
 */
export const InteractiveDemo: Story = {
  args: {
    defaultContentType: 'lesson' as ContentType,
    onGenerationStart: (topic: string, contentType: ContentType) => {
      alert(`Started generating ${contentType} content for topic: "${topic}"`);
    },
    onGenerationComplete: (content: any) => {
      alert(`Content generation completed! Generated content for: ${JSON.stringify(content, null, 2)}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive form that demonstrates callback functionality. Try filling in a topic and submitting the form.',
      },
    },
  },
};

/**
 * With Pre-filled Topic
 * Form with a topic already entered
 */
export const WithPrefilledTopic: Story = {
  render: (args) => {
    const [key, setKey] = useState(0);
    return (
      <div>
        <button 
          onClick={() => setKey(prev => prev + 1)}
          style={{ 
            marginBottom: '20px', 
            padding: '8px 16px', 
            backgroundColor: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Form
        </button>
        <div key={key}>
          <AIContentRequest {...args} />
        </div>
      </div>
    );
  },
  args: {
    defaultContentType: 'vocabulary' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form showing topic suggestions and how they interact with user input. The topic suggestions are filtered based on user input.',
      },
    },
  },
};

/**
 * All Content Types Showcase
 * Shows all content types side by side
 */
export const AllContentTypesShowcase: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <div style={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          padding: '20px',
          maxWidth: '1400px'
        }}>
          <div>
            <h4>Lesson Content</h4>
            <AIContentRequest 
              defaultContentType={'lesson' as ContentType}
              onGenerationStart={fn()}
              onGenerationComplete={fn()}
            />
          </div>
          <div>
            <h4>Exercise Content</h4>
            <AIContentRequest 
              defaultContentType={'exercise' as ContentType}
              onGenerationStart={fn()}
              onGenerationComplete={fn()}
            />
          </div>
          <div>
            <h4>Vocabulary Content</h4>
            <AIContentRequest 
              defaultContentType={'vocabulary' as ContentType}
              onGenerationStart={fn()}
              onGenerationComplete={fn()}
            />
          </div>
          <div>
            <h4>Conversation Content</h4>
            <AIContentRequest 
              defaultContentType={'conversation' as ContentType}
              onGenerationStart={fn()}
              onGenerationComplete={fn()}
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
        story: 'Comprehensive showcase of all content types available for AI generation, each with their specific configurations.',
      },
    },
  },
};

/**
 * Responsive Demo
 * Shows how the form adapts to different screen sizes
 */
export const ResponsiveDemo: Story = {
  args: {
    defaultContentType: 'lesson' as ContentType,
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
            maxWidth: '1400px'
          }}>
            <div style={{ width: '300px' }}>
              <h4>Mobile (300px)</h4>
              <Story />
            </div>
            <div style={{ width: '450px' }}>
              <h4>Tablet (450px)</h4>
              <Story />
            </div>
            <div style={{ width: '600px' }}>
              <h4>Desktop (600px)</h4>
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
        story: 'Form responsively adapts to different container widths while maintaining usability and visual hierarchy.',
      },
    },
  },
};

/**
 * Accessibility Demo
 * Demonstrates accessibility features and keyboard navigation
 */
export const AccessibilityDemo: Story = {
  args: {
    defaultContentType: 'exercise' as ContentType,
  },
  parameters: {
    docs: {
      description: {
        story: 'Form implements comprehensive ARIA patterns, keyboard navigation for topic suggestions, and screen reader support. Try navigating with Tab and using arrow keys on topic suggestions.',
      },
    },
  },
};

/**
 * Form States Demo
 * Shows different form states and validation
 */
export const FormStatesDemo: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <div style={{ 
          display: 'grid', 
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          padding: '20px',
          maxWidth: '124
          <div>
            <h4>Default State</h4>
            <AIContentRequest 
              defaultContentType={'lesson' as ContentType}
              onGenerationStart={fn()}
              onGenerationComplete={fn()}
            />
          </div>
          <div>
            <h4>Disabled State</h4>
            <AIContentRequest 
              disabled={true}
              defaultContentType={'lesson' as ContentType}
              onGenerationStart={fn()}
              onGenerationComplete={fn()}
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
        story: 'Comparison of different form states showing normal operation versus disabled/offline state.',
      },
    },
  },
};
