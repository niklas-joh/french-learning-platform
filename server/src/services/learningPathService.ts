import { Knex } from 'knex';
import db from '../config/db';
import { LearningPath, LearningPathWithUserProgress } from '../models/LearningPath';
import { LearningUnit, LearningUnitWithUserProgress } from '../models/LearningUnit';
import { Lesson, LessonWithUserProgress } from '../models/Lesson';
import { UserLessonProgress, LessonStatus } from '../models/UserLessonProgress';

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
  const learningPath = await db<LearningPath>('learning_paths')
    .where('id', pathId)
    .first();

  if (!learningPath) {
    return null;
  }

  // 2. Fetch All Units and Lessons for the Path in One Go
  // The DB driver converts snake_case to camelCase, so our type must reflect that.
  type UnitAndLessonRow = {
    unitId: number;
    unitTitle: string;
    unitDescription?: string;
    unitLevel: string;
    unitOrderIndex: number;
    unitPrerequisites?: string;
    unitIsActive: boolean;
    unitCreatedAt: string;
    unitUpdatedAt: string;
    lessonId: number;
    lessonTitle: string;
    lessonDescription?: string;
    lessonType: string;
    lessonEstimatedTime: number;
    lessonOrderIndex: number;
    lessonContentData?: string;
    lessonIsActive: boolean;
    lessonCreatedAt: string;
    lessonUpdatedAt: string;
  };

  const unitsAndLessonsRaw = await db('learning_units as lu')
    .join('lessons as l', 'lu.id', '=', 'l.learning_unit_id')
    .where('lu.learning_path_id', pathId)
    .select(
      'lu.id as unit_id', 'lu.title as unit_title', 'lu.description as unit_description',
      'lu.level as unit_level', 'lu.order_index as unit_order_index',
      'lu.prerequisites as unit_prerequisites', 'lu.is_active as unit_is_active',
      'lu.created_at as unit_created_at', 'lu.updated_at as unit_updated_at',
      'l.id as lesson_id', 'l.title as lesson_title', 'l.description as lesson_description',
      'l.type as lesson_type', 'l.estimated_time as lesson_estimated_time',
      'l.order_index as lesson_order_index', 'l.content_data as lesson_content_data',
      'l.is_active as lesson_is_active', 'l.created_at as lesson_created_at',
      'l.updated_at as lesson_updated_at'
    )
    .orderBy(['lu.order_index', 'l.order_index']) as UnitAndLessonRow[];

  if (!unitsAndLessonsRaw || unitsAndLessonsRaw.length === 0) {
    // Path exists but has no units or lessons, return with empty units
    return { ...learningPath, units: [] };
  }

  // 3. Fetch All Relevant User Lesson Progress in One Go
  const lessonIds = unitsAndLessonsRaw
    .map(item => item.lessonId)
    .filter((id): id is number => id !== null && id !== undefined);
    
  let userProgressRecords: UserLessonProgress[] = [];

  if (lessonIds.length > 0) {
    userProgressRecords = await db<UserLessonProgress>('user_lesson_progress')
      .where('user_id', userId)
      .whereIn('lesson_id', lessonIds);
  }

  // Create a map for quick progress lookup
  const progressMap = new Map<number, UserLessonProgress>();
  userProgressRecords.forEach(p => progressMap.set(p.lesson_id, p));

  // 4. Data Restructuring and Status Determination
  const unitsMap = new Map<number, LearningUnitWithUserProgress>();
  // This variable tracks the status of the previous lesson in the linear path
  // to determine if the current lesson should be unlocked.
  // We initialize it to 'completed' to unlock the very first lesson.
  let lastLessonStatus: LessonStatus | null = 'completed';

  for (const row of unitsAndLessonsRaw) {
    // Get or create the unit
    let unit = unitsMap.get(row.unitId);
    if (!unit) {
      unit = {
        id: row.unitId,
        learning_path_id: pathId,
        title: row.unitTitle,
        description: row.unitDescription,
        level: row.unitLevel,
        order_index: row.unitOrderIndex,
        prerequisites: row.unitPrerequisites,
        is_active: row.unitIsActive,
        created_at: row.unitCreatedAt,
        updated_at: row.unitUpdatedAt,
        lessons: [],
      };
      unitsMap.set(row.unitId, unit);
    }

    const lessonProgress = progressMap.get(row.lessonId);
    let currentStatus: LessonStatus;

    if (lessonProgress) {
      // If a progress record exists, it is the source of truth for this lesson's status.
      currentStatus = lessonProgress.status;
    } else {
      // If no progress record exists, the lesson is 'available' only if the previous
      // lesson was completed. Otherwise, it remains 'locked'.
      if (lastLessonStatus === 'completed') {
        currentStatus = 'available';
      } else {
        currentStatus = 'locked';
      }
    }

    // Create a base lesson object from the row data
    const lesson: Lesson = {
      id: row.lessonId,
      learning_unit_id: row.unitId,
      title: row.lessonTitle,
      description: row.lessonDescription,
      type: row.lessonType,
      estimated_time: row.lessonEstimatedTime,
      order_index: row.lessonOrderIndex,
      content_data: row.lessonContentData,
      is_active: row.lessonIsActive,
      created_at: row.lessonCreatedAt,
      updated_at: row.lessonUpdatedAt,
    };

    // Combine the base lesson with user progress to create the final object
    const lessonWithProgress: LessonWithUserProgress = {
      ...lesson,
      status: currentStatus,
      score: lessonProgress?.score,
      started_at: lessonProgress?.started_at,
      completed_at: lessonProgress?.completed_at,
    };
    
    unit.lessons.push(lessonWithProgress);

    // The status of the current lesson becomes the prerequisite for the next lesson.
    lastLessonStatus = currentStatus;
  }

  // TODO: Implement robust prerequisite logic for non-linear paths.
  // The current logic assumes a linear path. Future enhancements should parse
  // `learning_units.prerequisites` (e.g., a JSON array of unit IDs) to handle
  // complex dependencies, which might allow multiple lessons or units to be
  // 'available' simultaneously based on the completion of other units.

  const assembledUnits = Array.from(unitsMap.values()).sort((a, b) => a.order_index - b.order_index);

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
  // Find existing progress record
  const existingProgress = await db<UserLessonProgress>('user_lesson_progress')
    .where({ user_id: userId, lesson_id: lessonId })
    .first();

  if (existingProgress) {
    // If already 'in_progress' or 'completed', do nothing and return current state
    if (['in_progress', 'completed'].includes(existingProgress.status)) {
      return existingProgress;
    }
    // If 'available' or 'locked' (though starting a locked lesson should be prevented by UI), update to 'in-progress'
    const [updatedProgress] = await db<UserLessonProgress>('user_lesson_progress')
      .where('id', existingProgress.id)
      .update({
        status: 'in-progress',
        started_at: new Date().toISOString(),
      })
      .returning('*');
    return updatedProgress;
  } else {
    // If no record exists, create a new one
    // Note: In a strict system, we should verify the lesson is 'available' before creating this.
    // This is handled in getLearningPathUserView, but could be re-verified here for API security.
    const [newProgress] = await db<UserLessonProgress>('user_lesson_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        status: 'in-progress',
        started_at: new Date().toISOString(),
      })
      .returning('*');
    return newProgress;
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
  const progressToUpdate = await trx<UserLessonProgress>('user_lesson_progress')
    .where({ user_id: userId, lesson_id: lessonId })
    .first();

  // A lesson must be started before it can be completed.
  if (!progressToUpdate) {
    throw new Error('Lesson has not been started. Cannot mark as complete.');
  }

  // You can only complete a lesson that is currently in progress.
  if (progressToUpdate.status !== 'in-progress') {
    // We can either throw an error or just return the existing record if it's already completed.
    // Throwing an error is stricter and likely better.
    throw new Error(`Cannot complete lesson with status: ${progressToUpdate.status}`);
  }

  const [updatedProgress] = await trx<UserLessonProgress>('user_lesson_progress')
    .where('id', progressToUpdate.id)
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      // score could be updated here if applicable
    })
    .returning('*');

  return updatedProgress;
}
