import { Request, Response } from 'express';
import knex from '../config/db';

interface AnalyticsSummary {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  totalContentItems: number;
}

export const adminTestController = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Admin route test successful!' });
};

export const getAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Get total number of users
    const totalUsersResult = await knex('users').count('* as count').first();
    const totalUsers = Number(totalUsersResult?.count || 0);

    // 2. Get number of users by role
    const usersByRoleResult = await knex('users')
      .select('role')
      .count('* as count')
      .groupBy('role');
    const usersByRole = usersByRoleResult.map(row => ({
      role: String(row.role),
      count: Number(row.count),
    }));

    // 3. Get total number of content items
    // This is a placeholder. We need to determine how content items are stored.
    // Assuming content is stored as JSON files in `content/topics/*/*.json`
    // This part will require a different approach, likely reading the file system or querying a dedicated table if one exists.
    // For MVP, let's simulate this or come back to it.
    // For now, let's count files in the content/topics directory as a proxy.
    // This is NOT a robust solution for production.
    const fs = require('fs').promises;
    const path = require('path');
    // Corrected path: from server/src/controllers, go up 3 levels to french-learning-platform, then content/topics
    const topicsDir = path.join(__dirname, '../../../content/topics');
    let totalContentItems = 0;
    try {
      const topicFolders = await fs.readdir(topicsDir);
      for (const topicFolder of topicFolders) {
        const topicPath = path.join(topicsDir, topicFolder);
        const stat = await fs.stat(topicPath);
        if (stat.isDirectory()) {
          const files = await fs.readdir(topicPath);
          totalContentItems += files.filter((file: string) => file.endsWith('.json')).length;
        }
      }
    } catch (err) {
      console.error("Error reading content directory for analytics:", err);
      // If content directory reading fails, we don't want the whole API to fail.
      // Set to 0 or a specific error indicator if preferred.
      totalContentItems = 0; 
    }


    const summary: AnalyticsSummary = {
      totalUsers,
      usersByRole,
      totalContentItems,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ message: 'Failed to fetch analytics summary' });
  }
};
