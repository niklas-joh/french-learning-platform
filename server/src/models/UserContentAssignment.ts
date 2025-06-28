/**
 * Model helpers for the `user_content_assignments` join table.
 */
import db from '../config/db';

import { ContentSchema as Content } from './Content';

export interface UserContentAssignment {
  id: number;
  userId: number;
  contentId: number;
  assignedAt: Date;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

export interface UserContentAssignmentWithContent extends UserContentAssignment {
  content: Partial<Content> & { type: string };
}

/**
 * CRUD helpers for content assignments.
 */
const UserContentAssignmentModel = {
  async assign(userId: number, contentId: number, dueDate?: Date): Promise<UserContentAssignment> {
    // Create a new assignment row linking a user and a content item
    const [assignment] = await db('user_content_assignments')
      .insert({
        userId: userId,
        contentId: contentId,
        dueDate: dueDate,
        status: 'pending',
      })
      .returning('*');
    return assignment;
  },

  async findByUserId(userId: number): Promise<UserContentAssignmentWithContent[]> {
    // Lookup assignments and join the content information
    // console.log(`[UserContentAssignmentModel] findByUserId - User ID: ${userId} (DEBUGGING - Simple Query)`); // Removed debug log

    // // DEBUGGING: Simplified query (REMOVED)
    // const assignmentsFromDb = await db('user_content_assignments')
    //   .where({ 'user_id': userId })
    //   .select('*');
    // 
    // console.log(`[UserContentAssignmentModel] findByUserId - Raw assignments from DB (DEBUGGING - Simple Query): ${JSON.stringify(assignmentsFromDb, null, 2)}`); // Removed debug log

    // if (assignmentsFromDb.length === 0) { // REMOVED
    //   console.log(`[UserContentAssignmentModel] findByUserId - DEBUGGING: No assignments found for user ${userId} with simple query. Returning empty array.`); // Removed debug log
    //   return []; 
    // }

    // Restore Original query logic 
    const base = db('user_content_assignments')
      .where({ 'user_content_assignments.userId': userId })
      .leftJoin('content', 'user_content_assignments.contentId', 'content.id') // Changed to leftJoin
      .select(
        'user_content_assignments.*',
        'content.title as contentName',
        'content.questionData as contentQuestionData',
        'content.id as contentIdAlias'
      );

    const hasContentTypes = await db.schema.hasTable('content_types');
    const hasContentTypeId = await db.schema.hasColumn('content', 'contentTypeId');
    if (hasContentTypes && hasContentTypeId) {
      base.leftJoin('content_types', 'content.contentTypeId', 'content_types.id'); // Changed to leftJoin
      base.select('content_types.name as contentTypeName', 'content.contentTypeId as contentTypeId');
    } else {
      base.select('content.type as contentTypeName');
    }
    // console.log(`[UserContentAssignmentModel] findByUserId - User ID: ${userId} (Restored Original Query)`); // Log removed
    const assignments = await base;
    // console.log(`[UserContentAssignmentModel] findByUserId - Raw assignments from DB (After Joins): ${JSON.stringify(assignments, null, 2)}`); // Log removed

    const typeIdMap: Record<number, string> = {
      1: 'multiple-choice',
      2: 'fill-in-the-blank',
      3: 'sentence-correction',
      4: 'true-false',
    };

    return assignments.map(assignment => {
      const { contentName, contentQuestionData, contentIdAlias, contentTypeId, contentTypeName, ...assignmentData } = assignment;
      const type = contentTypeName || (contentTypeId ? typeIdMap[contentTypeId] : undefined) || 'default';
      return {
        ...assignmentData,
        content: {
          id: contentIdAlias,
          name: contentName,
          questionData: contentQuestionData,
          contentTypeId: contentTypeId,
          type,
          // Create a minimal valid Content object.
          // Most fields are missing, but it satisfies the type for now.
          correctAnswer: '',
        },
      };
    });
  },

  async findById(id: number): Promise<UserContentAssignment | undefined> {
    return db('user_content_assignments').where({ id }).first();
  },

  async unassign(id: number): Promise<number> {
    // TODO: implement soft delete to preserve assignment history
    return db('user_content_assignments').where({ id }).del();
  },

  async updateStatus(assignmentId: number, status: 'pending' | 'in-progress' | 'completed' | 'overdue'): Promise<UserContentAssignment | undefined> {
    const [updatedAssignment] = await db('user_content_assignments')
      .where({ id: assignmentId })
      .update({ status: status })
      .returning('*');
    return updatedAssignment;
  },

  async findByUserIdAndContentId(userId: number, contentId: number): Promise<UserContentAssignment | undefined> {
    return db('user_content_assignments')
      .where({ userId: userId, contentId: contentId })
      .first();
  }
};

export default UserContentAssignmentModel;
