import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClientLearningPath, ClientLesson } from '../types/LearningPath';
import { fetchLearningPath } from '../services/learningPathService';

// TODO: This custom hook should be replaced with a robust server-state management
// library like TanStack Query (React Query) in the future. This would provide
// caching, automatic refetching, request deduplication, and a more resilient
// data fetching strategy across the application.

interface UseLearningPathReturn {
  data: ClientLearningPath | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  findLessonById: (lessonId: number) => ClientLesson | undefined;
}

/**
 * A custom hook to fetch and manage the state for a learning path.
 * @param pathId The ID of the learning path to fetch.
 */
export const useLearningPath = (pathId: number): UseLearningPathReturn => {
  const [data, setData] = useState<ClientLearningPath | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const learningPathData = await fetchLearningPath(pathId);

      // Map the API's snake_case fields to the camelCase structure
      const mappedPath: ClientLearningPath = {
        id: learningPathData.id,
        name: learningPathData.name,
        description: learningPathData.description,
        totalLessons: learningPathData.total_lessons,
        units: learningPathData.units.map((unit: any) => ({
          id: unit.id,
          title: unit.title,
          description: unit.description,
          level: unit.level,
          orderIndex: unit.order_index,
          lessons: unit.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            estimatedTime: lesson.estimated_time,
            orderIndex: lesson.order_index,
            status: lesson.status,
            contentData: lesson.content_data,
          })),
        })),
      };

      setData(mappedPath);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching the learning path.');
    } finally {
      setIsLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const lessonMap = useMemo(() => {
    if (!data) {
      return new Map<number, ClientLesson>();
    }
    const map = new Map<number, ClientLesson>();
    data.units.forEach(unit => {
      unit.lessons.forEach(lesson => {
        map.set(lesson.id, lesson);
      });
    });
    return map;
  }, [data]);

  const findLessonById = useCallback(
    (lessonId: number): ClientLesson | undefined => {
      return lessonMap.get(lessonId);
    },
    [lessonMap]
  );

  return { data, isLoading, error, refetch: fetchData, findLessonById };
};
