import { Request, Response } from 'express';
import knex from '../config/db';
import { UserSchema } from '../models/User'; // Use UserSchema for DB operations
import UserContentAssignmentModel from '../models/UserContentAssignment';

// Extend Express Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number; // Changed to userId for consistency with auth.middleware.ts
    email?: string; // Added for completeness, though not strictly used by getCurrentUserProfile directly
    role?: string;  // Added for completeness
  };
}

export const getCurrentUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || typeof req.user.userId !== 'number' || req.user.userId <= 0) { // Check for userId and its validity
      res.status(401).json({ message: 'User not authenticated or invalid user ID' });
      return;
    }

    const userId = req.user.userId; // Use userId
    const user = await knex('users').where({ id: userId }).first();

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Exclude password from the response
    const { password_hash, ...userProfile } = user; 

    res.json(userProfile);
  } catch (error: any) { // Type error as any
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || typeof req.user.userId !== 'number' || req.user.userId <= 0) { // Check for userId and its validity
      res.status(401).json({ message: 'User not authenticated or invalid user ID' });
      return;
    }

    const userId = req.user.userId; // Use userId
    const { email, first_name, last_name, preferences, password } = req.body;

    if (password) {
      res.status(400).json({ message: 'Password cannot be updated through this route.' });
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      res.status(400).json({ message: 'Invalid email format.' });
      return;
    }

    const updateData: Partial<UserSchema> & { updated_at?: Date } = {};
    if (email) updateData.email = email;
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (preferences) updateData.preferences = JSON.stringify(preferences);

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: 'No update fields provided' });
      return;
    }

    updateData.updated_at = new Date();

    const [updatedUser] = await knex('users')
      .where({ id: userId })
      .update(updateData)
      .returning(['id', 'email', 'first_name', 'last_name', 'preferences', 'created_at', 'updated_at']);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found or update failed' });
      return;
    }
    
    res.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
        res.status(409).json({ message: 'Email already taken.' });
        return;
    }
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await knex('users').select('id', 'first_name', 'last_name', 'email', 'role');
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getAssignedContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || typeof req.user.userId !== 'number' || req.user.userId <= 0) {
      res.status(401).json({ message: 'User not authenticated or invalid user ID' });
      return;
    }

    const userId = req.user.userId;
    const assignments = await UserContentAssignmentModel.findByUserId(userId);
    res.json(assignments);
  } catch (error: any) {
    console.error('Error fetching assigned content:', error);
    res.status(500).json({ message: 'Failed to fetch assigned content' });
  }
};

export const getUserProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || typeof req.user.userId !== 'number' || req.user.userId <= 0) {
      res.status(401).json({ message: 'User not authenticated or invalid user ID' });
      return;
    }
    const userId = req.user.userId;

    // 1. Get all topics
    const topics = await knex('topics').select('id', 'name');
    if (!topics || topics.length === 0) {
      res.json([]);
      return;
    }

    // 2. Get total content count for each topic
    const totalCountsQuery = knex('content')
      .select('topic_id')
      .count('* as totalCount')
      .groupBy('topic_id');
    
    // 3. Get completed content count for the user for each topic
    const completedCountsQuery = knex('user_content_assignments')
      .join('content', 'user_content_assignments.content_id', 'content.id')
      .where({
        'user_content_assignments.user_id': userId,
        'user_content_assignments.status': 'completed',
      })
      .select('content.topic_id')
      .count('* as completedCount')
      .groupBy('content.topic_id');

    const [totalCounts, completedCounts] = await Promise.all([
      totalCountsQuery,
      completedCountsQuery,
    ]);

    // 4. Map counts to topics for a more robust result
    const progressData = topics.map(topic => {
      const total = totalCounts.find(c => c.topic_id === topic.id);
      const completed = completedCounts.find(c => c.topic_id === topic.id);

      const totalCount = total ? Number(total.totalCount) : 0;
      const completedCount = completed ? Number(completed.completedCount) : 0;

      return {
        topicId: topic.id,
        topicName: topic.name,
        completedCount,
        totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      };
    });

    res.json(progressData);
  } catch (error: any) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
};
