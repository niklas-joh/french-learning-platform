import request from 'supertest';
import { app, server } from '../../app'; // Adjust path as necessary
import knex from '../../config/db'; // Adjust path as necessary
import fs from 'fs/promises';
import path from 'path';

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

    // Seed data
    await knex('topics').insert([
      { id: 1, name: 'Test Topic 1', description: 'Description for topic 1', category: 'Test' },
      { id: 2, name: 'Test Topic 2', description: 'Description for topic 2', category: 'Test' },
    ]);
    
    // The schema now defines 'content' table with 'question_data', 'correct_answer', 'options'
    // Let's adjust the seed data to match the actual schema.sql
    await knex('content').insert([
      { 
        id: 1, 
        topic_id: 1, 
        type: 'lesson', 
        question_data: JSON.stringify({ title: 'Lesson 1.1', text: 'Content for lesson 1.1' }),
        correct_answer: JSON.stringify({}),
        options: JSON.stringify({})
      },
      { 
        id: 2, 
        topic_id: 1, 
        type: 'quiz', 
        question_data: JSON.stringify({ title: 'Quiz 1.1', questions: [] }),
        correct_answer: JSON.stringify({}),
        options: JSON.stringify({})
      },
      { 
        id: 3, 
        topic_id: 2, 
        type: 'lesson', 
        question_data: JSON.stringify({ title: 'Lesson 2.1', text: 'Content for lesson 2.1' }),
        correct_answer: JSON.stringify({}),
        options: JSON.stringify({})
      },
    ]);
  });

  afterAll((done) => {
    // Close the server and database connection
    server.close(() => {
      knex.destroy().then(done);
    });
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
        expect(item.topic_id).toBe(topicId);
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('type');
        // Title is inside the question_data JSON string
        const questionData = JSON.parse(item.question_data);
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
});
