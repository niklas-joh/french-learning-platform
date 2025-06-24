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
    const base = db('user_content_assignments')
      .where({ 'user_content_assignments.user_id': userId })
      .join('content', 'user_content_assignments.content_id', 'content.id')
      .select(
        'user_content_assignments.*',
        'content.name as content_name',
        'content.question_data as content_question_data',
        'content.id as content_id_alias'
      );

    const hasContentTypes = await db.schema.hasTable('content_types');
    const hasContentTypeId = await db.schema.hasColumn('content', 'content_type_id');
    if (hasContentTypes && hasContentTypeId) {
      base.join('content_types', 'content.content_type_id', 'content_types.id');
      base.select('content_types.name as content_type_name', 'content.content_type_id as content_type_id');
    } else {
      base.select('content.type as content_type_name');
    }

    const assignments = await base;
    const typeIdMap: Record<number, string> = {
      1: 'multiple-choice',
      2: 'fill-in-the-blank',
      3: 'sentence-correction',
      4: 'true-false',
    };

    return assignments.map(assignment => {
      const { content_name, content_question_data, content_id_alias, content_type_id, content_type_name, ...assignmentData } = assignment;
      const type = content_type_name || (content_type_id ? typeIdMap[content_type_id] : undefined) || 'default';
      return {
        ...assignmentData,
        content: {
          id: content_id_alias,
          name: content_name,
          question_data: content_question_data,
          content_type_id: content_type_id,
          type,
          // Create a minimal valid Content object.
          // Most fields are missing, but it satisfies the type for now.
          correct_answer: '',
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
