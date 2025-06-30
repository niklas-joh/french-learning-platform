# Task 2.3: Create API Controllers

Create the following file with the specified content:

**File**: `server/src/controllers/progressController.ts`
```typescript
import { Request, Response } from 'express';
import { progressService } from '../services/progressService';

export class ProgressController {
  async getUserProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const progress = await progressService.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  }

  async updateProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { activityType, performance, timeSpent } = req.body;
      const updatedProgress = await progressService.updateProgress(
        userId,
        activityType,
        performance,
        timeSpent
      );

      res.json(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  }

  async getStreakInfo(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const streakInfo = await progressService.getStreakInfo(userId);
      res.json(streakInfo);
    } catch (error) {
      console.error('Error fetching streak info:', error);
      res.status(500).json({ error: 'Failed to fetch streak info' });
    }
  }
}

export const progressController = new ProgressController();
