import knex from '../config/db';

export interface UserContentCompletion {
  id?: number;
  user_id: number;
  content_id: number;
  completed_at?: Date;
  attempt_number: number;
  score?: number;
  explicit_assignment_id?: number;
  created_at?: Date;
  updated_at?: Date;
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
        user_id: userId,
        content_id: contentId,
        explicit_assignment_id: explicitAssignmentId,
        score: score,
        attempt_number: attemptNumber,
      })
      .returning('*');
    return newCompletion;
  },

  async findByUserAndContent(userId: number, contentId: number): Promise<UserContentCompletion[]> {
    return knex('user_content_completions')
      .where({ user_id: userId, content_id: contentId })
      .select('*');
  },

  async getCompletionsByTopicForUser(userId: number, topicId: number): Promise<{ content_id: number }[]> {
    return knex('user_content_completions')
      .join('content', 'user_content_completions.content_id', 'content.id')
      .where({
        'user_content_completions.user_id': userId,
        'content.topic_id': topicId,
      })
      .distinct('user_content_completions.content_id')
      .select('user_content_completions.content_id');
  }
};

export default UserContentCompletionModel;
