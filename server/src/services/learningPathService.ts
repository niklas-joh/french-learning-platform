import Knex from 'knex';
import type { Knex as KnexTypes } from 'knex';
import { LearningPath, LearningPathWithUserProgress, getLearningPathById } from '../models/LearningPath';
import { LearningUnit, LearningUnitWithUserProgress, getUnitsAndLessonsByPathId, UnitAndLessonRow } from '../models/LearningUnit';
import { Lesson, LessonWithUserProgress } from '../models/Lesson';
import { UserLessonProgress, LessonStatus, getLessonProgressForUser, startLesson, completeLesson } from '../models/UserLessonProgress';

/**
 * Retrieves a learning path with its units and lessons, including user-specific progress
 * for each lesson.
 * @param pathId - The ID of the learning path to retrieve.
 * @param userId - The ID of the user for whom to retrieve progress.
 * @returns A Promise resolving to LearningPathWithUserProgress object or null if not found.
 */
export async function getLearningPathUserView(
  pathId: number,
  userId: number
): Promise<LearningPathWithUserProgress | null> {
  // 1. Fetch Learning Path Details
  const learningPath = await getLearningPathById(pathId);

  if (!learningPath) {
    return null;
  }

  // 2. Fetch All Units and Lessons for the Path in One Go
  const unitsAndLessonsRaw = await getUnitsAndLessonsByPathId(pathId);

  if (!unitsAndLessonsRaw || unitsAndLessonsRaw.length === 0) {
    // Path exists but has no units or lessons, return with empty units
    return { ...learningPath, units: [] };
  }

  // 3. Fetch All Relevant User Lesson Progress in One Go
  const lessonIds = unitsAndLessonsRaw
    .map(item => item.lessonId)
    .filter((id): id is number => id !== null && id !== undefined);
    
  const userProgressRecords = await getLessonProgressForUser(userId, lessonIds);

  // Create a map for quick progress lookup
  const progressMap = new Map<number, UserLessonProgress>();
  userProgressRecords.forEach(p => progressMap.set(p.lessonId, p));

  // 4. Data Restructuring and Status Determination
  const unitsMap = new Map<number, LearningUnitWithUserProgress>();
  // This variable tracks if the PREVIOUS lesson is marked as 'completed' in the database,
  // which is the condition for unlocking the current lesson.
  // We initialize it to true to ensure the very first lesson is always available.
  let previousLessonWasCompleted = true;

  for (const row of unitsAndLessonsRaw) {
    // Get or create the unit
    let unit = unitsMap.get(row.unitId);
    if (!unit) {
      unit = {
        id: row.unitId,
        learningPathId: pathId,
        title: row.unitTitle,
        description: row.unitDescription,
        level: row.unitLevel,
        orderIndex: row.unitOrderIndex,
        prerequisites: undefined,
        isActive: row.unitIsActive,
        createdAt: row.unitCreatedAt,
        updatedAt: row.unitUpdatedAt,
        lessons: [],
      };
      unitsMap.set(row.unitId, unit);
    }

    const lessonProgress = progressMap.get(row.lessonId);
    let currentStatus: LessonStatus;

    if (lessonProgress) {
      // If a progress record exists, it is the source of truth.
      currentStatus = lessonProgress.status;
    } else {
      // If no record exists, the status depends on the completion of the previous lesson.
      currentStatus = previousLessonWasCompleted ? 'available' : 'locked';
    }

    // Create a base lesson object from the row data
    const lesson: Lesson = {
      id: row.lessonId,
      learningUnitId: row.unitId,
      title: row.lessonTitle,
      description: row.lessonDescription,
      type: row.lessonType,
      estimatedTime: row.lessonEstimatedTime,
      orderIndex: row.lessonOrderIndex,
      contentData: row.lessonContentData,
      isActive: row.lessonIsActive,
      createdAt: row.lessonCreatedAt,
      updatedAt: row.lessonUpdatedAt,
    };

    // Combine the base lesson with user progress to create the final object
    const lessonWithProgress: LessonWithUserProgress = {
      ...lesson,
      status: currentStatus,
      score: lessonProgress?.score,
      startedAt: lessonProgress?.startedAt,
      completedAt: lessonProgress?.completedAt,
    };
    
    if (unit) {
      unit.lessons.push(lessonWithProgress);
    }

    // For the next lesson to be available, THIS lesson must have a 'completed' status
    // in the database. We check the original progress record, not the calculated `currentStatus`.
    previousLessonWasCompleted = lessonProgress?.status === 'completed';
  }

  // TODO: Implement robust prerequisite logic for non-linear paths.
  // The current logic assumes a linear path. Future enhancements should parse
  // `learning_units.prerequisites` (e.g., a JSON array of unit IDs) to handle
  // complex dependencies, which might allow multiple lessons or units to be
  // 'available' simultaneously based on the completion of other units.

  const assembledUnits = Array.from(unitsMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    ...learningPath,
    units: assembledUnits,
  };
}

/**
 * Starts a lesson for a user by creating or updating their progress record.
 * @param userId - The ID of the user.
 * @param lessonId - The ID of the lesson to start.
 * @returns The created or updated user lesson progress record.
 */
export async function startUserLesson(
  userId: number,
  lessonId: number
): Promise<UserLessonProgress> {
  try {
    return await startLesson(userId, lessonId);
  } catch (error) {
    console.error('startUserLesson error:', error);
    throw error;
  }
}

/**
 * Completes a lesson for a user within a database transaction.
 * @param userId - The ID of the user.
 * @param lessonId - The ID of the lesson to complete.
 * @param trx - The Knex transaction object.
 * @returns The updated user lesson progress record.
 * @throws An error if the lesson progress does not exist or is not 'in_progress'.
 */
export async function completeUserLesson(
  userId: number,
  lessonId: number,
  trx: KnexTypes.Transaction
): Promise<UserLessonProgress> {
  return await completeLesson(userId, lessonId, trx);
}

/**
 * Integrates AI-generated content into user's learning path following KISS principles.
 * 
 * This function bridges the gap between AI content generation and user accessibility by:
 * 1. Creating a lesson entry from generated content
 * 2. Adding the lesson to the user's active learning path
 * 3. Updating user progress to reflect new content availability
 * 
 * Follows established transaction patterns and reuses existing infrastructure for
 * optimal performance and maintainability. Critical for making AI-generated content
 * visible and accessible to users immediately after generation completes.
 * 
 * @param userId - User identifier for content assignment
 * @param contentId - Generated content identifier from aiGeneratedContent table
 * @param contentType - Type of generated content ('lesson' | 'exercise' | 'vocabulary')
 * @param transaction - Optional database transaction for atomic operations
 * @returns Promise resolving when integration is complete
 * @throws Error if content integration fails or user/content not found
 * 
 * @example
 * ```typescript
 * // Integrate lesson content after AI generation
 * const contentId = await saveGeneratedContent(structuredContent, userId);
 * await integrateGeneratedContent(userId, contentId, 'lesson');
 * ```
 */
export async function integrateGeneratedContent(
  userId: number,
  contentId: string, // ✅ Fixed: UUID support (was: number)
  contentType: 'lesson' | 'exercise' | 'vocabulary',
  transaction?: KnexTypes.Transaction
): Promise<void> {
  const db = await import('../config/db.js');
  const trx = transaction || await db.default.transaction();
  
  try {
    // 1. Get or create active learning path for user (reuse existing pattern)
    const activePath = await trx('userLearningPaths')
      .where({ userId, isActive: true })
      .first();
    
    if (!activePath) {
      throw new Error(`No active learning path found for user ${userId}`);
    }
    
    // 2. Get generated content details
    const generatedContent = await trx('aiGeneratedContent')
      .where({ id: contentId })
      .first();
    
    if (!generatedContent) {
      throw new Error(`Generated content ${contentId} not found`);
    }
    
    // 3. Create lesson entry from generated content (following existing lesson structure)
    const [lessonId] = await trx('lessons').insert({
      learningUnitId: activePath.currentUnitId || 1, // Use current unit or default
      title: generatedContent.title || `AI Generated ${contentType}`,
      description: `AI-generated ${contentType} content`,
      type: contentType,
      estimatedTime: 15, // Default 15 minutes for AI content
      orderIndex: await getNextLessonOrderIndex(trx, activePath.currentUnitId || 1),
      contentData: generatedContent.content,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning('id');
    
    // 4. Create user lesson progress record (following startLesson pattern)
    await trx('userLessonProgress').insert({
      userId,
      lessonId: lessonId.id || lessonId,
      status: 'available', // Make immediately available
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // 5. Update user learning path progress (reuse existing progress patterns)
    await trx('userLearningPaths')
      .where({ userId, isActive: true })
      .update({
        lastAccessedAt: new Date(),
        updatedAt: new Date()
      });
    
    // 6. Log successful integration for monitoring
    console.log(`[LearningPath] Integrated ${contentType} content ${contentId} for user ${userId}`);
    
    if (!transaction) await trx.commit();
  } catch (error) {
    if (!transaction) await trx.rollback();
    console.error('Error integrating generated content:', error);
    throw error;
  }
}

/**
 * Helper function to get next lesson order index within a unit.
 * Maintains proper lesson ordering when adding AI-generated content.
 * 
 * @param trx - Database transaction
 * @param unitId - Learning unit identifier
 * @returns Next available order index
 */
async function getNextLessonOrderIndex(
  trx: KnexTypes.Transaction, 
  unitId: number
): Promise<number> {
  const maxOrder = await trx('lessons')
    .where({ learningUnitId: unitId })
    .max('orderIndex as maxOrder')
    .first();
  
  return (maxOrder?.maxOrder || 0) + 1;
}

// =================================================================
// AI-POWERED CURRICULUM ENHANCEMENT FUNCTIONS
// Task 3.2.A.2: Enhance Learning Path Service with Curriculum Features
// =================================================================

/**
 * Generate adaptive daily learning recommendations using AI analysis
 * 
 * Task 3.2.A.2: Curriculum Feature Integration
 * 
 * Creates personalized daily learning plans by analyzing user progress data,
 * recent performance, and available time. Integrates with existing progress
 * tracking and AI orchestration infrastructure following established patterns.
 * 
 * @param userId - User identifier for personalization
 * @param timeAvailable - Available study time in minutes (default: 20)
 * @returns Promise resolving to array of learning recommendations
 * 
 * @example
 * ```typescript
 * const recommendations = await getAdaptiveLearningRecommendations(123, 30);
 * console.log(`Generated ${recommendations.length} activities for 30 minutes`);
 * ```
 */
export async function getAdaptiveLearningRecommendations(
  userId: number,
  timeAvailable: number = 20
): Promise<LearningRecommendation[]> {
  try {
    // Import required services following ESM patterns
    const { getUserRecentProgress, getUserLevel, identifyWeakAreas } = await import('./progressService.js');
    const { aiServiceFactory } = await import('./ai/index.js');
    
    // Load progress data using established service functions
    const recentProgress = await getUserRecentProgress(userId);
    const currentLevel = await getUserLevel(userId);
    const weakAreas = await identifyWeakAreas(userId);
    
    // Use existing AI orchestrator following factory pattern
    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();
    const userContext = { id: userId, firstName: '', role: 'user' as const, preferences: {} };
    
    // Generate daily plan using proper AI task type
    const response = await aiOrchestrator.generateDailyPlan(userContext, {
      userId,
      preferredDuration: timeAvailable,
      currentSkills: recentProgress.skillScores,
      recentPerformance: recentProgress.recentScores,
      focusAreas: weakAreas.slice(0, 3) // Focus on top 3 weak areas
    });

    // Transform AI response to learning recommendations with proper error handling
    if (response.status === 'error' || response.status === 'fallback') {
      console.warn('AI generation failed, using fallback recommendations');
      return getBasicRecommendations(userId, timeAvailable);
    }
    
    // Map AI response to standardized recommendation format
    return response.data.activities.map(activity => ({
      id: `daily_${Date.now()}_${activity.type}`,
      pathId: recentProgress.currentPathId,
      title: `${activity.topic} Practice`,
      type: activity.type,
      estimatedMinutes: activity.estimatedMinutes,
      difficulty: activity.difficulty,
      reasoning: activity.reasoning || `Recommended based on ${activity.type} skills`,
      priority: activity.priority,
      targetSkills: activity.targetSkills,
      createdAt: new Date(),
      isAdaptive: true
    }));
    
  } catch (error) {
    console.error('Error generating adaptive recommendations:', error);
    // Fallback to basic recommendations using existing logic
    return getBasicRecommendations(userId, timeAvailable);
  }
}

/**
 * Get cached daily learning plan to avoid repeated AI calls
 * 
 * Task 3.2.A.2: Performance Optimization
 * 
 * Provides intelligent caching layer for daily plans to improve performance and reduce
 * AI API costs. Plans are cached for 2 hours and tied to user progress state for
 * better cache invalidation strategy.
 * 
 * @param userId - User identifier
 * @returns Promise resolving to cached or newly generated daily plan
 */
export async function getCachedDailyPlan(userId: number): Promise<DailyPlan | null> {
  try {
    // Import services following established patterns
    const { aiServiceFactory } = await import('./ai/index.js');
    const cacheService = aiServiceFactory.getCacheService();
    
    // Create cache key with date and user context for better invalidation
    const today = new Date().toDateString();
    const cacheKey = `daily-plan:${userId}:${today}`;
    
    let plan = await cacheService.get<DailyPlan>(cacheKey);
    
    if (!plan) {
      console.log(`[DailyPlan] Cache MISS for user ${userId}`);
      const recommendations = await getAdaptiveLearningRecommendations(userId);
      
      plan = {
        userId,
        date: new Date(),
        activities: recommendations,
        totalMinutes: recommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0),
        generatedAt: new Date(),
        isAdaptive: true
      };
      
      // Cache for 2 hours (improved from 6 hours for better adaptability)
      await cacheService.set(cacheKey, plan, 2 * 60 * 60);
      console.log(`[DailyPlan] Cached plan for user ${userId}`);
    } else {
      console.log(`[DailyPlan] Cache HIT for user ${userId}`);
    }
    
    return plan;
    
  } catch (error) {
    console.error('Error with cached daily plan:', error);
    return null;
  }
}

/**
 * Adapt existing learning path based on performance analysis
 * 
 * Task 3.2.A.2: Path Adaptation Integration
 * 
 * Modifies a user's current learning path when performance data indicates
 * adaptation is needed. Integrates with existing assessment and progress
 * tracking systems to make intelligent modifications following KISS principles.
 * 
 * @param pathId - Learning path identifier to adapt
 * @param userId - User identifier for context
 * @param trigger - Reason for adaptation request
 * @returns Promise resolving to adapted learning path
 */
export async function adaptLearningPath(
  pathId: number,
  userId: number, 
  trigger: 'poor_performance' | 'excellent_progress' | 'user_request' = 'user_request'
): Promise<LearningPathWithUserProgress | null> {
  try {
    // Get current path using existing function
    const currentPath = await getLearningPathUserView(pathId, userId);
    if (!currentPath) {
      console.error(`Learning path ${pathId} not found for user ${userId}`);
      return null;
    }
    
    // Gather performance data using established patterns
    const performanceData = await gatherPerformanceData(userId);
    if (performanceData.length === 0) {
      console.log('No performance data available for adaptation - returning unchanged path');
      return currentPath;
    }
    
    // Import AI services following factory pattern
    const { aiServiceFactory } = await import('./ai/index.js');
    const aiOrchestrator = aiServiceFactory.getAIOrchestrator();
    const userContext = { id: userId, firstName: '', role: 'user' as const, preferences: {} };
    
    // Use AI orchestrator for adaptation analysis
    const adaptationResponse = await aiOrchestrator.adaptLearningPath(userContext, {
      currentPathId: pathId.toString(),
      performanceData: performanceData.map(p => ({
        skillArea: p.skillArea,
        score: p.averageScore,
        completedAt: p.lastAttempt.toISOString().split('T')[0],
        difficulty: (p.difficulty || 'A2') as any
      })),
      adaptationTrigger: trigger
    });
    
    // Handle AI service errors gracefully
    if (adaptationResponse.status === 'error' || adaptationResponse.status === 'fallback') {
      console.warn('AI adaptation failed, returning original path');
      return currentPath;
    }
    
    // Apply adaptations to current path with proper error handling
    const adaptedPath = applyAdaptations(currentPath, adaptationResponse.data);
    
    // Log adaptation for analytics and debugging
    console.log(`Path ${pathId} adapted for user ${userId}: ${adaptationResponse.data.adaptationReasoning}`);
    
    return adaptedPath;
    
  } catch (error) {
    console.error('Error adapting learning path:', error);
    return null;
  }
}

/**
 * Helper function to gather performance data for adaptation
 * 
 * Task 3.2.A.2: Performance Data Integration
 * 
 * Efficiently gathers user performance data from existing assessment system
 * for AI-powered learning path adaptation. Uses established repository patterns.
 */
async function gatherPerformanceData(userId: number): Promise<PerformanceDataPoint[]> {
  try {
    // Import services following established patterns
    const { AssessmentRepository } = await import('../repositories/assessmentRepository.js');
    const db = await import('../config/db.js');
    
    // Use assessment repository directly for data retrieval
    const assessmentRepo = new AssessmentRepository(db.default);
    
    // Get recent assessment results using correct method signature (timeframeDays parameter)
    const recentAssessments = await assessmentRepo.getAssessmentsForUser(userId, 30);
    
    // Transform assessment data to performance data points
    const performanceMap: Record<string, { scores: number[], attempts: Date[], difficulty?: string }> = {};
    
    recentAssessments.forEach(assessment => {
      // Use assessmentType as skill area since skillArea and responseType don't exist in AssessmentResult
      const skill = assessment.assessmentType || 'general';
      if (!performanceMap[skill]) {
        performanceMap[skill] = { scores: [], attempts: [] };
      }
      performanceMap[skill].scores.push(assessment.score);
      // Use metadata.createdAt or current date as AssessmentResult doesn't have createdAt directly
      const attemptDate = (assessment.metadata?.createdAt ? new Date(assessment.metadata.createdAt) : new Date());
      performanceMap[skill].attempts.push(attemptDate);
      // Use metadata.userLevel for difficulty if available
      if (assessment.metadata?.userLevel) {
        performanceMap[skill].difficulty = assessment.metadata.userLevel;
      }
    });
    
    // Convert to performance data points with proper statistics
    return Object.entries(performanceMap).map(([skill, data]) => ({
      skillArea: skill,
      averageScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
      lastAttempt: new Date(Math.max(...data.attempts.map(d => d.getTime()))),
      difficulty: data.difficulty,
      attemptCount: data.scores.length
    }));
    
  } catch (error) {
    console.error('Error gathering performance data:', error);
    return [];
  }
}

/**
 * Helper function to apply AI adaptations to learning path
 * 
 * Task 3.2.A.2: Path Modification Logic
 * 
 * Safely applies AI-suggested modifications to a learning path while maintaining
 * data integrity and pedagogical structure. Uses immutable patterns for safety.
 */
function applyAdaptations(
  currentPath: LearningPathWithUserProgress,
  adaptations: any
): LearningPathWithUserProgress {
  // Clone current path to avoid mutations (immutable pattern)
  const adaptedPath: LearningPathWithUserProgress = {
    ...currentPath,
    units: currentPath.units.map(unit => ({ ...unit }))
  };
  
  try {
    // Apply AI-suggested modifications with proper error handling
    if (adaptations.adaptedActivities && Array.isArray(adaptations.adaptedActivities)) {
      adaptedPath.units = currentPath.units.map(unit => ({
        ...unit,
        lessons: unit.lessons.map(lesson => {
          const adaptation = adaptations.adaptedActivities.find((a: any) => 
            a.id === lesson.id.toString() || a.title.includes(lesson.title)
          );
          
          if (adaptation && adaptation.changeType === 'modified') {
            return {
              ...lesson,
              estimatedTime: adaptation.estimatedMinutes || lesson.estimatedTime,
              // Note: Using estimatedTime to match existing Lesson interface
              isAdapted: true,
              adaptationReason: adaptations.adaptationReasoning
            };
          }
          
          return lesson;
        })
      }));
    }
    
    // Add adaptation metadata for tracking and analytics
    (adaptedPath as any).adaptationHistory = [
      ...((adaptedPath as any).adaptationHistory || []),
      {
        date: new Date(),
        trigger: adaptations.adaptationTrigger || 'unknown',
        reasoning: adaptations.adaptationReasoning,
        confidence: adaptations.confidenceScore,
        timelineImpact: adaptations.timelineImpact
      }
    ];
    
  } catch (error) {
    console.error('Error applying adaptations:', error);
    // Return original path if adaptation fails
    return currentPath;
  }
  
  return adaptedPath;
}

/**
 * Fallback function for basic recommendations when AI fails
 * 
 * Task 3.2.A.2: Reliability and Fallback Strategy
 * 
 * Provides rule-based learning recommendations when AI services are unavailable.
 * Uses existing user data and simple heuristics to maintain service availability.
 */
async function getBasicRecommendations(
  userId: number, 
  timeAvailable: number
): Promise<LearningRecommendation[]> {
  try {
    // Import progress functions following established patterns
    const { getUserLevel, identifyWeakAreas } = await import('./progressService.js');
    
    const userLevel = await getUserLevel(userId);
    const weakAreas = await identifyWeakAreas(userId);
    
    // Simple rule-based recommendations with focus on weak areas
    const basicActivities = [
      {
        type: weakAreas[0] || 'vocabulary',
        minutes: Math.floor(timeAvailable * 0.4),
        priority: 5
      },
      {
        type: weakAreas[1] || 'grammar',
        minutes: Math.floor(timeAvailable * 0.4),  
        priority: 4
      },
      {
        type: weakAreas[2] || 'conversation',
        minutes: Math.floor(timeAvailable * 0.2),
        priority: 3
      }
    ];
    
    return basicActivities.map((activity, index) => ({
      id: `basic_${Date.now()}_${index}`,
      pathId: 1, // Default path
      title: `${activity.type} Practice`,
      type: activity.type,
      estimatedMinutes: activity.minutes,
      difficulty: userLevel || 'A2',
      reasoning: `Basic ${activity.type} practice for your level - AI service temporarily unavailable`,
      priority: activity.priority,
      targetSkills: [activity.type],
      createdAt: new Date(),
      isAdaptive: false
    }));
    
  } catch (error) {
    console.error('Error generating basic recommendations:', error);
    // Ultra-simple fallback if even basic services fail
    return [{
      id: `emergency_${Date.now()}`,
      pathId: 1,
      title: 'General French Practice',
      type: 'vocabulary',
      estimatedMinutes: timeAvailable,
      difficulty: 'A2',
      reasoning: 'General practice session - services temporarily unavailable',
      priority: 3,
      targetSkills: ['general'],
      createdAt: new Date(),
      isAdaptive: false
    }];
  }
}

// =================================================================
// TYPE DEFINITIONS FOR AI CURRICULUM FEATURES
// Task 3.2.A.2: Supporting type definitions following existing patterns
// =================================================================

/**
 * Learning recommendation interface for AI-generated activities
 * Follows existing interface patterns in the codebase
 */
interface LearningRecommendation {
  id: string;
  pathId: number;
  title: string;
  type: string;
  estimatedMinutes: number;
  difficulty: string;
  reasoning: string;
  priority: number;
  targetSkills: string[];
  createdAt: Date;
  isAdaptive: boolean;
}

/**
 * Daily learning plan interface
 * Aggregates recommendations with metadata
 */
interface DailyPlan {
  userId: number;
  date: Date;
  activities: LearningRecommendation[];
  totalMinutes: number;
  generatedAt: Date;
  isAdaptive: boolean;
}

/**
 * Performance data point interface for AI analysis
 * Used for learning path adaptation decisions
 */
interface PerformanceDataPoint {
  skillArea: string;
  averageScore: number;
  lastAttempt: Date;
  difficulty?: string;
  attemptCount: number;
}
