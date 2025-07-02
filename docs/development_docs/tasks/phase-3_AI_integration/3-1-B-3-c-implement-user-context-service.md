# Task 3.1.B.3.c: Implement User Context Service

## **Task Information**
- **Task ID**: 3.1.B.3.c
- **Parent Task**: 3.1.B.3 (Core Generation Logic)
- **Estimated Time**: 0.5 hours
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.3.b (Content Structuring)
- **Status**: ⏳ Not Started

## **Objective**
Extract user context loading logic from `DynamicContentGenerator` into a dedicated service, implementing the `getLearningContext` method and user analysis functionality.

## **Success Criteria**
- [ ] `getLearningContext` method fully implemented
- [ ] User weakness/strength analysis logic
- [ ] Context caching for performance
- [ ] Fallback context for error scenarios
- [ ] Integration with existing User/UserProgress models

## **Implementation Details**

### **Files to Create/Modify**
```
server/src/services/ai/UserContextService.ts (new)
server/src/services/contentGeneration/DynamicContentGenerator.ts (update import)
```

### **1. Create UserContextService**

```typescript
// server/src/services/ai/UserContextService.ts
import { User } from '../../models/User';
import { UserProgress } from '../../models/UserProgress';
import { AIGeneratedContent } from '../../models/AIGeneratedContent';
import { LearningContext } from '../../types/Content';

/**
 * Service for loading and analyzing user learning context
 * TODO: Reference Future Implementation #33 - User Context Service Extraction
 * TODO: Reference Future Implementation #18 - AI Context Service Optimization Strategy
 */
export class UserContextService {
  private contextCache = new Map<number, { context: LearningContext; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getUserContext(userId: number): Promise<LearningContext> {
    // Check cache first
    const cached = this.contextCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.context;
    }

    try {
      const context = await this.loadUserContext(userId);
      
      // Cache the context
      this.contextCache.set(userId, {
        context,
        timestamp: Date.now()
      });
      
      return context;
    } catch (error) {
      console.error('Error loading user context:', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Return minimal context as fallback
      return this.getMinimalContext(userId);
    }
  }

  private async loadUserContext(userId: number): Promise<LearningContext> {
    // Load user data
    const user = await User.query().findById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Load user progress
    const userProgress = await UserProgress.query()
      .where('userId', userId)
      .first();

    // Get recent AI-generated content for analysis
    const recentContent = await AIGeneratedContent.query()
      .where('userId', userId)
      .where('status', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(10);

    // Analyze learning patterns
    const recentTopics = this.extractRecentTopics(recentContent);
    const weakAreas = this.analyzeWeakAreas(userProgress, recentContent);
    const strengths = this.analyzeStrengths(userProgress, recentContent);
    const performanceHistory = this.buildPerformanceHistory(recentContent);

    return {
      userId,
      currentLevel: userProgress?.currentLevel || 'A1',
      learningStyle: user.preferences?.learningStyle || 'mixed',
      weakAreas,
      strengths,
      interests: user.preferences?.interests || [],
      recentTopics,
      performanceHistory,
      lastActivity: userProgress?.lastActivityDate,
      streakDays: userProgress?.streakDays || 0,
      totalLessons: userProgress?.lessonsCompleted || 0,
      preferredDifficulty: userProgress?.preferredDifficulty || 'medium',
      averageSessionLength: userProgress?.averageSessionLength || 15,
    };
  }

  private extractRecentTopics(recentContent: any[]): string[] {
    return recentContent
      .flatMap(content => content.topics || [])
      .filter((topic, index, arr) => arr.indexOf(topic) === index)
      .slice(0, 5);
  }

  private analyzeWeakAreas(userProgress: any, recentContent: any[]): string[] {
    // Basic analysis based on user level and performance
    const level = userProgress?.currentLevel || 'A1';
    
    // Analyze performance patterns from recent content
    const lowPerformanceAreas = recentContent
      .filter(content => content.validationScore < 0.7)
      .flatMap(content => content.focusAreas || [])
      .reduce((areas: Record<string, number>, area: string) => {
        areas[area] = (areas[area] || 0) + 1;
        return areas;
      }, {});

    const weakAreasFromPerformance = Object.entries(lowPerformanceAreas)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([area]) => area);

    // Default weak areas by level
    const levelWeakAreas: Record<string, string[]> = {
      'A1': ['pronunciation', 'basic_grammar', 'verb_conjugation'],
      'A2': ['verb_conjugation', 'pronunciation', 'listening_comprehension'],
      'B1': ['subjunctive', 'complex_grammar', 'written_expression'],
      'B2': ['advanced_vocabulary', 'idiomatic_expressions', 'reading_comprehension'],
      'C1': ['nuanced_grammar', 'cultural_references', 'formal_writing'],
      'C2': ['literary_language', 'regional_dialects', 'advanced_discourse'],
    };

    // Combine performance-based and level-based weak areas
    const defaultAreas = levelWeakAreas[level] || levelWeakAreas['A1'];
    const combinedAreas = [...new Set([...weakAreasFromPerformance, ...defaultAreas])];
    
    return combinedAreas.slice(0, 4);
  }

  private analyzeStrengths(userProgress: any, recentContent: any[]): string[] {
    // Analyze high-performance areas
    const highPerformanceAreas = recentContent
      .filter(content => content.validationScore >= 0.8)
      .flatMap(content => content.focusAreas || [])
      .reduce((areas: Record<string, number>, area: string) => {
        areas[area] = (areas[area] || 0) + 1;
        return areas;
      }, {});

    const strengthsFromPerformance = Object.entries(highPerformanceAreas)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([area]) => area);

    // Default strengths if no performance data
    const defaultStrengths = ['vocabulary', 'reading_comprehension'];
    
    return strengthsFromPerformance.length > 0 ? strengthsFromPerformance : defaultStrengths;
  }

  private buildPerformanceHistory(recentContent: any[]): any[] {
    return recentContent.map(content => ({
      type: content.type,
      score: content.validationScore || 0.5,
      completedAt: content.lastAccessedAt || content.createdAt,
      topics: content.topics || [],
      difficulty: content.difficulty || 'medium',
    }));
  }

  private getMinimalContext(userId: number): LearningContext {
    return {
      userId,
      currentLevel: 'A1',
      learningStyle: 'mixed',
      weakAreas: ['pronunciation', 'basic_grammar'],
      strengths: ['vocabulary'],
      interests: [],
      recentTopics: [],
      performanceHistory: [],
      streakDays: 0,
      totalLessons: 0,
      preferredDifficulty: 'medium',
      averageSessionLength: 15,
    };
  }

  // Cache management
  clearCache(userId?: number): void {
    if (userId) {
      this.contextCache.delete(userId);
    } else {
      this.contextCache.clear();
    }
  }

  updateContext(userId: number, updates: Partial<LearningContext>): void {
    const cached = this.contextCache.get(userId);
    if (cached) {
      this.contextCache.set(userId, {
        context: { ...cached.context, ...updates },
        timestamp: Date.now()
      });
    }
  }
}
```

### **2. Update DynamicContentGenerator**

```typescript
// Update imports in DynamicContentGenerator.ts
import { UserContextService } from '../ai/UserContextService';

// Update constructor to inject UserContextService
constructor(
  private aiOrchestrator: AIOrchestrator,
  private promptEngine: PromptTemplateEngine,
  private validatorFactory: IContentValidatorFactory,
  private enhancerFactory: IContentEnhancerFactory,
  private templateManager: IContentTemplateManager,
  private userContextService: UserContextService, // Updated
  private fallbackHandler: IContentFallbackHandler,
  private metricsService: IContentGenerationMetrics
) {}

// Update the generateContent method
async generateContent(request: ContentRequest, retryCount = 0): Promise<GeneratedContent> {
  // ... existing code ...
  
  // Load user learning context
  const learningContext = await this.userContextService.getUserContext(request.userId);
  
  // ... rest of method unchanged ...
}

// Remove the old getLearningContext method and related helper methods
// (They are now in UserContextService)
```

### **3. Update Interface**

```typescript
// Update server/src/services/contentGeneration/interfaces.ts
export interface ILearningContextService {
  getUserContext(userId: number): Promise<LearningContext>;
  updateContext(userId: number, updates: Partial<LearningContext>): Promise<void>;
  clearCache(userId?: number): void;
}
```

## **Dependencies**
- User and UserProgress models for data loading
- AIGeneratedContent model for performance analysis
- LearningContext type definition
- Task 3.1.B.3.b for integration

## **Review Points**
1. **Caching Strategy**: Verify cache TTL and invalidation logic
2. **Performance**: Check database query efficiency
3. **Fallback Logic**: Validate minimal context provides useful defaults
4. **Memory Usage**: Ensure cache doesn't grow unbounded

## **Possible Issues & Solutions**
1. **Issue**: Cache might become stale with rapid user activity
   - **Solution**: Implement cache invalidation on user progress updates
2. **Issue**: Database queries might be slow for users with lots of history
   - **Solution**: Add pagination and indexes on query columns
3. **Issue**: Weak area analysis might be inaccurate
   - **Solution**: Implement more sophisticated ML-based analysis

## **Testing Strategy**
- Unit tests for context loading with various user data scenarios
- Cache behavior testing (hit/miss, TTL, invalidation)
- Performance testing with large user histories
- Fallback context validation
- Integration testing with DynamicContentGenerator

## **Next Steps**
After completion, proceed to Task 3.1.B.3.d (Implement Supporting Services)
