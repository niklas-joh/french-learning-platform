import request from 'supertest';
import express from 'express';
import contentRoutes from '../learning.routes';
import knex from '../../config/db'; // Adjust path as necessary
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());
app.use('/api/content', contentRoutes);

describe('Content API Endpoints', () => {
  beforeAll(async () => {
    // Read the schema.sql file and execute it to set up the in-memory database
    const schemaPath = path.resolve(__dirname, '../../../../database/schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
    
    // Split schema into individual statements to execute them one by one.
    const statements = schemaSQL.split(/;\s*$/m).filter(s => s.trim().length > 0);
    for (const statement of statements) {
      await knex.raw(statement);
    }
    await knex.raw(`
      CREATE TABLE user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        streak_days INTEGER DEFAULT 0,
        last_activity_date DATETIME,
        total_xp INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Seed data
    await knex('topics').insert([
      { id: 1, name: 'Test Topic 1', description: 'Description for topic 1', category: 'Test' },
      { id: 2, name: 'Test Topic 2', description: 'Description for topic 2', category: 'Test' },
    ]);
    
    // The schema now defines 'content' table with 'questionData', 'correctAnswer', 'options'
    // Let's adjust the seed data to match the actual schema.sql
    await knex('content').insert([
      { 
        id: 1, 
        topicId: 1, 
        type: 'lesson', 
        questionData: JSON.stringify({ title: 'Lesson 1.1', text: 'Content for lesson 1.1' }),
        correctAnswer: JSON.stringify({}),
        options: JSON.stringify({})
      },
      { 
        id: 2, 
        topicId: 1, 
        type: 'quiz', 
        questionData: JSON.stringify({ title: 'Quiz 1.1', questions: [] }),
        correctAnswer: JSON.stringify({}),
        options: JSON.stringify({})
      },
      { 
        id: 3, 
        topicId: 2, 
        type: 'lesson', 
        questionData: JSON.stringify({ title: 'Lesson 2.1', text: 'Content for lesson 2.1' }),
        correctAnswer: JSON.stringify({}),
        options: JSON.stringify({})
      },
    ]);
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('GET /api/content/topics', () => {
    it('should return a list of all topics', async () => {
      const response = await request(app).get('/api/content/topics');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });
  });

  describe('GET /api/content/topics/:topicId/content', () => {
    it('should return content items for a valid topic ID', async () => {
      const topicId = 1; // Assuming topic with ID 1 exists
      const response = await request(app).get(`/api/content/topics/${topicId}/content`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      response.body.forEach((item: any) => {
        expect(item.topicId).toBe(topicId);
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('type');
        // Title is inside the questionData JSON string
        const questionData = JSON.parse(item.questionData);
        expect(questionData).toHaveProperty('title');
      });
    });

    it('should return a 404 if the topic ID does not exist', async () => {
      const topicId = 999; // Assuming topic with ID 999 does not exist
      const response = await request(app).get(`/api/content/topics/${topicId}/content`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Topic not found.');
    });

    it('should return an empty array if the topic exists but has no content', async () => {
      // Add a topic without content
      await knex('topics').insert({ id: 3, name: 'Empty Topic', description: 'This topic has no content', category: 'Test' });
      const topicId = 3;
      const response = await request(app).get(`/api/content/topics/${topicId}/content`);
      expect(response.status).toBe(200); 
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
      // Clean up the added topic - this will be handled by afterAll drop tables
    });
  });

  describe('GET /api/content/sample-quiz', () => {
    it('should return the sample quiz JSON', async () => {
      const response = await request(app).get('/api/content/sample-quiz');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('question');
    });
  });
});
