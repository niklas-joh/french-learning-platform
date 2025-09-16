import type { Meta, StoryObj } from '@storybook/react';
import FeaturesGrid from '../../../components/landing/FeaturesGrid';
import ThemeProvider from '../../../ThemeProvider';
import { Box, Typography, Container } from '@mui/material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

/**
 * FeaturesGrid is a comprehensive features showcase with AI-focused messaging and animated cards.
 * 
 * **Key Features:**
 * - Responsive grid layout (1-2-3 columns based on screen size)
 * - Staggered entrance animations for visual impact
 * - Six feature cards highlighting AI capabilities
 * - Professional typography with semantic hierarchy
 * - Color-coded feature categories
 * - Glassmorphism design with modern aesthetics
 * - Optimized spacing and proportions
 */
const meta: Meta<typeof FeaturesGrid> = {
  title: 'Existing Components/Organisms/FeaturesGrid',
  component: FeaturesGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modern features grid showcasing AI-powered learning capabilities with responsive design and smooth animations.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ]
};

export default meta;
type Story = StoryObj<typeof FeaturesGrid>;

/**
 * Default features grid with all AI capabilities
 */
export const Default: Story = {};

/**
 * Features grid on white background
 */
export const WhiteBackground: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ]
};

/**
 * Features grid on gradient background
 */
export const GradientBackground: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ]
};

/**
 * Features grid with subtle pattern background
 */
export const PatternBackground: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ 
          minHeight: '100vh', 
          background: '#f8fafc',
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.05) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.05) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ]
};

/**
 * Mobile layout demonstration
 */
export const MobileLayout: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        width: 375, // iPhone width
        margin: '0 auto',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        minHeight: 600
      }}>
        <FeaturesGrid />
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Tablet layout demonstration
 */
export const TabletLayout: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        width: 768, // iPad width
        margin: '0 auto',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        minHeight: 600
      }}>
        <FeaturesGrid />
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Desktop layout demonstration
 */
export const DesktopLayout: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        width: 1200, // Desktop width
        margin: '0 auto',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        minHeight: 600
      }}>
        <FeaturesGrid />
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Animation showcase with replay functionality
 */
export const AnimationShowcase: Story = {
  render: () => {
    const [animationKey, setAnimationKey] = React.useState(0);

    return (
      <ThemeProvider>
        <Box sx={{ minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                Features Grid Animation Demo
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
                  fontSize: '16px'
                }}
              >
                Replay Staggered Animations
              </button>
            </Box>
          </Container>
          
          <Box key={animationKey}>
            <FeaturesGrid />
          </Box>
        </Box>
      </ThemeProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click "Replay Staggered Animations" to see the smooth entrance timing. Each card appears with an increasing delay for visual impact.'
      }
    }
  }
};

/**
 * Responsive breakpoints comparison
 */
export const ResponsiveComparison: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 3, background: '#f0f4f8' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Responsive Grid Breakpoints
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 6 }}>
          {/* Mobile */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Mobile (1 Column)
            </Typography>
            <Box sx={{ 
              width: 375,
              margin: '0 auto',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <FeaturesGrid />
            </Box>
          </Box>

          {/* Tablet */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Tablet (2 Columns)
            </Typography>
            <Box sx={{ 
              width: 768,
              margin: '0 auto',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <FeaturesGrid />
            </Box>
          </Box>

          {/* Desktop */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Desktop (3 Columns)
            </Typography>
            <Box sx={{ 
              width: 1000,
              margin: '0 auto',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <FeaturesGrid />
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
 * Landing page context demonstration
 */
export const InLandingContext: Story = {
  render: () => (
    <ThemeProvider>
      <Box>
        {/* Simple navigation */}
        <Box sx={{ 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6366F1' }}>
                🇫🇷 FrenchAI
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#6366F1' }}}>
                  Features
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#6366F1' }}}>
                  Pricing
                </Typography>
                <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#6366F1' }}}>
                  Contact
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Hero section mock */}
        <Box sx={{ 
          py: 8, 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          textAlign: 'center'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Master French with AI
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
              Experience the future of language learning
            </Typography>
            <button style={{
              background: '#6366F1',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer'
            }}>
              Start Learning Free
            </button>
          </Container>
        </Box>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Additional sections preview */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', color: '#64748b' }}>
            <Typography variant="h5" gutterBottom>More Sections</Typography>
            <Typography variant="body1">
              Testimonials • Pricing • FAQ • Contact
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Typography and messaging focus
 */
export const TypographyFocus: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        minHeight: '100vh',
        py: 4
      }}>
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, color: '#2d3748' }}>
            Typography & Messaging Analysis
          </Typography>
          
          <Box sx={{ 
            background: 'white',
            p: 4,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            mb: 6
          }}>
            <Typography variant="h5" gutterBottom>Content Strategy Elements:</Typography>
            <ul style={{ lineHeight: 1.8, color: '#4a5568' }}>
              <li><strong>AI-Focused Headlines:</strong> "Revolutionary AI Features" emphasizes cutting-edge technology</li>
              <li><strong>Benefit-Driven Descriptions:</strong> Each feature clearly states user benefits</li>
              <li><strong>Technical Credibility:</strong> Specific mentions of "adaptive", "personalized", "intelligent"</li>
              <li><strong>Measurable Claims:</strong> "3x faster learning" provides concrete expectations</li>
              <li><strong>24/7 Availability:</strong> Highlights always-on AI convenience</li>
              <li><strong>Expert Authority:</strong> Combines human expertise with AI enhancement</li>
            </ul>
          </Box>
        </Container>
        
        <FeaturesGrid />
      </Box>
    </ThemeProvider>
  )
};

/**
 * Color scheme variations
 */
export const ColorSchemeVariations: Story = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Features Grid Color Schemes
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 6 }}>
        {[
          { 
            name: 'Light Theme', 
            background: '#ffffff',
            description: 'Clean white background for professional presentations' 
          },
          { 
            name: 'Subtle Gray', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            description: 'Soft gray gradient for reduced eye strain' 
          },
          { 
            name: 'Branded Background', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            description: 'Subtle brand colors for cohesive design' 
          }
        ].map((scheme, index) => (
          <Box key={index}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              {scheme.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              {scheme.description}
            </Typography>
            <ThemeProvider>
              <Box sx={{ 
                background: scheme.background,
                border: '2px solid #e2e8f0',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <FeaturesGrid />
              </Box>
            </ThemeProvider>
          </Box>
        ))}
      </Box>
    </Box>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Performance and accessibility demo
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ 
            background: '#e0f2fe',
            border: '1px solid #0277bd',
            borderRadius: 2,
            p: 4,
            mb: 6
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#01579b' }}>
              ♿ Accessibility Features
            </Typography>
            <ul style={{ color: '#0277bd', lineHeight: 1.8 }}>
              <li><strong>Semantic Structure:</strong> Proper heading hierarchy (h2 → h6 → body)</li>
              <li><strong>Color Independence:</strong> Information conveyed through text, not just color</li>
              <li><strong>Keyboard Navigation:</strong> All interactive elements are keyboard accessible</li>
              <li><strong>Screen Reader Support:</strong> Meaningful content structure and labeling</li>
              <li><strong>Animation Control:</strong> Respects user motion preferences</li>
              <li><strong>High Contrast:</strong> Strong contrast ratios for text and backgrounds</li>
              <li><strong>Responsive Text:</strong> Scalable typography across all devices</li>
            </ul>
          </Box>
        </Container>
        
        <FeaturesGrid />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ 
            background: '#f3e5f5',
            border: '1px solid #7b1fa2',
            borderRadius: 2,
            p: 4
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4a148c' }}>
              🚀 Performance Features
            </Typography>
            <ul style={{ color: '#6a1b9a', lineHeight: 1.8 }}>
              <li><strong>Staggered Loading:</strong> Animations are optimized for smooth performance</li>
              <li><strong>CSS Grid:</strong> Modern layout system for efficient rendering</li>
              <li><strong>Component Reuse:</strong> FeatureCard components are efficiently reused</li>
              <li><strong>Responsive Images:</strong> Icons scale efficiently across devices</li>
              <li><strong>Minimal Dependencies:</strong> Uses Material-UI for optimized bundle size</li>
            </ul>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
};

/**
 * Dark mode compatibility
 */
export const DarkModeCompatibility: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
            Dark Mode Features Grid
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'rgba(255,255,255,0.8)' }}>
            Features grid adapts beautifully to dark backgrounds while maintaining readability and visual hierarchy.
          </Typography>
        </Container>
        
        <FeaturesGrid />
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

/**
 * Complete landing section with context
 */
export const CompleteLandingSection: Story = {
  render: () => (
    <ThemeProvider>
      <Box>
        {/* Hero Section */}
        <Box sx={{ 
          py: 12,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          textAlign: 'center'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{ 
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #1f2937 0%, #6366F1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Master French with AI-Powered Learning
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}>
              Experience the future of language learning with personalized AI tutoring and dynamic content generation.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}>
                Start Learning Free
              </button>
              <button style={{
                background: 'transparent',
                color: '#6366F1',
                border: '2px solid #6366F1',
                padding: '14px 30px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Watch Demo
              </button>
            </Box>
          </Container>
        </Box>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* CTA Section */}
        <Box sx={{ 
          py: 8,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          textAlign: 'center'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Ready to Transform Your French Learning?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
              Join thousands of learners already accelerating their progress with AI.
            </Typography>
            <button style={{
              background: 'white',
              color: '#6366F1',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              Get Started Today
            </button>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};
