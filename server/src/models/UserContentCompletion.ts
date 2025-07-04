import knex from '../config/db.js';

export interface UserContentCompletion {
  id?: number;
  userId: number;
  contentId: number;
  completedAt?: Date;
  attemptNumber: number;
  score?: number;
  explicitAssignmentId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserContentCompletionModel = {
  async create(
    userId: number,
    contentId: number,
    explicitAssignmentId?: number,
    score?: number,
    attemptNumber: number = 1
  ): Promise<UserContentCompletion> {
    const [newCompletion] = await knex('user_content_completions')
      .insert({
        userId: userId,
        contentId: contentId,
        explicitAssignmentId: explicitAssignmentId,
        score: score,
        attemptNumber: attemptNumber,
      })
      .returning('*');
    return newCompletion;
  },

  async findByUserAndContent(userId: number, contentId: number): Promise<UserContentCompletion[]> {
    return knex('user_content_completions')
      .where({ userId: userId, contentId: contentId })
      .select('*');
  },

  async getCompletionsByTopicForUser(userId: number, topicId: number): Promise<{ contentId: number }[]> {
    return knex('user_content_completions')
      .join('content', 'user_content_completions.contentId', 'content.id')
      .where({
        'user_content_completions.userId': userId,
        'content.topicId': topicId,
      })
      .distinct('user_content_completions.contentId')
      .select('user_content_completions.contentId as contentId');
  }
};

export default UserContentCompletionModel;
