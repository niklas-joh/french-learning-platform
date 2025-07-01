# Task 3.2.A: Adaptive Curriculum Engine

## **Task Information**
- **Task ID**: 3.2.A
- **Estimated Time**: 6 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.A (AI Orchestration), Task 3.1.C (Assessment Engine)
- **Assignee**: [To be assigned]
- **Status**: ⏳ Not Started

## **Objective**
Implement an intelligent curriculum engine that dynamically creates and adapts learning paths based on user progress, performance patterns, and learning goals. The engine should provide personalized learning sequences that optimize for both engagement and learning effectiveness.

## **Success Criteria**
- [ ] Generates personalized learning paths based on user data
- [ ] Adapts curriculum in real-time based on performance
- [ ] Identifies and fills knowledge gaps automatically
- [ ] Maintains optimal challenge level (not too easy, not too hard)
- [ ] Provides clear progression milestones and goals
- [ ] Supports multiple learning styles and preferences
- [ ] Predicts learning outcomes with >75% accuracy
- [ ] Reduces time to competency by 30% vs linear curriculum

## **Implementation Details**

### **Core Architecture**

#### **1. Adaptive Curriculum Engine Service**
```typescript
// server/src/services/aiCurriculumEngine.ts

import { OpenAI } from 'openai';
import { 
  UserProfile, 
  LearningPath, 
  CurriculumNode,
  AdaptationTrigger,
  LearningGoal,
  SkillAssessment,
  PathRecommendation 
} from '../types/Curriculum';
import { PromptTemplateEngine } from './promptTemplateEngine';
import { CacheService } from './cacheService';
import { LearningAnalytics } from './learningAnalytics';

export class AICurriculumEngine {
  private openai: OpenAI;
  private promptEngine: PromptTemplateEngine;
  private cache: CacheService;
  private analytics: LearningAnalytics;

  constructor(openai: OpenAI) {
    this.openai = openai;
    this.promptEngine = new PromptTemplateEngine();
    this.cache = new CacheService();
    this.analytics = new LearningAnalytics();
  }

  async generateDailyPlan(
    userProfile: UserProfile, 
    learningContext: any
  ): Promise<DailyLearningPlan> {
    try {
      const cacheKey = `daily-plan:${userProfile.userId}:${this.getDayKey()}`;
      let plan = await this.cache.get(cacheKey);

      if (!plan) {
        // Analyze current user state
        const currentSkills = await this.assessCurrentSkills(userProfile);
        const learningVelocity = await this.calculateLearningVelocity(userProfile);
        const optimalChallenge = await this.determineOptimalChallenge(userProfile, currentSkills);
        
        // Generate AI-powered daily plan
        const prompt = this.promptEngine.generateDailyPlanPrompt({
          userProfile,
          currentSkills,
          learningVelocity,
          optimalChallenge,
          timeAvailable: userProfile.preferredSessionLength || 20,
          recentPerformance: learningContext.recentPerformance,
        });

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.7,
        });

        const aiPlan = await this.parseDailyPlan(response.choices[0]?.message?.content);
        
        // Validate and optimize the plan
        plan = await this.validateAndOptimizePlan(aiPlan, userProfile, currentSkills);
        
        await this.cache.set(cacheKey, plan, 4 * 60 * 60); // 4-hour cache
      }

      return plan;
    } catch (error) {
      console.error('Error generating daily plan:', error);
      return this.getFallbackDailyPlan(userProfile);
    }
  }

  async createLearningPath(
    userGoals: LearningGoal[], 
    currentLevel: string,
    timeframe: number // weeks
  ): Promise<LearningPath> {
    try {
      // Analyze goal complexity and dependencies
      const goalAnalysis = await this.analyzeGoals(userGoals);
      const skillGaps = await this.identifySkillGaps(currentLevel, userGoals);
      const learningSequence = await this.optimizeLearningSequence(skillGaps, timeframe);

      // Generate comprehensive learning path with AI
      const prompt = this.promptEngine.generateLearningPathPrompt({
        goals: userGoals,
        currentLevel,
        timeframe,
        skillGaps,
        learningSequence,
        userPreferences: await this.getUserPreferences(userGoals[0]?.userId),
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.6,
      });

      const aiPath = await this.parseLearningPath(response.choices[0]?.message?.content);
      
      // Create curriculum nodes with dependencies
      const pathWithNodes = await this.createCurriculumNodes(aiPath, skillGaps);
      
      return {
        id: `path_${Date.now()}`,
        userId: userGoals[0]?.userId,
        title: aiPath.title,
        description: aiPath.description,
        estimatedDuration: timeframe,
        nodes: pathWithNodes,
        goals: userGoals,
        currentProgress: 0,
        adaptationHistory: [],
        createdAt: new Date(),
        lastAdaptedAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating learning path:', error);
      return this.getFallbackLearningPath(userGoals, currentLevel);
    }
  }

  async adaptPath(
    currentPath: LearningPath,
    trigger: AdaptationTrigger
  ): Promise<LearningPath> {
    try {
      // Analyze why adaptation is needed
      const adaptationAnalysis = await this.analyzeAdaptationNeed(currentPath, trigger);
      
      // Determine adaptation strategy
      const strategy = await this.determineAdaptationStrategy(adaptationAnalysis);
      
      // Apply adaptation using AI
      const prompt = this.promptEngine.generatePathAdaptationPrompt({
        currentPath,
        trigger,
        adaptationAnalysis,
        strategy,
        userProgress: trigger.userProgress,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.5,
      });

      const adaptationPlan = await this.parseAdaptationPlan(response.choices[0]?.message?.content);
      
      // Apply the adaptation
      const adaptedPath = await this.applyAdaptation(currentPath, adaptationPlan);
      
      // Record adaptation history
      adaptedPath.adaptationHistory.push({
        timestamp: new Date(),
        trigger: trigger.type,
        changes: adaptationPlan.changes,
        reason: adaptationPlan.reason,
      });

      return adaptedPath;
    } catch (error) {
      console.error('Error adapting learning path:', error);
      return currentPath; // Return unchanged path on error
    }
  }

  async recommendActivity(
    userProfile: UserProfile,
    currentContext: any
  ): Promise<ActivityRecommendation> {
    try {
      // Analyze current learning state
      const skillState = await this.assessCurrentSkills(userProfile);
      const motivationLevel = await this.assessMotivationLevel(userProfile);
      const optimalDifficulty = await this.calculateOptimalDifficulty(userProfile, skillState);
      
      // Get AI recommendation
      const prompt = this.promptEngine.generateActivityRecommendationPrompt({
        userProfile,
        skillState,
        motivationLevel,
        optimalDifficulty,
        currentContext,
        availableTime: currentContext.availableTime || 15,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });

      const recommendation = await this.parseActivityRecommendation(
        response.choices[0]?.message?.content
      );

      return {
        activityType: recommendation.activityType,
        topic: recommendation.topic,
        difficulty: recommendation.difficulty,
        estimatedTime: recommendation.estimatedTime,
        reasoning: recommendation.reasoning,
        expectedOutcome: recommendation.expectedOutcome,
        confidence: this.calculateRecommendationConfidence(skillState, recommendation),
      };
    } catch (error) {
      console.error('Error recommending activity:', error);
      return this.getFallbackActivityRecommendation(userProfile);
    }
  }

  // Skill assessment and analysis methods
  private async assessCurrentSkills(userProfile: UserProfile): Promise<SkillAssessment> {
    const recentPerformance = await this.getRecentPerformance(userProfile.userId);
    const skillAreas = ['vocabulary', 'grammar', 'pronunciation', 'listening', 'reading', 'writing'];
    
    const skillLevels = {};
    for (const skill of skillAreas) {
      const performances = recentPerformance.filter(p => p.skillArea === skill);
      if (performances.length > 0) {
        const avgScore = performances.reduce((sum, p) => sum + p.score, 0) / performances.length;
        const trend = this.calculateSkillTrend(performances);
        skillLevels[skill] = {
          level: this.scoreToLevel(avgScore),
          confidence: Math.min(performances.length / 5, 1), // More data = higher confidence
          trend,
          lastAssessed: new Date(),
        };
      } else {
        skillLevels[skill] = {
          level: userProfile.level || 'A1',
          confidence: 0.3, // Low confidence without data
          trend: 'stable',
          lastAssessed: null,
        };
      }
    }

    return {
      userId: userProfile.userId,
      skills: skillLevels,
      overallLevel: this.calculateOverallLevel(skillLevels),
      assessedAt: new Date(),
    };
  }

  private async calculateLearningVelocity(userProfile: UserProfile): Promise<LearningVelocity> {
    const activityHistory = await this.getActivityHistory(userProfile.userId, 30); // Last 30 days
    
    if (activityHistory.length < 5) {
      return {
        activitiesPerWeek: 3, // Default assumption
        improvementRate: 0.1, // 10% per week
        consistency: 0.5, // Moderate consistency
      };
    }

    const activitiesPerWeek = activityHistory.length / 4.3; // 30 days / 7 days
    const improvementRate = this.calculateImprovementRate(activityHistory);
    const consistency = this.calculateConsistency(activityHistory);

    return {
      activitiesPerWeek,
      improvementRate,
      consistency,
    };
  }

  private async determineOptimalChallenge(
    userProfile: UserProfile, 
    currentSkills: SkillAssessment
  ): Promise<ChallengeLevel> {
    // Flow theory: optimal challenge is slightly above current ability
    const averageSkillLevel = this.calculateAverageSkillLevel(currentSkills);
    const motivationFactor = await this.getMotivationFactor(userProfile.userId);
    
    // Adjust challenge based on recent performance and motivation
    let targetDifficulty = averageSkillLevel + 0.2; // Slightly above current level
    
    if (motivationFactor < 0.5) {
      targetDifficulty -= 0.1; // Easier if motivation is low
    } else if (motivationFactor > 0.8) {
      targetDifficulty += 0.1; // Harder if motivation is high
    }

    return {
      level: Math.max(0.1, Math.min(1.0, targetDifficulty)),
      reasoning: this.generateChallengeReasoning(averageSkillLevel, motivationFactor, targetDifficulty),
    };
  }

  // Goal and path analysis methods
  private async analyzeGoals(goals: LearningGoal[]): Promise<GoalAnalysis> {
    const complexity = goals.reduce((sum, goal) => sum + this.assessGoalComplexity(goal), 0) / goals.length;
    const dependencies = this.identifyGoalDependencies(goals);
    const timeRequirement = goals.reduce((sum, goal) => sum + (goal.estimatedHours || 10), 0);

    return {
      complexity,
      dependencies,
      timeRequirement,
      priority: this.calculateGoalPriority(goals),
    };
  }

  private async identifySkillGaps(currentLevel: string, goals: LearningGoal[]): Promise<SkillGap[]> {
    const requiredSkills = this.extractRequiredSkills(goals);
    const currentSkillLevel = this.levelToNumeric(currentLevel);
    
    const gaps = [];
    for (const [skill, requiredLevel] of Object.entries(requiredSkills)) {
      const numericRequired = this.levelToNumeric(requiredLevel);
      if (numericRequired > currentSkillLevel) {
        gaps.push({
          skill,
          currentLevel: currentLevel,
          requiredLevel: requiredLevel,
          priority: this.calculateSkillPriority(skill, goals),
          estimatedTime: this.estimateTimeToFill(currentSkillLevel, numericRequired),
        });
      }
    }

    return gaps.sort((a, b) => b.priority - a.priority);
  }

  private async optimizeLearningSequence(gaps: SkillGap[], timeframe: number): Promise<LearningSequence> {
    // Use AI to optimize the sequence based on dependencies and learning science
    const prompt = this.promptEngine.generateSequenceOptimizationPrompt({
      skillGaps: gaps,
      timeframe,
      constraints: {
        maxParallelSkills: 3,
        prerequisiteMandatory: true,
        spacedRepetition: true,
      },
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3,
    });

    return await this.parseSequenceOptimization(response.choices[0]?.message?.content);
  }

  // Fallback methods
  private getFallbackDailyPlan(userProfile: UserProfile): DailyLearningPlan {
    return {
      title: "Continue Your French Journey",
      description: "Balanced practice focusing on core skills",
      activities: [
        {
          type: "vocabulary",
          topic: "daily-activities",
          difficulty: userProfile.level || "A2",
          estimatedTime: 8,
        },
        {
          type: "grammar",
          topic: "present-tense",
          difficulty: userProfile.level || "A2", 
          estimatedTime: 7,
        },
        {
          type: "conversation",
          topic: "introductions",
          difficulty: userProfile.level || "A2",
          estimatedTime: 5,
        }
      ],
      totalTime: 20,
      aiGenerated: false,
      fallback: true,
    };
  }

  private getFallbackLearningPath(goals: LearningGoal[], currentLevel: string): LearningPath {
    return {
      id: `fallback_${Date.now()}`,
      userId: goals[0]?.userId || 0,
      title: "Structured French Learning Path",
      description: "A comprehensive approach to French language learning",
      estimatedDuration: 12, // 12 weeks
      nodes: this.createBasicPathNodes(currentLevel),
      goals,
      currentProgress: 0,
      adaptationHistory: [],
      createdAt: new Date(),
      lastAdaptedAt: new Date(),
      isFallback: true,
    };
  }

  private getFallbackActivityRecommendation(userProfile: UserProfile): ActivityRecommendation {
    return {
      activityType: "vocabulary",
      topic: "daily-activities",
      difficulty: userProfile.level || "A2",
      estimatedTime: 10,
      reasoning: "Vocabulary building is fundamental for language learning",
      expectedOutcome: "Learn 5-8 new French words",
      confidence: 0.7,
      isFallback: true,
    };
  }

  // Helper methods
  private getDayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  private scoreToLevel(score: number): string {
    if (score >= 90) return 'C2';
    if (score >= 80) return 'C1';
    if (score >= 70) return 'B2';
    if (score >= 60) return 'B1';
    if (score >= 50) return 'A2';
    return 'A1';
  }

  private levelToNumeric(level: string): number {
    const levels = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
    return levels[level] || 1;
  }

  private calculateSkillTrend(performances: any[]): 'improving' | 'stable' | 'declining' {
    if (performances.length < 3) return 'stable';
    
    const recent = performances.slice(-3);
    const older = performances.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, p) => sum + p.score, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.score, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'declining';
    return 'stable';
  }

  private calculateOverallLevel(skillLevels: any): string {
    const levels = Object.values(skillLevels).map((skill: any) => this.levelToNumeric(skill.level));
    const average = levels.reduce((sum, level) => sum + level, 0) / levels.length;
    
    return this.numericToLevel(Math.round(average));
  }

  private numericToLevel(numeric: number): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levels[Math.max(0, Math.min(5, numeric - 1))] || 'A1';
  }

  private calculateAverageSkillLevel(skills: SkillAssessment): number {
    const skillValues = Object.values(skills.skills);
    const sum = skillValues.reduce((total: number, skill: any) => {
      return total + this.levelToNumeric(skill.level);
    }, 0);
    return sum / skillValues.length / 6; // Normalize to 0-1 scale
  }

  // Placeholder methods for database operations
  private async getRecentPerformance(userId: number): Promise<any[]> {
    // Implement database query for recent performance data
    return [];
  }

  private async getActivityHistory(userId: number, days: number): Promise<any[]> {
    // Implement database query for activity history
    return [];
  }

  private async getMotivationFactor(userId: number): Promise<number> {
    // Calculate motivation based on recent engagement
    return 0.7; // Default moderate motivation
  }

  private async getUserPreferences(userId: number): Promise<any> {
    // Get user learning preferences
    return {};
  }

  // Additional parsing and helper methods would be implemented here...
  private async parseDailyPlan(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing daily plan:', error);
      return null;
    }
  }

  private async parseLearningPath(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing learning path:', error);
      return null;
    }
  }

  private async parseActivityRecommendation(content: string): Promise<any> {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing activity recommendation:', error);
      return {};
    }
  }

  // Additional helper methods for calculations and analysis...
}
```

#### **2. Learning Analytics Service**
```typescript
// server/src/services/learningAnalytics.ts

export class LearningAnalytics {
  
  calculateImprovementRate(activityHistory: any[]): number {
    if (activityHistory.length < 2) return 0.1; // Default 10% improvement
    
    // Sort by date
    const sorted = activityHistory.sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    
    // Calculate linear regression of scores over time
    const n = sorted.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    sorted.forEach((activity, index) => {
      const x = index; // Time index
      const y = activity.score; // Performance score
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Convert slope to improvement rate per week
    const improvementPerActivity = slope;
    const activitiesPerWeek = this.calculateActivityFrequency(sorted);
    
    return Math.max(0, improvementPerActivity * activitiesPerWeek / 100); // Convert to percentage
  }

  calculateConsistency(activityHistory: any[]): number {
    if (activityHistory.length < 3) return 0.5;
    
    // Calculate time gaps between activities
    const sorted = activityHistory.sort((a, b) => 
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
    
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const gap = new Date(sorted[i].completedAt).getTime() - 
                   new Date(sorted[i-1].completedAt).getTime();
      gaps.push(gap / (1000 * 60 * 60 * 24)); // Convert to days
    }
    
    // Calculate coefficient of variation (lower = more consistent)
    const mean = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - mean, 2), 0) / gaps.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / mean;
    
    // Convert to consistency score (0-1, higher = more consistent)
    return Math.max(0, Math.min(1, 1 - (coefficientOfVariation / 2)));
  }

  private calculateActivityFrequency(activities: any[]): number {
    if (activities.length < 2) return 3; // Default 3 per week
    
    const firstDate = new Date(activities[0].completedAt);
    const lastDate = new Date(activities[activities.length - 1].completedAt);
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    const weeksDiff = daysDiff / 7;
    
    return activities.length / Math.max(weeksDiff, 1);
  }

  predictLearningOutcome(
    userProfile: any,
    plannedActivities: any[],
    timeframe: number
  ): LearningPrediction {
    // Simplified prediction model - in production, use ML models
    const currentLevel = this.levelToNumeric(userProfile.level);
    const improvementRate = userProfile.learningVelocity?.improvementRate || 0.1;
    const activityImpact = plannedActivities.length * 0.05; // 5% per activity
    
    const predictedImprovement = (improvementRate * timeframe + activityImpact) * 
                                userProfile.learningVelocity?.consistency || 0.7;
    
    const predictedLevel = Math.min(6, currentLevel + predictedImprovement);
    
    return {
      currentLevel: userProfile.level,
      predictedLevel: this.numericToLevel(Math.round(predictedLevel)),
      confidence: this.calculatePredictionConfidence(userProfile, plannedActivities),
      timeframe,
      factors: {
        improvementRate,
        activityImpact,
        consistency: userProfile.learningVelocity?.consistency || 0.7,
      },
    };
  }

  private levelToNumeric(level: string): number {
    const levels = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
    return levels[level] || 1;
  }

  private numericToLevel(numeric: number): string {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levels[Math.max(0, Math.min(5, numeric - 1))] || 'A1';
  }

  private calculatePredictionConfidence(userProfile: any, activities: any[]): number {
    let confidence = 0.5; // Base confidence
    
    // More data = higher confidence
    if (userProfile.totalLessonsCompleted > 20) confidence += 0.2;
    if (userProfile.totalLessonsCompleted > 50) confidence += 0.1;
    
    // Consistency increases confidence
    const consistency = userProfile.learningVelocity?.consistency || 0.5;
    confidence += consistency * 0.3;
    
    // Recent activity increases confidence
    if (activities.length > 10) confidence += 0.1;
    
    return Math.min(1, confidence);
  }
}

interface LearningPrediction {
  currentLevel: string;
  predictedLevel: string;
  confidence: number;
  timeframe: number;
  factors: {
    improvementRate: number;
    activityImpact: number;
    consistency: number;
  };
}
```

#### **3. Enhanced Prompt Templates**
```typescript
// server/src/services/promptTemplateEngine.ts (additions)

export class PromptTemplateEngine {
  // ... existing methods ...

  generateDailyPlanPrompt(params: DailyPlanParams): string {
    return `Create a personalized daily French learning plan:

STUDENT PROFILE:
- User ID: ${params.userProfile.userId}
- Current Level: ${params.userProfile.level}
- Learning Velocity: ${params.learningVelocity.activitiesPerWeek} activities/week
- Improvement Rate: ${params.learningVelocity.improvementRate * 100}% per week
- Consistency: ${params.learningVelocity.consistency * 100}%
- Available Time: ${params.timeAvailable} minutes
- Recent Performance: ${params.recentPerformance * 100}%

CURRENT SKILLS ASSESSMENT:
${Object.entries(params.currentSkills.skills).map(([skill, data]: [string, any]) => 
  `- ${skill}: ${data.level} (${data.trend}, confidence: ${Math.round(data.confidence * 100)}%)`
).join('\n')}

OPTIMAL CHALLENGE LEVEL:
- Target Difficulty: ${params.optimalChallenge.level * 100}%
- Reasoning: ${params.optimalChallenge.reasoning}

PLAN REQUIREMENTS:
- Focus on skills that are trending downward or have low confidence
- Maintain optimal challenge level to promote flow state
- Include variety to maintain engagement
- Prioritize recent weak areas
- Respect time constraints

Return a JSON object with this structure:
{
  "title": "Engaging plan title",
  "description": "Brief description explaining the plan's focus",
  "activities": [
    {
      "type": "vocabulary|grammar|conversation|listening|reading|writing",
      "topic": "specific topic based on user needs",
      "difficulty": "CEFR level appropriate for challenge",
      "estimatedTime": minutes,
      "reasoning": "Why this activity was selected",
      "targetSkills": ["skills this activity develops"],
      "priority": 1-5
    }
  ],
  "totalTime": ${params.timeAvailable},
  "focusAreas": ["primary learning objectives for today"],
  "expectedOutcomes": ["what user should achieve"],
  "adaptiveNotes": "How this plan adapts to user's current state"
}`;
  }

  generateLearningPathPrompt(params: LearningPathParams): string {
    return `Design a comprehensive French learning path:

LEARNING GOALS:
${params.goals.map(goal => 
  `- ${goal.title}: ${goal.description} (Priority: ${goal.priority}, Est. ${goal.estimatedHours}h)`
).join('\n')}

STUDENT CONTEXT:
- Current Level: ${params.currentLevel}
- Timeframe: ${params.timeframe} weeks
- Learning Preferences: ${JSON.stringify(params.userPreferences)}

IDENTIFIED SKILL GAPS:
${params.skillGaps.map(gap => 
  `- ${gap.skill}: ${gap.currentLevel} → ${gap.requiredLevel} (${gap.estimatedTime}h, Priority: ${gap.priority})`
).join('\n')}

OPTIMIZED SEQUENCE:
${JSON.stringify(params.learningSequence, null, 2)}

PATH REQUIREMENTS:
- Create logical progression with clear prerequisites
- Balance different skill types for comprehensive development
- Include milestone assessments every 2-3 weeks
- Provide multiple paths for different learning styles
- Ensure goals are achievable within timeframe
- Include buffer time for struggling areas

Return a JSON object:
{
  "title": "Comprehensive path title",
  "description": "Detailed path description and objectives",
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": weeks,
      "objectives": ["learning objectives"],
      "milestones": ["achievement milestones"],
      "skills": ["skills developed in this phase"],
      "prerequisites": ["skills needed before starting"]
    }
  ],
  "totalDuration": ${params.timeframe},
  "assessmentSchedule": [
    {
      "week": number,
      "type": "formative|summative",
      "skills": ["skills to assess"],
      "format": "assessment format"
    }
  ],
  "adaptationTriggers": [
    {
      "condition": "when to adapt",
      "action": "how to adapt",
      "threshold": "performance threshold"
    }
  ],
  "successMetrics": ["how to measure success"]
}`;
  }

  generateActivityRecommendationPrompt(params: ActivityRecommendationParams): string {
    return `Recommend the optimal next learning activity:

CURRENT CONTEXT:
- User Level: ${params.userProfile.level}
- Available Time: ${params.availableTime} minutes
- Motivation Level: ${params.motivationLevel * 100}%
- Optimal Difficulty: ${params.optimalDifficulty * 100}%

SKILL STATE:
${Object.entries(params.skillState.skills).map(([skill, data]: [string, any]) => 
  `- ${skill}: ${data.level} (trend: ${data.trend})`
).join('\n')}

CONTEXT FACTORS:
- Time of Day: ${params.currentContext.timeOfDay || 'unknown'}
- Recent Activities: ${params.currentContext.recentActivities?.join(', ') || 'none'}
- User Energy Level: ${params.currentContext.energyLevel || 'medium'}
- Last Session Performance: ${params.currentContext.lastSessionScore || 'unknown'}

RECOMMENDATION CRITERIA:
- Select activity type that addresses weakest trending skill
- Adjust difficulty for optimal challenge
- Consider user's current energy and motivation
- Respect time constraints
- Provide variety from recent activities
- Maximize learning efficiency

Return a JSON object:
{
  "activityType": "vocabulary|grammar|conversation|listening|reading|writing|pronunciation",
  "topic": "specific topic suited to user's level and interests",
  "difficulty": "CEFR level",
  "estimatedTime": ${params.availableTime},
  "reasoning": "Detailed explanation for this recommendation",
  "expectedOutcome": "What the user will achieve",
  "adaptiveFactors": [
    "factors that influenced this recommendation"
  ],
  "alternatives": [
    {
      "type": "alternative activity type",
      "reasoning": "why this could also work"
    }
  ]
}`;
  }
}

// Parameter interfaces
interface DailyPlanParams {
  userProfile: UserProfile;
  currentSkills: SkillAssessment;
  learningVelocity: LearningVelocity;
  optimalChallenge: ChallengeLevel;
  timeAvailable: number;
  recentPerformance: number;
}

interface LearningPathParams {
  goals: LearningGoal[];
  currentLevel: string;
  timeframe: number;
  skillGaps: SkillGap[];
  learningSequence: LearningSequence;
  userPreferences: any;
}

interface ActivityRecommendationParams {
  userProfile: UserProfile;
  skillState: SkillAssessment;
  motivationLevel: number;
  optimalDifficulty: number;
  currentContext: any;
  availableTime: number;
}
```

## **Files to Create/Modify**

### **New Files**
```
server/src/services/
├── aiCurriculumEngine.ts       (Main curriculum engine)
├── learningAnalytics.ts        (Analytics and predictions)
└── pathOptimizer.ts            (Learning path optimization)

server/src/types/
└── Curriculum.ts               (Curriculum-specific types)

server/src/controllers/
└── curriculumController.ts     (Curriculum API endpoints)

server/src/routes/
└── curriculumRoutes.ts         (Curriculum routes)
```

### **Files to Modify**
```
server/src/services/aiOrchestrator.ts     (Integrate curriculum engine)
server/src/services/promptTemplateEngine.ts (Add curriculum prompts)
server/src/controllers/aiController.ts    (Add curriculum methods)
server/src/routes/aiRoutes.ts            (Add curriculum routes)
```

## **TypeScript Types**

### **Curriculum Types**
```typescript
// server/src/types/Curriculum.ts

export interface DailyLearningPlan {
  title: string;
  description: string;
  activities: PlannedActivity[];
  totalTime: number;
  focusAreas: string[];
  expectedOutcomes: string[];
  adaptiveNotes?: string;
  aiGenerated: boolean;
  fallback?: boolean;
}

export interface PlannedActivity {
  type: ActivityType;
  topic: string;
  difficulty: CEFRLevel;
  estimatedTime: number;
  reasoning: string;
  targetSkills: string[];
  priority: number;
}

export interface LearningPath {
  id: string;
  userId: number;
  title: string;
  description: string;
  estimatedDuration: number; // weeks
  nodes: CurriculumNode[];
  goals: LearningGoal[];
  currentProgress: number; // 0-100
  adaptationHistory: AdaptationRecord[];
  createdAt: Date;
  lastAdaptedAt: Date;
  isFallback?: boolean;
}

export interface CurriculumNode {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'assessment' | 'milestone' | 'branch';
  prerequisites: string[];
  estimatedDuration: number; // hours
  skills: string[];
  difficulty: CEFRLevel;
  isOptional: boolean;
  completionCriteria: CompletionCriteria;
}

export interface LearningGoal {
  id: string;
  userId: number;
  title: string;
  description: string;
  targetLevel: CEFRLevel;
  priority: number; // 1-5
  estimatedHours: number;
  deadline?: Date;
  category: 'vocabulary' | 'grammar' | 'conversation' | 'professional' | 'travel' | 'culture';
}

export interface SkillAssessment {
  userId: number;
  skills: Record<string, SkillData>;
  overallLevel: CEFRLevel;
  assessedAt: Date;
}

export interface SkillData {
  level: CEFRLevel;
  confidence: number; // 0-1
  trend: 'improving' | 'stable' | 'declining';
  lastAssessed: Date | null;
}

export interface LearningVelocity {
  activitiesPerWeek: number;
  improvementRate: number; // percentage per week
  consistency: number; // 0-1, higher = more consistent
}

export interface ChallengeLevel {
  level: number; // 0-1, optimal challenge level
  reasoning: string;
}

export interface AdaptationTrigger {
  type: 'performance' | 'time' | 'goal_change' | 'user_request';
  userProgress: any;
  timestamp: Date;
  data: any;
}

export interface AdaptationRecord {
  timestamp: Date;
  trigger: string;
  changes: string[];
  reason: string;
}

export interface ActivityRecommendation {
  activityType: ActivityType;
  topic: string;
  difficulty: CEFRLevel;
  estimatedTime: number;
  reasoning: string;
  expectedOutcome: string;
  confidence: number;
  isFallback?: boolean;
}

export interface SkillGap {
  skill: string;
  currentLevel: CEFRLevel;
  requiredLevel: CEFRLevel;
  priority: number;
  estimatedTime: number; // hours to fill gap
}

export interface LearningSequence {
  phases: LearningPhase[];
  totalDuration: number;
  adaptationPoints: number[];
}

export interface LearningPhase {
  phase: number;
  title: string;
  duration: number; // weeks
  objectives: string[];
  skills: string[];
  prerequisites: string[];
}

export interface CompletionCriteria {
  minScore: number;
  maxAttempts: number;
  requiresReview: boolean;
}

export type ActivityType = 
  | 'vocabulary'
  | 'grammar' 
  | 'conversation'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'pronunciation'
  | 'culture';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
```

## **API Endpoints**

### **Curriculum Controller**
```typescript
// server/src/controllers/curriculumController.ts

import { Request, Response } from 'express';
import { AICurriculumEngine } from '../services/aiCurriculumEngine';
import { LearningGoal } from '../types/Curriculum';

export class CurriculumController {
  private curriculumEngine: AICurriculumEngine;

  constructor(curriculumEngine: AICurriculumEngine) {
    this.curriculumEngine = curriculumEngine;
  }

  async generateDailyPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const userProfile = await this.getUserProfile(userId);
      const learningContext = await this.getLearningContext(userId);
      
      const plan = await this.curriculumEngine.generateDailyPlan(userProfile, learningContext);
      
      res.json({
        success: true,
        data: plan,
      });
    } catch (error) {
      console.error('Error generating daily plan:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async createLearningPath(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { goals, timeframe } = req.body;
      const userProfile = await this.getUserProfile(userId);
      
      const path = await this.curriculumEngine.createLearningPath(
        goals as LearningGoal[],
        userProfile.level,
        timeframe
      );
      
      // Save path to database
      await this.saveLearningPath(path);
      
      res.json({
        success: true,
        data: path,
      });
    } catch (error) {
      console.error('Error creating learning path:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async recommendActivity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { context } = req.body;
      
      const userProfile = await this.getUserProfile(userId);
      const recommendation = await this.curriculumEngine.recommendActivity(
        userProfile,
        context
      );
      
      res.json({
        success: true,
        data: recommendation,
      });
    } catch (error) {
      console.error('Error recommending activity:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async adaptLearningPath(req: Request, res: Response): Promise<void> {
    try {
      const { pathId } = req.params;
      const { trigger } = req.body;
      
      const currentPath = await this.getLearningPath(pathId);
      const adaptedPath = await this.curriculumEngine.adaptPath(currentPath, trigger);
      
      // Update path in database
      await this.updateLearningPath(adaptedPath);
      
      res.json({
        success: true,
        data: adaptedPath,
      });
    } catch (error) {
      console.error('Error adapting learning path:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Helper methods
  private async getUserProfile(userId: number): Promise<any> {
    // Implementation depends on your user service
    return {};
  }

  private async getLearningContext(userId: number): Promise<any> {
    // Implementation depends on your context service
    return {};
  }

  private async saveLearningPath(path: any): Promise<void> {
    // Save to database
  }

  private async getLearningPath(pathId: string): Promise<any> {
    // Get from database
    return {};
  }

  private async updateLearningPath(path: any): Promise<void> {
    // Update in database
  }
}
```

## **Testing Strategy**

### **Unit Tests**
```typescript
// server/src/tests/aiCurriculumEngine.test.ts

describe('AICurriculumEngine', () => {
  let engine: AICurriculumEngine;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockOpenAI = createMockOpenAI();
    engine = new AICurriculumEngine(mockOpenAI);
  });

  describe('generateDailyPlan', () => {
    it('should generate personalized daily plan', async () => {
      const userProfile = createMockUserProfile();
      const learningContext = createMockLearningContext();
      
      mockOpenAI.chat.completions.create.mockResolvedValue(
        createMockOpenAIResponse(validDailyPlanJSON)
      );

      const plan = await engine.generateDailyPlan(userProfile, learningContext);
      
      expect(plan).toBeDefined();
      expect(plan.activities).toHaveLength(3);
      expect(plan.totalTime).toBeLessThanOrEqual(userProfile.preferredSessionLength);
    });

    it('should adapt plan based on user performance', async () => {
      const userProfile = createMockUserProfile({ recentPerformance: 0.4 });
      const learningContext = createMockLearningContext();
      
      const plan = await engine.generateDailyPlan(userProfile, learningContext);
      
      // Should generate easier activities for struggling user
      expect(plan.activities.every(a => a.difficulty === 'A1' || a.difficulty === 'A2')).toBe(true);
    });
  });

  describe('createLearningPath', () => {
    it('should create comprehensive learning path', async () => {
      const goals = [createMockLearningGoal()];
      const currentLevel = 'A2';
      const timeframe = 12;

      const path = await engine.createLearningPath(goals, currentLevel, timeframe);
      
      expect(path).toBeDefined();
      expect(path.estimatedDuration).toBe(timeframe);
      expect(path.nodes.length).toBeGreaterThan(0);
    });

    it('should identify and address skill gaps', async () => {
      const goals = [createMockLearningGoal({ targetLevel: 'B2' })];
      const currentLevel = 'A1';
      
      const path = await engine.createLearningPath(goals, currentLevel, 16);
      
      // Should include progression through intermediate levels
      expect(path.nodes.some(n => n.difficulty === 'A2')).toBe(true);
      expect(path.nodes.some(n => n.difficulty === 'B1')).toBe(true);
    });
  });

  describe('recommendActivity', () => {
    it('should recommend appropriate activity', async () => {
      const userProfile = createMockUserProfile();
      const context = { availableTime: 15, energyLevel: 'high' };
      
      const recommendation = await engine.recommendActivity(userProfile, context);
      
      expect(recommendation).toBeDefined();
      expect(recommendation.estimatedTime).toBeLessThanOrEqual(15);
      expect(recommendation.confidence).toBeGreaterThan(0);
    });

    it('should focus on weak areas', async () => {
      const userProfile = createMockUserProfile({
        weakAreas: ['grammar', 'pronunciation']
      });
      const context = { availableTime: 20 };
      
      const recommendation = await engine.recommendActivity(userProfile, context);
      
      expect(['grammar', 'pronunciation']).toContain(recommendation.activityType);
    });
  });
});
```

## **Review Points & Solutions**

### **🔍 Review Point 1: Adaptation Accuracy**
**Concern**: Curriculum adaptations might not improve learning outcomes
**Solution**: 
- A/B testing framework for adaptation strategies
- Machine learning models trained on learning outcome data
- Regular validation against learning science principles
- User feedback integration for adaptation quality

### **🔍 Review Point 2: Computational Complexity**
**Concern**: Real-time path optimization might be too slow
**Solution**:
- Pre-computed optimization for common scenarios
- Incremental adaptation rather than full recalculation
- Background processing for complex optimizations
- Simplified heuristics for real-time decisions

### **🔍 Review Point 3: Personalization Effectiveness**
**Concern**: AI might not capture individual learning nuances
**Solution**:
- Multiple learning style frameworks integration
- Continuous learning from user behavior patterns
- Expert system fallbacks for edge cases
- User control over personalization preferences

### **🔍 Review Point 4: Goal Alignment**
**Concern**: Generated paths might not align with user goals
**Solution**:
- Explicit goal validation at each phase
- User feedback loops for goal alignment
- Transparent explanation of curriculum decisions
- Easy path modification and customization options

## **Progress Tracking**

### **Task Checklist**
- [ ] **Core Engine Implementation** (3 hours)
  - [ ] AICurriculumEngine service
  - [ ] Learning analytics integration
  - [ ] Path optimization algorithms
  - [ ] Adaptation logic implementation
- [ ] **AI Integration** (2 hours)
  - [ ] Prompt engineering for curriculum
  - [ ] OpenAI API integration
  - [ ] Response parsing and validation
  - [ ] Error handling and fallbacks
- [ ] **API Development** (1 hour)
  - [ ] Controller implementation
  - [ ] Route configuration
  - [ ] Request/response handling
  - [ ] Database integration
- [ ] **Testing & Validation** (1 hour)
  - [ ] Unit tests implementation
  - [ ] Integration testing
  - [ ] Performance benchmarking
  - [ ] Learning outcome validation

### **Success Metrics**
- [ ] Path generation time < 5 seconds
- [ ] Adaptation accuracy > 75% improvement in outcomes
- [ ] User goal achievement rate > 80%
- [ ] Path completion rate > 70%
- [ ] User satisfaction with personalization > 4.0/5
- [ ] Reduced time to competency by 30%

## **Next Steps**
1. Complete this implementation
2. Integration with assessment engine for feedback loops
3. Learning outcome tracking and validation
4. Begin Task 3.2.B: Conversational AI Tutor
5. Performance optimization and machine learning integration

---

**Status**: ⏳ Ready for Implementation  
**Dependencies**: Task 3.1.A (AI Orchestration), Task 3.1.C (Assessment Engine)  
**Estimated Completion**: After dependencies + 6 hours development
