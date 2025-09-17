# Phase 3: Progressive Enhancement Using Existing Infrastructure

**Phase**: 3 of 3 (CORRECTED from 5-phase approach)  
**Priority**: ENHANCEMENT - Optional features using existing patterns  
**Estimated Duration**: 1-2 days  
**Dependencies**: Phase 1 UI transformation operational  
**Deliverable**: Enhanced social and analytics features leveraging existing infrastructure

## Overview

Add enhanced social features, analytics, and advanced UI components by progressively extending existing infrastructure. This approach maintains the 95% code reuse principle while adding valuable functionality through minimal, focused extensions.

**PRINCIPLE**: Only implement features that clearly enhance the core learning experience and can be built using existing infrastructure patterns.

## Existing Infrastructure Leverage

### **Social Features via Existing Systems**

**LEVERAGE: `progressService.ts` for Social Analytics**:
```typescript
// EXTEND: server/src/services/progressService.ts (+50 lines)
// ADD: Social features using existing patterns and infrastructure

/**
 * Simple Friend System using existing infrastructure
 * REUSE: Existing users table and userProgress metadata
 */
export async function addSimpleSocialFeatures() {
  
  const addFriend = async (userId: number, friendEmail: string): Promise<boolean> => {
    try {
      // LEVERAGE: Existing user lookup
      const friend = await db('users').where({ email: friendEmail }).first();
      if (!friend || friend.id === userId) return false;
      
      // LEVERAGE: Existing userProgress metadata
      const userProgress = await getUserProgress(userId);
      const friendIds = userProgress?.metadata?.friends || [];
      
      if (!friendIds.includes(friend.id)) {
        await db('userProgress').where({ userId }).update({
          metadata: {
            ...userProgress?.metadata,
            friends: [...friendIds, friend.id],
            updatedAt: new Date().toISOString()
          }
        });
        
        console.log(`[Social] User ${userId} added friend ${friend.id}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding friend:', error);
      return false;
    }
  };

  const getFriendsList = async (userId: number): Promise<any[]> => {
    try {
      // LEVERAGE: Existing getUserProgress function
      const userProgress = await getUserProgress(userId);
      const friendIds = userProgress?.metadata?.friends || [];
      
      if (friendIds.length === 0) return [];
      
      // LEVERAGE: Existing users and userProgress tables
      const friends = await db('users as u')
        .leftJoin('userProgress as up', 'u.id', 'up.userId')
        .whereIn('u.id', friendIds)
        .select(
          'u.id', 'u.firstName', 'u.lastName', 'u.email',
          'up.totalXp', 'up.weeklyXp', 'up.streakDays', 'up.currentLevel'
        );
      
      return friends.map(friend => ({
        id: friend.id,
        displayName: `${friend.firstName} ${friend.lastName}`.trim() || friend.email,
        email: friend.email,
        totalXp: friend.totalXp || 0,
        weeklyXp: friend.weeklyXp || 0,
        currentStreak: friend.streakDays || 0,
        level: friend.currentLevel || 'A1'
      }));
    } catch (error) {
      console.error('Error getting friends list:', error);
      return [];
    }
  };

  const getWeeklyLeaderboard = async (userId?: number, limit: number = 10): Promise<any[]> => {
    try {
      // LEVERAGE: Existing userProgress table for leaderboard
      let query = db('userProgress as up')
        .join('users as u', 'up.userId', 'u.id')
        .select(
          'u.id', 'u.firstName', 'u.lastName', 'u.email',
          'up.weeklyXp', 'up.totalXp', 'up.streakDays', 'up.currentLevel'
        )
        .where('up.weeklyXp', '>', 0)
        .orderBy('up.weeklyXp', 'desc')
        .limit(limit);

      const leaderboard = await query;
      
      // DETERMINE: Friend status if userId provided
      let friendIds: number[] = [];
      if (userId) {
        const userProgress = await getUserProgress(userId);
        friendIds = userProgress?.metadata?.friends || [];
      }

      return leaderboard.map((entry, index) => ({
        rank: index + 1,
        id: entry.id,
        displayName: `${entry.firstName} ${entry.lastName}`.trim() || entry.email,
        weeklyXp: entry.weeklyXp,
        totalXp: entry.totalXp,
        currentStreak: entry.streakDays || 0,
        level: entry.currentLevel || 'A1',
        isFriend: friendIds.includes(entry.id)
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  };

  const getUserSocialStats = async (userId: number): Promise<any> => {
    try {
      const userProgress = await getUserProgress(userId);
      const friendIds = userProgress?.metadata?.friends || [];
      
      // CALCULATE: User's leaderboard rank
      const rankResult = await db.raw(`
        SELECT rank FROM (
          SELECT userId, ROW_NUMBER() OVER (ORDER BY weeklyXp DESC) as rank
          FROM userProgress WHERE weeklyXp > 0
        ) ranked WHERE userId = ?
      `, [userId]);
      
      return {
        friendsCount: friendIds.length,
        leaderboardRank: rankResult?.[0]?.rank || 0,
        weeklyRank: rankResult?.[0]?.rank || 0,
        studyGroupsCount: 0 // Future feature
      };
    } catch (error) {
      console.error('Error getting social stats:', error);
      return { friendsCount: 0, leaderboardRank: 0, weeklyRank: 0, studyGroupsCount: 0 };
    }
  };

  return { addFriend, getFriendsList, getWeeklyLeaderboard, getUserSocialStats };
}
```

**LEVERAGE: Existing AI Infrastructure for Analytics**:
```typescript
// EXTEND: server/src/services/progressService.ts (additional +40 lines)
// ADD: Analytics using existing AI assessment functions

/**
 * Learning Analytics using existing infrastructure
 * REUSE: getSkillAssessmentForCurriculum, getUserRecentProgress
 */
export async function generateLearningInsights(userId: number): Promise<any> {
  try {
    // LEVERAGE: Existing skill assessment function
    const skillAssessment = await getSkillAssessmentForCurriculum(userId);
    
    // LEVERAGE: Existing progress function
    const recentProgress = await getUserRecentProgress(userId);
    
    // LEVERAGE: Existing user progress data
    const userProgress = await getUserProgress(userId);
    
    // SIMPLE: Calculate study patterns from existing data
    const studyPatterns = {
      totalStudyTime: recentProgress?.totalStudyTime || 0,
      averageSessionTime: recentProgress?.averageSessionTime || 0,
      currentStreak: userProgress?.streakDays || 0,
      longestStreak: userProgress?.bestStreak || 0,
      lessonsCompleted: userProgress?.lessonsCompleted || 0,
      averageScore: recentProgress?.averageScore || 0
    };
    
    // SIMPLE: Goal analytics from metadata
    const goalData = userProgress?.metadata?.goalHistory || [];
    const goalAnalytics = {
      totalGoalsSet: goalData.length,
      goalsCompleted: goalData.filter((g: any) => g.completed).length,
      averageCompletion: goalData.length > 0 ? 
        goalData.filter((g: any) => g.completed).length / goalData.length * 100 : 0
    };

    return {
      skillRadar: skillAssessment.skills || {},
      studyPatterns,
      goalAnalytics,
      recommendations: skillAssessment.recommendations || [],
      weakAreas: skillAssessment.weakAreas || [],
      strongAreas: skillAssessment.strongAreas || [],
      overallProgress: {
        currentLevel: userProgress?.currentLevel || 'A1',
        totalXp: userProgress?.totalXp || 0,
        weeklyXp: userProgress?.weeklyXp || 0
      }
    };
  } catch (error) {
    console.error('Error generating learning insights:', error);
    return {
      skillRadar: {},
      studyPatterns: {},
      goalAnalytics: {},
      recommendations: [],
      weakAreas: [],
      strongAreas: [],
      overallProgress: {}
    };
  }
}
```

## Enhanced Frontend Components

### **1. Enhanced Leaderboard Widget (Extend Existing)**

```typescript
// NEW: client/src/components/dashboard/LeaderboardWidget.tsx (80 lines)
// REUSE: Existing Material-UI components and design patterns

import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Avatar, List, ListItem,
  ListItemAvatar, ListItemText, Chip, Button, Skeleton
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  People as FriendsIcon,
  Star as StarIcon
} from '@mui/icons-material';
import api from '../../services/api.js';

interface LeaderboardEntry {
  rank: number;
  id: number;
  displayName: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  level: string;
  isFriend: boolean;
}

export const LeaderboardWidget: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [socialStats, setSocialStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      const [leaderboardRes, socialStatsRes] = await Promise.all([
        api.get('/api/social/leaderboard?limit=10'),
        api.get('/api/social/stats')
      ]);
      
      setLeaderboard(leaderboardRes.data.leaderboard || []);
      setSocialStats(socialStatsRes.data.stats || {});
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: '#ffd700' };
    if (rank === 2) return { icon: '🥈', color: '#c0c0c0' };
    if (rank === 3) return { icon: '🥉', color: '#cd7f32' };
    return { icon: rank.toString(), color: 'text.secondary' };
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent>
          <Typography variant="h6">Weekly Leaderboard</Typography>
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Weekly Leaderboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<FriendsIcon />}
              label={`${socialStats?.friendsCount || 0} friends`}
              size="small"
              variant="outlined"
            />
            {socialStats?.leaderboardRank > 0 && (
              <Chip
                icon={<TrophyIcon />}
                label={`#${socialStats.leaderboardRank}`}
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
                key={entry.id}
                sx={{
                  backgroundColor: entry.isFriend ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                  border: entry.isFriend ? '1px solid rgba(102, 126, 234, 0.2)' : 'none'
                }}
              >
                <ListItemAvatar>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main' }}>
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
                        <Typography variant="caption" sx={{ color: '#ff6b35', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 12 }} />
                          {entry.currentStreak}
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

### **2. Learning Analytics Panel (Leverage Existing AI)**

```typescript
// NEW: client/src/components/analytics/LearningInsightsPanel.tsx (90 lines)
// LEVERAGE: Existing API and design patterns

import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Grid, LinearProgress,
  FormControl, Select, MenuItem, Skeleton
} from '@mui/material';
import {
  TrendingUp as TrendsIcon,
  Assessment as AnalyticsIcon,
  School as SkillIcon,
  Target as GoalIcon
} from '@mui/icons-material';
import { ProgressRing } from '../dashboard/ProgressRing.js'; // REUSE from Phase 1
import api from '../../services/api.js';

interface LearningInsights {
  skillRadar: Record<string, any>;
  studyPatterns: any;
  goalAnalytics: any;
  recommendations: string[];
  overallProgress: any;
}

export const LearningInsightsPanel: React.FC = () => {
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [timeframe]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // LEVERAGE: Existing API patterns
      const response = await api.get(`/api/analytics/insights?timeframe=${timeframe}`);
      setInsights(response.data.insights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map(i => (
          <Grid item xs={12} md={6} key={i}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      {/* Header with timeframe selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Skill Development */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SkillIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Skill Development</Typography>
              </Box>
              
              {insights?.skillRadar && Object.entries(insights.skillRadar).map(([skill, data]: [string, any]) => (
                <Box key={skill} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                      {skill}
                    </Typography>
                    <Typography variant="caption">
                      {data.averageScore || 0}%
                    </Typography>
                  </Box>
                  {/* REUSE: ProgressRing component from Phase 1 */}
                  <LinearProgress
                    variant="determinate"
                    value={data.averageScore || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Study Patterns */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendsIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Study Patterns</Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Study Time
                  </Typography>
                  <Typography variant="h6">
                    {Math.round((insights?.studyPatterns?.totalStudyTime || 0) / 60)} hours
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Streak
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'warning.main' }}>
                    {insights?.studyPatterns?.currentStreak || 0} days
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Score
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.main' }}>
                    {insights?.studyPatterns?.averageScore || 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Goal Analytics */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GoalIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Goal Achievement</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                {/* REUSE: ProgressRing component from Phase 1 */}
                <ProgressRing
                  progress={insights?.goalAnalytics?.averageCompletion || 0}
                  size={100}
                  label="Completion Rate"
                />
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {insights?.goalAnalytics?.goalsCompleted || 0} of {insights?.goalAnalytics?.totalGoalsSet || 0} goals completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">AI Recommendations</Typography>
              </Box>
              
              {insights?.recommendations?.length > 0 ? (
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  {insights.recommendations.slice(0, 3).map((rec, index) => (
                    <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>
                      {rec}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Complete more lessons to get personalized recommendations.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
```

### **3. Enhanced Daily Goals (Client-Side Storage)**

```typescript
// ENHANCE: client/src/components/dashboard/DailyGoalsPanel.tsx (existing file +40 lines)
// EXTEND: Add goal history and social comparison

// ADD to existing DailyGoalsPanel component:

const [goalHistory, setGoalHistory] = useState<any[]>([]);
const [friendsAverage, setFriendsAverage] = useState<number>(0);

useEffect(() => {
  loadGoalHistory();
}, []);

const loadGoalHistory = () => {
  // SIMPLE: Load goal history from localStorage
  const history = localStorage.getItem('dailyGoalHistory');
  if (history) {
    setGoalHistory(JSON.parse(history));
  }
  
  // SIMPLE: Mock friends average (could fetch from API)
  setFriendsAverage(45); // Average XP of friends
};

const saveGoalToHistory = (completedGoal: any) => {
  const history = goalHistory || [];
  const today = new Date().toISOString().split('T')[0];
  
  const newEntry = {
    date: today,
    targetXp: completedGoal.targetXp,
    currentXp: completedGoal.currentXp,
    completed: completedGoal.currentXp >= completedGoal.targetXp,
    timestamp: new Date().toISOString()
  };
  
  const updatedHistory = [...history.filter(h => h.date !== today), newEntry];
  setGoalHistory(updatedHistory);
  localStorage.setItem('dailyGoalHistory', JSON.stringify(updatedHistory));
};

// ADD: Social comparison section to existing component JSX:
{/* Social Comparison */}
<Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
  <Typography variant="caption" color="text.secondary">
    Friends Average: {friendsAverage} XP
  </Typography>
  <LinearProgress
    variant="determinate"
    value={(goal?.currentXp / friendsAverage) * 100}
    sx={{ mt: 0.5, height: 4 }}
  />
  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
    {goal?.currentXp > friendsAverage ? '🎉 Above average!' : 'Keep going!'}
  </Typography>
</Box>

{/* Goal History (Last 7 days) */}
<Box sx={{ mt: 2 }}>
  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
    Last 7 Days
  </Typography>
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    {goalHistory.slice(-7).map((historyGoal, index) => (
      <Box
        key={index}
        sx={{
          width: 8,
          height: 24,
          backgroundColor: historyGoal.completed ? 'success.main' : 'grey.300',
          borderRadius: 0.5
        }}
      />
    ))}
  </Box>
</Box>
```

## Backend API Extensions (Minimal)

### **Social and Analytics Endpoints**

```typescript
// EXTEND: server/src/routes/users.routes.ts (+60 lines)
// ADD: Social and analytics endpoints using existing infrastructure

import { addSimpleSocialFeatures, generateLearningInsights } from '../services/progressService.js';

// Social endpoints
router.get('/social/leaderboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const { getWeeklyLeaderboard } = await addSimpleSocialFeatures();
    const leaderboard = await getWeeklyLeaderboard(userId, limit);
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

router.get('/social/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    const { getUserSocialStats } = await addSimpleSocialFeatures();
    const stats = await getUserSocialStats(userId);
    
    res.json({ stats });
  } catch (error) {
    console.error('Error getting social stats:', error);
    res.status(500).json({ error: 'Failed to get social stats' });
  }
});

router.post('/social/friends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { friendEmail } = req.body;
    
    if (!friendEmail) {
      return res.status(400).json({ error: 'Friend email is required' });
    }
    
    const { addFriend } = await addSimpleSocialFeatures();
    const success = await addFriend(userId, friendEmail);
    
    if (success) {
      res.json({ success: true, message: 'Friend added successfully' });
    } else {
      res.status(400).json({ error: 'Friend not found or already added' });
    }
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

router.get('/social/friends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    const { getFriendsList } = await addSimpleSocialFeatures();
    const friends = await getFriendsList(userId);
    
    res.json({ friends });
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ error: 'Failed to get friends list' });
  }
});

// Analytics endpoints
router.get('/analytics/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const timeframe = req.query.timeframe as string || 'month';
    
    // LEVERAGE: Existing AI infrastructure for insights
    const insights = await generateLearningInsights(userId);
    
    res.json({
      success: true,
      insights,
      timeframe,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate learning insights' });
  }
});
```

## Integration with HomePage

### **Integrate New Components into Existing Dashboard**

```typescript
// MODIFY: client/src/pages/HomePage.tsx
// ADD: New components to existing layout

// ADD imports for new components:
import { LeaderboardWidget } from '../components/dashboard/LeaderboardWidget.js';
import { LearningInsightsPanel } from '../components/analytics/LearningInsightsPanel.js';

// ADD: New state for enhanced features
const [showAnalytics, setShowAnalytics] = useState(false);

// ADD: Enhanced dashboard sections after existing lesson cards:
{/* Enhanced Features Section */}
<Box sx={{ mt: 4 }}>
  <Grid container spacing={3}>
    {/* Leaderboard Widget */}
    <Grid item xs={12} md={6}>
      <LeaderboardWidget />
    </Grid>
    
    {/* Enhanced Daily Goals */}
    <Gri
