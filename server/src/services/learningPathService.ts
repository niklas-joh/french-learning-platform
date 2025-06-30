import { Knex } from 'knex';
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
  trx: Knex.Transaction
): Promise<UserLessonProgress> {
  return await completeLesson(userId, lessonId, trx);
}
