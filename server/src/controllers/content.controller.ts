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

    const content: ContentSchema[] = await knex('content')
      .where({ topic_id: topicId, active: true }) // Ensure only active content is fetched
      .select('*');

    if (content.length === 0) {
      res.json([]);
      return;
    }

    // Manually transform the data to match the frontend's expected structure
    const transformedContent = content.map(item => {
      const questionData = typeof item.question_data === 'string' ? JSON.parse(item.question_data) : item.question_data;
      
      return {
        id: item.id,
        type: item.type,
        topic: topicExists.name, // Add topic name
        difficultyLevel: item.difficulty_level,
        tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
        questionData: {
          text: questionData.text,
          explanation: questionData.explanation,
        },
        options: typeof item.options === 'string' ? JSON.parse(item.options) : item.options,
        correctAnswer: typeof item.correct_answer === 'string' ? JSON.parse(item.correct_answer) : item.correct_answer,
        feedback: questionData.feedback, // Extract feedback from the blob
      };
    });

    console.log('Transformed content being sent to client:', JSON.stringify(transformedContent, null, 2));
    res.json(transformedContent);
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
