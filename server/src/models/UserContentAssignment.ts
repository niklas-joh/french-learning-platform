import db from '../config/db';

export interface UserContentAssignment {
  id: number;
  user_id: number;
  content_id: number;
  assigned_at: Date;
  status: 'pending' | 'completed';
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

  async findByUserId(userId: number): Promise<UserContentAssignment[]> {
    return db('user_content_assignments').where({ user_id: userId });
  },

  async findById(id: number): Promise<UserContentAssignment | undefined> {
    return db('user_content_assignments').where({ id }).first();
  },

  async unassign(id: number): Promise<number> {
    return db('user_content_assignments').where({ id }).del();
  },
};

export default UserContentAssignmentModel;
