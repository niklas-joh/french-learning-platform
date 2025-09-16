import type { Meta, StoryObj } from '@storybook/react';
import BottomTabNavigation from '../../../components/navigation/BottomTabNavigation';
import ThemeProvider from '../../../ThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

/**
 * BottomTabNavigation is a modern mobile navigation component with glassmorphism styling.
 * 
 * **Key Features:**
 * - Fixed bottom positioning for mobile-first design
 * - Glassmorphism background with backdrop blur
 * - Active state indicators with French blue accent
 * - Material Design icons for intuitive navigation
 * - Responsive layout optimized for mobile devices
 * - Smooth transitions and hover effects
 * - Router integration for seamless navigation
 */
const meta: Meta<typeof BottomTabNavigation> = {
  title: 'Existing Components/Molecules/BottomTabNavigation',
  component: BottomTabNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modern mobile navigation with glassmorphism styling, fixed bottom positioning, and smooth transitions between app sections.'
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/home']}>
        <ThemeProvider>
          <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

export default meta;
type Story = StoryObj<typeof BottomTabNavigation>;

/**
 * Default navigation on home page
 */
export const Default: Story = {};

/**
 * Navigation with Home tab active
 */
export const HomeActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/home']}>
        <ThemeProvider>
          <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
              Home Page Content
            </Typography>
            <Story />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

/**
 * Navigation with Lessons tab active
 */
export const LessonsActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/lessons']}>
        <ThemeProvider>
          <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
              Lessons Content
            </Typography>
            <Story />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

/**
 * Navigation with Practice tab active
 */
export const PracticeActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/practice']}>
        <ThemeProvider>
          <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
              Practice Exercises
            </Typography>
            <Story />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

/**
 * Navigation with Progress tab active
 */
export const ProgressActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/progress']}>
        <ThemeProvider>
          <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#333', textAlign: 'center' }}>
              Learning Progress
            </Typography>
            <Story />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ]
};

/**
 * Navigation with Profile tab active
 */
export const ProfileActive: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/profile']}>
        <ThemeProvider>
          <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h4" sx={{ color: '#333', textAlign: 'center' }}>
              User Profile
            </Typography>
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
    <MemoryRouter initialEntries={['/home']}>
      <ThemeProvider>
        <Box sx={{ 
          width: 375, // iPhone width
          height: 667, // iPhone height
          margin: '0 auto',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: '8px solid #333'
        }}>
          {/* Mock content */}
          <Box sx={{ 
            p: 3, 
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '120px' // Account for bottom nav
          }}>
            <Typography variant="h5" gutterBottom>
              French Learning App
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.8 }}>
              Navigate between sections using the bottom navigation
            </Typography>
          </Box>
          
          <BottomTabNavigation />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Interactive navigation demo
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [currentPath, setCurrentPath] = React.useState('/home');
    
    const navigationItems = [
      { label: 'Home', path: '/home', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', content: 'Welcome Home! Your French learning journey starts here.' },
      { label: 'Lessons', path: '/lessons', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', content: 'Discover structured French lessons and modules.' },
      { label: 'Practice', path: '/practice', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', content: 'Practice your French skills with interactive exercises.' },
      { label: 'Progress', path: '/progress', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', content: 'Track your learning progress and achievements.' },
      { label: 'Profile', path: '/profile', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', content: 'Manage your profile and learning preferences.' }
    ];

    const currentItem = navigationItems.find(item => item.path === currentPath) || navigationItems[0];

    return (
      <MemoryRouter initialEntries={[currentPath]}>
        <ThemeProvider>
          <Box sx={{ 
            width: 375,
            height: 667,
            margin: '0 auto',
            background: currentItem.color,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '8px solid #333',
            transition: 'background 0.3s ease-in-out'
          }}>
            {/* Content Area */}
            <Box sx={{ 
              p: 3, 
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: '120px',
              textAlign: 'center'
            }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {currentItem.label}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '280px' }}>
                {currentItem.content}
              </Typography>
            </Box>
            
            {/* Navigation buttons for demo */}
            <Box sx={{ 
              position: 'absolute',
              top: 20,
              right: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => setCurrentPath(item.path)}
                  style={{
                    background: currentPath === item.path ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </Box>
            
            <BottomTabNavigation />
          </Box>
        </ThemeProvider>
      </MemoryRouter>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Click the buttons in the top right to simulate navigation between different sections.'
      }
    }
  }
};

/**
 * Different device sizes comparison
 */
export const DeviceSizes: Story = {
  render: () => (
    <Box sx={{ p: 3, background: '#f0f0f0' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Bottom Navigation on Different Devices
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* iPhone SE */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>iPhone SE (320px)</Typography>
          <MemoryRouter initialEntries={['/home']}>
            <ThemeProvider>
              <Box sx={{ 
                width: 320,
                height: 568,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                border: '4px solid #333'
              }}>
                <Box sx={{ 
                  p: 2, 
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: '100px'
                }}>
                  <Typography variant="body2">Compact View</Typography>
                </Box>
                <BottomTabNavigation />
              </Box>
            </ThemeProvider>
          </MemoryRouter>
        </Box>

        {/* iPhone 12 */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>iPhone 12 (390px)</Typography>
          <MemoryRouter initialEntries={['/lessons']}>
            <ThemeProvider>
              <Box sx={{ 
                width: 390,
                height: 844,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '6px solid #333'
              }}>
                <Box sx={{ 
                  p: 3, 
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: '120px'
                }}>
                  <Typography variant="body1">Standard View</Typography>
                </Box>
                <BottomTabNavigation />
              </Box>
            </ThemeProvider>
          </MemoryRouter>
        </Box>

        {/* iPhone 12 Pro Max */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>iPhone Pro Max (430px)</Typography>
          <MemoryRouter initialEntries={['/practice']}>
            <ThemeProvider>
              <Box sx={{ 
                width: 430,
                height: 932,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                border: '8px solid #333'
              }}>
                <Box sx={{ 
                  p: 3, 
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: '120px'
                }}>
                  <Typography variant="h6">Large View</Typography>
                </Box>
                <BottomTabNavigation />
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
 * Glassmorphism styling showcase
 */
export const GlassmorphismShowcase: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/home']}>
      <ThemeProvider>
        <Box sx={{ 
          width: 375,
          height: 667,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: '8px solid #333'
        }}>
          {/* Animated background */}
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, #667eea, #764ba2, #667eea)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          }} />
          
          {/* Floating elements for depth */}
          <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }} />
          <Box sx={{ position: 'absolute', top: '40%', right: '20%', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }} />
          <Box sx={{ position: 'absolute', top: '60%', left: '30%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }} />
          
          {/* Content */}
          <Box sx={{ 
            position: 'relative',
            zIndex: 1,
            p: 3, 
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '120px',
            textAlign: 'center'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Glassmorphism Effect
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Notice the frosted glass effect of the bottom navigation with backdrop blur and transparency
            </Typography>
          </Box>
          
          <BottomTabNavigation />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered'
  }
};

/**
 * Dark mode compatibility
 */
export const DarkModeCompatibility: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/home']}>
      <ThemeProvider>
        <Box sx={{ 
          width: 375,
          height: 667,
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          border: '8px solid #000'
        }}>
          {/* Dark mode content */}
          <Box sx={{ 
            p: 3, 
            color: '#ffffff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '120px',
            textAlign: 'center'
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Dark Mode
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Navigation adapts beautifully to dark backgrounds
            </Typography>
          </Box>
          
          <BottomTabNavigation />
        </Box>
      </ThemeProvider>
    </MemoryRouter>
  ),
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' }
  }
};

/**
 * All navigation states comparison
 */
export const AllStatesComparison: Story = {
  render: () => (
    <Box sx={{ p: 3, background: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        All Navigation States
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, maxWidth: 1200, margin: '0 auto' }}>
        {[
          { path: '/home', title: 'Home Active', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { path: '/lessons', title: 'Lessons Active', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
          { path: '/practice', title: 'Practice Active', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
          { path: '/progress', title: 'Progress Active', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
          { path: '/profile', title: 'Profile Active', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
        ].map((item) => (
          <Box key={item.path} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>{item.title}</Typography>
            <MemoryRouter initialEntries={[item.path]}>
              <ThemeProvider>
                <Box sx={{ 
                  width: 280,
                  height: 400,
                  background: item.gradient,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '3px solid #ddd',
                  margin: '0 auto'
                }}>
                  <Box sx={{ 
                    p: 2, 
                    color: 'white',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '80px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2">
                      {item.title.replace(' Active', '')} Section
                    </Typography>
                  </Box>
                  <BottomTabNavigation />
                </Box>
              </ThemeProvider>
            </MemoryRouter>
          </Box>
        ))}
      </Box>
    </Box>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};
