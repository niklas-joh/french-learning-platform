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
  content: Partial<Content> & { type: string };
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
      .join('content_types', 'content.content_type_id', 'content_types.id')
      .select(
        'user_content_assignments.*',
        'content.name as content_name',
        'content.question_data as content_question_data',
        'content.id as content_id', // Use a clear alias for the content ID
        'content_types.name as content_type_name',
        'content.content_type_id as content_type_id'
      );

    return assignments.map(row => {
      // Destructure with care to avoid name collisions
      const { content_id: assigned_content_id, ...assignmentFields } = row;

      return {
        id: assignmentFields.id,
        user_id: assignmentFields.user_id,
        content_id: assigned_content_id, // This is the actual content_id from the content table
        assigned_at: assignmentFields.assigned_at,
        status: assignmentFields.status,
        content: {
          id: assigned_content_id, // The ID of the content item
          name: assignmentFields.content_name,
          question_data: assignmentFields.content_question_data,
          content_type_id: assignmentFields.content_type_id,
          type: assignmentFields.content_type_name,
          correct_answer: '', // Still minimal, but the ID is now correct
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
