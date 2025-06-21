import { Request, Response } from 'express';
import knex from '../config/db';

import { createContent, getContentById, getAllContent, updateContent, deleteContent } from '../models/Content';
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

export const getAllTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topics = await knex('topics').select('*');
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Failed to fetch topics' });
  }
};

export const createTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    const [newTopic] = await knex('topics').insert({ name, description }).returning('*');
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: 'Failed to create topic' });
  }
};

export const getTopicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const topic = await knex('topics').where({ id }).first();
    if (!topic) {
      res.status(404).json({ message: 'Topic not found' });
      return;
    }
    res.status(200).json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Failed to fetch topic' });
  }
};

export const updateTopicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await knex('topics').where({ id }).update(req.body);
    const updated = await knex('topics').where({ id }).first();
    if (!updated) {
      res.status(404).json({ message: 'Topic not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ message: 'Failed to update topic' });
  }
};

export const deleteTopicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await knex('topics').where({ id }).del();
    if (!deleted) {
      res.status(404).json({ message: 'Topic not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ message: 'Failed to delete topic' });
  }
};

export const getAllContentTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const types = await knex('content_types').select('*');
    res.status(200).json(types);
  } catch (error) {
    console.error('Error fetching content types:', error);
    res.status(500).json({ message: 'Failed to fetch content types' });
  }
};

export const createContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    const [newType] = await knex('content_types').insert({ name, description }).returning('*');
    res.status(201).json(newType);
  } catch (error) {
    console.error('Error creating content type:', error);
    res.status(500).json({ message: 'Failed to create content type' });
  }
};

export const updateContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await knex('content_types').where({ id }).update({ name, description });
    if (!updated) {
      res.status(404).json({ message: 'Content type not found' });
      return;
    }
    const updatedType = await knex('content_types').where({ id }).first();
    res.status(200).json(updatedType);
  } catch (error) {
    console.error('Error updating content type:', error);
    res.status(500).json({ message: 'Failed to update content type' });
  }
};

export const deleteContentType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await knex('content_types').where({ id }).del();
    if (!deleted) {
      res.status(404).json({ message: 'Content type not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting content type:', error);
    res.status(500).json({ message: 'Failed to delete content type' });
  }
};

export const createContentItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required for content.' });
      return;
    }
    const newItem = await createContent(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: 'Failed to create content' });
  }
};

export const getAllContentItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllContent();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching content items:', error);
    res.status(500).json({ message: 'Failed to fetch content items' });
  }
};

export const getContentItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await getContentById(Number(id));
    if (!item) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
};

export const updateContentItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await updateContent(Number(id), req.body);
    if (!updated) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Failed to update content' });
  }
};

export const deleteContentItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await deleteContent(Number(id));
    if (!success) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Failed to delete content' });
  }
};
