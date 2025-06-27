/**
 * Content and topic retrieval endpoints.
 */
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import knex from '../config/db';
import { TopicSchema } from '../models/Topic';
import { getContentByTopicId as fetchContentByTopicId, getContentById as fetchContentById } from '../models/Content';

/**
 * Retrieves a list of all learning topics.
 */
export const getAllTopics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics: TopicSchema[] = await knex('topics').select('*');
    res.json(topics);
  } catch (error: any) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Failed to fetch topics' });
  }
};

/**
 * Retrieves a single topic by its ID.
 */
export const getTopicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const topicId = parseInt(id);
    if (isNaN(topicId)) {
      res.status(400).json({ message: 'Invalid topic ID format.' });
      return;
    }

    const topic: TopicSchema | undefined = await knex('topics').where({ id: topicId }).first();
    if (!topic) {
      res.status(404).json({ message: 'Topic not found.' });
      return;
    }

    res.json(topic);
  } catch (error: any) {
    console.error('Error fetching topic by ID:', error);
    res.status(500).json({ message: 'Failed to fetch topic' });
  }
};

/**
 * Returns all content items associated with a given topic.
 */
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

    const content = await fetchContentByTopicId(parseInt(topicId));
    res.json(content);
  } catch (error: any) {
    console.error('Error fetching content for topic:', error);
    res.status(500).json({ message: 'Failed to fetch content for topic' });
  }
};

export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contentId = parseInt(id);
    if (isNaN(contentId)) {
      res.status(400).json({ message: 'Invalid content ID format.' });
      return;
    }

    const content = await fetchContentById(contentId);
    if (!content) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }

    res.json(content);
  } catch (error: any) {
    console.error('Error fetching content by id:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
};

// Simple endpoint to return a sample quiz from the JSON content directory
/**
 * Serves a static quiz JSON file for quick testing.
 * TODO: remove once dynamic quizzes are implemented.
 */
export const getSampleQuiz = async (_req: Request, res: Response): Promise<void> => {
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
