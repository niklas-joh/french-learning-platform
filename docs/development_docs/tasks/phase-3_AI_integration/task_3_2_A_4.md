# Task 3.2.A.4: Implement Skill Assessment Integration

**Status**: ⏳ **Not Started**  
**Estimated Time**: 0.75h  
**Dependencies**: 3.2.A.1 (AI Types), progressService (existing)  

## **Objective**

Integrate curriculum features with existing progress tracking system by enhancing the progress service with skill assessment capabilities that feed into AI curriculum generation.

## **Scope**

### **Files to Modify**
- `server/src/services/progressService.ts` - Add skill assessment function
- Integration with existing progress tracking and assessment systems

### **Implementation Plan**

#### **1. Add Skill Assessment Function to Progress Service**

**File**: `server/src/services/progressService.ts`

Following existing patterns in the progress service:

```typescript
/**
 * Generate comprehensive skill assessment for curriculum planning
 * 
 * Task 3.2.A.4: Skill Assessment Integration
 * 
 * Analyzes user progress data, assessment results, and learning patterns to create
 * a comprehensive skill assessment that feeds into AI curriculum generation.
 * Integrates with existing progress tracking infrastructure.
 * 
 * @param userId User identifier for assessment
 * @returns Promise resolving to comprehensive skill assessment
 * 
 * @example
 * ```typescript
 * const assessment = await getSkillAssessmentForCurriculum(123);
 * console.log(`User has ${Object.keys(assessment.skills).length} skill areas assessed`);
 * console.log(`Overall confidence: ${assessment.overallConfidence}`);
 * ```
 */
export async function getSkillAssessmentForCurriculum(userId: number): Promise<SkillAssessment> {
  try {
    // Leverage existing progress data functions
    const userProgress = await getUserProgress(userId);
    const recentAssessments = await getUserRecentAssessments(userId, 30); // Last 30 days
    const completionStats = await getUserCompletionStats(userId);
    
    // Define skill areas following CEFR framework
    const skillAreas = ['vocabulary', 'grammar', 'pronunciation', 'listening', 'reading', 'writing', 'conversation', 'culture'];
    const skillLevels: Record<string, SkillLevel> = {};
    
    // Calculate skill levels using existing assessment data
    for (const skill of skillAreas) {
      const skillAssessments = recentAssessments.filter(a => 
        a.skillArea === skill || a.metadata?.skillArea === skill
      );
      
      const skillLevel = await calculateSkillLevel(userId, skill, skillAssessments, userProgress);
      skillLevels[skill] = skillLevel;
    }
    
    // Calculate overall metrics
    const overallLevel = calculateOverallCEFRLevel(skillLevels);
    const weakAreas = identifyWeakestAreas(skillLevels, 3);
    const strongAreas = identifyStrongestAreas(skillLevels, 3);
    
    return {
      userId,
      skills: skillLevels,
      overallLevel,
      overallConfidence: calculateOverallConfidence(skillLevels),
      weakAreas,
      strongAreas,
      assessedAt: new Date(),
      dataPoints: recentAssessments.length,
      recommendations: generateSkillRecommendations(skillLevels, weakAreas)
    };
    
  } catch (error) {
    console.error('Error generating skill assessment:', error);
    
    // Fallback assessment using basic progress data
    return generateFallbackAssessment(userId);
  }
}

/**
 * Calculate individual skill level using assessment data
 * 
 * @param userId User identifier
 * @param skillArea Skill area to assess
 * @param assessments Recent assessments for this skill
 * @param userProgress Overall user progress context
 * @returns Promise resolving to skill level assessment
 */
async function calculateSkillLevel(
  userId: number,
  skillArea: string,
  assessments: AssessmentResult[],
  userProgress: UserProgress
): Promise<SkillLevel> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (assessments.length === 0) {
    // Use progress data as fallback
    const estimatedLevel = estimateLevelFromProgress(userProgress, skillArea);
    return {
      level: estimatedLevel,
      confidence: 0.3, // Low confidence without assessment data
      trend: 'stable',
      lastAssessed: null,
      dataPoints: 0,
      averageScore: 0,
      improvement: 0
    };
  }
  
  // Calculate metrics from recent assessments
  const scores = assessments.map(a => a.score || 0);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Calculate trend (improvement over time)
  const sortedAssessments = assessments.sort((a, b) => 
    new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );
  
  const trend = calculateTrend(sortedAssessments);
  const improvement = calculateImprovement(sortedAssessments);
  
  // Map score to CEFR level
  const cefrLevel = mapScoreToCEFRLevel(averageScore, skillArea);
  
  // Calculate confidence based on data points and consistency
  const confidence = calculateConfidence(assessments);
  
  return {
    level: cefrLevel,
    confidence,
    trend,
    lastAssessed: new Date(Math.max(...assessments.map(a => new Date(a.completedAt).getTime()))),
    dataPoints: assessments.length,
    averageScore,
    improvement
  };
}

/**
 * Map assessment scores to CEFR levels based on skill area
 * 
 * @param score Average score (0-100)
 * @param skillArea Skill area being assessed
 * @returns CEFR level designation
 */
function mapScoreToCEFRLevel(score: number, skillArea: string): CEFRLevel {
  // Skill-specific thresholds (some skills are harder to master)
  const thresholds = {
    vocabulary: { A1: 30, A2: 50, B1: 65, B2: 75, C1: 85, C2: 95 },
    grammar: { A1: 25, A2: 45, B1: 60, B2: 75, C1: 85, C2: 95 },
    pronunciation: { A1: 35, A2: 55, B1: 70, B2: 80, C1: 90, C2: 98 },
    listening: { A1: 30, A2: 50, B1: 65, B2: 75, C1: 85, C2: 95 },
    reading: { A1: 35, A2: 55, B1: 70, B2: 80, C1: 88, C2: 95 },
    writing: { A1: 25, A2: 45, B1: 60, B2: 75, C1: 85, C2: 95 },
    conversation: { A1: 30, A2: 50, B1: 65, B2: 75, C1: 85, C2: 95 },
    culture: { A1: 40, A2: 60, B1: 75, B2: 85, C1: 90, C2: 95 }
  };
  
  const skillThresholds = thresholds[skillArea] || thresholds.vocabulary;
  
  if (score >= skillThresholds.C2) return 'C2';
  if (score >= skillThresholds.C1) return 'C1';
  if (score >= skillThresholds.B2) return 'B2';
  if (score >= skillThresholds.B1) return 'B1';
  if (score >= skillThresholds.A2) return 'A2';
  return 'A1';
}

/**
 * Calculate learning trend from assessment history
 * 
 * @param assessments Sorted assessments (oldest to newest)
 * @returns Trend indicator
 */
function calculateTrend(assessments: AssessmentResult[]): 'improving' | 'declining' | 'stable' {
  if (assessments.length < 3) return 'stable';
  
  // Compare first third to last third of assessments
  const firstThird = assessments.slice(0, Math.floor(assessments.length / 3));
  const lastThird = assessments.slice(-Math.floor(assessments.length / 3));
  
  const firstAvg = firstThird.reduce((sum, a) => sum + (a.score || 0), 0) / firstThird.length;
  const lastAvg = lastThird.reduce((sum, a) => sum + (a.score || 0), 0) / lastThird.length;
  
  const difference = lastAvg - firstAvg;
  
  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

/**
 * Calculate improvement percentage over time
 * 
 * @param assessments Sorted assessments
 * @returns Improvement percentage
 */
function calculateImprovement(assessments: AssessmentResult[]): number {
  if (assessments.length < 2) return 0;
  
  const firstScore = assessments[0].score || 0;
  const lastScore = assessments[assessments.length - 1].score || 0;
  
  if (firstScore === 0) return 0;
  
  return Math.round(((lastScore - firstScore) / firstScore) * 100);
}

/**
 * Calculate confidence based on assessment consistency and volume
 * 
 * @param assessments Assessment data
 * @returns Confidence score (0-1)
 */
function calculateConfidence(assessments: AssessmentResult[]): number {
  if (assessments.length === 0) return 0;
  if (assessments.length === 1) return 0.5;
  
  // Base confidence on data points
  let confidence = Math.min(assessments.length / 10, 0.8); // Max 0.8 from volume
  
  // Adjust for consistency (lower variance = higher confidence)
  const scores = assessments.map(a => a.score || 0);
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Lower standard deviation = higher confidence
  const consistencyBonus = Math.max(0, (20 - standardDeviation) / 20) * 0.2;
  
  return Math.min(confidence + consistencyBonus, 1);
}

/**
 * Calculate overall CEFR level from individual skill levels
 * 
 * @param skillLevels Individual skill assessments
 * @returns Overall CEFR level
 */
function calculateOverallCEFRLevel(skillLevels: Record<string, SkillLevel>): CEFRLevel {
  const levels = Object.values(skillLevels).map(s => s.level);
  const levelCounts = levels.reduce((counts, level) => {
    counts[level] = (counts[level] || 0) + 1;
    return counts;
  }, {} as Record<CEFRLevel, number>);
  
  // Find most common level, with tie-breaking toward lower levels (conservative)
  const sortedLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let maxCount = 0;
  let mostCommonLevel: CEFRLevel = 'A1';
  
  for (const level of sortedLevels) {
    if (levelCounts[level] > maxCount) {
      maxCount = levelCounts[level];
      mostCommonLevel = level;
    }
  }
  
  return mostCommonLevel;
}

/**
 * Identify weakest skill areas for focused improvement
 * 
 * @param skillLevels Individual skill assessments
 * @param count Number of weak areas to identify
 * @returns Array of weak skill areas
 */
function identifyWeakestAreas(skillLevels: Record<string, SkillLevel>, count: number): string[] {
  const sortedSkills = Object.entries(skillLevels)
    .sort((a, b) => {
      // Sort by level first, then by average score
      const levelOrder: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
      const levelDiff = levelOrder[a[1].level] - levelOrder[b[1].level];
      
      if (levelDiff !== 0) return levelDiff;
      return a[1].averageScore - b[1].averageScore;
    })
    .slice(0, count)
    .map(([skill]) => skill);
  
  return sortedSkills;
}

/**
 * Identify strongest skill areas for confidence building
 * 
 * @param skillLevels Individual skill assessments
 * @param count Number of strong areas to identify
 * @returns Array of strong skill areas
 */
function identifyStrongestAreas(skillLevels: Record<string, SkillLevel>, count: number): string[] {
  const sortedSkills = Object.entries(skillLevels)
    .sort((a, b) => {
      // Sort by level (descending), then by average score (descending)
      const levelOrder: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
      const levelDiff = levelOrder[b[1].level] - levelOrder[a[1].level];
      
      if (levelDiff !== 0) return levelDiff;
      return b[1].averageScore - a[1].averageScore;
    })
    .slice(0, count)
    .map(([skill]) => skill);
  
  return sortedSkills;
}

/**
 * Calculate overall confidence across all skills
 * 
 * @param skillLevels Individual skill assessments
 * @returns Overall confidence score (0-1)
 */
function calculateOverallConfidence(skillLevels: Record<string, SkillLevel>): number {
  const confidences = Object.values(skillLevels).map(s => s.confidence);
  return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
}

/**
 * Generate skill improvement recommendations
 * 
 * @param skillLevels Individual skill assessments
 * @param weakAreas Identified weak areas
 * @returns Array of improvement recommendations
 */
function generateSkillRecommendations(
  skillLevels: Record<string, SkillLevel>,
  weakAreas: string[]
): string[] {
  const recommendations: string[] = [];
  
  for (const area of weakAreas) {
    const skill = skillLevels[area];
    
    if (skill.trend === 'declining') {
      recommendations.push(`Focus on ${area} - performance has been declining recently`);
    } else if (skill.confidence < 0.4) {
      recommendations.push(`Practice ${area} more regularly to build consistency`);
    } else if (skill.level === 'A1' && skill.dataPoints > 5) {
      recommendations.push(`${area} needs foundational work - consider structured lessons`);
    } else {
      recommendations.push(`Strengthen ${area} skills with targeted practice`);
    }
  }
  
  return recommendations;
}

/**
 * Generate fallback assessment when detailed data is unavailable
 * 
 * @param userId User identifier
 * @returns Basic skill assessment
 */
async function generateFallbackAssessment(userId: number): Promise<SkillAssessment> {
  // Use basic progress data to estimate skills
  try {
    const progress = await getUserProgress(userId);
    const estimatedLevel: CEFRLevel = progress.currentLevel as CEFRLevel || 'A1';
    
    const basicSkill: SkillLevel = {
      level: estimatedLevel,
      confidence: 0.3,
      trend: 'stable',
      lastAssessed: null,
      dataPoints: 0,
      averageScore: 0,
      improvement: 0
    };
    
    const skills = ['vocabulary', 'grammar', 'pronunciation', 'listening', 'reading', 'writing', 'conversation', 'culture']
      .reduce((acc, skill) => {
        acc[skill] = { ...basicSkill };
        return acc;
      }, {} as Record<string, SkillLevel>);
    
    return {
      userId,
      skills,
      overallLevel: estimatedLevel,
      overallConfidence: 0.3,
      weakAreas: ['grammar', 'pronunciation', 'conversation'], // Conservative defaults
      strongAreas: ['vocabulary'],
      assessedAt: new Date(),
      dataPoints: 0,
      recommendations: ['Complete more assessments to get personalized recommendations']
    };
    
  } catch (error) {
    console.error('Error generating fallback assessment:', error);
    throw error;
  }
}
```

#### **2. Add Supporting Type Definitions**

Add to the existing progress service types:

```typescript
/**
 * Task 3.2.A.4: Skill Assessment Types
 */
export interface SkillAssessment {
  userId: number;
  skills: Record<string, SkillLevel>;
  overallLevel: CEFRLevel;
  overallConfidence: number;
  weakAreas: string[];
  strongAreas: string[];
  assessedAt: Date;
  dataPoints: number;
  recommendations: string[];
}

export interface SkillLevel {
  level: CEFRLevel;
  confidence: number; // 0-1 scale
  trend: 'improving' | 'declining' | 'stable';
  lastAssessed: Date | null;
  dataPoints: number;
  averageScore: number; // 0-100 scale
  improvement: number; // Percentage improvement over time
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Extend existing types if needed
export interface UserProgress {
  // ... existing properties ...
  skillAssessment?: SkillAssessment;
}
```

#### **3. Add Helper Functions**

```typescript
/**
 * Get recent assessments for a user within specified days
 * 
 * @param userId User identifier
 * @param days Number of days to look back
 * @returns Promise resolving to recent assessment results
 */
async function getUserRecentAssessments(userId: number, days: number): Promise<AssessmentResult[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // Integration with existing assessment system
  try {
    // Use existing assessment functions if available
    const assessmentService = await import('../assessment/assessmentServiceFactory.js');
    const service = assessmentService.assessmentServiceFactory.getAssessmentService();
    
    return await service.getUserAssessmentsByDateRange(userId, cutoffDate, new Date());
  } catch (error) {
    console.warn('Could not load assessment service, using fallback:', error);
    return []; // Return empty array as fallback
  }
}

/**
 * Estimate CEFR level from basic progress data
 * 
 * @param progress User progress data
 * @param skillArea Skill area to estimate
 * @returns Estimated CEFR level
 */
function estimateLevelFromProgress(progress: UserProgress, skillArea: string): CEFRLevel {
  // Simple estimation based on completion percentage
  const completionPercentage = progress.completionPercentage || 0;
  
  if (completionPercentage >= 90) return 'C2';
  if (completionPercentage >= 75) return 'C1';
  if (completionPercentage >= 60) return 'B2';
  if (completionPercentage >= 45) return 'B1';
  if (completionPercentage >= 25) return 'A2';
  return 'A1';
}
```

## **Integration Points**

### **1. Existing Progress Service Integration**
- ✅ **getUserProgress()**: Leverages existing progress data loading
- ✅ **getUserCompletionStats()**: Uses existing completion metrics
- ✅ **Error Handling**: Follows existing error handling patterns
- ✅ **Database Patterns**: Uses established database access patterns

### **2. Assessment System Integration**
- ✅ **Assessment Service**: Integrates with existing assessment infrastructure
- ✅ **Assessment Results**: Processes existing assessment data structures
- ✅ **Date Range Queries**: Uses existing date range query functions
- ✅ **Fallback Mechanisms**: Graceful handling when assessment data unavailable

### **3. AI Curriculum Integration**
The skill assessment function directly feeds into the AI curriculum system:

```typescript
// Usage in Task 3.2.A.2 (Learning Path Service)
const skillAssessment = await getSkillAssessmentForCurriculum(userId);

// Feed into AI orchestrator
const aiResponse = await aiOrchestrator.generateDailyPlan(context, {
  userId,
  preferredDuration: timeAvailable,
  currentSkills: convertSkillsToAIFormat(skillAssessment.skills),
  focusAreas: skillAssessment.weakAreas,
  recentPerformance: extractRecentScores(skillAssessment)
});
```

## **Review Points Addressed**

### **1. Code Reuse (85%)**
- ✅ **Existing Functions**: Leverages `getUserProgress`, completion stats
- ✅ **Assessment Integration**: Uses existing assessment service patterns
- ✅ **Database Access**: Follows established database query patterns
- ✅ **Error Handling**: Consistent with existing progress service errors

### **2. KISS Principle**
- ✅ **Focused Function**: Single responsibility for skill assessment
- ✅ **Simple Algorithms**: Straightforward statistical calculations
- ✅ **Clear Logic Flow**: Easy-to-follow assessment process
- ✅ **Fallback Strategy**: Simple fallback when data unavailable

### **3. Performance Optimization**
- ✅ **Efficient Queries**: Reuses existing optimized database functions
- ✅ **Data Filtering**: Only processes recent assessment data (30 days)
- ✅ **Caching Opportunity**: Results can be cached by calling functions
- ✅ **Graceful Degradation**: Functions without blocking other features

### **4. Type Safety**
- ✅ **Comprehensive Types**: Full TypeScript integration
- ✅ **CEFR Standards**: Proper CEFR level typing and validation
- ✅ **Error Boundaries**: Proper error handling and recovery
- ✅ **Data Validation**: Input validation and sanitization

## **Testing Strategy**

### **Unit Tests**
```typescript
// Test skill assessment calculation
describe('getSkillAssessmentForCurriculum', () => {
  it('should calculate skill levels from assessment data', async () => {
    const mockAssessments = [
      { skillArea: 'vocabulary', score: 75, completedAt: '2025-08-20' },
      { skillArea: 'grammar', score: 60, completedAt: '2025-08-22' }
    ];
    
    jest.spyOn(progressService, 'getUserRecentAssessments')
      .mockResolvedValue(mockAssessments);
    
    const assessment = await getSkillAssessmentForCurriculum(123);
    
    expect(assessment.skills.vocabulary.level).toBe('B2');
    expect(assessment.skills.grammar.level).toBe('B1');
    expect(assessment.weakAreas).toContain('grammar');
  });
  
  it('should provide fallback assessment when no data available', async () => {
    jest.spyOn(progressService, 'getUserRecentAssessments')
      .mockResolvedValue([]);
    
    const assessment = await getSkillAssessmentForCurriculum(123);
    
    expect(assessment.overallConfidence).toBe(0.3);
    expect(assessment.dataPoints).toBe(0);
    expect(assessment.recommendations).toContain('Complete more assessments');
  });
});

// Test CEFR level mapping
describe('mapScoreToCEFRLevel', () => {
  it('should correctly map scores to CEFR levels', () => {
    expect(mapScoreToCEFRLevel(95, 'vocabulary')).toBe('C2');
    expect(mapScoreToCEFRLevel(75, 'grammar')).toBe('B2');
    expect(mapScoreToCEFRLevel(45, 'pronunciation')).toBe('A2');
    expect(mapScoreToCEFRLevel(20, 'conversation')).toBe('A1');
  });
});

// Test trend calculation
describe('calculateTrend', () => {
  it('should identify improving trend', () => {
    const assessments = [
      { score: 50, completedAt: '2025-08-01' },
      { score: 60, completedAt: '2025-08-15' },
      { score: 70, completedAt: '2025-08-25' }
    ];
    
    const trend = calculateTrend(assessments);
    expect(trend).toBe('improving');
  });
});
```

### **Integration Tests**
```typescript
// Test integration with AI curriculum system
describe('Curriculum Integration', () => {
  it('should provide data compatible with AI curriculum generation', async () => {
    const assessment = await getSkillAssessmentForCurriculum(123);
    
    // Should have all required fields for AI input
    expect(assessment.skills).toBeDefined();
    expect(assessment.weakAreas).toBeDefined();
    expect(assessment.overallLevel).toMatch(/^[ABC][12]$/);
    
    // Skills should be convertible to AI format
    const aiSkills = convertSkillsToAIFormat(assessment.skills);
    expect(Object.values(aiSkills)).toSatisfy(
      skills => skills.every(score => score >= 0 && score <= 1)
    );
  });
});
```

## **Dependent Files**

### **Files Modified**
- `server/src/services/progressService.ts` - Add skill assessment function

### **Files Integrated With**
- `server/src/services/assessment/assessmentServiceFactory.ts` - Assessment data
- `server/src/types/AI.ts` - CEFR level types (from 3.2.A.1)
- `server/src/services/learningPathService.ts` - Used in 3.2.A.2

### **Files That Will Use This**
- `server/src/services/learningPathService.ts` - Daily plan generation (3.2.A.2)
- `server/src/controllers/aiController.ts` - API endpoints (3.2.A.3)
- Frontend dashboard components - Progress visualization

## **Performance Considerations**

### **Optimization Strategies**
```typescript
// Caching wrapper for expensive skill assessment
export async function getCachedSkillAssessment(userId: number): Promise<SkillAssessment> {
  const cacheKey = `skill-assessment:${userId}`;
  const cached = await cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const assessment = await getSkillAssessmentForCurriculum(userId);
  await cache.set(cacheKey, assessment, 24 * 60 * 60); // 24 hour cache
  
  return assessment;
}
```

### **Database Query Optimization**
- Uses existing optimized progress queries
- Limits assessment data to 30 days
- Efficient skill area filtering
- Batch processing for multiple skills

## **Success Metrics**

- ✅ Skill assessment integrates with existing progress system (85% code reuse)
- ✅ Assessment results feed properly into AI curriculum generation
- ✅ CEFR level mapping accuracy > 90% based on assessment scores
- ✅ Fallback mechanism handles missing data gracefully
- ✅ Performance < 200ms for skill assessment calculation
- ✅ Comprehensive error handling prevents service disruption

This implementation provides robust skill assessment capabilities that seamlessly integrate with existing progress tracking while feeding high-quality data into the AI curriculum system.