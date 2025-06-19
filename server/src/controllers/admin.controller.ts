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

    // 3. Get total number of content items from the 'content' table
    const totalContentItemsResult = await knex('content').count('* as count').first();
    const totalContentItems = Number(totalContentItemsResult?.count || 0);

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
