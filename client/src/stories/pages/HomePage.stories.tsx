import type { Meta, StoryObj } from '@storybook/react';
import { Box, Container, Typography } from '@mui/material';
import React from 'react';

// Mock function for onClick handlers
const fn = () => () => {};

// Complete Page Component based on design mockups
const HomePageComponent = ({ 
  user = { name: 'Sarah', level: 'A2' },
  userProgress = { overall: 75, weeklyXp: 380, streak: 7 },
  dailyGoals = { currentXp: 150, targetXp: 200, currentLessons: 2, targetLessons: 3, currentMinutes: 45, targetMinutes: 60 },
  lessons = [],
  leaderboard = [],
  quickActions = [],
  showGamification = true,
  variant = 'default',
  ...props 
}: {
  user?: { name: string; level: string };
  userProgress?: { overall: number; weeklyXp: number; streak: number };
  dailyGoals?: { currentXp: number; targetXp: number; currentLessons: number; targetLessons: number; currentMinutes: number; targetMinutes: number };
  lessons?: any[];
  leaderboard?: any[];
  quickActions?: any[];
  showGamification?: boolean;
  variant?: 'default' | 'new-user' | 'high-achiever' | 'mobile';
}) => {
  // Default data based on design mockups
  const defaultLessons = [
    {
      id: 'greetings',
      icon: '👋',
      title: 'French Greetings',
      description: 'Master common French greetings and introductions',
      difficulty: 'beginner',
      progress: 0,
      estimatedTime: 15,
      xpReward: 50,
      category: 'vocabulary',
      status: 'not_started'
    },
    {
      id: 'past-tense',
      icon: '📅',
      title: 'Past Tense Mastery',
      description: 'Learn passé composé and imparfait usage',
      difficulty: 'intermediate',
      progress: 75,
      estimatedTime: 25,
      xpReward: 75,
      category: 'grammar',
      status: 'in_progress'
    },
    {
      id: 'conversation',
      icon: '💬',
      title: 'Conversation Practice',
      description: 'Real-world French conversation scenarios',
      difficulty: 'intermediate',
      progress: 100,
      estimatedTime: 20,
      xpReward: 60,
      category: 'speaking',
      status: 'completed'
    },
    {
      id: 'subjunctive',
      icon: '🤔',
      title: 'Subjunctive Practice',
      description: 'Master the French subjunctive mood',
      difficulty: 'advanced',
      progress: 0,
      estimatedTime: 30,
      xpReward: 100,
      category: 'grammar',
      status: 'not_started'
    }
  ];

  const defaultLeaderboard = [
    { rank: 1, name: 'Marie L.', xp: 420, isYou: false, isFriend: true },
    { rank: 2, name: 'You', xp: userProgress.weeklyXp, isYou: true, isFriend: false },
    { rank: 3, name: 'Thomas K.', xp: 360, isYou: false, isFriend: false },
    { rank: 4, name: 'Sophie M.', xp: 320, isYou: false, isFriend: true },
    { rank: 5, name: 'Alex R.', xp: 290, isYou: false, isFriend: false }
  ];

  const defaultQuickActions = [
    { id: 'practice', icon: '🎧', title: 'Practice Listening', description: 'Audio exercises' },
    { id: 'conversation', icon: '💬', title: 'Start Conversation', description: 'Chat practice' },
    { id: 'review', icon: '📖', title: 'Review Vocab', description: 'Flashcards' },
    { id: 'quiz', icon: '🎯', title: 'Take Quiz', description: 'Test knowledge' }
  ];

  const lessonData = lessons.length > 0 ? lessons : defaultLessons;
  const leaderboardData = leaderboard.length > 0 ? leaderboard : defaultLeaderboard;
  const actionsData = quickActions.length > 0 ? quickActions : defaultQuickActions;

  return (
    <Box
      sx={{
        background: '#f9fafb',
        minHeight: '100vh',
        pb: 8 // Space for bottom navigation
      }}
      {...props}
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          alignItems: 'start',
          flexDirection: { xs: 'column', lg: showGamification ? 'row' : 'column' }
        }}>
          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Enhanced Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: 3,
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '160px',
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
              {/* Daily Goals Badge */}
              {showGamification && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  🎯 {dailyGoals.currentLessons}/{dailyGoals.targetLessons} lessons
                </Box>
              )}

              {/* Streak Counter */}
              {userProgress.streak > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 80,
                    zIndex: 2,
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    color: '#92400e',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  🔥 {userProgress.streak} day streak
                </Box>
              )}

              {/* Content */}
              <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Box>
                  <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 700, mb: 1 }}>
                    Bonjour {user.name}! 🇫🇷
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', opacity: 0.9 }}>
                    {userProgress.streak >= 7 ? "You're doing great! Keep it up today." : "Ready for your French lesson today?"}
                  </Typography>
                </Box>
                
                {/* Progress Ring */}
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="30" cy="30" r="26" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="4" fill="none" />
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="26" 
                      stroke="white" 
                      strokeWidth="4" 
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="163.3"
                      strokeDashoffset={163.3 - (userProgress.overall / 100) * 163.3}
                      style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                    />
                  </svg>
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {userProgress.overall}%
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Today's Lessons Section */}
            <Box
              sx={{
                background: 'white',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="h2" sx={{ fontSize: '1.875rem', fontWeight: 600, color: '#1f2937', mb: 3 }}>
                Today's Lessons
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: variant === 'mobile' 
                  ? '1fr' 
                  : showGamification 
                    ? 'repeat(auto-fit, minmax(280px, 1fr))'
                    : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 2
              }}>
                {lessonData.map((lesson, index) => (
                  <Box
                    key={lesson.id || index}
                    sx={{
                      background: lesson.status === 'completed' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(255, 255, 255, 0.15))' : '#ffffff',
                      border: lesson.status === 'completed' ? '1px solid #10b981' : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                      p: 2.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minHeight: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
                      },
                    }}
                  >
                    {/* Lesson Card Content */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ fontSize: '1.75rem' }}>{lesson.icon}</Box>
                        <Box sx={{
                          background: lesson.difficulty === 'beginner' ? '#d1fae5' : lesson.difficulty === 'intermediate' ? '#dbeafe' : '#fed7aa',
                          color: lesson.difficulty === 'beginner' ? '#047857' : lesson.difficulty === 'intermediate' ? '#1e40af' : '#c2410c',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {lesson.difficulty === 'beginner' ? 'Beginner' : lesson.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </Box>
                      </Box>
                      
                      {/* Progress Ring */}
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="20" cy="20" r="16" stroke="#f3f4f6" strokeWidth="3" fill="none" />
                          <circle 
                            cx="20" 
                            cy="20" 
                            r="16" 
                            stroke={lesson.status === 'completed' ? '#10b981' : '#3b82f6'}
                            strokeWidth="3" 
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="100.5"
                            strokeDashoffset={100.5 - (lesson.progress / 100) * 100.5}
                            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                          />
                        </svg>
                        {lesson.progress > 0 && (
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#374151'
                          }}>
                            {lesson.progress}%
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                      {lesson.title}
                    </Typography>
                    
                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', mb: 'auto', flexGrow: 1 }}>
                      {lesson.description}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 2,
                      pt: 1,
                      borderTop: '1px solid #f3f4f6'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ fontSize: '0.75rem' }}>⏱️</span>
                        <Box sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          {lesson.estimatedTime}min
                        </Box>
                      </Box>
                      
                      <Box sx={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        ⭐ {lesson.xpReward} XP
                      </Box>
                    </Box>

                    {/* Completion Indicator */}
                    {lesson.status === 'completed' && (
                      <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                      }}>
                        ✓
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Gamification Sidebar (Desktop Only) */}
          {showGamification && variant !== 'mobile' && (
            <Box sx={{ 
              width: { lg: '280px' },
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column', 
              gap: 2
            }}>
              {/* Daily Goals Panel */}
              <Box
                sx={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  p: 2
                }}
              >
                <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🎯</span>
                  <span>Daily Goals</span>
                </Box>
                
                {/* XP Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>⭐ XP</span>
                    <span style={{ fontWeight: 600 }}>{dailyGoals.currentXp}/{dailyGoals.targetXp}</span>
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#f3f4f6', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <Box sx={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', 
                      width: `${(dailyGoals.currentXp / dailyGoals.targetXp) * 100}%`,
                      transition: 'width 1s ease-out'
                    }} />
                  </Box>
                </Box>
                
                {/* Lessons Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>📚 Lessons</span>
                    <span style={{ fontWeight: 600 }}>{dailyGoals.currentLessons}/{dailyGoals.targetLessons}</span>
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#f3f4f6', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <Box sx={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #10b981, #34d399)', 
                      width: `${(dailyGoals.currentLessons / dailyGoals.targetLessons) * 100}%`,
                      transition: 'width 1s ease-out'
                    }} />
                  </Box>
                </Box>

                {/* Time Progress */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>⏱️ Time</span>
                    <span style={{ fontWeight: 600 }}>{dailyGoals.currentMinutes}/{dailyGoals.targetMinutes}min</span>
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#f3f4f6', 
                    borderRadius: '4px', 
                    overflow: 'hidden' 
                  }}>
                    <Box sx={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', 
                      width: `${(dailyGoals.currentMinutes / dailyGoals.targetMinutes) * 100}%`,
                      transition: 'width 1s ease-out'
                    }} />
                  </Box>
                </Box>

                {/* Motivational Message */}
                {dailyGoals.currentLessons < dailyGoals.targetLessons && (
                  <Box sx={{
                    mt: 2,
                    p: 1.5,
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#92400e',
                    textAlign: 'center'
                  }}>
                    🌟 Complete {dailyGoals.targetLessons - dailyGoals.currentLessons} more lesson{dailyGoals.targetLessons - dailyGoals.currentLessons === 1 ? '' : 's'}!
                  </Box>
                )}
              </Box>

              {/* Weekly Leaderboard */}
              <Box
                sx={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  p: 2
                }}
              >
                <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🏆</span>
                  <span>Weekly Leaderboard</span>
                </Box>
                
                {leaderboardData.slice(0, 5).map((entry: any, index: number) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    py: 0.75,
                    borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none',
                    background: entry.isYou ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    borderRadius: entry.isYou ? '8px' : '0',
                    px: entry.isYou ? 1 : 0
                  }}>
                    <Box sx={{ width: '20px', fontSize: '0.875rem' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </Box>
                    <Box sx={{ flex: 1, fontWeight: entry.isYou ? 600 : 500, color: entry.isYou ? '#3b82f6' : '#1f2937' }}>
                      {entry.name}
                    </Box>
                    <Box sx={{ fontSize: '0.75rem', color: '#6b7280', mr: entry.isFriend ? 0.5 : 0 }}>
                      {entry.xp} XP
                    </Box>
                    {entry.isFriend && (
                      <Box sx={{ fontSize: '0.75rem', opacity: 0.7 }}>👥</Box>
                    )}
                  </Box>
                ))}

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Box sx={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#3b82f6',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#f1f5f9'
                    }
                  }}>
                    View All →
                  </Box>
                </Box>
              </Box>

              {/* Quick Actions Panel */}
              <Box
                sx={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  p: 2
                }}
              >
                <Box sx={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>📊</span>
                  <span>Quick Actions</span>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {actionsData.map((action, index) => (
                    <Box
                      key={action.id || index}
                      sx={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        p: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: '#f1f5f9',
                          borderColor: '#3b82f6'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                        <Box>
                          <Box sx={{ fontWeight: 500, color: '#1f2937', fontSize: '0.875rem' }}>
                            {action.title}
                          </Box>
                          <Box sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {action.description}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

const meta: Meta<typeof HomePageComponent> = {
  title: 'Pages/HomePage',
  component: HomePageComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete HomePage implementation that combines all atomic design levels (atoms, molecules, organisms, templates) to create a full dashboard experience for the French learning platform. Based on the comprehensive design mockups.',
      },
    },
  },
  argTypes: {
    user: {
      control: 'object',
      description: 'User information',
    },
    userProgress: {
      control: 'object',
      description: 'User progress data',
    },
    dailyGoals: {
      control: 'object',
      description: 'Daily learning goals data',
    },
    showGamification: {
      control: 'boolean',
      description: 'Show gamification sidebar',
    },
    variant: {
      control: 'select',
      options: ['default', 'new-user', 'high-achiever', 'mobile'],
      description: 'Page variant for different user states',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Complete Dashboard Experience
export const Default: Story = {
  args: {
    user: { name: 'Sarah', level: 'A2' },
    userProgress: { overall: 75, weeklyXp: 380, streak: 7 },
    showGamification: true,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete default dashboard experience with all features.',
      },
    },
  },
};

// New User Experience
export const NewUser: Story = {
  args: {
    user: { name: '', level: 'A1' },
    userProgress: { overall: 0, weeklyXp: 0, streak: 0 },
    dailyGoals: { currentXp: 0, targetXp: 200, currentLessons: 0, targetLessons: 3, currentMinutes: 0, targetMinutes: 60 },
    showGamification: true,
    variant: 'new-user',
    lessons: [
      {
        id: 'welcome',
        icon: '🌟',
        title: 'Welcome to French!',
        description: 'Your very first French lesson',
        difficulty: 'beginner',
        progress: 0,
        estimatedTime: 10,
        xpReward: 25,
        status: 'not_started'
      },
      {
        id: 'alphabet',
        icon: '🔤',
        title: 'French Alphabet',
        description: 'Learn French pronunciation',
        difficulty: 'beginner',
        progress: 0,
        estimatedTime: 15,
        xpReward: 30,
        status: 'not_started'
      }
    ],
    leaderboard: [
      { rank: 1, name: 'Welcome!', xp: 0, isYou: true, isFriend: false }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard experience for a completely new user.',
      },
    },
  },
};

// High Achiever Experience
export const HighAchiever: Story = {
  args: {
    user: { name: 'Marie', level: 'B2' },
    userProgress: { overall: 95, weeklyXp: 520, streak: 30 },
    dailyGoals: { currentXp: 200, targetXp: 200, currentLessons: 3, targetLessons: 3, currentMinutes: 60, targetMinutes: 60 },
    showGamification: true,
    variant: 'high-achiever',
    lessons: [
      {
        id: 'advanced-grammar',
        icon: '🎓',
        title: 'Advanced Grammar',
        description: 'Complex French grammatical structures',
        difficulty: 'advanced',
        progress: 85,
        estimatedTime: 45,
        xpReward: 150,
        status: 'in_progress'
      },
      {
        id: 'literature',
        icon: '📚',
        title: 'French Literature',
        description: 'Analyze classic French texts',
        difficulty: 'advanced',
        progress: 100,
        estimatedTime: 60,
        xpReward: 200,
        status: 'completed'
      }
    ],
    leaderboard: [
      { rank: 1, name: 'You', xp: 520, isYou: true, isFriend: false },
      { rank: 2, name: 'Thomas K.', xp: 480, isYou: false, isFriend: false },
      { rank: 3, name: 'Sophie M.', xp: 460, isYou: false, isFriend: true },
      { rank: 4, name: 'Alex R.', xp: 420, isYou: false, isFriend: false },
      { rank: 5, name: 'Lucas P.', xp: 390, isYou: false, isFriend: false }
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

// Mobile Experience
export const Mobile: Story = {
  args: {
    user: { name: 'Alex', level: 'A2' },
    userProgress: { overall: 60, weeklyXp: 290, streak: 3 },
    dailyGoals: { currentXp: 120, targetXp: 200, currentLessons: 1, targetLessons: 3, currentMinutes: 30, targetMinutes: 60 },
    showGamification: false,
    variant: 'mobile'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile-optimized dashboard without sidebar.',
      },
    },
  },
};

// Without Gamification
export const WithoutGamification: Story = {
  args: {
    user: { name: 'Emma', level: 'A2' },
    userProgress: { overall: 65, weeklyXp: 310, streak: 5 },
    showGamification: false,
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'Clean dashboard focused purely on learning content without gamification elements.',
      },
    },
  },
};

// Learning Path Focus
export const LearningPathFocus: Story = {
  args: {
    user: { name: 'Lucas', level: 'A2' },
    userProgress: { overall: 80, weeklyXp: 450, streak: 12 },
    showGamification: true,
    lessons: [
      {
        id: 'path-travel-1',
        icon: '✈️',
        title: 'At the Airport',
        description: 'Essential airport vocabulary and phrases',
        difficulty: 'intermediate',
        progress: 100,
        estimatedTime: 20,
        xpReward: 75,
        status: 'completed'
      },
      {
        id: 'path-travel-2',
        icon: '🏨',
        title: 'Hotel Check-in',
        description: 'Hotel reservation and check-in conversations',
        difficulty: 'intermediate',
        progress: 60,
        estimatedTime: 25,
        xpReward: 80,
        status: 'in_progress'
      },
      {
        id: 'path-travel-3',
        icon: '🍽️',
        title: 'Restaurant Dining',
        description: 'Order food and drinks in French',
        difficulty: 'intermediate',
        progress: 0,
        estimatedTime: 30,
        xpReward: 90,
        status: 'not_started'
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard focused on a specific learning path (Travel French).',
      },
    },
  },
};

// Comparison: Before and After Design
export const DesignComparison: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, color: '#6b7280' }}>
          Modern Enhanced Design (Based on Mockups)
        </Typography>
        <Box sx={{ transform: 'scale(0.8)', transformOrigin: 'center top' }}>
          <HomePageComponent
            user={{ name: 'Sarah', level: 'A2' }}
            userProgress={{ overall: 75, weeklyXp: 380, streak: 7 }}
            showGamification={true}
          />
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, color: '#6b7280' }}>
          Simplified Version (No Gamification)
        </Typography>
        <Box sx={{ transform: 'scale(0.8)', transformOrigin: 'center top' }}>
          <HomePageComponent
            user={{ name: 'Sarah', level: 'A2' }}
            userProgress={{ overall: 75, weeklyXp: 380, streak: 7 }}
            showGamification={false}
          />
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of enhanced vs simplified dashboard designs.',
      },
    },
  },
};
