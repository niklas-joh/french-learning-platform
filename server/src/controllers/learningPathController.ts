import { Request, Response, NextFunction } from 'express';
import * as learningPathService from '../services/learningPathService.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import knex from '../config/db.js';

/**
 * @controller LearningPathController
 * Handles requests related to learning paths.
 */
export class LearningPathController {
  /**
   * @handler GET /api/learning-paths/:pathId/user-view
   * Retrieves a specific learning path with user progress for the authenticated user.
   * @param req Express request object, expected to be an AuthenticatedRequest.
   * @param res Express response object.
   * @param next Express next middleware function.
   */
  public async getLearningPathForUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const pathIdString = req.params.pathId;
      if (!pathIdString || isNaN(parseInt(pathIdString, 10))) {
        res.status(400).json({ message: 'Valid pathId parameter is required.' });
        return;
      }
      const pathId = parseInt(pathIdString, 10);

      // Assuming req.user is populated by authentication middleware and has a 'userId' property
      if (!req.user || typeof req.user.userId !== 'number') { // Changed to userId
        // This case should ideally be caught by auth middleware, but good to double check
        res.status(401).json({ message: 'User authentication required or user ID missing.' });
        return;
      }
      const userId = req.user.userId; // Changed to userId

      const learningPathWithProgress = await learningPathService.getLearningPathUserView(pathId, userId);

      if (!learningPathWithProgress) {
        res.status(404).json({ message: `Learning path with ID ${pathId} not found.` });
        return;
      }

      res.status(200).json(learningPathWithProgress);
    } catch (error) {
      // Pass to a centralized error handler if one exists, otherwise log and send generic error
      console.error('Error in getLearningPathForUser:', error);
      next(error); // Or res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * @handler POST /api/user/lessons/:lessonId/start
   * Marks a lesson as 'in_progress' for the user.
   */
  public async startLesson(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lessonId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'User authentication required.' });
        return;
      }

      if (!lessonId || isNaN(parseInt(lessonId, 10))) {
        res.status(400).json({ message: 'Valid lessonId parameter is required.' });
        return;
      }

      const numericLessonId = parseInt(lessonId, 10);

      // Your service call to update the lesson status
      const progress = await learningPathService.startUserLesson(userId, numericLessonId);

      res.status(200).json({ message: 'Lesson started successfully.', progress });
    } catch (error) {
      console.error('Error in startLesson:', error);
      next(error);
    }
  }

  /**
   * @handler POST /api/user/lessons/:lessonId/complete
   * Marks a lesson as 'completed' for the user within a transaction.
   */
  public async completeLesson(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { lessonId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'User authentication required.' });
      return;
    }

    if (!lessonId || isNaN(parseInt(lessonId, 10))) {
      res.status(400).json({ message: 'Valid lessonId parameter is required.' });
      return;
    }
    const numericLessonId = parseInt(lessonId, 10);

    try {
      await knex.transaction(async (trx) => {
        // Update lesson progress
        const progress = await learningPathService.completeUserLesson(userId, numericLessonId, trx);

        // Future steps (e.g., gamification) would be called here, using the same transaction `trx`
        // await gamificationService.awardPointsForLesson(userId, numericLessonId, { trx });
        // await achievementService.checkLessonCompletionAchievements(userId, { trx });

        res.status(200).json({ message: 'Lesson completed successfully.', progress });
      });
    } catch (error) {
      console.error('Error in completeLesson transaction:', error);
      // The transaction will automatically roll back on error
      next(error);
    }
  }
}

// Export an instance if you prefer singleton controllers, or use static methods
export default new LearningPathController();
