import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import knex from '../config/db';
import { TopicSchema } from '../models/Topic';
import { ContentSchema } from '../models/Content';

export const getAllTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topics: TopicSchema[] = await knex('topics').select('*');
    res.json(topics);
  } catch (error: any) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Failed to fetch topics' });
  }
};

export const getContentForTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topicId } = req.params;
    if (isNaN(parseInt(topicId))) {
        res.status(400).json({ message: 'Invalid topic ID format.' });
        return;
    }

    const topicExists: TopicSchema | undefined = await knex('topics').where({ id: topicId }).first();
    if (!topicExists) {
        res.status(404).json({ message: 'Topic not found.' });
        return;
    }

    const content: ContentSchema[] = await knex('content').where({ topic_id: topicId }).select('*');
    
    if (content.length === 0) {
      // It's not an error if a topic has no content yet, return empty array
      res.json([]);
      return;
    }
    
    res.json(content);
  } catch (error: any) {
    console.error('Error fetching content for topic:', error);
    res.status(500).json({ message: 'Failed to fetch content for topic' });
  }
};

// Simple endpoint to return a sample quiz from the JSON content directory
export const getSampleQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = path.resolve(__dirname, '../../../content/topics/subjunctive/certainty-vs-doubt.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const quiz = JSON.parse(fileData);
    res.json(quiz);
  } catch (error: any) {
    console.error('Error loading sample quiz:', error);
    res.status(500).json({ message: 'Failed to load sample quiz' });
  }
};
