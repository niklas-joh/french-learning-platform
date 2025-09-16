import type { Meta, StoryObj } from '@storybook/react';
import FeatureCard from '../../../components/landing/FeatureCard';
import ThemeProvider from '../../../ThemeProvider';
import { Box, Typography } from '@mui/material';
import { 
  Psychology, 
  AutoAwesome, 
  TrendingUp, 
  Groups, 
  Speed, 
  School,
  Favorite,
  Security,
  Language,
  EmojiObjects
} from '@mui/icons-material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

/**
 * FeatureCard is a reusable card component for showcasing product features with glassmorphism effects.
 * 
 * **Key Features:**
 * - Glassmorphism design with subtle transparency effects
 * - Animated zoom entrance with staggered timing
 * - Color-coded icon backgrounds with gradients
 * - Hover animations with lift and shadow effects
 * - Responsive design that works in grid layouts
 * - Customizable colors, icons, and content
 * - Professional typography hierarchy
 */
const meta: Meta<typeof FeatureCard> = {
  title: 'Existing Components/Molecules/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modern feature card with glassmorphism effects, customizable colors, and smooth animations for showcasing product capabilities.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ 
          width: '350px', 
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'
        }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    icon: {
      control: false,
      description: 'React element icon to display in the card header'
    },
    title: {
      control: 'text',
      description: 'Feature title text'
    },
    description: {
      control: 'text',
      description: 'Feature description content'
    },
    color: {
      control: 'color',
      description: 'Primary color for icon background and accents'
    },
    index: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
      description: 'Animation delay index for staggered entrances'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

/**
 * Default AI-powered learning feature
 */
export const Default: Story = {
  args: {
    icon: <Psychology />,
    title: 'AI-Powered Learning',
    description: 'Advanced AI creates personalized lessons tailored to your learning style and pace.',
    color: '#6366F1',
    index: 0
  }
};

/**
 * Dynamic content generation feature
 */
export const DynamicContent: Story = {
  args: {
    icon: <AutoAwesome />,
    title: 'Dynamic Content Generation',
    description: 'Fresh, engaging content generated on-demand to keep your learning experience exciting.',
    color: '#8B5CF6',
    index: 1
  }
};

/**
 * Progress tracking feature
 */
export const ProgressTracking: Story = {
  args: {
    icon: <TrendingUp />,
    title: 'Adaptive Progress Tracking',
    description: 'Intelligent analytics track your progress and identify areas for improvement.',
    color: '#06B6D4',
    index: 2
  }
};

/**
 * Conversation practice feature
 */
export const ConversationPractice: Story = {
  args: {
    icon: <Groups />,
    title: 'AI Conversation Partner',
    description: 'Practice speaking with an AI tutor available 24/7 for realistic conversations.',
    color: '#10B981',
    index: 3
  }
};

/**
 * Accelerated learning feature
 */
export const AcceleratedLearning: Story = {
  args: {
    icon: <Speed />,
    title: 'Accelerated Learning',
    description: 'Learn 3x faster with AI-optimized spaced repetition and memory techniques.',
    color: '#F59E0B',
    index: 4
  }
};

/**
 * Expert curriculum feature
 */
export const ExpertCurriculum: Story = {
  args: {
    icon: <School />,
    title: 'Expert Curriculum',
    description: 'Curriculum designed by language experts and enhanced by cutting-edge AI.',
    color: '#EF4444',
    index: 5
  }
};

/**
 * Custom colors demonstration
 */
export const CustomColors: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 3, 
        p: 3,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)'
      }}>
        <FeatureCard
          icon={<Favorite />}
          title="Passion for Learning"
          description="Cultivate a deep love for the French language and culture."
          color="#E91E63"
          index={0}
        />
        <FeatureCard
          icon={<Security />}
          title="Secure & Private"
          description="Your learning data is protected with enterprise-grade security."
          color="#607D8B"
          index={1}
        />
        <FeatureCard
          icon={<Language />}
          title="Multi-Language Support"
          description="Learn French while maintaining support for your native language."
          color="#FF9800"
          index={2}
        />
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Animation timing showcase
 */
export const AnimationTiming: Story = {
  render: () => {
    const [animationKey, setAnimationKey] = React.useState(0);

    return (
      <ThemeProvider>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Staggered Animation Demo
          </Typography>
          
          <button
            onClick={() => setAnimationKey(prev => prev + 1)}
            style={{
              background: '#6366F1',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '24px',
              display: 'block',
              margin: '0 auto 24px'
            }}
          >
            Replay Animations
          </button>
          
          <Box key={animationKey} sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 3,
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
            p: 3,
            borderRadius: 2
          }}>
            {[
              { icon: <Psychology />, title: 'First Card', color: '#6366F1', delay: 0 },
              { icon: <AutoAwesome />, title: 'Second Card', color: '#8B5CF6', delay: 1 },
              { icon: <TrendingUp />, title: 'Third Card', color: '#06B6D4', delay: 2 },
              { icon: <EmojiObjects />, title: 'Fourth Card', color: '#10B981', delay: 3 }
            ].map((card, index) => (
              <FeatureCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={`This card appears with a ${card.delay * 100}ms delay, creating a smooth staggered animation effect.`}
                color={card.color}
                index={card.delay}
              />
            ))}
          </Box>
        </Box>
      </ThemeProvider>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Click "Replay Animations" to see the staggered entrance timing. Each card has an increasing delay based on its index.'
      }
    }
  }
};

/**
 * Hover effects demonstration
 */
export const HoverEffects: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Hover Effects Demo
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
          Hover over the cards to see lift animations, color changes, and shadow effects
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 4,
          background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
          p: 4,
          borderRadius: 2
        }}>
          <FeatureCard
            icon={<Psychology />}
            title="Hover Me!"
            description="Notice the smooth lift animation, increased shadow depth, and border color change on hover."
            color="#6366F1"
            index={0}
          />
          <FeatureCard
            icon={<AutoAwesome />}
            title="Interactive Design"
            description="The hover effects provide visual feedback and create an engaging user experience."
            color="#8B5CF6"
            index={1}
          />
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Responsive behavior showcase
 */
export const ResponsiveBehavior: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Responsive Card Behavior
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 4 }}>
          {/* Mobile simulation */}
          <Box>
            <Typography variant="h6" gutterBottom>Mobile Layout (Single Column)</Typography>
            <Box sx={{ 
              width: 320, 
              background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
              p: 2,
              borderRadius: 2,
              border: '2px solid #e2e8f0'
            }}>
              <FeatureCard
                icon={<Psychology />}
                title="Mobile Card"
                description="Cards stack vertically on mobile devices for optimal readability."
                color="#6366F1"
                index={0}
              />
            </Box>
          </Box>

          {/* Tablet simulation */}
          <Box>
            <Typography variant="h6" gutterBottom>Tablet Layout (Two Columns)</Typography>
            <Box sx={{ 
              width: 600, 
              background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
              p: 3,
              borderRadius: 2,
              border: '2px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                <FeatureCard
                  icon={<Psychology />}
                  title="Tablet Card 1"
                  description="Two cards per row on tablet screens."
                  color="#6366F1"
                  index={0}
                />
                <FeatureCard
                  icon={<AutoAwesome />}
                  title="Tablet Card 2"
                  description="Maintains proper spacing and proportions."
                  color="#8B5CF6"
                  index={1}
                />
              </Box>
            </Box>
          </Box>

          {/* Desktop simulation */}
          <Box>
            <Typography variant="h6" gutterBottom>Desktop Layout (Three Columns)</Typography>
            <Box sx={{ 
              width: 900, 
              background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
              p: 3,
              borderRadius: 2,
              border: '2px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                <FeatureCard
                  icon={<Psychology />}
                  title="Desktop Card 1"
                  description="Three cards per row on desktop."
                  color="#6366F1"
                  index={0}
                />
                <FeatureCard
                  icon={<AutoAwesome />}
                  title="Desktop Card 2"
                  description="Optimal use of screen real estate."
                  color="#8B5CF6"
                  index={1}
                />
                <FeatureCard
                  icon={<TrendingUp />}
                  title="Desktop Card 3"
                  description="Consistent card heights and spacing."
                  color="#06B6D4"
                  index={2}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Color palette showcase
 */
export const ColorPalette: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Color Palette Options
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 3,
          background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
          p: 3,
          borderRadius: 2
        }}>
          {[
            { color: '#6366F1', name: 'French Blue', icon: <Psychology /> },
            { color: '#8B5CF6', name: 'Purple', icon: <AutoAwesome /> },
            { color: '#06B6D4', name: 'Cyan', icon: <TrendingUp /> },
            { color: '#10B981', name: 'Emerald', icon: <Groups /> },
            { color: '#F59E0B', name: 'Amber', icon: <Speed /> },
            { color: '#EF4444', name: 'Red', icon: <School /> }
          ].map((item, index) => (
            <FeatureCard
              key={index}
              icon={item.icon}
              title={`${item.name} Theme`}
              description={`Feature card styled with ${item.name.toLowerCase()} color (${item.color})`}
              color={item.color}
              index={index}
            />
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Long content handling
 */
export const LongContent: Story = {
  args: {
    icon: <Psychology />,
    title: 'Very Long Feature Title That Might Wrap to Multiple Lines',
    description: 'This is a much longer description that demonstrates how the feature card handles extended content. The card should maintain its proportions and readability even with more text content. The layout should remain balanced and the typography should continue to be readable and well-spaced.',
    color: '#6366F1',
    index: 0
  }
};

/**
 * Minimal content
 */
export const MinimalContent: Story = {
  args: {
    icon: <Psychology />,
    title: 'Brief',
    description: 'Short description.',
    color: '#6366F1',
    index: 0
  }
};

/**
 * Dark background compatibility
 */
export const DarkBackground: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        p: 4,
        minHeight: '400px'
      }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
          Dark Background Compatibility
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 3
        }}>
          <FeatureCard
            icon={<Psychology />}
            title="Dark Theme Ready"
            description="Feature cards adapt beautifully to dark backgrounds with glassmorphism effects."
            color="#6366F1"
            index={0}
          />
          <FeatureCard
            icon={<AutoAwesome />}
            title="Visual Contrast"
            description="Maintains excellent readability and visual hierarchy on dark surfaces."
            color="#8B5CF6"
            index={1}
          />
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' }
  }
};
