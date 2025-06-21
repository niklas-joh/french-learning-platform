import db from '../config/db';

import { ContentSchema as Content } from './Content';

export interface UserContentAssignment {
  id: number;
  user_id: number;
  content_id: number;
  assigned_at: Date;
  status: 'pending' | 'completed';
}

export interface UserContentAssignmentWithContent extends UserContentAssignment {
  content: Content;
}

const UserContentAssignmentModel = {
  async assign(userId: number, contentId: number): Promise<UserContentAssignment> {
    const [assignment] = await db('user_content_assignments')
      .insert({
        user_id: userId,
        content_id: contentId,
      })
      .returning('*');
    return assignment;
  },

  async findByUserId(userId: number): Promise<UserContentAssignmentWithContent[]> {
    const assignments = await db('user_content_assignments')
      .where({ 'user_content_assignments.user_id': userId })
      .join('content', 'user_content_assignments.content_id', 'content.id')
      .select(
        'user_content_assignments.*',
        'content.name as content_name',
        'content.type as content_type',
        'content.question_data as content_question_data',
        'content.id as content_id_alias'
      );

    return assignments.map(assignment => {
      const { content_name, content_type, content_question_data, content_id_alias, ...assignmentData } = assignment;
      return {
        ...assignmentData,
        content: {
          id: content_id_alias,
          name: content_name,
          type: content_type,
          question_data: content_question_data,
          // Add other necessary content fields here, with default or null values
          correct_answer: '', // Or fetch if needed
        },
      };
    });
  },

  async findById(id: number): Promise<UserContentAssignment | undefined> {
    return db('user_content_assignments').where({ id }).first();
  },

  async unassign(id: number): Promise<number> {
    return db('user_content_assignments').where({ id }).del();
  },
};

export default UserContentAssignmentModel;
