import db from '../config/db';

export interface UserProgress {
  id?: number;
  userId: number;
  currentLevel: CEFRLevel;
  currentXP: number;
  totalXP: number;
  streakDays: number;
  lastActivityDate?: Date;
  lessonsCompleted: number;
  wordsLearned: number;
  timeSpentMinutes: number;
  accuracyRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LevelThreshold {
  level: CEFRLevel;
  xpRequired: number;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 'A1', xpRequired: 0 },
  { level: 'A2', xpRequired: 1000 },
  { level: 'B1', xpRequired: 3000 },
  { level: 'B2', xpRequired: 6000 },
  { level: 'C1', xpRequired: 10000 },
  { level: 'C2', xpRequired: 15000 }
];

export interface TopicProgress {
    topicId: number;
    topicName: string;
    completedCount: number;
    totalCount: number;
    percentage: number;
}

export interface AssignedContentProgress {
    completedCount: number;
    totalCount: number;
    percentage: number;
}

export const getTopicProgress = async (userId: number): Promise<TopicProgress[]> => {
    const topics = await db('topics').select('id', 'name');
    if (topics.length === 0) {
        return [];
    }
    const topicProgress = await Promise.all(topics.map(async topic => {
      const totalCountResult = await db('content').where('topicId', topic.id).count('* as count').first();
      const completedCountResult = await db('user_content_completions')
        .join('content', 'user_content_completions.contentId', 'content.id')
        .where({
          'user_content_completions.userId': userId,
          'content.topicId': topic.id,
        })
        .countDistinct('content.id as count')
        .first();
      
      const totalCount = Number(totalCountResult?.count || 0);
      const completedCount = Number(completedCountResult?.count || 0);

      return {
        topicId: topic.id,
        topicName: topic.name,
        completedCount,
        totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      };
    }));
    return topicProgress;
}

export const getAssignedContentProgress = async (userId: number): Promise<AssignedContentProgress> => {
    const totalAssignedResult = await db('user_content_assignments')
      .where({ userId: userId })
      .count('* as count')
      .first();

    const completedAssignedResult = await db('user_content_completions')
      .where({ userId: userId })
      .whereNotNull('explicitAssignmentId')
      .countDistinct('explicitAssignmentId as count')
      .first();

    const totalAssigned = Number(totalAssignedResult?.count || 0);
    const completedAssigned = Number(completedAssignedResult?.count || 0);
    
    const assignedContentProgress = {
      completedCount: completedAssigned,
      totalCount: totalAssigned,
      percentage: totalAssigned > 0 ? Math.round((completedAssigned / totalAssigned) * 100) : 0,
    };

    return assignedContentProgress;
}
