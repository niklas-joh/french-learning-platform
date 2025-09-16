import type { Meta, StoryObj } from '@storybook/react';
import HeroSection from '../../../components/landing/HeroSection';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

/**
 * HeroSection is the main landing page hero with AI-focused messaging and compelling CTAs.
 * 
 * **Key Features:**
 * - Gradient background with animated elements
 * - Typography with gradient text effects
 * - Prominent call-to-action buttons
 * - Responsive design across all device sizes
 * - Fade-in animations and hover effects
 * - AI-powered branding with modern aesthetics
 * - Link integration for navigation
 */
const meta: Meta<typeof HeroSection> = {
  title: 'Existing Components/Organisms/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modern landing page hero section with AI-focused messaging, gradient backgrounds, and compelling call-to-action elements.'
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <div style={{ minHeight: '100vh' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

/**
 * Default hero section with full functionality
 */
export const Default: Story = {};

/**
 * Hero section on light background
 */
export const LightBackground: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            minHeight: '100vh'
          }}>
            <Story />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

/**
 * Hero section on dark background
 */
export const DarkBackground: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            minHeight: '100vh'
          }}>
            <Story />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

/**
 * Mobile view demonstration
 */
export const MobileView: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          width: 375, // iPhone width
          minHeight: 667, // iPhone height
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <HeroSection />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Tablet view demonstration
 */
export const TabletView: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          width: 768, // iPad width
          minHeight: 600,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <HeroSection />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Desktop view demonstration
 */
export const DesktopView: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          width: 1200, // Desktop width
          minHeight: 700,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <HeroSection />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Interactive button demo
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [buttonClicked, setButtonClicked] = React.useState<string>('');

    return (
      <MemoryRouter>
        <ThemeProvider>
          <Box sx={{ minHeight: '100vh' }}>
            <HeroSection />
            
            {/* Demo interaction indicator */}
            {buttonClicked && (
              <Box sx={{ 
                position: 'fixed',
                top: 20,
                right: 20,
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                p: 2,
                borderRadius: 2,
                zIndex: 9999
              }}>
                <Typography variant="body2">
                  {buttonClicked} clicked!
                </Typography>
              </Box>
            )}
            
            {/* Click handlers overlay */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              '& button': {
                pointerEvents: 'all'
              }
            }}>
              <Container maxWidth="lg" sx={{ pt: 20 }}>
                <Box sx={{ textAlign: 'center', mt: 35 }}>
                  <Box sx={{ 
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={() => setButtonClicked('Start Learning Free')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '16px 32px',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    />
                    <button
                      onClick={() => setButtonClicked('Watch Demo')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '16px 32px',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the call-to-action buttons to see interaction feedback. In the real app, these would navigate to registration or demo pages.'
      }
    }
  }
};

/**
 * Gradient and animation showcase
 */
export const GradientShowcase: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #667eea, #764ba2, #667eea)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}>
          <HeroSection />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Hero section with animated gradient background demonstrating the visual effects and animations.'
      }
    }
  }
};

/**
 * Typography and branding focus
 */
export const TypographyFocus: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
          minHeight: '100vh',
          p: 4
        }}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, color: '#2d3748' }}>
            Typography & Branding Demo
          </Typography>
          
          <HeroSection />
          
          {/* Typography breakdown */}
          <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Box sx={{ 
              background: 'white',
              p: 4,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h5" gutterBottom>Design Elements Used:</Typography>
              <ul style={{ lineHeight: 1.8, color: '#4a5568' }}>
                <li><strong>Gradient Text:</strong> Creates visual hierarchy and brand focus</li>
                <li><strong>AI Chip:</strong> Highlights key value proposition with emoji and color</li>
                <li><strong>Animated Underline:</strong> Emphasizes key messaging</li>
                <li><strong>Responsive Typography:</strong> Scales from 2.5rem to 4.5rem across devices</li>
                <li><strong>Call-to-Action Buttons:</strong> Primary gradient and outlined secondary</li>
                <li><strong>Background Effects:</strong> Subtle gradients and radial overlays</li>
              </ul>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  )
};

/**
 * Responsive breakpoints comparison
 */
export const ResponsiveComparison: Story = {
  render: () => (
    <Box sx={{ p: 3, background: '#f7fafc' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Responsive Breakpoints
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: '1fr', alignItems: 'start' }}>
        {/* Mobile */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Mobile (375px)
          </Typography>
          <MemoryRouter>
            <ThemeProvider>
              <Box sx={{ 
                width: 375,
                height: 600,
                border: '2px solid #e2e8f0',
                borderRadius: 2,
                overflow: 'hidden',
                margin: '0 auto'
              }}>
                <HeroSection />
              </Box>
            </ThemeProvider>
          </MemoryRouter>
        </Box>

        {/* Tablet */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Tablet (768px)
          </Typography>
          <MemoryRouter>
            <ThemeProvider>
              <Box sx={{ 
                width: 768,
                height: 500,
                border: '2px solid #e2e8f0',
                borderRadius: 2,
                overflow: 'hidden',
                margin: '0 auto'
              }}>
                <HeroSection />
              </Box>
            </ThemeProvider>
          </MemoryRouter>
        </Box>

        {/* Desktop */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Desktop (1200px+)
          </Typography>
          <MemoryRouter>
            <ThemeProvider>
              <Box sx={{ 
                width: 1000,
                height: 450,
                border: '2px solid #e2e8f0',
                borderRadius: 2,
                overflow: 'hidden',
                margin: '0 auto'
              }}>
                <HeroSection />
              </Box>
            </ThemeProvider>
          </MemoryRouter>
        </Box>
      </Box>
    </Box>
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
    <MemoryRouter>
      <ThemeProvider>
        <Box>
          {/* Simple landing page navigation */}
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
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--french-blue)' }}>
                  🇫🇷 FrenchAI
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--french-blue)' }}}>
                    Features
                  </Typography>
                  <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--french-blue)' }}}>
                    Pricing
                  </Typography>
                  <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: 'var(--french-blue)' }}}>
                    Login
                  </Typography>
                </Box>
              </Box>
            </Container>
          </Box>

          {/* Hero Section */}
          <HeroSection />
          
          {/* Additional sections preview */}
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', color: '#64748b' }}>
              <Typography variant="h5" gutterBottom>More Landing Sections</Typography>
              <Typography variant="body1">
                Features • Testimonials • Pricing • FAQ
              </Typography>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Animation and effects showcase
 */
export const AnimationShowcase: Story = {
  render: () => {
    const [animationKey, setAnimationKey] = React.useState(0);

    return (
      <MemoryRouter key={animationKey}>
        <ThemeProvider>
          <Box sx={{ minHeight: '100vh', position: 'relative' }}>
            <HeroSection />
            
            {/* Animation controls */}
            <Box sx={{ 
              position: 'fixed',
              bottom: 20,
              right: 20,
              background: 'rgba(255,255,255,0.9)',
              p: 2,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}>
              <Typography variant="body2" gutterBottom>Animation Controls</Typography>
              <button
                onClick={() => setAnimationKey(prev => prev + 1)}
                style={{
                  background: 'var(--french-blue)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Replay Fade-in
              </button>
            </Box>
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click "Replay Fade-in" to see the entrance animation again. Notice the smooth fade and timing effects.'
      }
    }
  }
};

/**
 * Accessibility features demonstration
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <MemoryRouter>
      <ThemeProvider>
        <Box sx={{ minHeight: '100vh' }}>
          <HeroSection />
          
          {/* Accessibility info */}
          <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ 
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: 2,
              p: 4
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0369a1' }}>
                ♿ Accessibility Features
              </Typography>
              <ul style={{ color: '#075985', lineHeight: 1.8 }}>
                <li><strong>Semantic HTML:</strong> Proper heading hierarchy and structure</li>
                <li><strong>Color Contrast:</strong> WCAG AA compliant text and background ratios</li>
                <li><strong>Keyboard Navigation:</strong> All interactive elements are keyboard accessible</li>
                <li><strong>Screen Reader Support:</strong> Meaningful text content and proper labeling</li>
                <li><strong>Focus Management:</strong> Clear focus indicators on buttons and links</li>
                <li><strong>Responsive Text:</strong> Text scales appropriately across all devices</li>
              </ul>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  )
};
