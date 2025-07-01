# Task 3.2.C: Real-time Performance Analytics

## **Task Information**
- **Task ID**: 3.2.C
- **Estimated Time**: 4 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.C (Assessment Engine), Task 3.2.A (Curriculum Engine)
- **Assignee**: [To be assigned]
- **Status**: ⏳ Not Started

## **Objective**
Implement a comprehensive real-time performance analytics system that tracks user learning progress, identifies patterns, provides actionable insights, and enables data-driven optimization of the AI learning experience.

## **Success Criteria**
- [ ] Real-time tracking of all user learning activities
- [ ] Performance trend analysis and prediction
- [ ] Learning pattern identification and insights
- [ ] Automated anomaly detection for learning issues
- [ ] Personalized recommendations based on analytics
- [ ] Interactive dashboards for progress visualization
- [ ] Data export capabilities for detailed analysis
- [ ] Privacy-compliant data handling and storage
- [ ] Analytics response time < 500ms for real-time queries
- [ ] 99.9% data accuracy and integrity

## **Implementation Details**

### **Core Architecture**

#### **1. Real-time Analytics Engine**
```typescript
// server/src/services/performanceAnalytics.ts

import { 
  LearningEvent,
  PerformanceMetrics,
  LearningTrend,
  Insight,
  Recommendation,
  AnalyticsQuery,
  UserProgress,
  LearningPattern
} from '../types/Analytics';
import { EventProcessor } from './eventProcessor';
import { TrendAnalyzer } from './trendAnalyzer';
import { InsightGenerator } from './insightGenerator';
import { RecommendationEngine } from './recommendationEngine';

export class PerformanceAnalytics {
  private eventProcessor: EventProcessor;
  private trendAnalyzer: TrendAnalyzer;
  private insightGenerator: InsightGenerator;
  private recommendationEngine: RecommendationEngine;
  private realtimeData: Map<number, UserPerformanceState> = new Map();

  constructor() {
    this.eventProcessor = new EventProcessor();
    this.trendAnalyzer = new TrendAnalyzer();
    this.insightGenerator = new InsightGenerator();
    this.recommendationEngine = new RecommendationEngine();
    
    // Initialize real-time processing
    this.initializeRealtimeProcessing();
  }

  async trackLearningEvent(event: LearningEvent): Promise<void> {
    try {
      // Process event immediately
      await this.eventProcessor.processEvent(event);
      
      // Update real-time user state
      await this.updateUserState(event);
      
      // Trigger real-time analysis if needed
      await this.checkForImportantPatterns(event);
      
      // Update performance metrics
      await this.updatePerformanceMetrics(event);
      
    } catch (error) {
      console.error('Error tracking learning event:', error);
      // Fallback: queue event for retry
      await this.queueEventForRetry(event);
    }
  }

  async getUserPerformanceMetrics(
    userId: number, 
    timeframe: TimeFrame = 'week'
  ): Promise<PerformanceMetrics> {
    try {
      const now = new Date();
      const startDate = this.calculateStartDate(now, timeframe);
      
      // Get events from specified timeframe
      const events = await this.eventProcessor.getEventsInRange(
        userId, 
        startDate, 
        now
      );
      
      // Calculate comprehensive metrics
      const metrics = await this.calculatePerformanceMetrics(events, timeframe);
      
      // Enhance with real-time state
      const realtimeState = this.realtimeData.get(userId);
      if (realtimeState) {
        metrics.currentStreak = realtimeState.currentStreak;
        metrics.todayProgress = realtimeState.todayProgress;
        metrics.activeSession = realtimeState.activeSession;
      }
      
      return metrics;
    } catch (error) {
      console.error('Error getting user performance metrics:', error);
      return this.getFallbackMetrics(userId, timeframe);
    }
  }

  async analyzeLearningTrends(
    userId: number, 
    skillArea?: string
  ): Promise<LearningTrend[]> {
    try {
      // Get comprehensive learning history
      const learningHistory = await this.eventProcessor.getLearningHistory(
        userId, 
        90 // Last 90 days
      );
      
      // Apply trend analysis
      const trends = await this.trendAnalyzer.analyzeTrends(
        learningHistory,
        {
          skillArea,
          includeProjections: true,
          confidenceThreshold: 0.7,
        }
      );
      
      // Enhance trends with contextual insights
      const enhancedTrends = await Promise.all(
        trends.map(trend => this.enhanceTrendWithInsights(trend, userId))
      );
      
      return enhancedTrends;
    } catch (error) {
      console.error('Error analyzing learning trends:', error);
      return this.getFallbackTrends(userId, skillArea);
    }
  }

  async generateInsights(userId: number): Promise<Insight[]> {
    try {
      // Gather data for insight generation
      const recentPerformance = await this.getUserPerformanceMetrics(userId, 'month');
      const learningPatterns = await this.identifyLearningPatterns(userId);
      const compareMetrics = await this.getComparativeMetrics(userId);
      
      // Generate various types of insights
      const insights = await this.insightGenerator.generateInsights({
        userId,
        performance: recentPerformance,
        patterns: learningPatterns,
        comparative: compareMetrics,
        historical: await this.getHistoricalContext(userId),
      });
      
      // Prioritize and filter insights
      const prioritizedInsights = this.prioritizeInsights(insights, userId);
      
      return prioritizedInsights.slice(0, 5); // Return top 5 insights
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackInsights(userId);
    }
  }

  async generateRecommendations(userId: number): Promise<Recommendation[]> {
    try {
      // Collect comprehensive user context
      const userContext = await this.gatherUserContext(userId);
      
      // Generate recommendations based on analytics
      const recommendations = await this.recommendationEngine.generateRecommendations({
        userId,
        context: userContext,
        performance: await this.getUserPerformanceMetrics(userId, 'week'),
        trends: await this.analyzeLearningTrends(userId),
        insights: await this.generateInsights(userId),
      });
      
      // Validate and rank recommendations
      const validatedRecommendations = await this.validateRecommendations(
        recommendations, 
        userContext
      );
      
      return validatedRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(userId);
    }
  }

  async getRealtimeProgress(userId: number): Promise<RealtimeProgress> {
    const userState = this.realtimeData.get(userId);
    if (!userState) {
      return this.initializeUserState(userId);
    }
    
    return {
      userId,
      currentSession: userState.activeSession,
      todayProgress: userState.todayProgress,
      weekProgress: userState.weekProgress,
      currentStreak: userState.currentStreak,
      skillProgress: userState.skillProgress,
      lastActivity: userState.lastActivity,
      momentum: this.calculateMomentum(userState),
      achievements: userState.pendingAchievements,
      timestamp: new Date(),
    };
  }

  async detectAnomalies(userId: number): Promise<LearningAnomaly[]> {
    try {
      const recentEvents = await this.eventProcessor.getRecentEvents(userId, 7); // Last 7 days
      const userBaseline = await this.getUserBaseline(userId);
      
      const anomalies: LearningAnomaly[] = [];
      
      // Check for performance anomalies
      const performanceAnomaly = this.detectPerformanceAnomaly(recentEvents, userBaseline);
      if (performanceAnomaly) {
        anomalies.push(performanceAnomaly);
      }
      
      // Check for engagement anomalies
      const engagementAnomaly = this.detectEngagementAnomaly(recentEvents, userBaseline);
      if (engagementAnomaly) {
        anomalies.push(engagementAnomaly);
      }
      
      // Check for learning velocity anomalies
      const velocityAnomaly = this.detectVelocityAnomaly(recentEvents, userBaseline);
      if (velocityAnomaly) {
        anomalies.push(velocityAnomaly);
      }
      
      return anomalies;
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return [];
    }
  }

  // Real-time processing methods
  private async updateUserState(event: LearningEvent): Promise<void> {
    let userState = this.realtimeData.get(event.userId);
    if (!userState) {
      userState = await this.initializeUserState(event.userId);
    }
    
    // Update based on event type
    switch (event.type) {
      case 'lesson_completed':
        userState.todayProgress.lessonsCompleted++;
        userState.skillProgress[event.skillArea] = 
          (userState.skillProgress[event.skillArea] || 0) + 1;
        break;
        
      case 'exercise_completed':
        userState.todayProgress.exercisesCompleted++;
        if (event.score >= 80) {
          userState.todayProgress.excellentScores++;
        }
        break;
        
      case 'streak_extended':
        userState.currentStreak = event.data.newStreakLength;
        break;
        
      case 'session_started':
        userState.activeSession = {
          startTime: event.timestamp,
          activitiesCompleted: 0,
          currentScore: 0,
        };
        break;
        
      case 'session_ended':
        userState.activeSession = null;
        break;
    }
    
    userState.lastActivity = event.timestamp;
    this.realtimeData.set(event.userId, userState);
  }

  private async checkForImportantPatterns(event: LearningEvent): Promise<void> {
    // Check for patterns that require immediate attention
    const userId = event.userId;
    const recentEvents = await this.eventProcessor.getRecentEvents(userId, 1); // Last day
    
    // Check for struggling pattern
    if (this.isStruggling(recentEvents)) {
      await this.triggerInterventionRecommendation(userId, 'struggling_detected');
    }
    
    // Check for achievement unlocks
    const newAchievements = this.checkForAchievements(event, recentEvents);
    if (newAchievements.length > 0) {
      await this.processAchievements(userId, newAchievements);
    }
    
    // Check for milestone completion
    if (this.isMilestoneEvent(event)) {
      await this.processMilestone(userId, event);
    }
  }

  private async calculatePerformanceMetrics(
    events: LearningEvent[], 
    timeframe: TimeFrame
  ): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {
      timeframe,
      totalActivities: events.length,
      averageScore: 0,
      timeSpent: 0,
      skillBreakdown: {},
      accuracyTrend: [],
      velocityTrend: [],
      engagementLevel: 0,
      improvementRate: 0,
      strengths: [],
      weaknesses: [],
      achievements: [],
      streakInfo: {
        current: 0,
        longest: 0,
        daysActive: 0,
      },
    };
    
    if (events.length === 0) return metrics;
    
    // Calculate basic metrics
    const totalScore = events
      .filter(e => e.score !== undefined)
      .reduce((sum, e) => sum + e.score!, 0);
    const scoredEvents = events.filter(e => e.score !== undefined);
    
    metrics.averageScore = scoredEvents.length > 0 ? totalScore / scoredEvents.length : 0;
    metrics.timeSpent = events.reduce((sum, e) => sum + (e.duration || 0), 0);
    
    // Calculate skill breakdown
    events.forEach(event => {
      if (event.skillArea) {
        if (!metrics.skillBreakdown[event.skillArea]) {
          metrics.skillBreakdown[event.skillArea] = {
            activities: 0,
            averageScore: 0,
            timeSpent: 0,
            improvement: 0,
          };
        }
        metrics.skillBreakdown[event.skillArea].activities++;
        metrics.skillBreakdown[event.skillArea].timeSpent += event.duration || 0;
      }
    });
    
    // Calculate skill scores
    Object.keys(metrics.skillBreakdown).forEach(skill => {
      const skillEvents = events.filter(e => e.skillArea === skill && e.score !== undefined);
      if (skillEvents.length > 0) {
        const skillScore = skillEvents.reduce((sum, e) => sum + e.score!, 0) / skillEvents.length;
        metrics.skillBreakdown[skill].averageScore = skillScore;
      }
    });
    
    // Calculate trends (simplified)
    metrics.accuracyTrend = this.calculateAccuracyTrend(events);
    metrics.velocityTrend = this.calculateVelocityTrend(events);
    
    // Calculate engagement
    metrics.engagementLevel = this.calculateEngagement(events, timeframe);
    
    // Identify strengths and weaknesses
    metrics.strengths = this.identifyStrengths(metrics.skillBreakdown);
    metrics.weaknesses = this.identifyWeaknesses(metrics.skillBreakdown);
    
    return metrics;
  }

  // Helper methods
  private calculateStartDate(now: Date, timeframe: TimeFrame): Date {
    const start = new Date(now);
    switch (timeframe) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    return start;
  }

  private calculateMomentum(userState: UserPerformanceState): LearningMomentum {
    const now = new Date();
    const daysSinceLastActivity = userState.lastActivity ? 
      Math.floor((now.getTime() - userState.lastActivity.getTime()) / (1000 * 60 * 60 * 24)) : 
      999;
    
    let momentum: 'high' | 'medium' | 'low' | 'stalled';
    
    if (daysSinceLastActivity === 0 && userState.todayProgress.lessonsCompleted > 0) {
      momentum = 'high';
    } else if (daysSinceLastActivity <= 1) {
      momentum = 'medium';
    } else if (daysSinceLastActivity <= 3) {
      momentum = 'low';
    } else {
      momentum = 'stalled';
    }
    
    return {
      level: momentum,
      daysSinceLastActivity,
      activitiesToday: userState.todayProgress.lessonsCompleted + userState.todayProgress.exercisesCompleted,
      streak: userState.currentStreak,
    };
  }

  private async initializeUserState(userId: number): Promise<UserPerformanceState> {
    const state: UserPerformanceState = {
      userId,
      currentStreak: 0,
      todayProgress: {
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        timeSpent: 0,
        excellentScores: 0,
      },
      weekProgress: {
        totalActivities: 0,
        averageScore: 0,
        daysActive: 0,
      },
      skillProgress: {},
      activeSession: null,
      lastActivity: null,
      pendingAchievements: [],
    };
    
    this.realtimeData.set(userId, state);
    return state;
  }

  private calculateAccuracyTrend(events: LearningEvent[]): TrendPoint[] {
    // Group events by day and calculate daily accuracy
    const dailyGroups = this.groupEventsByDay(events);
    return Object.entries(dailyGroups).map(([date, dayEvents]) => {
      const scoredEvents = dayEvents.filter(e => e.score !== undefined);
      const averageScore = scoredEvents.length > 0 ? 
        scoredEvents.reduce((sum, e) => sum + e.score!, 0) / scoredEvents.length : 0;
      
      return {
        date: new Date(date),
        value: averageScore,
        count: scoredEvents.length,
      };
    });
  }

  private calculateVelocityTrend(events: LearningEvent[]): TrendPoint[] {
    // Group events by day and calculate daily activity count
    const dailyGroups = this.groupEventsByDay(events);
    return Object.entries(dailyGroups).map(([date, dayEvents]) => ({
      date: new Date(date),
      value: dayEvents.length,
      count: dayEvents.length,
    }));
  }

  private groupEventsByDay(events: LearningEvent[]): Record<string, LearningEvent[]> {
    return events.reduce((groups, event) => {
      const dateKey = event.timestamp.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    }, {} as Record<string, LearningEvent[]>);
  }

  private calculateEngagement(events: LearningEvent[], timeframe: TimeFrame): number {
    if (events.length === 0) return 0;
    
    const timeframeHours = this.getTimeframeHours(timeframe);
    const totalTime = events.reduce((sum, e) => sum + (e.duration || 0), 0) / 60; // Convert to hours
    const activityFrequency = events.length / Math.max(1, timeframeHours / 24); // Activities per day
    
    // Engagement based on time spent and activity frequency
    const timeEngagement = Math.min(totalTime / (timeframeHours * 0.1), 1); // Expect 10% of time
    const frequencyEngagement = Math.min(activityFrequency / 3, 1); // Expect 3 activities per day
    
    return (timeEngagement + frequencyEngagement) / 2;
  }

  private getTimeframeHours(timeframe: TimeFrame): number {
    switch (timeframe) {
      case 'day': return 24;
      case 'week': return 168;
      case 'month': return 720;
      case 'quarter': return 2160;
      case 'year': return 8760;
      default: return 168;
    }
  }

  private identifyStrengths(skillBreakdown: Record<string, SkillMetrics>): string[] {
    return Object.entries(skillBreakdown)
      .filter(([_, metrics]) => metrics.averageScore >= 80)
      .map(([skill, _]) => skill)
      .slice(0, 3);
  }

  private identifyWeaknesses(skillBreakdown: Record<string, SkillMetrics>): string[] {
    return Object.entries(skillBreakdown)
      .filter(([_, metrics]) => metrics.averageScore < 60)
      .map(([skill, _]) => skill)
      .slice(0, 3);
  }

  // Fallback methods
  private getFallbackMetrics(userId: number, timeframe: TimeFrame): PerformanceMetrics {
    return {
      timeframe,
      totalActivities: 0,
      averageScore: 0,
      timeSpent: 0,
      skillBreakdown: {},
      accuracyTrend: [],
      velocityTrend: [],
      engagementLevel: 0,
      improvementRate: 0,
      strengths: [],
      weaknesses: [],
      achievements: [],
      streakInfo: { current: 0, longest: 0, daysActive: 0 },
      isFallback: true,
    };
  }

  private getFallbackTrends(userId: number, skillArea?: string): LearningTrend[] {
    return [{
      userId,
      skillArea: skillArea || 'overall',
      trend: 'stable',
      confidence: 0.3,
      dataPoints: [],
      projection: null,
      timeframe: 'week',
      insights: ['Insufficient data for trend analysis'],
    }];
  }

  private getFallbackInsights(userId: number): Insight[] {
    return [{
      userId,
      type: 'general',
      title: 'Keep Learning!',
      description: 'Continue practicing regularly to build your French skills.',
      priority: 'medium',
      actionable: true,
      actions: ['Complete daily lessons', 'Practice conversation'],
      confidence: 0.8,
      generatedAt: new Date(),
    }];
  }

  private getFallbackRecommendations(userId: number): Recommendation[] {
    return [{
      userId,
      type: 'activity',
      title: 'Daily Practice',
      description: 'Spend 15 minutes daily on French practice',
      priority: 'high',
      estimatedImpact: 0.7,
      reasoning: 'Consistent practice improves learning outcomes',
      actions: ['Schedule daily practice time', 'Set learning goals'],
      timeframe: 'ongoing',
      generatedAt: new Date(),
    }];
  }

  // Additional helper methods would be implemented here...
  private async initializeRealtimeProcessing(): Promise<void> {
    // Initialize real-time event processing
  }

  private async queueEventForRetry(event: LearningEvent): Promise<void> {
    // Queue failed events for retry
  }

  private async enhanceTrendWithInsights(trend: LearningTrend, userId: number): Promise<LearningTrend> {
    // Enhance trends with additional insights
    return trend;
  }

  private async identifyLearningPatterns(userId: number): Promise<LearningPattern[]> {
    // Identify learning patterns for the user
    return [];
  }

  private async getComparativeMetrics(userId: number): Promise<any> {
    // Get comparative metrics vs other users
    return {};
  }

  private async getHistoricalContext(userId: number): Promise<any> {
    // Get historical context for insights
    return {};
  }

  private prioritizeInsights(insights: Insight[], userId: number): Insight[] {
    // Prioritize insights based on user context
    return insights.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async gatherUserContext(userId: number): Promise<any> {
    // Gather comprehensive user context
    return {};
  }

  private async validateRecommendations(recommendations: Recommendation[], context: any): Promise<Recommendation[]> {
    // Validate and rank recommendations
    return recommendations;
  }

  private async getUserBaseline(userId: number): Promise<any> {
    // Get user's baseline performance
    return {};
  }

  private detectPerformanceAnomaly(events: LearningEvent[], baseline: any): LearningAnomaly | null {
    // Detect performance anomalies
    return null;
  }

  private detectEngagementAnomaly(events: LearningEvent[], baseline: any): LearningAnomaly | null {
    // Detect engagement anomalies
    return null;
  }

  private detectVelocityAnomaly(events: LearningEvent[], baseline: any): LearningAnomaly | null {
    // Detect learning velocity anomalies
    return null;
  }

  private isStruggling(events: LearningEvent[]): boolean {
    // Check if user is struggling
    const recentScores = events
      .filter(e => e.score !== undefined)
      .map(e => e.score!)
      .slice(-5);
    
    return recentScores.length >= 3 && 
           recentScores.every(score => score < 60);
  }

  private checkForAchievements(event: LearningEvent, recentEvents: LearningEvent[]): Achievement[] {
    // Check for new achievements
    return [];
  }

  private isMilestoneEvent(event: LearningEvent): boolean {
    // Check if event represents a milestone
    return event.type === 'milestone_reached' || 
           event.type === 'level_completed';
  }

  private async triggerInterventionRecommendation(userId: number, reason: string): Promise<void> {
    // Trigger intervention recommendation
  }

  private async processAchievements(userId: number, achievements: Achievement[]): Promise<void> {
    // Process new achievements
  }

  private async processMilestone(userId: number, event: LearningEvent): Promise<void> {
    // Process milestone completion
  }
}

// Supporting interfaces and types
interface UserPerformanceState {
  userId: number;
  currentStreak: number;
  todayProgress: DailyProgress;
  weekProgress: WeeklyProgress;
  skillProgress: Record<string, number>;
  activeSession: ActiveSession | null;
  lastActivity: Date | null;
  pendingAchievements: Achievement[];
}

interface DailyProgress {
  lessonsCompleted: number;
  exercisesCompleted: number;
  timeSpent: number;
  excellentScores: number;
}

interface WeeklyProgress {
  totalActivities: number;
  averageScore: number;
  daysActive: number;
}

interface ActiveSession {
  startTime: Date;
  activitiesCompleted: number;
  currentScore: number;
}

interface RealtimeProgress {
  userId: number;
  currentSession: ActiveSession | null;
  todayProgress: DailyProgress;
  weekProgress: WeeklyProgress;
  currentStreak: number;
  skillProgress: Record<string, number>;
  lastActivity: Date | null;
  momentum: LearningMomentum;
  achievements: Achievement[];
  timestamp: Date;
}

interface LearningMomentum {
  level: 'high' | 'medium' | 'low' | 'stalled';
  daysSinceLastActivity: number;
  activitiesToday: number;
  streak: number;
}

interface LearningAnomaly {
  userId: number;
  type: 'performance' | 'engagement' | 'velocity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: Date;
  suggestedActions: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

type TimeFrame = 'day' | 'week' | 'month' | 'quarter' | 'year';

interface TrendPoint {
  date: Date;
  value: number;
  count: number;
}

interface SkillMetrics {
  activities: number;
  averageScore: number;
  timeSpent: number;
  improvement: number;
}
```

#### **2. Event Processor Service**
```typescript
// server/src/services/eventProcessor.ts

import { LearningEvent } from '../types/Analytics';

export class EventProcessor {
  private eventStore: LearningEvent[] = []; // In production, use proper database
  private eventQueue: LearningEvent[] = [];
  private processingInterval: NodeJS.Timer | null = null;

  constructor() {
    this.initializeProcessing();
  }

  async processEvent(event: LearningEvent): Promise<void> {
    try {
      // Validate event
      this.validateEvent(event);
      
      // Enrich event with additional data
      const enrichedEvent = await this.enrichEvent(event);
      
      // Store event
      await this.storeEvent(enrichedEvent);
      
      // Trigger real-time notifications if needed
      await this.checkForNotifications(enrichedEvent);
      
    } catch (error) {
      console.error('Error processing event:', error);
      throw error;
    }
  }

  async getEventsInRange(
    userId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<LearningEvent[]> {
    return this.eventStore.filter(event => 
      event.userId === userId &&
      event.timestamp >= startDate &&
      event.timestamp <= endDate
    );
  }

  async getLearningHistory(userId: number, days: number): Promise<LearningEvent[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.getEventsInRange(userId, startDate, endDate);
  }

  async getRecentEvents(userId: number, days: number): Promise<LearningEvent[]> {
    return this.getLearningHistory(userId, days);
  }

  private validateEvent(event: LearningEvent): void {
    if (!event.userId || !event.type || !event.timestamp) {
      throw new Error('Invalid event: missing required fields');
    }
    
    if (event.timestamp > new Date()) {
      throw new Error('Invalid event: timestamp cannot be in the future');
    }
  }

  private async enrichEvent(event: LearningEvent): Promise<LearningEvent> {
    // Add additional context and metadata
    const enriched: LearningEvent = {
      ...event,
      id: event.id || this.generateEventId(),
      metadata: {
        ...event.metadata,
        processedAt: new Date(),
        source: event.metadata?.source || 'web',
      },
    };

    // Add derived fields
    if (event.type === 'exercise_completed' && event.score !== undefined) {
      enriched.derived = {
        performanceLevel: this.categorizePerformance(event.score),
        difficulty: event.metadata?.difficulty || 'medium',
      };
    }

    return enriched;
  }

  private async storeEvent(event: LearningEvent): Promise<void> {
    // In production, this would write to database
    this.eventStore.push(event);
    
    // Keep only recent events in memory (last 1000 per user)
    this.pruneOldEvents();
  }

  private async checkForNotifications(event: LearningEvent): Promise<void> {
    // Check for events that should trigger notifications
    if (event.type === 'achievement_unlocked') {
      await this.triggerAchievementNotification(event);
    }
    
    if (event.type === 'streak_broken') {
      await this.triggerStreakBrokenNotification(event);
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizePerformance(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  private pruneOldEvents(): void {
    // Keep events from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    this.eventStore = this.eventStore.filter(event => 
      event.timestamp >= sixMonthsAgo
    );
  }

  private async triggerAchievementNotification(event: LearningEvent): Promise<void> {
    // Trigger achievement notification
    console.log(`Achievement unlocked for user ${event.userId}:`, event.data);
  }

  private async triggerStreakBrokenNotification(event: LearningEvent): Promise<void> {
    // Trigger streak broken notification
    console.log(`Streak broken for user ${event.userId}:`, event.data);
  }

  private initializeProcessing(): void {
    // Process queued events every 5 seconds
    this.processingInterval = setInterval(() => {
      this.processQueuedEvents();
    }, 5000);
  }

  private async processQueuedEvents(): Promise<void> {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        try {
          await this.processEvent(event);
        } catch (error) {
          console.error('Error processing queued event:', error);
          // Optionally re-queue or send to dead letter queue
        }
      }
    }
  }

  destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
  }
}
```

#### **3. Analytics Dashboard Component**
```typescript
// client/src/components/analytics/AnalyticsDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp as TrendIcon,
  Insights as InsightIcon,
  EmojiEvents as AchievementIcon,
  Speed as PerformanceIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePerformanceAnalytics } from '../../hooks/usePerformanceAnalytics';

interface AnalyticsDashboardProps {
  userId: number;
  embedded?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userId,
  embedded = false,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('week');
  const {
    metrics,
    trends,
    insights,
    recommendations,
    realtimeProgress,
    loading,
    refreshAnalytics,
  } = usePerformanceAnalytics(userId, timeframe);

  useEffect(() => {
    refreshAnalytics();
  }, [timeframe, refreshAnalytics]);

  if (loading && !metrics) {
    return <AnalyticsLoadingSkeleton />;
  }

  return (
    <Box sx={{ p: embedded ? 0 : 3 }}>
      {/* Header with Controls */}
      {!embedded && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Learning Analytics
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              onClick={refreshAnalytics}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Refresh'}
            </Button>
          </Box>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Real-time Progress */}
        <Grid item xs={12}>
          <RealtimeProgressCard progress={realtimeProgress} />
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Average Score"
            value={`${Math.round(metrics?.averageScore || 0)}%`}
            icon={<PerformanceIcon />}
            color="#4CAF50"
            trend={metrics?.improvementRate ? `+${metrics.improvementRate.toFixed(1)}%` : undefined}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Activities Completed"
            value={metrics?.totalActivities?.toString() || '0'}
            icon={<TrendIcon />}
            color="#2196F3"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Time Spent"
            value={`${Math.round((metrics?.timeSpent || 0) / 60)}h`}
            icon={<TrendIcon />}
            color="#FF9800"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <MetricCard
            title="Current Streak"
            value={`${metrics?.streakInfo?.current || 0} days`}
            icon={<AchievementIcon />}
            color="#E91E63"
          />
        </Grid>

        {/* Performance Trend Chart */}
        <Grid item xs={12} lg={8}>
          <PerformanceTrendChart trends={trends} />
        </Grid>

        {/* Skill Breakdown */}
        <Grid item xs={12} lg={4}>
          <SkillBreakdownCard skillBreakdown={metrics?.skillBreakdown || {}} />
        </Grid>

        {/* Insights and Recommendations */}
        <Grid item xs={12} md={6}>
          <InsightsCard insights={insights} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecommendationsCard recommendations={recommendations} />
        </Grid>
      </Grid>
    </Box>
  );
};

const RealtimeProgressCard: React.FC<{ progress: any }> = ({ progress }) => (
  <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
    <CardContent>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {progress?.momentum?.level === 'high' ? '🔥' : 
               progress?.momentum?.level === 'medium' ? '⚡' : 
               progress?.momentum?.level === 'low' ? '🌱' : '😴'}
            </Typography>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
              {progress?.momentum?.level || 'Unknown'} Momentum
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={9}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Today's Activities</Typography>
              <Typography variant="h6">{progress?.todayProgress?.lessonsCompleted || 0}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Current Streak</Typography>
              <Typography variant="h6">{progress?.currentStreak || 0} days</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>This Week</Typography>
              <Typography variant="h6">{progress?.weekProgress?.totalActivities || 0}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Session Active</Typography>
              <Typography variant="h6">{progress?.currentSession ? 'Yes' : 'No'}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color, mr: 1 }}>{icon}</Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {value}
      </Typography>
      
      {trend && (
        <Typography variant="body2" sx={{ color: '#4CAF50' }}>
          {trend} from last period
        </Typography>
      )}
    </CardContent>
  </Card>
);

const PerformanceTrendChart: React.FC<{ trends: any[] }> = ({ trends }) => {
  const accuracyTrend = trends.find(t => t.type === 'accuracy')?.dataPoints || [];
  
  return (
    <Card sx={{ height: '400px' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Performance Trend
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={accuracyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SkillBreakdownCard: React.FC<{ skillBreakdown: any }> = ({ skillBreakdown }) => (
  <Card sx={{ height: '400px' }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Skills Progress
      </Typography>
      
      {Object.entries(skillBreakdown).map(([skill, metrics]: [string, any]) => (
        <Box key={skill} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {skill}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.round(metrics.averageScore)}%
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', bgcolor: '#f0f0f0', borderRadius: 1, height: 8 }}>
            <Box
              sx={{
                width: `${metrics.averageScore}%`,
                bgcolor: metrics.averageScore >= 80 ? '#4CAF50' : 
                         metrics.averageScore >= 60 ? '#FF9800' : '#f44336',
                height: '100%',
                borderRadius: 1,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>
      ))}
    </CardContent>
  </Card>
);

const InsightsCard: React.FC<{ insights: any[] }> = ({ insights }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InsightIcon sx={{ color: '#667eea', mr: 1 }} />
        <Typography variant="h6">AI Insights</Typography>
      </Box>
      
      {insights.map((insight, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f8faff', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {insight.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {insight.description}
          </Typography>
        </Box>
      ))}
    </CardContent>
  </Card>
);

const RecommendationsCard: React.FC<{ recommendations: any[] }> = ({ recommendations }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>
        AI Recommendations
      </Typography>
      
      {recommendations.map((rec, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {rec.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            {rec.description}
          </Typography>
          <Button size="small" variant="outlined">
            Apply Recommendation
          </Button>
        </Box>
      ))}
    </CardContent>
  </Card>
);

const AnalyticsLoadingSkeleton: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} md={6} lg={3} key={i}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography>Loading...</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

type TimeFrame = 'day' | 'week' | 'month' | 'quarter';
```

## **Files to Create/Modify**

### **New Files**
```
server/src/services/
├── performanceAnalytics.ts     (Main analytics engine)
├── eventProcessor.ts           (Event processing and storage)
├── trendAnalyzer.ts           (Trend analysis algorithms)
├── insightGenerator.ts        (AI insight generation)
└── recommendationEngine.ts    (Recommendation generation)

server/src/types/
└── Analytics.ts               (Analytics-specific types)

server/src/controllers/
└── analyticsController.ts     (Analytics API endpoints)

server/src/routes/
└── analyticsRoutes.ts         (Analytics routes)

client/src/components/analytics/
├── AnalyticsDashboard.tsx     (Main analytics dashboard)
├── PerformanceTrendChart.tsx  (Trend visualization)
├── SkillBreakdownChart.tsx    (Skill progress visualization)
└── RealtimeProgress.tsx       (Real-time progress display)

client/src/hooks/
└── usePerformanceAnalytics.ts (Analytics data hook)
```

### **Files to Modify**
```
server/src/services/aiOrchestrator.ts     (Integrate analytics)
client/src/pages/AILearningDashboard.tsx (Add analytics widgets)
server/src/app.ts                        (Add analytics routes)
```

## **Testing Strategy**

### **Unit Tests**
```typescript
// server/src/tests/performanceAnalytics.test.ts

describe('PerformanceAnalytics', () => {
  let analytics: PerformanceAnalytics;
  
  beforeEach(() => {
    analytics = new PerformanceAnalytics();
  });

  describe('trackLearningEvent', () => {
    it('should track learning events in real-time', async () => {
      const event: LearningEvent = {
        userId: 1,
        type: 'lesson_completed',
        skillArea: 'vocabulary',
        score: 85,
        duration: 600,
        timestamp: new Date(),
      };

      await analytics.trackLearningEvent(event);
      
      const progress = await analytics.getRealtimeProgress(1);
      expect(progress.todayProgress.lessonsCompleted).toBe(1);
    });
  });

  describe('getUserPerformanceMetrics', () => {
    it('should calculate comprehensive performance metrics', async () => {
      // Add test events
      const events = [
        createTestEvent('lesson_completed', 85),
        createTestEvent('exercise_completed', 92),
        createTestEvent('quiz_completed', 78),
      ];

      for (const event of events) {
        await analytics.trackLearningEvent(event);
      }

      const metrics = await analytics.getUserPerformanceMetrics(1, 'week');
      
      expect(metrics.totalActivities).toBe(3);
      expect(metrics.averageScore).toBeCloseTo(85);
      expect(metrics.strengths).toBeDefined();
      expect(metrics.weaknesses).toBeDefined();
    });
  });

  describe('detectAnomalies', () => {
    it('should detect performance anomalies', async () => {
      // Create events showing declining performance
      const events = [
        createTestEvent('lesson_completed', 30),
        createTestEvent('lesson_completed', 25),
        createTestEvent('lesson_completed', 20),
      ];

      for (const event of events) {
        await analytics.trackLearningEvent(event);
      }

      const anomalies = await analytics.detectAnomalies(1);
      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].type).toBe('performance');
    });
  });
});
```

## **Review Points & Solutions**

### **🔍 Review Point 1: Real-time Performance**
**Concern**: Analytics processing might impact application performance
**Solution**: 
- Asynchronous event processing with queuing
- Efficient in-memory caching for frequently accessed data
- Database optimization with proper indexing
- Horizontal scaling capabilities for analytics services

### **🔍 Review Point 2: Data Privacy**
**Concern**: Learning analytics involve sensitive user data
**Solution**:
- Data anonymization for comparative analytics
- GDPR-compliant data retention policies
- User consent management for analytics features
- Secure data transmission and storage

### **🔍 Review Point 3: Analytics Accuracy**
**Concern**: AI-generated insights might be misleading
**Solution**:
- Confidence scoring for all insights and recommendations
- Statistical validation of trend analysis
- Expert validation of pedagogical recommendations
- User feedback integration for continuous improvement

### **🔍 Review Point 4: Scalability**
**Concern**: Analytics system needs to scale with user growth
**Solution**:
- Event-driven architecture with message queuing
- Distributed analytics processing
- Caching strategies for expensive computations
- Efficient data aggregation and summarization

## **Progress Tracking**

### **Task Checklist**
- [ ] **Core Analytics Engine** (2 hours)
  - [ ] PerformanceAnalytics service
  - [ ] EventProcessor implementation
  - [ ] Real-time tracking system
  - [ ] Anomaly detection logic
- [ ] **Analysis Components** (1.5 hours)
  - [ ] TrendAnalyzer implementation
  - [ ] InsightGenerator service
  - [ ] RecommendationEngine logic
  - [ ] Pattern recognition algorithms
- [ ] **Frontend Implementation** (30 minutes)
  - [ ] Analytics dashboard component
  - [ ] Chart visualizations
  - [ ] Real-time progress display
  - [ ] Performance metrics cards

### **Success Metrics**
- [ ] Analytics response time < 500ms for real-time queries
- [ ] Event processing latency < 100ms
- [ ] Data accuracy > 99.9%
- [ ] Insight relevance > 80% user satisfaction
- [ ] Dashboard load time < 2 seconds
- [ ] Real-time updates work reliably

## **Next Steps**
1. Complete this implementation
2. Integration with all AI services for comprehensive tracking
3. Performance optimization and caching tuning
4. Begin Task 3.2.D: Multi-modal AI Integration
5. User testing and analytics validation

---

**Status**: ⏳ Ready for Implementation  
**Dependencies**: Task 3.1.C (Assessment Engine), Task 3.2.A (Curriculum Engine)  
**Estimated Completion**: After dependencies + 4 hours development
