import type { Meta, StoryObj } from '@storybook/react';
import { Box, Container, useTheme } from '@mui/material';
import React from 'react';
import { getDifficultyColor, getFeatureCategoryColor } from '../../utils/designSystemHelpers';

// Mock function for onClick handlers
const fn = () => () => {};

// Import simplified versions of our components for the template
const EnhancedHeader = ({ userName, progressPercentage, currentStreak, dailyGoals, userStats, variant }: any) => {
  const theme = useTheme();
  const aiColors = getFeatureCategoryColor('ai', theme);
  
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${aiColors.main} 0%, ${aiColors.light} 100%)`,
        color: theme.palette.common.white,
        padding: variant === 'compact' ? theme.spacing(2) : theme.spacing(3),
        borderRadius: theme.spacing(2),
        position: 'relative',
        overflow: 'hidden',
        minHeight: variant === 'compact' ? '120px' : '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ fontSize: '2rem', fontWeight: 700, mb: 1 }}>
          {userName ? `Bonjour ${userName}! 🇫🇷` : 'Bonjour! 🇫🇷'}
        </Box>
        <Box sx={{ fontSize: '1rem', opacity: 0.9 }}>
          {currentStreak > 0 ? `${currentStreak} day streak! Keep it up!` : 'Ready for your French lesson today?'}
        </Box>
      </Box>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="30" cy="30" r="26" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="4" fill="none" />
          <circle 
            cx="30" 
            cy="30" 
            r="26" 
            stroke={theme.palette.common.white} 
            strokeWidth="4" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray="163.3"
            strokeDashoffset={163.3 - (progressPercentage / 100) * 163.3}
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
          />
        </svg>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.common.white,
          fontSize: '0.875rem',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {progressPercentage}%
        </Box>
      </Box>
    </Box>
  );
};

const LessonCard = ({ icon, title, description, difficulty, progress, estimatedTime, xpReward }: any) => {
  const theme = useTheme();
  const difficultyColors = getDifficultyColor(difficulty, theme);
  const aiColors = getFeatureCategoryColor('ai', theme);

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.spacing(1.5),
        boxShadow: theme.shadows[1],
        p: 2.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ fontSize: '1.75rem' }}>{icon}</Box>
          <Box sx={{
            background: difficultyColors.light,
            color: difficultyColors.main,
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: theme.spacing(0.75)
          }}>
            {difficulty === 'beginner' ? 'Beginner' : difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
          </Box>
        </Box>
        
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="20" cy="20" r="16" stroke={theme.palette.grey[200]} strokeWidth="3" fill="none" />
            <circle 
              cx="20" 
              cy="20" 
              r="16" 
              stroke={theme.palette.primary.main} 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray="100.5"
              strokeDashoffset={100.5 - (progress / 100) * 100.5}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          {progress > 0 && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: theme.palette.text.primary
            }}>
              {progress}%
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
        {title}
      </Box>
      
      <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem', mb: 'auto', flexGrow: 1 }}>
        {description}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        pt: 1,
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span style={{ fontSize: '0.75rem' }}>⏱️</span>
          <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
            {estimatedTime}min
          </Box>
        </Box>
        
        <Box sx={{
          background: `linear-gradient(45deg, ${aiColors.main}, ${aiColors.light})`,
          color: theme.palette.common.white,
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 8px',
          borderRadius: theme.spacing(0.75)
        }}>
          ⭐ {xpReward} XP
        </Box>
      </Box>
    </Box>
  );
};

const GamificationSidebar = ({ dailyGoals, leaderboard, userStats }: any) => {
  const theme = useTheme();
  const beginnerColors = getDifficultyColor('beginner', theme);

  return (
    <Box sx={{ 
      width: '280px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      '@media (max-width: 1024px)': {
        display: 'none'
      }
    }}>
      {/* Daily Goals Panel */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1.5),
          boxShadow: theme.shadows[1],
          p: 2
        }}
      >
        <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.palette.text.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>🎯</span>
          <span>Daily Goals</span>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
            <span style={{ color: theme.palette.text.secondary }}>⭐ XP</span>
            <span style={{ fontWeight: 600, color: theme.palette.text.primary }}>{dailyGoals?.currentXp}/{dailyGoals?.targetXp}</span>
          </Box>
          <Box sx={{ 
            width: '100%', 
            height: '8px', 
            background: theme.palette.grey[200], 
            borderRadius: theme.spacing(0.5), 
            overflow: 'hidden' 
          }}>
            <Box sx={{ 
              height: '100%', 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`, 
              width: `${(dailyGoals?.currentXp / dailyGoals?.targetXp) * 100}%`,
              transition: 'width 1s ease-out'
            }} />
          </Box>
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
            <span style={{ color: theme.palette.text.secondary }}>📚 Lessons</span>
            <span style={{ fontWeight: 600, color: theme.palette.text.primary }}>{dailyGoals?.currentLessons}/{dailyGoals?.targetLessons}</span>
          </Box>
          <Box sx={{ 
            width: '100%', 
            height: '8px', 
            background: theme.palette.grey[200], 
            borderRadius: theme.spacing(0.5), 
            overflow: 'hidden' 
          }}>
            <Box sx={{ 
              height: '100%', 
              background: `linear-gradient(90deg, ${beginnerColors.main}, ${beginnerColors.light})`, 
              width: `${(dailyGoals?.currentLessons / dailyGoals?.targetLessons) * 100}%`,
              transition: 'width 1s ease-out'
            }} />
          </Box>
        </Box>
      </Box>

      {/* Leaderboard Panel */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1.5),
          boxShadow: theme.shadows[1],
          p: 2
        }}
      >
        <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: theme.palette.text.primary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>🏆</span>
          <span>Weekly Leaderboard</span>
        </Box>
        
        {leaderboard?.slice(0, 5).map((entry: any, index: number) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            py: 0.75,
            borderBottom: index < 4 ? `1px solid ${theme.palette.divider}` : 'none'
          }}>
            <Box sx={{ width: '20px', fontSize: '0.875rem' }}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
            </Box>
            <Box sx={{ flex: 1, fontWeight: entry.isYou ? 600 : 500, color: entry.isYou ? theme.palette.primary.main : theme.palette.text.primary }}>
              {entry.name}
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
              {entry.xp} XP
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Dashboard Template Component
const DashboardTemplate = ({ 
  userName = 'Sarah',
  progressPercentage = 75,
  currentStreak = 7,
  lessons = [],
  showSidebar = true,
  variant = 'default',
  dailyGoals,
  leaderboard,
  userStats,
  ...props 
}: {
  userName?: string;
  progressPercentage?: number;
  currentStreak?: number;
  lessons?: any[];
  showSidebar?: boolean;
  variant?: 'default' | 'mobile' | 'tablet';
  dailyGoals?: any;
  leaderboard?: any[];
  userStats?: any;
}) => {
  const defaultLessons = [
    {
      icon: '👋',
      title: 'French Greetings',
      description: 'Master common French greetings',
      difficulty: 'beginner',
      progress: 0,
      estimatedTime: 15,
      xpReward: 50
    },
    {
      icon: '📅',
      title: 'Past Tense',
      description: 'Learn past tense usage',
      difficulty: 'intermediate',
      progress: 75,
      estimatedTime: 25,
      xpReward: 75
    },
    {
      icon: '💬',
      title: 'Conversation',
      description: 'Practice real conversations',
      difficulty: 'intermediate',
      progress: 100,
      estimatedTime: 20,
      xpReward: 60
    },
    {
      icon: '🤔',
      title: 'Subjunctive',
      description: 'Advanced grammar concepts',
      difficulty: 'advanced',
      progress: 0,
      estimatedTime: 45,
      xpReward: 100
    }
  ];

  const lessonData = lessons.length > 0 ? lessons : defaultLessons;
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        minHeight: '100vh',
        p: { xs: 2, sm: 3 }
      }}
      {...props}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'start' }}>
          {/* Main Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Section */}
            <EnhancedHeader
              userName={userName}
              progressPercentage={progressPercentage}
              currentStreak={currentStreak}
              dailyGoals={dailyGoals}
              userStats={userStats}
              variant={variant === 'mobile' ? 'compact' : 'default'}
            />

            {/* Lessons Section */}
            <Box>
            <Box sx={{ 
              fontSize: '1.875rem', 
              fontWeight: 600, 
              color: theme.palette.text.primary, 
              mb: 3,
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              Today's Lessons
            </Box>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: variant === 'mobile' 
                  ? '1fr' 
                  : variant === 'tablet' 
                    ? 'repeat(2, 1fr)'
                    : showSidebar 
                      ? 'repeat(2, 1fr)'
                      : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 2
              }}>
                {lessonData.map((lesson, index) => (
                  <LessonCard key={index} {...lesson} />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Sidebar */}
          {showSidebar && variant !== 'mobile' && variant !== 'tablet' && (
            <GamificationSidebar 
              dailyGoals={dailyGoals}
              leaderboard={leaderboard}
              userStats={userStats}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

const meta: Meta<typeof DashboardTemplate> = {
  title: 'Templates/DashboardTemplate',
  component: DashboardTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard template that combines organisms (header, lesson grids, sidebar) to create complete page layouts for the French learning platform. Based on the design mockups structure.',
      },
    },
  },
  argTypes: {
    userName: {
      control: 'text',
      description: 'User name for personalized experience',
    },
    progressPercentage: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Overall learning progress percentage',
    },
    currentStreak: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current learning streak in days',
    },
    showSidebar: {
      control: 'boolean',
      description: 'Show gamification sidebar (desktop only)',
    },
    variant: {
      control: 'select',
      options: ['default', 'mobile', 'tablet'],
      description: 'Template variant for different viewports',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default Dashboard
export const Default: Story = {
  args: {
    userName: 'Sarah',
    progressPercentage: 75,
    currentStreak: 7,
    showSidebar: true,
    dailyGoals: {
      currentXp: 150,
      targetXp: 200,
      currentLessons: 2,
      targetLessons: 3
    },
    leaderboard: [
      { name: 'Marie L.', xp: 420, isYou: false },
      { name: 'You', xp: 380, isYou: true },
      { name: 'Thomas K.', xp: 360, isYou: false },
      { name: 'Sophie M.', xp: 320, isYou: false },
      { name: 'Alex R.', xp: 290, isYou: false }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dashboard template with sidebar and all gamification elements.',
      },
    },
  },
};

// New User Dashboard
export const NewUser: Story = {
  args: {
    userName: undefined,
    progressPercentage: 0,
    currentStreak: 0,
    showSidebar: true,
    dailyGoals: {
      currentXp: 0,
      targetXp: 200,
      currentLessons: 0,
      targetLessons: 3
    },
    lessons: [
      {
        icon: '🌟',
        title: 'Welcome to French!',
        description: 'Your first French lesson',
        difficulty: 'beginner',
        progress: 0,
        estimatedTime: 10,
        xpReward: 25
      },
      {
        icon: '👋',
        title: 'Basic Greetings',
        description: 'Learn to say hello',
        difficulty: 'beginner',
        progress: 0,
        estimatedTime: 15,
        xpReward: 50
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for a new user just starting their learning journey.',
      },
    },
  },
};

// Mobile Layout
export const Mobile: Story = {
  args: {
    userName: 'Alex',
    progressPercentage: 60,
    currentStreak: 3,
    showSidebar: false,
    variant: 'mobile',
    dailyGoals: {
      currentXp: 120,
      targetXp: 200,
      currentLessons: 1,
      targetLessons: 3
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized dashboard template without sidebar.',
      },
    },
  },
};

// Tablet Layout
export const Tablet: Story = {
  args: {
    userName: 'Emma',
    progressPercentage: 85,
    currentStreak: 12,
    showSidebar: false,
    variant: 'tablet',
    dailyGoals: {
      currentXp: 170,
      targetXp: 200,
      currentLessons: 2,
      targetLessons: 3
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet-optimized dashboard template with adjusted grid layout.',
      },
    },
  },
};

// Without Sidebar
export const WithoutSidebar: Story = {
  args: {
    userName: 'Lucas',
    progressPercentage: 90,
    currentStreak: 15,
    showSidebar: false,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard template without sidebar, showing expanded lesson grid.',
      },
    },
  },
};

// High Achiever Dashboard
export const HighAchiever: Story = {
  args: {
    userName: 'Marie',
    progressPercentage: 100,
    currentStreak: 30,
    showSidebar: true,
    dailyGoals: {
      currentXp: 200,
      targetXp: 200,
      currentLessons: 3,
      targetLessons: 3
    },
    leaderboard: [
      { name: 'You', xp: 520, isYou: true },
      { name: 'Thomas K.', xp: 480, isYou: false },
      { name: 'Sophie M.', xp: 460, isYou: false },
      { name: 'Alex R.', xp: 420, isYou: false },
      { name: 'Lucas P.', xp: 390, isYou: false }
    ],
    lessons: [
      {
        icon: '🎓',
        title: 'Advanced Grammar',
        description: 'Complex French structures',
        difficulty: 'advanced',
        progress: 85,
        estimatedTime: 45,
        xpReward: 150
      },
      {
        icon: '📚',
        title: 'Literature Review',
        description: 'French literary works',
        difficulty: 'advanced',
        progress: 60,
        estimatedTime: 60,
        xpReward: 200
      },
      {
        icon: '💼',
        title: 'Business French',
        description: 'Professional vocabulary',
        difficulty: 'advanced',
        progress: 40,
        estimatedTime: 40,
        xpReward: 125
      },
      {
        icon: '🎭',
        title: 'Cultural Studies',
        description: 'French culture and history',
        difficulty: 'intermediate',
        progress: 100,
        estimatedTime: 30,
        xpReward: 100
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard for a high-achieving learner with completed goals and advanced lessons.',
      },
    },
  },
};

// Responsive Demo
export const ResponsiveDemo: Story = {
  render: () => {
    const theme = useTheme();
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Box sx={{ textAlign: 'center', mb: 2, fontSize: '1.25rem', fontWeight: 600, color: theme.palette.text.secondary }}>
            Desktop View (with sidebar)
          </Box>
          <Box sx={{ transform: 'scale(0.7)', transformOrigin: 'center top' }}>
            <DashboardTemplate
              userName="Sarah"
              progressPercentage={75}
              currentStreak={7}
              showSidebar={true}
              dailyGoals={{
                currentXp: 150,
                targetXp: 200,
                currentLessons: 2,
                targetLessons: 3
              }}
            />
          </Box>
        </Box>
        
        <Box>
          <Box sx={{ textAlign: 'center', mb: 2, fontSize: '1.25rem', fontWeight: 600, color: theme.palette.text.secondary }}>
            Tablet View (no sidebar)
          </Box>
          <Box sx={{ transform: 'scale(0.7)', transformOrigin: 'center top' }}>
            <DashboardTemplate
              userName="Sarah"
              progressPercentage={75}
              currentStreak={7}
              showSidebar={false}
              variant="tablet"
            />
          </Box>
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive demonstration showing different viewport layouts.',
      },
    },
  },
};
