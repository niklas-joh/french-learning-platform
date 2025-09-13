# Phase 5: Social Features & Advanced Analytics

**Phase**: 5 of 5  
**Priority**: HIGH - Final Feature Set  
**Estimated Duration**: 4-5 days  
**Dependencies**: Phase 1-4 completed (Database, Gamification, OAuth, Lesson Cards)  
**Deliverable**: Complete social learning platform with advanced analytics, study groups, and mobile optimizations

## Overview

Complete the transformation with advanced social features, comprehensive analytics dashboard, study group functionality, and mobile PWA optimizations. This final phase creates a fully-featured social learning platform that rivals modern language learning applications.

## Design Specifications

### Advanced Social Features UI
Building on Phase 3's foundation:

**Study Groups Interface:**
- Group creation with invite system
- Shared progress tracking
- Group challenges and competitions
- Real-time activity feeds
- Group leaderboards and achievements

**Enhanced Leaderboard:**
- Multiple timeframes (daily, weekly, monthly, all-time)
- Skill-specific leaderboards (vocabulary, grammar, etc.)
- Achievement showcase
- Friend-only leaderboards
- Regional/global toggles

**Social Learning Dashboard:**
- Friend activity timeline
- Achievement sharing and reactions
- Collaborative lesson recommendations
- Study buddy matching system
- Social learning insights

### Analytics Dashboard Design
Professional learning analytics following modern data visualization:

**Learning Insights Panel:**
- Skill radar chart showing strengths/weaknesses
- Learning velocity trends over time
- Study session heatmap calendar
- Goal achievement history
- AI recommendation accuracy tracking

**Performance Metrics:**
- Weekly study patterns visualization
- Streak analysis with breakdown
- XP earning trends by activity type
- Lesson completion efficiency
- Time-of-day learning optimization

**Social Analytics:**
- Friend comparison charts
- Social learning impact metrics
- Group participation statistics
- Leaderboard position trends
- Collaborative learning effectiveness

### Mobile PWA Enhancements
State-of-the-art mobile experience:

**Offline-First Features:**
- Cached lesson content for offline study
- Offline progress tracking with sync
- Background sync for social updates
- Offline badge notifications queue

**Native-Like Features:**
- Push notifications for streaks, friends, achievements
- Home screen installation prompts
- Splash screen with learning motivation
- Gesture-based navigation
- Voice interaction integration

## Detailed Changes Required

### 1. Advanced Social Features (NEW)

**File**: `server/src/services/studyGroupService.ts`
```typescript
/**
 * Study Group Service - Collaborative Learning Features
 * 
 * Manages study groups, group challenges, shared progress tracking,
 * and collaborative learning features for enhanced social engagement.
 * 
 * @version 1.0.0
 * @author Dashboard Transformation Team
 */

import db from '../config/db.js';
import type { Knex as KnexTypes } from 'knex';
import { recordXpActivity } from './gamificationService.js';

// Study Group Types
export interface StudyGroup {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  isPublic: boolean;
  maxMembers: number;
  currentMembers: number;
  language: string;
  targetLevel: string;
  activityLevel: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyGroupMember {
  id: number;
  groupId: number;
  userId: number;
  role: 'creator' | 'admin' | 'member';
  joinedAt: Date;
  lastActiveAt: Date;
  contributionScore: number;
}

export interface GroupChallenge {
  id: number;
  groupId: number;
  title: string;
  description: string;
  targetType: 'xp' | 'lessons' | 'streak' | 'skill_improvement';
  targetValue: number;
  startDate: Date;
  endDate: Date;
  xpReward: number;
  status: 'upcoming' | 'active' | 'completed';
  participantCount: number;
}

export interface StudySession {
  id: number;
  userId: number;
  groupId?: number;
  startTime: Date;
  endTime?: Date;
  lessonsCompleted: number;
  xpEarned: number;
  studyBuddyId?: number; // For paired study sessions
  sessionType: 'solo' | 'group' | 'buddy';
  metadata: any;
}

/**
 * Create a new study group
 * 
 * @param creatorId - User creating the group
 * @param groupData - Group configuration
 * @returns Created study group
 */
export async function createStudyGroup(
  creatorId: number,
  groupData: {
    name: string;
    description: string;
    isPublic: boolean;
    maxMembers: number;
    targetLevel: string;
    tags: string[];
  }
): Promise<StudyGroup> {
  return db.transaction(async (trx: KnexTypes.Transaction) => {
    try {
      // Create the group
      const [groupId] = await trx('studyGroups').insert({
        name: groupData.name,
        description: groupData.description,
        creatorId,
        isPublic: groupData.isPublic,
        maxMembers: groupData.maxMembers,
        currentMembers: 1, // Creator is first member
        language: 'french', // Default language
        targetLevel: groupData.targetLevel,
        activityLevel: 'medium',
        tags: JSON.stringify(groupData.tags)
      }).returning('id');

      const newGroupId = typeof groupId === 'object' ? groupId.id : groupId;

      // Add creator as first member
      await trx('studyGroupMembers').insert({
        groupId: newGroupId,
        userId: creatorId,
        role: 'creator',
        joinedAt: trx.fn.now(),
        lastActiveAt: trx.fn.now(),
        contributionScore: 0
      });

      // Award XP for creating group
      await recordXpActivity(
        creatorId,
        'study_group_created',
        20,
        trx,
        newGroupId.toString(),
        { groupName: groupData.name }
      );

      const createdGroup = await trx('studyGroups').where({ id: newGroupId }).first();
      console.log(`[StudyGroup] Created group "${groupData.name}" by user ${creatorId}`);
      
      return {
        ...createdGroup,
        tags: JSON.parse(createdGroup.tags || '[]')
      };

    } catch (error) {
      console.error('Error creating study group:', error);
      throw error;
    }
  });
}

/**
 * Join a study group
 * 
 * @param userId - User joining the group
 * @param groupId - Group to join
 * @param inviteCode - Optional invite code for private groups
 * @returns Updated group membership
 */
export async function joinStudyGroup(
  userId: number,
  groupId: number,
  inviteCode?: string
): Promise<StudyGroupMember> {
  return db.transaction(async (trx: KnexTypes.Transaction) => {
    try {
      // Check if group exists and has space
      const group = await trx('studyGroups').where({ id: groupId }).first();
      if (!group) {
        throw new Error('Study group not found');
      }

      if (group.currentMembers >= group.maxMembers) {
        throw new Error('Study group is full');
      }

      // Check if user is already a member
      const existingMember = await trx('studyGroupMembers')
        .where({ groupId, userId })
        .first();

      if (existingMember) {
        throw new Error('User is already a member of this group');
      }

      // Add member
      const [memberId] = await trx('studyGroupMembers').insert({
        groupId,
        userId,
        role: 'member',
        joinedAt: trx.fn.now(),
        lastActiveAt: trx.fn.now(),
        contributionScore: 0
      }).returning('id');

      // Update group member count
      await trx('studyGroups')
        .where({ id: groupId })
        .increment('currentMembers', 1);

      // Award XP for joining group
      await recordXpActivity(
        userId,
        'study_group_joined',
        10,
        trx,
        groupId.toString(),
        { groupName: group.name }
      );

      const newMember = await trx('studyGroupMembers')
        .where({ id: typeof memberId === 'object' ? memberId.id : memberId })
        .first();

      console.log(`[StudyGroup] User ${userId} joined group ${groupId}`);
      return newMember;

    } catch (error) {
      console.error('Error joining study group:', error);
      throw error;
    }
  });
}

/**
 * Create group challenge
 * 
 * @param groupId - Group identifier
 * @param creatorId - User creating the challenge
 * @param challengeData - Challenge configuration
 * @returns Created challenge
 */
export async function createGroupChallenge(
  groupId: number,
  creatorId: number,
  challengeData: {
    title: string;
    description: string;
    targetType: 'xp' | 'lessons' | 'streak' | 'skill_improvement';
    targetValue: number;
    durationDays: number;
    xpReward: number;
  }
): Promise<GroupChallenge> {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + challengeData.durationDays);

    const [challengeId] = await db('groupChallenges').insert({
      groupId,
      creatorId,
      title: challengeData.title,
      description: challengeData.description,
      targetType: challengeData.targetType,
      targetValue: challengeData.targetValue,
      startDate: startDate,
      endDate: endDate,
      xpReward: challengeData.xpReward,
      status: 'upcoming',
      participantCount: 0
    }).returning('id');

    const challenge = await db('groupChallenges')
      .where({ id: typeof challengeId === 'object' ? challengeId.id : challengeId })
      .first();

    console.log(`[StudyGroup] Created challenge "${challengeData.title}" for group ${groupId}`);
    return challenge;

  } catch (error) {
    console.error('Error creating group challenge:', error);
    throw error;
  }
}

/**
 * Get user's study groups with activity stats
 * 
 * @param userId - User identifier
 * @returns Array of user's study groups
 */
export async function getUserStudyGroups(userId: number): Promise<StudyGroup[]> {
  try {
    const groups = await db('studyGroups as sg')
      .join('studyGroupMembers as sgm', 'sg.id', 'sgm.groupId')
      .where('sgm.userId', userId)
      .select('sg.*', 'sgm.role', 'sgm.joinedAt')
      .orderBy('sgm.joinedAt', 'desc');

    return groups.map(group => ({
      ...group,
      tags: JSON.parse(group.tags || '[]')
    }));

  } catch (error) {
    console.error('Error getting user study groups:', error);
    return [];
  }
}
```

**File**: `server/src/services/analyticsService.ts`
```typescript
/**
 * Analytics Service - Learning Insights and Performance Tracking
 * 
 * Provides comprehensive learning analytics including skill progression,
 * study patterns, social learning impact, and AI recommendation effectiveness.
 * 
 * @version 1.0.0
 * @author Dashboard Transformation Team
 */

import db from '../config/db.js';
import type { Knex as KnexTypes } from 'knex';

// Analytics Types
export interface LearningInsights {
  userId: number;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  skillRadar: SkillRadarData;
  studyPatterns: StudyPatternData;
  goalAnalytics: GoalAnalyticsData;
  socialImpact: SocialImpactData;
  aiEffectiveness: AIEffectivenessData;
  generatedAt: Date;
}

export interface SkillRadarData {
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  listening: number;
  reading: number;
  writing: number;
  conversation: number;
}

export interface StudyPatternData {
  totalStudyTime: number;
  averageSessionLength: number;
  preferredStudyTimes: string[]; // Hours of day
  mostProductiveDays: string[]; // Days of week
  streakAnalysis: {
    currentStreak: number;
    longestStreak: number;
    averageStreak: number;
    streakBreakReasons: string[];
  };
  sessionQuality: {
    averageScore: number;
    completionRate: number;
    retentionRate: number;
  };
}

export interface GoalAnalyticsData {
  totalGoalsSet: number;
  goalsAchieved: number;
  achievementRate: number;
  averageGoalDifficulty: number;
  goalTypes: Record<string, number>;
  monthlyTrends: {
    month: string;
    goalsSet: number;
    goalsAchieved: number;
    xpEarned: number;
  }[];
}

export interface SocialImpactData {
  friendsCount: number;
  groupsJoined: number;
  leaderboardRanking: {
    current: number;
    highest: number;
    average: number;
  };
  socialLearningBoost: number; // Percentage improvement with social features
  collaborativeSessions: number;
  achievementsShared: number;
}

export interface AIEffectivenessData {
  recommendationsFollowed: number;
  recommendationAccuracy: number;
  aiContentEngagement: number;
  personalizedLessonsCompleted: number;
  difficultyAdjustmentSuccess: number;
  timeOptimization: number; // Percentage time saved through AI
}

/**
 * Generate comprehensive learning insights for user
 * 
 * @param userId - User identifier
 * @param timeframe - Analysis timeframe
 * @returns Complete learning insights dashboard data
 */
export async function generateLearningInsights(
  userId: number,
  timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'
): Promise<LearningInsights> {
  try {
    const daysBack = getTimeframeDays(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Parallel data gathering for performance
    const [
      skillRadar,
      studyPatterns,
      goalAnalytics,
      socialImpact,
      aiEffectiveness
    ] = await Promise.all([
      generateSkillRadarData(userId, startDate),
      generateStudyPatternsData(userId, startDate),
      generateGoalAnalyticsData(userId, startDate),
      generateSocialImpactData(userId, startDate),
      generateAIEffectivenessData(userId, startDate)
    ]);

    return {
      userId,
      timeframe,
      skillRadar,
      studyPatterns,
      goalAnalytics,
      socialImpact,
      aiEffectiveness,
      generatedAt: new Date()
    };

  } catch (error) {
    console.error('Error generating learning insights:', error);
    throw error;
  }
}

/**
 * Generate skill radar chart data
 */
async function generateSkillRadarData(userId: number, startDate: Date): Promise<SkillRadarData> {
  try {
    // Get skill assessment using existing service
    const { getSkillAssessmentForCurriculum } = await import('./progressService.js');
    const skillAssessment = await getSkillAssessmentForCurriculum(userId);

    // Convert skill levels to radar chart percentages
    const skillRadar: SkillRadarData = {
      vocabulary: (skillAssessment.skills.vocabulary?.averageScore || 30) / 100 * 100,
      grammar: (skillAssessment.skills.grammar?.averageScore || 30) / 100 * 100,
      pronunciation: (skillAssessment.skills.pronunciation?.averageScore || 30) / 100 * 100,
      listening: (skillAssessment.skills.listening?.averageScore || 30) / 100 * 100,
      reading: (skillAssessment.skills.reading?.averageScore || 30) / 100 * 100,
      writing: (skillAssessment.skills.writing?.averageScore || 30) / 100 * 100,
      conversation: (skillAssessment.skills.conversation?.averageScore || 30) / 100 * 100
    };

    return skillRadar;

  } catch (error) {
    console.error('Error generating skill radar data:', error);
    // Return default values
    return {
      vocabulary: 50, grammar: 50, pronunciation: 50,
      listening: 50, reading: 50, writing: 50, conversation: 50
    };
  }
}

/**
 * Generate study patterns analysis
 */
async function generateStudyPatternsData(userId: number, startDate: Date): Promise<StudyPatternData> {
  try {
    // Get XP activities for pattern analysis
    const activities = await db('xpActivities')
      .where('userId', userId)
      .where('createdAt', '>=', startDate)
      .orderBy('createdAt');

    // Get lesson progress for session analysis
    const lessons = await db('userLessonProgress')
      .where('userId', userId)
      .where('completedAt', '>=', startDate)
      .whereNotNull('completedAt');

    // Analyze study times
    const studyHours = activities.map(activity => 
      new Date(activity.createdAt).getHours()
    );
    const studyDays = activities.map(activity => 
      new Date(activity.createdAt).toLocaleDateString('en', { weekday: 'long' })
    );

    // Calculate study patterns
    const hourCounts = studyHours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const dayCounts = studyDays.reduce((acc, day) => {
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredStudyTimes = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);

    const mostProductiveDays = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day);

    // Calculate session metrics
    const totalStudyTime = lessons.reduce((sum, lesson) => {
      const start = new Date(lesson.startedAt);
      const end = new Date(lesson.completedAt);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
    }, 0);

    const averageSessionLength = lessons.length > 0 ? totalStudyTime / lessons.length : 0;
    const averageScore = lessons.reduce((sum, l) => sum + (l.score || 0), 0) / lessons.length || 0;

    return {
      totalStudyTime: Math.round(totalStudyTime),
      averageSessionLength: Math.round(averageSessionLength),
      preferredStudyTimes,
      mostProductiveDays,
      streakAnalysis: await calculateStreakAnalysis(userId, startDate),
      sessionQuality: {
        averageScore: Math.round(averageScore),
        completionRate: 95, // Would calculate from actual data
        retentionRate: 85   // Would calculate from review sessions
      }
    };

  } catch (error) {
    console.error('Error generating study patterns data:', error);
    return {
      totalStudyTime: 0,
      averageSessionLength: 0,
      preferredStudyTimes: [],
      mostProductiveDays: [],
      streakAnalysis: {
        currentStreak: 0,
        longestStreak: 0,
        averageStreak: 0,
        streakBreakReasons: []
      },
      sessionQuality: {
        averageScore: 0,
        completionRate: 0,
        retentionRate: 0
      }
    };
  }
}

/**
 * Generate goal analytics data
 */
async function generateGoalAnalyticsData(userId: number, startDate: Date): Promise<GoalAnalyticsData> {
  try {
    const goals = await db('dailyGoals')
      .where('userId', userId)
      .where('date', '>=', startDate.toISOString().split('T')[0])
      .orderBy('date');

    const totalGoalsSet = goals.length;
    const goalsAchieved = goals.filter(g => g.completed).length;
    const achievementRate = totalGoalsSet > 0 ? (goalsAchieved / totalGoalsSet) * 100 : 0;

    // Calculate monthly trends
    const monthlyTrends = goals.reduce((acc, goal) => {
      const month = new Date(goal.date).toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { month, goalsSet: 0, goalsAchieved: 0, xpEarned: 0 };
      }
      acc[month].goalsSet++;
      if (goal.completed) acc[month].goalsAchieved++;
      acc[month].xpEarned += goal.currentXp;
      return acc;
    }, {} as Record<string, any>);

    return {
      totalGoalsSet,
      goalsAchieved,
      achievementRate: Math.round(achievementRate),
      averageGoalDifficulty: calculateAverageGoalDifficulty(goals),
      goalTypes: {
        xp: goals.length, // All goals have XP component
        lessons: goals.length,
        minutes: goals.length
      },
      monthlyTrends: Object.values(monthlyTrends)
    };

  } catch (error) {
    console.error('Error generating goal analytics:', error);
    return {
      totalGoalsSet: 0,
      goalsAchieved: 0,
      achievementRate: 0,
      averageGoalDifficulty: 0,
      goalTypes: {},
      monthlyTrends: []
    };
  }
}

/**
 * Helper functions for analytics calculations
 */
function getTimeframeDays(timeframe: string): number {
  switch (timeframe) {
    case 'week': return 7;
    case 'month': return 30;
    case 'quarter': return 90;
    case 'year': return 365;
    default: return 30;
  }
}

async function calculateStreakAnalysis(userId: number, startDate: Date): Promise<any> {
  try {
    const progress = await db('userProgress').where({ userId }).first();
    
    return {
      currentStreak: progress?.streakDays || 0,
      longestStreak: progress?.bestStreak || 0,
      averageStreak: Math.round((progress?.streakDays || 0) * 0.7), // Estimate
      streakBreakReasons: ['weekend_break', 'vacation', 'busy_schedule'] // Would analyze actual data
    };
  } catch (error) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      averageStreak: 0,
      streakBreakReasons: []
    };
  }
}

function calculateAverageGoalDifficulty(goals: any[]): number {
  if (goals.length === 0) return 0;
  
  // Calculate difficulty based on target values relative to defaults
  const avgDifficulty = goals.reduce((sum, goal) => {
    const xpDifficulty = goal.targetXp / 50; // 50 is default
    const lessonDifficulty = goal.targetLessons / 3; // 3 is default
    const timeDifficulty = goal.targetMinutes / 20; // 20 is default
    
    return sum + ((xpDifficulty + lessonDifficulty + timeDifficulty) / 3);
  }, 0);
  
  return Math.round((avgDifficulty / goals.length) * 100);
}

async function generateSocialImpactData(userId: number, startDate: Date): Promise<SocialImpactData> {
  // Implementation would analyze social learning effectiveness
  return {
    friendsCount: 0,
    groupsJoined: 0,
    leaderboardRanking: { current: 0, highest: 0, average: 0 },
    socialLearningBoost: 0,
    collaborativeSessions: 0,
    achievementsShared: 0
  };
}

async function generateAIEffectivenessData(userId: number, startDate: Date): Promise<AIEffectivenessData> {
  // Implementation would analyze AI recommendation effectiveness
  return {
    recommendationsFollowed: 0,
    recommendationAccuracy: 0,
    aiContentEngagement: 0,
    personalizedLessonsCompleted: 0,
    difficultyAdjustmentSuccess: 0,
    timeOptimization: 0
  };
}
```

### 2. Frontend Analytics Components (NEW)

**File**: `client/src/components/analytics/LearningInsightsDashboard.tsx`
```typescript
/**
 * Learning Insights Dashboard Component
 * 
 * Comprehensive analytics dashboard showing learning progress,
 * skill development, study patterns, and social learning impact.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp as TrendsIcon,
  Assessment as AnalyticsIcon,
  People as SocialIcon,
  Psychology as AIIcon
} from '@mui/icons-material';
import { SkillRadarChart } from './SkillRadarChart.js';
import { StudyPatternsChart } from './StudyPatternsChart.js';
import { GoalTrendsChart } from './GoalTrendsChart.js';
import api from '../../services/api.js';

interface LearningInsightsDashboardProps {
  userId: number;
}

export const LearningInsightsDashboard: React.FC<LearningInsightsDashboardProps> = ({
  userId
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [timeframe]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/analytics/insights?timeframe=${timeframe}`);
      setInsights(response.data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: 'Skills', icon: <TrendsIcon />, content: 'skills' },
    { label: 'Patterns', icon: <AnalyticsIcon />, content: 'patterns' },
    { label: 'Social', icon: <SocialIcon />, content: 'social' },
    { label: 'AI Impact', icon: <AIIcon />, content: 'ai' }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with timeframe selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Learning Insights
        </Typography>
        
        <FormControl size="small">
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
          >
            <MenuItem value="week">Past Week</MenuItem>
            <MenuItem value="month">Past Month</MenuItem>
            <MenuItem value="quarter">Past Quarter</MenuItem>
            <MenuItem value="year">Past Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Navigation tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            label={tab.label}
            sx={{ textTransform: 'none' }}
          />
        ))}
      </Tabs>

      {/* Tab content */}
      {loading ? (
        <Box>Loading insights...</Box>
      ) : (
        <Box>
          {activeTab === 0 && insights && (
            <SkillsInsightsPanel insights={insights} />
          )}
          {activeTab === 1 && insights && (
            <StudyPatternsPanel insights={insights} />
          )}
          {activeTab === 2 && insights && (
            <SocialInsightsPanel insights={insights} />
          )}
          {activeTab === 3 && insights && (
            <AIInsightsPanel insights={insights} />
          )}
        </Box>
      )}
    </Box>
  );
};

// Individual insight panels would be implemented as separate components
const SkillsInsightsPanel: React.FC<{ insights: any }> = ({ insights }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Skill Development</Typography>
          <SkillRadarChart data={insights.skillRadar} />
        </CardContent>
      </Card>
    </Grid>
    {/* Additional skill-related charts */}
  </Grid>
);

const StudyPatternsPanel: React.FC<{ insights: any }> = ({ insights }) => (
  <Grid container spacing={3}>
    {/* Study pattern visualizations */}
  </Grid>
);

const SocialInsightsPanel: React.FC<{ insights: any }> = ({ insights }) => (
  <Grid container spacing={3}>
    {/* Social learning analytics */}
  </Grid>
);

const AIInsightsPanel: React.FC<{ insights: any }> = ({ insights }) => (
  <Grid container spacing={3}>
    {/* AI effectiveness analytics */}
  </Grid>
);
```

### 3. Mobile PWA Enhancements (NEW)

**File**: `client/public/manifest.json` (UPDATE EXISTING)
```json
{
  "name": "French Learning Platform",
  "short_name": "FrenchLearner",
  "description": "AI-powered French learning with social features",
  "start_url": "/home",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png", 
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["education", "language"],
  "shortcuts": [
    {
      "name": "Start Today's Lesson",
      "short_name": "Lesson",
      "description": "Jump to today's recommended lesson",
      "url": "/home?action=start-lesson",
      "icons": [{ "src": "/icons/shortcut-lesson.png", "sizes": "96x96" }]
    },
    {
      "name": "Practice Speaking",
      "short_name": "Speaking",
      "description": "Practice French pronunciation",
      "url": "/practice/speaking",
      "icons": [{ "src": "/icons/shortcut-speaking.png", "sizes": "96x96" }]
    },
    {
      "name": "Check Progress",
      "short_name": "Progress", 
      "description": "View your learning progress",
      "url": "/progress",
      "icons": [{ "src": "/icons/shortcut-progress.png", "sizes": "96x96" }]
    }
  ]
}
```

**File**: `client/src/services/offlineService.ts` (NEW)
```typescript
/**
 * Offline Service - PWA Offline Functionality
 * 
 * Handles offline content caching, background sync,
 * and offline-first features for PWA experience.
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDBSchema extends DBSchema {
  lessons: {
    key: number;
    value: {
      id: number;
      title: string;
      content: any;
      downloadedAt: Date;
      lastAccessedAt: Date;
    };
  };
  progress: {
    key: string;
    value: {
      id: string;
      userId: number;
      data: any;
      syncedAt: Date;
      needsSync: boolean;
    };
  };
  notifications: {
    key: string;
    value: {
      id: string;
      type: string;
      title: string;
      message: string;
      data: any;
      scheduledFor: Date;
      shown: boolean;
    };
  };
}

class OfflineService {
  private db: IDBPDatabase<OfflineDBSchema> | null = null;

  async initialize(): Promise<void> {
    this.db = await openDB<OfflineDBSchema>('french-learning-offline', 1, {
      upgrade(db) {
        // Lessons store
        const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
        lessonsStore.createIndex('downloadedAt', 'downloadedAt');
        
        // Progress store  
        const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('needsSync', 'needsSync');
        
        // Notifications store
        const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
        notificationsStore.createIndex('scheduledFor', 'scheduledFor');
      }
    });
  }

  async cacheLessonForOffline(lessonId: number, lessonData: any): Promise<void> {
    if (!this.db) await this.initialize();
    
    await this.db!.put('lessons', {
      id: lessonId,
      title: lessonData.title,
      content: lessonData,
      downloadedAt: new Date(),
      lastAccessedAt: new Date()
    });
  }

  async getOfflineLesson(lessonId: number): Promise<any> {
    if (!this.db) await this.initialize();
    
    const lesson = await this.db!.get('lessons', lessonId);
    if (lesson) {
      // Update last accessed
      lesson.lastAccessedAt = new Date();
      await this.db!.put('lessons', lesson);
      return lesson.content;
    }
    return null;
  }

  async queueProgressSync(userId: number, progressData: any): Promise<void> {
    if (!this.db) await this.initialize();
    
    const id = `progress_${userId}_${Date.now()}`;
    await this.db!.put('progress', {
      id,
      userId,
      data: progressData,
      syncedAt: new Date(),
      needsSync: true
    });
  }

  async syncPendingProgress(): Promise<void> {
    if (!this.db) await this.initialize();
    
    const pendingProgress = await this.db!.getAllFromIndex('progress', 'needsSync', true);
    
    for (const item of pendingProgress) {
      try {
        // Sync with server
        const response = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
        
        if (response.ok) {
          // Mark as synced
          item.needsSync = false;
          await this.db!.put('progress', item);
        }
      } catch (error) {
        console.error('Error syncing progress:', error);
      }
    }
  }
}

export const offlineService = new OfflineService();
```

### 4. Enhanced API Routes (NEW)

**File**: `server/src/routes/analytics.routes.ts`
```typescript
/**
 * Analytics API Routes
 * Handles learning insights, performance analytics, and reporting endpoints
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { generateLearningInsights } from '../services/analyticsService.js';

const router = express.Router();

// Learning insights endpoint
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const timeframe = req.query.timeframe as 'week' | 'month' | 'quarter' | 'year' || 'month';
    
    const insights = await generateLearningInsights(userId, timeframe);
    
    res.json({
      success: true,
      insights,
      generatedAt: new Date()
    });
    
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate learning insights' });
  }
});

// Export insights data
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const format = req.query.format || 'json';
    
    const insights = await generateLearningInsights(userId, 'year');
    
    if (format === 'csv') {
      // Convert to CSV format
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="learning-data.csv"');
      // CSV conversion logic here
    } else {
      res.json(insights);
    }
    
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export learning data' });
  }
});

export default router;
```

## Dependencies

### Prerequisites
- Phase 1-4 completed successfully
- All database migrations applied
- Gamification and social infrastructure operational
- Lesson card dashboard functional

### Additional Dependencies

**New Server Dependencies**:
```json
{
  "chart.js": "^4.4.0",
  "canvas": "^2.11.2", // For server-side chart generation
  "date-fns": "^2.30.0" // For date manipulation in analytics
}
```

**New Client Dependencies**:
```json
{
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "date-fns": "^2.30.0",
  "idb": "^7.1.1" // For offline storage
}
```

## Testing Strategy

### Social Features Testing
```typescript
// Test file: server/src/services/__tests__/studyGroupService.test.ts
describe('Study Group Service', () => {
  test('should create study group with proper permissions', async () => {
    const group = await createStudyGroup(1, {
      name: 'French Beginners',
      description: 'Group for A1-A2 learners',
      isPublic: true,
      maxMembers: 20,
      targetLevel: 'A2',
      tags: ['beginner', 'conversation']
    });
    
    expect(group.name).toBe('French Beginners');
    expect(group.currentMembers).toBe(1);
  });

  test('should handle group joining with proper validation', async () => {
    // Test group joining workflow
  });
});
```

### Analytics Testing
- Data accuracy for skill radar calculations
- Study pattern analysis correctness
- Goal analytics computation validation
- Performance impact of analytics generation

### PWA Testing
- Offline functionality across different network conditions
- Service worker registration and updates
- Push notification delivery
- App installation and home screen behavior

## Review Points

### Critical Review Areas
1. **Data Privacy**: Ensure analytics comply with privacy regulations
2. **Performance Impact**: Analytics generation shouldn't slow down core features
3. **Social Safety**: Study group moderation and reporting systems
4. **Mobile Experience**: PWA features work consistently across devices
5. **Analytics Accuracy**: Learning insights provide valuable, actionable data

### Possible Solutions Considered

**Analytics Architecture:**
- ✅ **Chosen**: Server-side analytics with client-side visualization (better performance, privacy)
- ❌ **Rejected**: Client-side analytics processing (privacy concerns, performance issues)
- ❌ **Rejected**: Third-party analytics service (data ownership, cost)

**Study Group Management:**
- ✅ **Chosen**: Structured group system with roles and permissions (scalable, moderable)
- ❌ **Rejected**: Open social network approach (harder to moderate)
- ❌ **Rejected**: Simple group chat (limited learning collaboration features)

**PWA Implementation:**
- ✅ **Chosen**: Service worker with strategic caching (optimal offline experience)
- ❌ **Rejected**: Full offline app (too complex, large download)
- ❌ **Rejected**: Online-only with offline notification (poor UX when offline)

## Success Criteria

### Functional Requirements Met
- [ ] Study groups create, join, and manage properly
- [ ] Analytics dashboard provides accurate, actionable insights
- [ ] PWA installs and works offline for core features
- [ ] Social features enhance learning motivation
- [ ] Advanced leaderboards and competitions functional

### Performance Benchmarks
- Analytics generation < 3 seconds for yearly data
- Study group operations < 500ms
- PWA app launch < 2 seconds from home screen
- Offline lesson access < 1 second

### User Experience Goals
- Analytics feel insightful and motivating
- Social features encourage positive learning habits
- PWA provides native app-like experience
- Advanced features don't overwhelm basic users

---

**Phase 5 Completion**: All major dashboard transformation features implemented
**Next Steps**: User testing, performance optimization, and feature refinement
