# Phase 4: Lesson Card System & AI Curation

**Phase**: 4 of 5  
**Priority**: CRITICAL - Core UI Transformation  
**Estimated Duration**: 5-6 days  
**Dependencies**: Phase 1-3 completed (Database, Gamification, OAuth)  
**Deliverable**: Complete lesson card dashboard with AI-powered personalization and modern UX

## Overview

Transform the existing AI dashboard into a structured lesson card system inspired by your mockup dashboard, where AI enhances and curates existing content rather than generating everything dynamically. This phase delivers the primary user-facing transformation with modern lesson cards, progress visualization, and intelligent AI personalization.

## Design Specifications

### Lesson Card Design System
Based on your mockup at https://calm-sound-3361.21st.app/:

**Card Layout Specifications:**
- **Card Dimensions**: 16:9 aspect ratio, 320px wide (mobile), 280px (tablet+)
- **Border Radius**: 20px for modern appearance
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.1)` with hover elevation to `0 8px 20px rgba(0, 0, 0, 0.15)`
- **Spacing**: 16px padding internal, 12px gap between cards
- **Typography**: Title (18px, 600 weight), Description (14px, 400 weight), Metadata (12px, 500 weight)

**Progress Indicators:**
- **Progress Bar**: Height 6px, rounded corners, gradient fill based on completion percentage
- **Circular Progress**: 48px diameter for overall course progress
- **Status Badges**: 
  - Available: Green background `#4caf50`
  - In Progress: Orange background `#ff9800` 
  - Completed: Blue background `#2196f3`
  - Locked: Gray background `#9e9e9e`

**Visual Hierarchy:**
- **Lesson Title**: Most prominent, French Blue (`#667eea`)
- **Duration & Level**: Secondary metadata in capsule badges
- **AI Personalization**: Subtle recommendation text in accent color
- **Progress**: Visual progress bar with percentage
- **Action Button**: Primary CTA matching lesson status

### Grid Layout System
- **Mobile (< 768px)**: 2 columns, 8px gap
- **Tablet (768px-1024px)**: 3 columns, 12px gap  
- **Desktop (> 1024px)**: 4 columns, 16px gap
- **Responsive Breakpoints**: Use CSS Grid with `auto-fit` and `minmax(280px, 1fr)`

### Animation Specifications
- **Card Entry**: Staggered animation, 150ms delay between cards
- **Hover Effects**: Scale (1.02) + shadow elevation over 200ms
- **Progress Updates**: Smooth fill animation over 800ms
- **Status Changes**: Color transition over 300ms
- **Loading States**: Skeleton cards with shimmer effect

## Detailed Changes Required

### 1. Core Dashboard Transformation (MODIFY EXISTING)

**File**: `client/src/pages/HomePage.tsx`
**Changes**: Complete transformation from AI dashboard to lesson card grid

```typescript
/**
 * Enhanced HomePage - Lesson Card Dashboard
 * 
 * Transformed from AI content generation to structured lesson card system
 * with AI-powered personalization and gamification integration.
 * 
 * Key Features:
 * - Lesson card grid with AI personalization
 * - Progress visualization and gamification
 * - Daily goals and achievement tracking
 * - Social features integration
 * 
 * @version 3.0.0 - Major Dashboard Transformation
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Grid, Skeleton } from '@mui/material';
import { AIDashboardLayout, AIEnhancedHeader } from '../components/ai-dashboard/AIDashboardLayout.js';
import { LessonCard } from '../components/dashboard/LessonCard.js';
import { ProgressRing } from '../components/dashboard/ProgressRing.js';
import { DailyGoalsPanel } from '../components/dashboard/DailyGoalsPanel.js';
import { LeaderboardWidget } from '../components/dashboard/LeaderboardWidget.js';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid.js';
import { useLearningPath } from '../hooks/useLearningPath.js';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';

interface LessonCard {
  id: number;
  title: string;
  description: string;
  type: string;
  estimatedTime: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number; // 0-100
  score?: number;
  level: string; // A1, A2, etc.
  orderIndex: number;
  aiPersonalization: {
    difficultyAdjustment: 'easier' | 'normal' | 'harder';
    focusAreas: string[];
    estimatedTime: number;
    recommendationReason: string;
    userSkillMatch: number; // 0-1
  };
  thumbnailUrl?: string;
  tags: string[];
}

interface DashboardData {
  lessonCards: LessonCard[];
  dailyGoal: any;
  socialStats: any;
  recentBadges: any[];
  leaderboard: any[];
  overallProgress: {
    currentLevel: string;
    progressPercentage: number;
    totalXp: number;
    weeklyXp: number;
    currentStreak: number;
  };
}

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load dashboard data with AI personalization
   * Fetches lesson cards with AI curation, progress data, and social features
   */
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Parallel data loading for optimal performance
      const [
        lessonCardsResponse,
        dailyGoalResponse,
        socialStatsResponse,
        badgesResponse,
        leaderboardResponse,
        progressResponse
      ] = await Promise.all([
        api.get('/api/learning/lessons/personalized'), // AI-curated lesson cards
        api.get('/api/gamification/goals/today'),
        api.get('/api/social/stats'),
        api.get('/api/gamification/badges?limit=3&sortBy=unlocked_at'),
        api.get('/api/social/leaderboard?limit=10'),
        api.get('/api/users/progress')
      ]);

      setDashboardData({
        lessonCards: lessonCardsResponse.data.lessons || [],
        dailyGoal: dailyGoalResponse.data.goal,
        socialStats: socialStatsResponse.data.stats,
        recentBadges: badgesResponse.data.badges || [],
        leaderboard: leaderboardResponse.data.leaderboard || [],
        overallProgress: {
          currentLevel: progressResponse.data.currentLevel || 'A1',
          progressPercentage: calculateOverallProgress(progressResponse.data),
          totalXp: progressResponse.data.totalXp || 0,
          weeklyXp: progressResponse.data.weeklyXp || 0,
          currentStreak: progressResponse.data.streakDays || 0
        }
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  /**
   * Handle lesson card click - navigate to lesson with analytics
   */
  const handleLessonClick = useCallback(async (lessonId: number, lessonTitle: string) => {
    try {
      // Track lesson start analytics
      await api.post('/api/analytics/lesson-started', {
        lessonId,
        source: 'dashboard',
        aiPersonalized: true
      });
      
      // Navigate to lesson page
      window.location.href = `/lesson/${lessonId}`;
      
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  }, []);

  /**
   * Handle quick action click
   */
  const handleQuickAction = useCallback(async (actionType: string) => {
    console.log(`Quick action triggered: ${actionType}`);
    // Handle different action types
    switch (actionType) {
      case 'daily_review':
        window.location.href = '/practice/review';
        break;
      case 'voice_practice':
        window.location.href = '/practice/speaking';
        break;
      case 'grammar_quiz':
        window.location.href = '/practice/grammar';
        break;
      case 'ai_chat':
        // Keep existing AI chat functionality
        console.log('AI Chat functionality preserved');
        break;
    }
  }, []);

  /**
   * Calculate overall progress percentage based on lesson completion
   */
  const calculateOverallProgress = (progressData: any): number => {
    if (!progressData || !dashboardData?.lessonCards) return 0;
    
    const totalLessons = dashboardData.lessonCards.length;
    const completedLessons = dashboardData.lessonCards.filter(
      lesson => lesson.status === 'completed'
    ).length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (loading) {
    return (
      <AIDashboardLayout>
        <DashboardSkeleton />
      </AIDashboardLayout>
    );
  }

  if (error) {
    return (
      <AIDashboardLayout>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </AIDashboardLayout>
    );
  }

  return (
    <AIDashboardLayout>
      {/* Enhanced Header with Progress */}
      <AIEnhancedHeader
        userName={user?.firstName}
        progressPercentage={dashboardData?.overallProgress.progressPercentage || 0}
        currentStreak={dashboardData?.overallProgress.currentStreak || 0}
        weeklyXp={dashboardData?.overallProgress.weeklyXp || 0}
      />

      {/* Daily Goal and Progress Overview */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <DailyGoalsPanel 
            goal={dashboardData?.dailyGoal}
            onGoalUpdate={loadDashboardData}
          />
        </Box>
        <Box sx={{ width: 120 }}>
          <ProgressRing
            progress={dashboardData?.overallProgress.progressPercentage || 0}
            size={120}
            label="Course Progress"
          />
        </Box>
      </Box>

      {/* Quick Actions */}
      <QuickActionsGrid
        onActionClick={handleQuickAction}
        userLevel={dashboardData?.overallProgress.currentLevel || 'A1'}
        sx={{ mb: 3 }}
      />

      {/* Today's Lessons Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: 'text.primary'
          }}
        >
          Today's Lessons
        </Typography>
        
        {dashboardData?.lessonCards?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No lessons available. Check back later for new content!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {dashboardData?.lessonCards?.map((lesson, index) => (
              <Grid item xs={6} sm={4} md={3} key={lesson.id}>
                <LessonCard
                  lesson={lesson}
                  onClick={() => handleLessonClick(lesson.id, lesson.title)}
                  animationDelay={index * 150} // Staggered entrance
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Social Features */}
      <LeaderboardWidget
        leaderboard={dashboardData?.leaderboard || []}
        userRank={dashboardData?.socialStats?.leaderboardRank || 0}
        friendsCount={dashboardData?.socialStats?.friendsCount || 0}
        sx={{ mb: 2 }}
      />
    </AIDashboardLayout>
  );
};

/**
 * Dashboard loading skeleton
 */
const DashboardSkeleton: React.FC = () => (
  <>
    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Skeleton variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 2 }} />
      <Skeleton variant="circular" width={120} height={120} />
    </Box>
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Grid item xs={6} sm={4} md={3} key={i}>
          <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
  </>
);

export default HomePage;
```

### 2. Core Dashboard Components (NEW)

**File**: `client/src/components/dashboard/LessonCard.tsx`
```typescript
/**
 * Enhanced Lesson Card Component
 * 
 * Modern lesson card with AI personalization, progress tracking,
 * and interactive states. Follows your mockup design with enhanced UX.
 * 
 * Features:
 * - AI-powered difficulty adjustments and recommendations
 * - Smooth animations and micro-interactions
 * - Accessibility-compliant design
 * - Progress visualization
 * - Status-based styling
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Badge,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CompletedIcon,
  Lock as LockedIcon,
  School as LevelIcon,
  AccessTime as TimeIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    description: string;
    type: string;
    estimatedTime: number;
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    progress: number; // 0-100
    score?: number;
    level: string;
    aiPersonalization: {
      difficultyAdjustment: 'easier' | 'normal' | 'harder';
      focusAreas: string[];
      estimatedTime: number;
      recommendationReason: string;
      userSkillMatch: number; // 0-1
    };
    thumbnailUrl?: string;
    tags: string[];
  };
  onClick: () => void;
  animationDelay?: number;
}

export const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson, 
  onClick, 
  animationDelay = 0 
}) => {
  /**
   * Get status-based styling
   */
  const getStatusConfig = () => {
    switch (lesson.status) {
      case 'completed':
        return {
          primaryColor: '#2196f3',
          backgroundColor: '#e3f2fd',
          icon: <CompletedIcon />,
          buttonText: 'Review',
          buttonColor: 'primary' as const
        };
      case 'in_progress':
        return {
          primaryColor: '#ff9800',
          backgroundColor: '#fff3e0',
          icon: <PlayIcon />,
          buttonText: 'Continue',
          buttonColor: 'warning' as const
        };
      case 'available':
        return {
          primaryColor: '#4caf50',
          backgroundColor: '#e8f5e8',
          icon: <PlayIcon />,
          buttonText: 'Start',
          buttonColor: 'success' as const
        };
      case 'locked':
        return {
          primaryColor: '#9e9e9e',
          backgroundColor: '#f5f5f5',
          icon: <LockedIcon />,
          buttonText: 'Locked',
          buttonColor: 'inherit' as const
        };
      default:
        return {
          primaryColor: '#667eea',
          backgroundColor: '#f8f9ff',
          icon: <PlayIcon />,
          buttonText: 'Start',
          buttonColor: 'primary' as const
        };
    }
  };

  const statusConfig = getStatusConfig();
  const disabled = lesson.status === 'locked';

  /**
   * Get AI personalization display
   */
  const getAIPersonalizationText = (): string => {
    const { difficultyAdjustment, recommendationReason, userSkillMatch } = lesson.aiPersonalization;
    
    if (userSkillMatch > 0.8) {
      return '🎯 Perfect match for your level';
    } else if (difficultyAdjustment === 'easier') {
      return '📉 Adjusted to be more manageable';
    } else if (difficultyAdjustment === 'harder') {
      return '📈 Extra challenge for faster progress';
    } else if (recommendationReason) {
      return `💡 ${recommendationReason}`;
    }
    
    return '🤖 AI-curated for you';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: animationDelay / 1000,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="glass-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all var(--transition-normal)',
          borderLeft: `4px solid ${statusConfig.primaryColor}`,
          '&:hover': disabled ? {} : {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
          }
        }}
        onClick={disabled ? undefined : onClick}
      >
        {/* Lesson Thumbnail or Type Indicator */}
        <Box
          sx={{
            height: 120,
            background: lesson.thumbnailUrl 
              ? `url(${lesson.thumbnailUrl})` 
              : `linear-gradient(135deg, ${statusConfig.primaryColor}20, ${statusConfig.primaryColor}40)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Status Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: statusConfig.primaryColor,
              color: 'white',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {statusConfig.icon}
          </Box>

          {/* Progress Ring for in-progress lessons */}
          {lesson.status === 'in_progress' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              {lesson.progress}%
            </Box>
          )}
        </Box>

        <CardContent sx={{ flex: 1, p: 2 }}>
          {/* Lesson Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              color: statusConfig.primaryColor,
              fontSize: '1.125rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {lesson.title}
          </Typography>

          {/* Metadata Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={`${lesson.estimatedTime} min`}
              icon={<TimeIcon />}
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={lesson.level}
              icon={<LevelIcon />}
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={lesson.type}
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>

          {/* AI Personalization */}
          <Tooltip title={lesson.aiPersonalization.recommendationReason} arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 2,
                p: 1,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: 1,
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              <AIIcon sx={{ fontSize: 16, color: '#667eea' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#667eea',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              >
                {getAIPersonalizationText()}
              </Typography>
            </Box>
          </Tooltip>

          {/* Progress Bar */}
          {lesson.status !== 'locked' && lesson.status !== 'available' && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={lesson.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${statusConfig.primaryColor}, ${statusConfig.primaryColor}dd)`
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {lesson.progress}%
                </Typography>
              </Box>
            </Box>
          )}

          {/* Action Button */}
          <Button
            fullWidth
            variant={lesson.status === 'completed' ? 'outlined' : 'contained'}
            color={statusConfig.buttonColor}
            disabled={disabled}
            startIcon={statusConfig.icon}
            sx={{
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            {statusConfig.buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
```

**File**: `client/src/components/dashboard/ProgressRing.tsx`
```typescript
/**
 * Animated Progress Ring Component
 * 
 * Circular progress indicator with smooth animations and customizable styling.
 * Used for overall course progress, daily goals, and achievement progress.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  label,
  showPercentage = true,
  color = '#667eea',
  backgroundColor = '#e0e0e0',
  animated = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animated ? strokeDasharray : strokeDashoffset}
            animate={animated ? { strokeDashoffset } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>

        {/* Center Content */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {showPercentage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: color,
                  fontSize: size > 100 ? '1.25rem' : '1rem'
                }}
              >
                {Math.round(progress)}%
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* Label */}
      {label && (
        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.75rem'
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};
```

**File**: `client/src/components/dashboard/DailyGoalsPanel.tsx`
```typescript
/**
 * Daily Goals Panel Component
 * 
 * Displays user's daily learning goals with real-time progress tracking.
 * Includes XP, lessons, and time targets with celebration effects.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Edit as EditIcon,
  Celebration as CelebrationIcon
} from '@mui/icons-material';
import { ProgressRing } from './ProgressRing.js';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyGoal {
  id: string;
  targetXp: number;
  targetLessons: number;
  targetMinutes: number;
  currentXp: number;
  currentLessons: number;
  currentMinutes: number;
  completed: boolean;
  completedAt?: string;
}

interface DailyGoalsPanelProps {
  goal: DailyGoal | null;
  onGoalUpdate: () => void;
}

export const DailyGoalsPanel: React.FC<DailyGoalsPanelProps> = ({
  goal,
  onGoalUpdate
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newTargets, setNewTargets] = useState({
    targetXp: goal?.targetXp || 50,
    targetLessons: goal?.targetLessons || 3,
    targetMinutes: goal?.targetMinutes || 20
  });

  // Check for goal completion and show celebration
  useEffect(() => {
    if (goal?.completed && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [goal?.completed, showCelebration]);

  /**
   * Calculate progress percentages
   */
  const progressData = goal ? [
    {
      label: 'XP',
      current: goal.currentXp,
      target: goal.targetXp,
      color: '#667eea',
      progress: Math.min(100, (goal.currentXp / goal.targetXp) * 100)
    },
    {
      label: 'Lessons',
      current: goal.currentLessons,
      target: goal.targetLessons,
      color: '#4caf50',
      progress: Math.min(100, (goal.currentLessons / goal.targetLessons) * 100)
    },
    {
      label: 'Minutes',
      current: goal.currentMinutes,
      target: goal.targetMinutes,
      color: '#ff9800',
      progress: Math.min(100, (goal.currentMinutes / goal.targetMinutes) * 100)
    }
  ] : [];

  const overallProgress = goal ? 
    Math.round((progressData.reduce((sum, p) => sum + p.progress, 0) / progressData.length)) : 0;

  /**
   * Handle goal editing
   */
  const handleSaveGoal = async () => {
    try {
      await fetch('/api/gamification/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTargets)
      });
      
      setEditDialogOpen(false);
      onGoalUpdate();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  if (!goal) {
    return (
      <Card className="glass-card" sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Setting up your daily goals...
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Card 
        className="glass-card"
        sx={{
          background: goal.completed 
            ? 'linear-gradient(135deg, #4caf50, #81c784)'
            : 'var(--glass-bg)',
          color: goal.completed ? 'white' : 'inherit',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10
              }}
            >
              <CelebrationIcon sx={{ fontSize: 32, color: 'white' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Daily Goal
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              sx={{ color: goal.completed ? 'white' : 'text.secondary' }}
            >
              Edit
            </Button>
          </Box>

          {/* Progress Rings */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-around', mb: 2 }}>
            {progressData.map((data, index) => (
              <Box key={data.label} sx={{ textAlign: 'center' }}>
                <ProgressRing
                  progress={data.progress}
                  size={60}
                  color={goal.completed ? 'white' : data.color}
                  backgroundColor={goal.completed ? 'rgba(255,255,255,0.3)' : '#e0e0e0'}
                  showPercentage={false}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
                  {data.current}/{data.target}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {data.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Overall Progress */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {overallProgress}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {goal.completed ? '🎉 Goal Completed!' : 'Daily Progress'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Goal Editing Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Daily Goals</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Target XP"
              type="number"
              value={newTargets.targetXp}
              onChange={(e) => setNewTargets(prev => ({ ...prev, targetXp: parseInt(e.target.value) }))}
              InputProps={{ inputProps: { min: 10, max: 200 } }}
            />
            <TextField
              label="Target Lessons"
              type="number"
              value={newTargets.targetLessons}
              onChange={(e) => setNewTargets(prev => ({ ...prev, targetLessons: parseInt(e.target.value) }))}
              InputProps={{ inputProps: { min: 1, max: 10 } }}
            />
            <TextField
              label="Target Minutes"
              type="number"
              value={newTargets.targetMinutes}
              onChange={(e) => setNewTargets(prev => ({ ...prev, targetMinutes: parseInt(e.target.value) }))}
              InputProps={{ inputProps: { min: 5, max: 120 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
```

**File**: `client/src/components/dashboard/LeaderboardWidget.tsx`
```typescript
/**
 * Leaderboard Widget Component
 * 
 * Displays weekly leaderboard with friend highlighting and social features.
 * Matches your mockup design with enhanced social interaction.
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import {
  People as FriendsIcon,
  EmojiEvents as TrophyIcon,
  Add as AddFriendIcon
} from '@mui/icons-material';

interface LeaderboardEntry {
  id: number;
  userId: number;
  displayName: string;
  profilePictureUrl?: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  rank: number;
  badge?: string;
  isFriend: boolean;
}

interface LeaderboardWidgetProps {
  leaderboard: LeaderboardEntry[];
  userRank: number;
  friendsCount: number;
  sx?: any;
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  leaderboard,
  userRank,
  friendsCount,
  sx
}) => {
  /**
   * Get rank display with appropriate styling
   */
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: '#ffd700' };
    if (rank === 2) return { icon: '🥈', color: '#c0c0c0' };
    if (rank === 3) return { icon: '🥉', color: '#cd7f32' };
    return { icon: rank.toString(), color: 'text.secondary' };
  };

  return (
    <Card className="glass-card" sx={sx}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Weekly Leaderboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<FriendsIcon />}
              label={`${friendsCount} friends`}
              size="small"
              variant="outlined"
            />
            {userRank > 0 && (
              <Chip
                icon={<TrophyIcon />}
                label={`#${userRank}`}
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>

        {/* Leaderboard List */}
        <List dense sx={{ py: 0 }}>
          {leaderboard.slice(0, 5).map((entry) => {
            const rankDisplay = getRankDisplay(entry.rank);
            
            return (
              <ListItem
                key={entry.userId}
                sx={{
                  backgroundColor: entry.isFriend ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                  border: entry.isFriend ? '1px solid rgba(102, 126, 234, 0.2)' : 'none'
                }}
              >
                <ListItemAvatar>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={entry.profilePictureUrl}
                      sx={{ width: 40, height: 40 }}
                    >
                      {entry.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: rankDisplay.color,
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {rankDisplay.icon}
                    </Box>
                  </Box>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {entry.displayName}
                      </Typography>
                      {entry.isFriend && (
                        <Chip label="Friend" size="small" color="primary" sx={{ height: 18 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {entry.weeklyXp} XP this week
                      </Typography>
                      {entry.currentStreak > 0 && (
                        <Typography variant="caption" sx={{ color: '#ff6b35' }}>
                          🔥 {entry.currentStreak}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {/* View More Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2, textTransform: 'none' }}
          onClick={() => window.location.href = '/leaderboard'}
        >
          View Full Leaderboard
        </Button>
      </CardContent>
    </Card>
  );
};
```

### 3. Service Extensions for AI Curation (MODIFY EXISTING)

**File**: `server/src/services/learningPathService.ts`
**Changes**: Add AI curation functions (EXTEND: +100 lines)

```typescript
// ADD TO EXISTING learningPathService.ts - append to end of file

/**
 * Get lesson cards with AI personalization for dashboard
 * 
 * Transforms existing lessons into personalized lesson cards using AI analysis
 * of user performance, preferences, and learning patterns.
 * 
 * @param userId - User identifier
 * @param pathId - Learning path identifier (default: 1)
 * @param maxResults - Maximum number of lessons to return (default: 12)
 * @returns Array of AI-personalized lesson cards
 */
export async function getLessonCardsWithAIPersonalization(
  userId: number,
  pathId: number = 1,
  maxResults: number = 12
): Promise<LessonCard[]> {
  try {
    // Get user's learning path with progress
    const learningPath = await getLearningPathUserView(pathId, userId);
    if (!learningPath) {
      throw new Error(`Learning path ${pathId} not found for user ${userId}`);
    }

    // Get user skill assessment for AI personalization
    const { getSkillAssessmentForCurriculum } = await import('./progressService.js');
    const skillAssessment = await getSkillAssessmentForCurriculum(userId);

    // Extract all lessons from units
    const allLessons: LessonWithUserProgress[] = [];
    learningPath.units.forEach(unit => {
      allLessons.push(...unit.lessons);
    });

    // Prioritize lessons for today's learning
    const prioritizedLessons = await prioritizeLessonsWithAI(allLessons, skillAssessment, maxResults);

    // Add AI personalization to each lesson
    const lessonCards = await Promise.all(
      prioritizedLessons.map(async (lesson) => {
        const aiPersonalization = await generateAIPersonalization(lesson, skillAssessment);
        
        return {
          ...lesson,
          aiPersonalization,
          thumbnailUrl: generateLessonThumbnail(lesson.type, lesson.title),
          tags: extractLessonTags(lesson)
        };
      })
    );

    console.log(`[AI Curation] Generated ${lessonCards.length} personalized lesson cards for user ${userId}`);
    return lessonCards;

  } catch (error) {
    console.error('Error getting personalized lesson cards:', error);
    // Fallback to basic lesson cards without AI personalization
    return getFallbackLessonCards(userId, pathId, maxResults);
  }
}

/**
 * Prioritize lessons using AI analysis
 * 
 * Uses user skill assessment and performance data to determine
 * optimal lesson sequence and difficulty progression.
 */
async function prioritizeLessonsWithAI(
  lessons: LessonWithUserProgress[],
  skillAssessment: SkillAssessment,
  maxResults: number
): Promise<LessonWithUserProgress[]> {
  try {
    // Import AI services
    const { aiServiceFactory } = await import('./ai/index.js');
    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();

    // Prepare lesson data for AI analysis
    const lessonAnalysisData = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      level: 'A2', // Would get from lesson's unit level
      status: lesson.status,
      progress: calculateLessonProgress(lesson),
      estimatedTime: lesson.estimatedTime,
      lastAttempted: lesson.startedAt,
      completedAt: lesson.completedAt,
      score: lesson.score
    }));

    // Use AI to prioritize lessons based on user profile
    const userContext = { 
      id: skillAssessment.userId, 
      firstName: '', 
      role: 'user' as const, 
      preferences: {} 
    };

    const prioritizationResponse = await aiOrchestrator.prioritizeLessons(userContext, {
      lessons: lessonAnalysisData,
      userSkillProfile: {
        level: skillAssessment.overallLevel,
        weakAreas: skillAssessment.weakAreas,
        strongAreas: skillAssessment.strongAreas,
        confidence: skillAssessment.overallConfidence
      },
      maxResults,
      focusMode: 'balanced' // Could be 'weak_areas', 'progression', 'review'
    });

    if (prioritizationResponse.status === 'success') {
      // Reorder lessons based on AI prioritization
      const prioritizedIds = prioritizationResponse.data.prioritizedLessons.map((l: any) => l.id);
      const prioritizedLessons = prioritizedIds
        .map((id: number) => lessons.find(l => l.id === id))
        .filter(Boolean)
        .slice(0, maxResults);

      return prioritizedLessons;
    } else {
      console.warn('AI prioritization failed, using fallback ordering');
      return getFallbackLessonPriority(lessons, skillAssessment, maxResults);
    }

  } catch (error) {
    console.error('Error prioritizing lessons with AI:', error);
    return getFallbackLessonPriority(lessons, skillAssessment, maxResults);
  }
}

/**
 * Generate AI personalization for individual lesson
 * 
 * Creates personalized recommendations, difficulty adjustments,
 * and focus areas based on user's skill assessment.
 */
async function generateAIPersonalization(
  lesson: LessonWithUserProgress,
  skillAssessment: SkillAssessment
): Promise<{
  difficultyAdjustment: 'easier' | 'normal' | 'harder';
  focusAreas: string[];
  estimatedTime: number;
  recommendationReason: string;
  userSkillMatch: number;
}> {
  try {
    // Determine skill match based on lesson type and user skills
    const relevantSkill = lesson.type || 'vocabulary';
    const userSkillLevel = skillAssessment.skills[relevantSkill];
    const userSkillMatch = userSkillLevel ? 
      Math.min(1, userSkillLevel.confidence * (userSkillLevel.averageScore / 100)) : 0.5;

    // Determine difficulty adjustment based on user performance
    let difficultyAdjustment: 'easier' | 'normal' | 'harder' = 'normal';
    let recommendationReason = '';

    if (skillAssessment.weakAreas.includes(relevantSkill)) {
      difficultyAdjustment = 'easier';
      recommendationReason = `Focused practice for ${relevantSkill} improvement`;
    } else if (skillAssessment.strongAreas.includes(relevantSkill)) {
      difficultyAdjustment = 'harder';
      recommendationReason = `Challenge mode for your strong ${relevantSkill} skills`;
    } else if (userSkillMatch > 0.8) {
      recommendationReason = 'Perfect match for your current level';
    } else if (userSkillMatch < 0.4) {
      difficultyAdjustment = 'easier';
      recommendationReason = 'Adjusted difficulty to build confidence';
    } else {
      recommendationReason = 'Recommended based on your progress';
    }

    // Adjust estimated time based on user performance
    const baseTime = lesson.estimatedTime;
    let adjustedTime = baseTime;

    if (difficultyAdjustment === 'easier') {
      adjustedTime = Math.round(baseTime * 0.8); // 20% faster for easier content
    } else if (difficultyAdjustment === 'harder') {
      adjustedTime = Math.round(baseTime * 1.3); // 30% longer for harder content
    }

    // Determine focus areas based on weak areas and lesson content
    const focusAreas = skillAssessment.weakAreas
      .filter(area => isRelatedToLesson(area, lesson))
      .slice(0, 3);

    return {
      difficultyAdjustment,
      focusAreas,
      estimatedTime: adjustedTime,
      recommendationReason,
      userSkillMatch
    };

  } catch (error) {
    console.error('Error generating AI personalization:', error);
    // Return default personalization
    return {
      difficultyAdjustment: 'normal',
      focusAreas: [],
      estimatedTime: lesson.estimatedTime,
      recommendationReason: 'Continue your French learning journey',
      userSkillMatch: 0.5
    };
  }
}

/**
 * Fallback lesson prioritization when AI is unavailable
 */
function getFallbackLessonPriority(
  lessons: LessonWithUserProgress[],
  skillAssessment: SkillAssessment,
  maxResults: number
): LessonWithUserProgress[] {
  // Simple rule-based prioritization
  const availableLessons = lessons.filter(l => l.status === 'available');
  const inProgressLessons = lessons.filter(l => l.status === 'in_progress');
  const reviewLessons = lessons.filter(l => l.status === 'completed').slice(0, 2);

  // Prioritize: in-progress → available (weak areas first) → review
  const weakAreaTypes = skillAssessment.weakAreas;
  const weakAreaAvailable = availableLessons.filter(l => weakAreaTypes.includes(l.type));
  const otherAvailable = availableLessons.filter(l => !weakAreaTypes.includes(l.type));

  const prioritized = [
    ...inProgressLessons,
    ...weakAreaAvailable.slice(0, Math.max(1, maxResults - inProgressLessons.length - 2)),
    ...otherAvailable.slice(0, Math.max(0, maxResults - inProgressLessons.length - weakAreaAvailable.length - 2)),
    ...reviewLessons
  ];

  return prioritized.slice(0, maxResults);
}

/**
 * Helper functions for lesson card generation
 */
function calculateLessonProgress(lesson: LessonWithUserProgress): number {
  if (lesson.status === 'completed') return 100;
  if (lesson.status === 'in_progress') return 50; // Could be more sophisticated
  return 0;
}

function generateLessonThumbnail(type: string, title: string): string {
  // Generate thumbnail URLs based on lesson type
  const thumbnailMap: Record<string, string> = {
    vocabulary: '/images/thumbnails/vocabulary.jpg',
    grammar: '/images/thumbnails/grammar.jpg',
    conversation: '/images/thumbnails/conversation.jpg',
    pronunciation: '/images/thumbnails/pronunciation.jpg'
  };
  
  return thumbnailMap[type] || '/images/thumbnails/default.jpg';
}

function extractLessonTags(lesson: LessonWithUserProgress): string[] {
  const tags = [lesson.type];
  
  // Add level-based tags
  tags.push(lesson.learningUnitId ? `unit-${lesson.learningUnitId}` : 'general');
  
  // Add difficulty tags based on estimated time
  if (lesson.estimatedTime <= 10) tags.push('quick');
  if (lesson.estimatedTime >= 30) tags.push('deep-dive');
  
  return tags;
}

function isRelatedToLesson(skillArea: string, lesson: LessonWithUserProgress): boolean {
  return lesson.type === skillArea || 
         lesson.title.toLowerCase().includes(skillArea) ||
         lesson.description?.toLowerCase().includes(skillArea);
}

/**
 * Fallback lesson cards when AI services are unavailable
 */
async function getFallbackLessonCards(
  userId: number,
  pathId: number,
  maxResults: number
): Promise<LessonCard[]> {
  try {
    const learningPath = await getLearningPathUserView(pathId, userId);
    if (!learningPath) return [];

    const allLessons: LessonWithUserProgress[] = [];
    learningPath.units.forEach(unit => {
      allLessons.push(...unit.lessons);
    });

    return allLessons
      .filter(l => l.status !== 'locked')
      .slice(0, maxResults)
      .map(lesson => ({
        ...lesson,
        aiPersonalization: {
          difficultyAdjustment: 'normal' as const,
          focusAreas: [],
          estimatedTime: lesson.estimatedTime,
          recommendationReason: 'Continue your learning journey',
          userSkillMatch: 0.5
        },
        thumbnailUrl: generateLessonThumbnail(lesson.type, lesson.title),
        tags: extractLessonTags(lesson)
      }));

  } catch (error) {
    console.error('Error getting fallback lesson cards:', error);
    return [];
  }
}
```

## Dependencies

### Prerequisites
- Phase 1-3 completed (Database, Gamification, OAuth)
- Existing AI infrastructure functional
- Learning path and progress services operational

### Additional Dependencies

**Client Dependencies** (ADD IF NEEDED):
```json
{
  "framer-motion": "^10.16.0" // Already exists in your package.json
}
```

**No additional server dependencies required** - leverages existing AI infrastructure

## Testing Strategy

### Component Testing
```typescript
// Test file: client/src/components/dashboard/__tests__/LessonCard.test.tsx
describe('LessonCard Component', () => {
  test('should render lesson card with AI personalization', () => {
    const mockLesson = {
      id: 1,
      title: 'Basic Greetings',
      status: 'available',
      aiPersonalization: {
        difficultyAdjustment: 'normal',
        recommendationReason: 'Perfect for your level'
      }
    };
    
    render(<LessonCard lesson={mockLesson} onClick={() => {}} />);
    expect(screen.getByText('Basic Greetings')).toBeInTheDocument();
    expect(screen.getByText('Perfect for your level')).toBeInTheDocument();
  });

  test('should handle different lesson statuses correctly', () => {
    // Test locked, available, in_progress, completed states
  });
});
```

### AI Curation Testing
- Lesson prioritization accuracy based on skill assessment
- AI personalization relevance to user performance
- Fallback behavior when AI services are unavailable
- Performance impact of AI curation on page load

### Integration Testing
- Complete dashboard data loading workflow
- Lesson card click navigation and analytics tracking
- Goal progress updates on lesson completion
- Social feature integration with lesson cards

## Review Points

### Critical Review Areas
1. **AI Curation Accuracy**: Ensure AI recommendations are relevant and helpful
2. **Performance Impact**: Dashboard load time should remain under 2 seconds
3. **User Experience**: Lesson cards should feel intuitive and motivating
4. **Mobile Responsiveness**: Card grid adapts properly to all screen sizes
5. **Accessibility**: All interactive elements meet WCAG 2.1 AA standards

### Possible Solutions Considered

**AI Integration Approach:**
- ✅ **Chosen**: AI enhances existing content with personalization (balances structure with intelligence)
- ❌ **Rejected**: AI generates all content dynamically (too unpredictable for structured learning)
- ❌ **Rejected**: No AI integration (misses opportunity for personalization)

**Lesson Card Design:**
- ✅ **Chosen**: Card-based layout with progress indicators (matches modern UX expectations)
- ❌ **Rejected**: List-based layout (less engaging, harder to scan)
- ❌ **Rejected**: Single-lesson focus (reduces choice and motivation)

**Dashboard Layout Strategy:**
- ✅ **Chosen**: Progressive disclosure with key metrics at top (follows F-pattern reading)
- ❌ **Rejected**: Single-scroll layout (information overload)
- ❌ **Rejected**: Tab-based organization (adds unnecessary complexity)

## Success Criteria

### Functional Requirements Met
- [ ] Lesson cards display with AI personalization and progress tracking
- [ ] Dashboard loads efficiently with parallel data fetching
- [ ] Navigation to individual lessons works seamlessly
- [ ] Progress visualization is accurate and engaging
- [ ] Quick actions provide immediate access to key features
- [ ] Social features integrate naturally with learning flow

### Performance Benchmarks
- Dashboard initial load time < 2 seconds
- Lesson card rendering < 500ms for 12 cards
- AI personalization generation < 1 second per lesson
- Smooth animations at 60fps on modern devices

### User Experience Goals
- Users can quickly identify their next learning steps
- Progress feels tangible and motivating
- AI recommendations feel helpful, not intrusive
- Dashboard encourages daily learning habits
- Social elements add motivation without distraction

---

**Next Phase**: [Phase 5: Social Features & Advanced Analytics](./phase-5-social-features-analytics.md)
**Dependencies for Next Phase**: Complete lesson card dashboard operational and tested
