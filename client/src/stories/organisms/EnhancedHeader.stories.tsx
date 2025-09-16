import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

// Atomic components (simplified versions for this story)
const AtomicBadge = ({ variant, children, icon }: any) => {
  const getStyles = () => {
    switch (variant) {
      case 'daily-goal':
        return {
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        };
      case 'streak':
        return {
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#92400e',
          borderRadius: '8px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        };
      case 'rank':
        return {
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.9), rgba(255, 193, 7, 0.9))',
          color: '#333',
          borderRadius: '8px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
        };
      default:
        return {};
    }
  };

  const content = icon ? `${icon} ${children}` : children;
  return <Box sx={getStyles()}>{content}</Box>;
};

const AtomicProgressIndicator = ({ value, size = 'medium' }: any) => {
  const diameter = size === 'small' ? 50 : size === 'large' ? 80 : 60;
  const radius = (diameter - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={diameter} height={diameter} style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx={diameter / 2} 
          cy={diameter / 2} 
          r={radius} 
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth="4" 
          fill="none" 
        />
        <circle 
          cx={diameter / 2} 
          cy={diameter / 2} 
          r={radius} 
          stroke="white" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
      </svg>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: size === 'small' ? '0.75rem' : size === 'large' ? '1.125rem' : '0.875rem',
        fontWeight: 600,
        textAlign: 'center'
      }}>
        <div>{value}%</div>
        <div style={{ fontSize: '0.6em', opacity: 0.8 }}>Complete</div>
      </Box>
    </Box>
  );
};

// Enhanced Header Organism Component based on design mockups
const EnhancedHeaderOrganism = ({ 
  userName,
  progressPercentage = 75,
  currentStreak = 0,
  dailyGoals,
  userStats,
  variant = 'default',
  ...props 
}: {
  userName?: string;
  progressPercentage?: number;
  currentStreak?: number;
  dailyGoals?: {
    currentLessons: number;
    targetLessons: number;
    currentXp: number;
    targetXp: number;
    completed: boolean;
  };
  userStats?: {
    weeklyRank?: number;
  };
  variant?: 'default' | 'compact' | 'detailed';
}) => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    let timeGreeting: string;
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';
    
    if (userName) {
      return `Bonjour ${userName}! 🇫🇷`;
    }
    return 'Bonjour! 🇫🇷';
  };

  const getSubtitle = (): string => {
    if (dailyGoals?.completed) {
      return "Amazing! You've completed today's goals!";
    }
    
    if (currentStreak >= 7) {
      return "You're doing great! Keep it up today.";
    } else if (currentStreak > 0) {
      return "You're making excellent progress!";
    }
    
    return "Ready for your French lesson today?";
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: variant === 'compact' ? 2 : variant === 'detailed' ? 4 : 3,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: variant === 'compact' ? '120px' : variant === 'detailed' ? '200px' : '160px',
        // Enhanced visual effects
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
      {...props}
    >
      {/* Gamification Badges */}
      {dailyGoals && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2
          }}
        >
          <AtomicBadge variant="daily-goal" icon="🎯">
            {dailyGoals.currentLessons}/{dailyGoals.targetLessons} lessons
          </AtomicBadge>
        </Box>
      )}

      {currentStreak > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: progressPercentage ? 100 : 16,
            zIndex: 2
          }}
        >
          <AtomicBadge variant="streak" icon="🔥">
            {currentStreak} day streak
          </AtomicBadge>
        </Box>
      )}

      {userStats?.weeklyRank && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 2
          }}
        >
          <AtomicBadge variant="rank" icon="🏆">
            Rank #{userStats.weeklyRank}
          </AtomicBadge>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ maxWidth: progressPercentage ? '70%' : '100%' }}>
            <Typography
              variant="h1"
              sx={{ 
                fontSize: variant === 'compact' ? '1.5rem' : variant === 'detailed' ? '2.5rem' : '2rem',
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 1,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {getGreeting()}
            </Typography>
            
            <Typography
              sx={{ 
                fontSize: variant === 'compact' ? '0.875rem' : '1rem',
                opacity: 0.9,
                lineHeight: 1.4,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {getSubtitle()}
            </Typography>

            {/* Additional stats for detailed variant */}
            {variant === 'detailed' && dailyGoals && (
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}>
                  ⭐ {dailyGoals.currentXp}/{dailyGoals.targetXp} XP
                </Box>
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}>
                  📚 {dailyGoals.currentLessons}/{dailyGoals.targetLessons} Lessons
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Progress Ring */}
          {progressPercentage !== undefined && (
            <Box
              sx={{
                flexShrink: 0
              }}
            >
              <AtomicProgressIndicator 
                value={progressPercentage} 
                size={variant === 'compact' ? 'small' : variant === 'detailed' ? 'large' : 'medium'}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const meta: Meta<typeof EnhancedHeaderOrganism> = {
  title: 'Organisms/EnhancedHeader',
  component: EnhancedHeaderOrganism,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced header organism that combines atomic components (badges, progress indicators) and content to create a complete header section for the French learning platform. Based on the design mockups with gamification elements.',
      },
    },
  },
  argTypes: {
    userName: {
      control: 'text',
      description: 'User name for personalized greeting',
    },
    progressPercentage: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Overall learning progress percentage',
    },
    currentStreak: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current learning streak in days',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Header variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic States
export const NewUser: Story = {
  args: {
    userName: undefined,
    progressPercentage: 0,
    currentStreak: 0,
    dailyGoals: {
      currentLessons: 0,
      targetLessons: 3,
      currentXp: 0,
      targetXp: 200,
      completed: false
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Header for a new user just starting their French learning journey.',
      },
    },
  },
};

export const ActiveLearner: Story = {
  args: {
    userName: 'Sarah',
    progressPercentage: 75,
    currentStreak: 7,
    dailyGoals: {
      currentLessons: 2,
      targetLessons: 3,
      currentXp: 150,
      targetXp: 200,
      completed: false
    },
    userStats: {
      weeklyRank: 3
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Header for an active learner with progress and streak.',
      },
    },
  },
};

export const HighAchiever: Story = {
  args: {
    userName: 'Marie',
    progressPercentage: 100,
    currentStreak: 21,
    dailyGoals: {
      currentLessons: 3,
      targetLessons: 3,
      currentXp: 200,
      targetXp: 200,
      completed: true
    },
    userStats: {
      weeklyRank: 1
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Header for a high achiever who has completed daily goals.',
      },
    },
  },
};

// Variants
export const CompactVariant: Story = {
  args: {
    userName: 'Alex',
    progressPercentage: 45,
    currentStreak: 3,
    dailyGoals: {
      currentLessons: 1,
      targetLessons: 3,
      currentXp: 50,
      targetXp: 200,
      completed: false
    },
    variant: 'compact'
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant for mobile or space-constrained layouts.',
      },
    },
  },
};

export const DetailedVariant: Story = {
  args: {
    userName: 'Sophie',
    progressPercentage: 88,
    currentStreak: 14,
    dailyGoals: {
      currentLessons: 2,
      targetLessons: 3,
      currentXp: 175,
      targetXp: 200,
      completed: false
    },
    userStats: {
      weeklyRank: 2
    },
    variant: 'detailed'
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed variant with additional statistics and information.',
      },
    },
  },
};

// Different Progress States
export const LowProgress: Story = {
  args: {
    userName: 'Thomas',
    progressPercentage: 15,
    currentStreak: 1,
    dailyGoals: {
      currentLessons: 0,
      targetLessons: 3,
      currentXp: 25,
      targetXp: 200,
      completed: false
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Header showing low progress - encouraging the user to continue.',
      },
    },
  },
};

export const MediumProgress: Story = {
  args: {
    userName: 'Emma',
    progressPercentage: 60,
    currentStreak: 5,
    dailyGoals: {
      currentLessons: 2,
      targetLessons: 3,
      currentXp: 120,
      targetXp: 200,
      completed: false
    },
    userStats: {
      weeklyRank: 5
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Header showing medium progress with steady learning habits.',
      },
    },
  },
};

// Special States
export const NoProgressRing: Story = {
  args: {
    userName: 'Lucas',
    progressPercentage: undefined,
    currentStreak: 12,
    dailyGoals: {
      currentLessons: 1,
      targetLessons: 3,
      currentXp: 75,
      targetXp: 200,
      completed: false
    },
    userStats: {
      weeklyRank: 4
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without progress ring, focusing on other gamification elements.',
      },
    },
  },
};

// Responsive Demo
export const ResponsiveDemo: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#6b7280', textAlign: 'center' }}>
          Desktop View
        </Typography>
        <EnhancedHeaderOrganism
          userName="Marie"
          progressPercentage={75}
          currentStreak={7}
          dailyGoals={{
            currentLessons: 2,
            targetLessons: 3,
            currentXp: 150,
            targetXp: 200,
            completed: false
          }}
          userStats={{ weeklyRank: 3 }}
          variant="detailed"
        />
      </Box>
      
      <Box sx={{ width: '100%', maxWidth: '500px' }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#6b7280', textAlign: 'center' }}>
          Tablet View
        </Typography>
        <EnhancedHeaderOrganism
          userName="Marie"
          progressPercentage={75}
          currentStreak={7}
          dailyGoals={{
            currentLessons: 2,
            targetLessons: 3,
            currentXp: 150,
            targetXp: 200,
            completed: false
          }}
          userStats={{ weeklyRank: 3 }}
          variant="default"
        />
      </Box>
      
      <Box sx={{ width: '100%', maxWidth: '350px' }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#6b7280', textAlign: 'center' }}>
          Mobile View
        </Typography>
        <EnhancedHeaderOrganism
          userName="Marie"
          progressPercentage={75}
          currentStreak={7}
          dailyGoals={{
            currentLessons: 2,
            targetLessons: 3,
            currentXp: 150,
            targetXp: 200,
            completed: false
          }}
          variant="compact"
        />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive demonstration showing different viewport sizes.',
      },
    },
  },
};
