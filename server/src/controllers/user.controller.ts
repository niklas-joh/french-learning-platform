/**
 * User related controllers responsible for profile management and progress
 * tracking APIs.
 */
import { Request, Response } from 'express';
import knex from '../config/db';
import { UserSchema } from '../models/User';
import UserContentAssignmentModel from '../models/UserContentAssignment';
import UserPreferenceModel from '../models/UserPreference';

// Extend Express Request type to include the user object populated by the
// authentication middleware.
interface AuthenticatedRequest extends Request {
  user?: {
    
    userId?: number;
    id?: number;
    email?: string;
    role?: string;
  };
}

/**
 * Returns the authenticated user's profile without the password hash.
 */
export const getCurrentUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = uid;
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

/**
 * Updates the authenticated user's profile fields.
 */
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = uid;
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

/**
 * Lists all users. Admin only endpoint.
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await knex('users').select('id', 'first_name', 'last_name', 'email', 'role');
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Returns all content assignments for the authenticated user.
 */
export const getAssignedContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = uid;
    const assignments = await UserContentAssignmentModel.findByUserId(userId);
    res.json(assignments);
  } catch (error: any) {
    console.error('Error fetching assigned content:', error);
    res.status(500).json({ message: 'Failed to fetch assigned content' });
  }
};

/**
 * Aggregates progress for the authenticated user across all topics and assigned content.
 */
export const getUserProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const userId = uid;

    // --- Topic Progress Calculation ---
    const topics = await knex('topics').select('id', 'name');
    const topicProgress = topics.length > 0 ? await Promise.all(topics.map(async topic => {
      const totalCountResult = await knex('content').where('topic_id', topic.id).count('* as count').first();
      const completedCountResult = await knex('user_content_assignments')
        .join('content', 'user_content_assignments.content_id', 'content.id')
        .where({
          'user_content_assignments.user_id': userId,
          'user_content_assignments.status': 'completed',
          'content.topic_id': topic.id,
        })
        .count('* as count').first();
      
      const totalCount = Number(totalCountResult?.count || 0);
      const completedCount = Number(completedCountResult?.count || 0);

      return {
        topicId: topic.id,
        topicName: topic.name,
        completedCount,
        totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      };
    })) : [];

    // --- Assigned Content Progress Calculation ---
    const assignedContentStats = await knex('user_content_assignments')
      .where({ user_id: userId })
      .select(
        knex.raw('count(*) as "totalCount"'),
        knex.raw('count(case when status = \'completed\' then 1 else null end) as "completedCount"')
      )
      .first();

    const totalAssigned = Number(assignedContentStats?.totalCount || 0);
    const completedAssigned = Number(assignedContentStats?.completedCount || 0);
    
    const assignedContentProgress = {
      completedCount: completedAssigned,
      totalCount: totalAssigned,
      percentage: totalAssigned > 0 ? Math.round((completedAssigned / totalAssigned) * 100) : 0,
    };

    // --- Final Response ---
    const overallProgress = {
      topicProgress,
      assignedContentProgress,
    };

    res.json(overallProgress);
  } catch (error: any) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
};

/**
 * Retrieves the persisted preferences for the authenticated user.
 */
export const getUserPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.userId ?? req.user?.id;
        if (!uid || typeof uid !== 'number' || uid <= 0) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userId = uid;
        const preferences = await UserPreferenceModel.findByUserId(userId);
        if (preferences) {
            res.json(JSON.parse(preferences.preferences));
        } else {
            res.json({}); // Return empty object if no preferences are set
        }
    } catch (error: any) {
        console.error('Error fetching user preferences:', error);
        res.status(500).json({ message: 'Failed to fetch user preferences' });
    }
};

/**
 * Stores new preference values for the authenticated user.
 */
export const updateUserPreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid2 = req.user?.userId ?? req.user?.id;
        if (!uid2 || typeof uid2 !== 'number' || uid2 <= 0) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userId = uid2;
        const { preferences } = req.body;

        if (!preferences || typeof preferences !== 'object') {
            res.status(400).json({ message: 'Invalid preferences format' });
            return;
        }

        const updatedPreference = await UserPreferenceModel.upsert(userId, preferences);
        res.json(JSON.parse(updatedPreference.preferences));
    } catch (error: any) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: 'Failed to update user preferences' });
    }
};

/**
 * Records progress for a specific content item for the authenticated user.
 * Sets the status of the corresponding user_content_assignment to 'completed'.
 */
export const recordContentItemProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.userId ?? req.user?.id;
    if (!uid || typeof uid !== 'number' || uid <= 0) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const userId = uid;
    const { contentId } = req.params;

    if (!contentId || isNaN(Number(contentId))) {
      res.status(400).json({ message: 'Invalid content ID provided.' });
      return;
    }

    const numericContentId = Number(contentId);

    // Check if an assignment exists. If not, create one.
    // This handles cases where a user completes content that wasn't explicitly assigned.
    let assignment = await knex('user_content_assignments')
      .where({ user_id: userId, content_id: numericContentId })
      .first();

    if (!assignment) {
      assignment = await UserContentAssignmentModel.assign(userId, numericContentId);
    }

    // Now, update the status to 'completed'
    const updatedAssignment = await UserContentAssignmentModel.updateStatus(userId, numericContentId, 'completed');

    if (!updatedAssignment) {
      // This case might occur if the assignment exists but the update fails for some reason.
      res.status(404).json({ message: 'Could not update progress. Assignment not found.' });
      return;
    }

    res.status(200).json({ message: 'Progress recorded successfully.', assignment: updatedAssignment });

  } catch (error: any) {
    console.error('Error recording content progress:', error);
    res.status(500).json({ message: 'Failed to record progress.' });
  }
};
