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
  // We need to cast the result of this query as the Knex select can be broad.
  type UnitAndLessonRow = LearningUnit & Lesson & {
    unit_id: number;
    unit_title: string;
    unit_description?: string;
    unit_level: string;
    unit_order_index: number;
    unit_prerequisites?: string;
    unit_is_active: boolean;
    unit_created_at: string;
    unit_updated_at: string;
    lesson_id: number;
    lesson_title: string;
    lesson_description?: string;
    lesson_type: string;
    lesson_estimated_time: number;
    lesson_order_index: number;
    lesson_content_data?: string;
    lesson_is_active: boolean;
    lesson_created_at: string;
    lesson_updated_at: string;
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
  const lessonIds = unitsAndLessonsRaw.map(item => item.lesson_id);
  const userProgressRecords = await db<UserLessonProgress>('user_lesson_progress')
    .where('user_id', userId)
    .whereIn('lesson_id', lessonIds);

  // Create a map for quick progress lookup
  const progressMap = new Map<number, UserLessonProgress>();
  userProgressRecords.forEach(p => progressMap.set(p.lesson_id, p));

  // 4. Data Restructuring and Status Determination
  const unitsMap = new Map<number, LearningUnitWithUserProgress>();
  let firstAvailableFound = false;

  for (const row of unitsAndLessonsRaw) {
    // Get or create the unit
    let unit = unitsMap.get(row.unit_id);
    if (!unit) {
      unit = {
        id: row.unit_id,
        learning_path_id: pathId,
        title: row.unit_title,
        description: row.unit_description,
        level: row.unit_level,
        order_index: row.unit_order_index,
        prerequisites: row.unit_prerequisites,
        is_active: row.unit_is_active,
        created_at: row.unit_created_at,
        updated_at: row.unit_updated_at,
        lessons: [],
      };
      unitsMap.set(row.unit_id, unit);
    }

    const lessonProgress = progressMap.get(row.lesson_id);
    let currentStatus: LessonStatus = 'locked'; // Default to locked

    if (lessonProgress) {
      currentStatus = lessonProgress.status;
    } else if (!firstAvailableFound) {
      // This is the first lesson without a progress record, so it becomes available.
      currentStatus = 'available';
      firstAvailableFound = true;
    }

    const lessonWithProgress: LessonWithUserProgress = {
      id: row.lesson_id,
      learning_unit_id: row.unit_id,
      title: row.lesson_title,
      description: row.lesson_description,
      type: row.lesson_type,
      estimated_time: row.lesson_estimated_time,
      order_index: row.lesson_order_index,
      content_data: row.lesson_content_data,
      is_active: row.lesson_is_active,
      created_at: row.lesson_created_at,
      updated_at: row.lesson_updated_at,
      status: currentStatus,
      score: lessonProgress?.score,
      started_at: lessonProgress?.started_at,
      completed_at: lessonProgress?.completed_at,
    };
    unit.lessons.push(lessonWithProgress);
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
