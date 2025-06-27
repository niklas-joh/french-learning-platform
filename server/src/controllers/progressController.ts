import { Request, Response } from 'express';
import * as progressService from '../services/progressService';

export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // This assumes progressService.getUserProgress exists and fetches all relevant progress data
    const userProgress = await progressService.getUserProgress(userId); 
    res.status(200).json(userProgress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user progress.', error });
  }
};

export const getUserStreak = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // This assumes progressService.getUserStreak exists
    const streak = await progressService.getUserStreak(userId); 
    res.status(200).json({ streak });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user streak.', error });
  }
};

export const recordActivityCompleted = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const activityData = req.body; // e.g., { type, performance, timeSpent }

    // This is the main transactional function we planned
    const updatedProgress = await progressService.recordActivity(userId, activityData);

    res.status(200).json(updatedProgress);
  } catch (error) {
    // Log the detailed error for debugging
    console.error('Failed to record activity:', error);
    res.status(500).json({ message: 'Error recording completed activity.', error: (error as Error).message });
  }
};
