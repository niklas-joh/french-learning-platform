import { Request, Response } from 'express';

// Placeholder for AchievementService
const achievementService = {
  async getUserAchievements(userId: number) {
    // TODO: Implement actual logic
    console.log(`Fetching achievements for user ${userId}`);
    return [];
  },
  async getAllAchievements() {
    // TODO: Implement actual logic
    console.log('Fetching all achievements');
    return [];
  },
};

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const achievements = await achievementService.getUserAchievements(userId);
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user achievements.', error });
  }
};

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all achievements.', error });
  }
};
