import request from 'supertest';
import express from 'express';
import adminRoutes from '../admin.routes';
import authRoutes from '../auth.routes';
import knex from '../../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Setup express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

let adminToken: string;
let userToken: string;
let adminUserId: number;
let regularUserId: number;

const setupDatabase = async () => {
  const fs = require('fs').promises;
  const path = require('path');
  const schemaPath = path.resolve(__dirname, '../../../../database/schema.sql');
  const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
  const statements = schemaSQL.split(/;\s*$/m).filter((s: string) => s.trim().length > 0);
  for (const statement of statements) {
    await knex.raw(statement);
  }

  // Clean up before seeding
  await knex('users').delete();
  await knex('topics').delete();
  await knex('content').delete();

  const hashedPassword = await bcrypt.hash('password123', 10);
  const [admin] = await knex('users').insert({
    email: 'admin@test.com',
    passwordHash: hashedPassword,
    role: 'admin'
  }).returning('id');
  adminUserId = admin.id;

  const [user] = await knex('users').insert({
    email: 'user@test.com',
    passwordHash: hashedPassword,
    role: 'user'
  }).returning('id');
  regularUserId = user.id;

  adminToken = jwt.sign({ userId: adminUserId, role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  userToken = jwt.sign({ userId: regularUserId, role: 'user' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
};

beforeAll(async () => {
  await setupDatabase();
});

afterAll(async () => {
  await knex.destroy();
});

describe('Admin Routes', () => {
  describe('Authorization', () => {
    it('should deny access to /api/admin/test without a token', async () => {
      const res = await request(app).get('/api/admin/test');
      expect(res.status).toBe(401);
    });

    it('should deny access to /api/admin/test for non-admin users', async () => {
      const res = await request(app)
        .get('/api/admin/test')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('should allow access to /api/admin/test for admin users', async () => {
      const res = await request(app)
        .get('/api/admin/test')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Admin route test successful!');
    });
  });

  describe('Topic Management (/api/admin/topics)', () => {
    let topicId: number;

    it('POST / - should create a new topic', async () => {
      const res = await request(app)
        .post('/api/admin/topics')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Test Topic', description: 'Description for test topic' });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('New Test Topic');
      topicId = res.body.id;
    });

    it('GET / - should get all topics', async () => {
      const res = await request(app)
        .get('/api/admin/topics')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /:id - should get a single topic', async () => {
      const res = await request(app)
        .get(`/api/admin/topics/${topicId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(topicId);
    });

    it('PUT /:id - should update a topic', async () => {
      const res = await request(app)
        .put(`/api/admin/topics/${topicId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Test Topic' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Test Topic');
    });

    it('DELETE /:id - should delete a topic', async () => {
      const res = await request(app)
        .delete(`/api/admin/topics/${topicId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(204);
    });
  });

  describe('Content Management (/api/admin/content)', () => {
    let contentId: number;
    let topicId: number;

    beforeAll(async () => {
        // Create a topic to associate content with
        const topicRes = await request(app)
            .post('/api/admin/topics')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Content Topic', description: 'Topic for content tests' });
        topicId = topicRes.body.id;
    });

    it('POST / - should create new content', async () => {
      const res = await request(app)
        .post('/api/admin/content')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'test_content',
          topicId: topicId,
          type: 'multiple-choice',
          questionData: { question: 'What is 2+2?' },
          correctAnswer: { answer: '4' },
          options: { choices: ['3', '4', '5'] }
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.type).toBe('multiple-choice');
      contentId = res.body.id;
    });

    it('GET / - should get all content', async () => {
        const res = await request(app)
          .get('/api/admin/content')
          .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /:id - should get single content', async () => {
        const res = await request(app)
          .get(`/api/admin/content/${contentId}`)
          .set('Authorization', `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(contentId);
    });

    it('PUT /:id - should update content', async () => {
        const res = await request(app)
          .put(`/api/admin/content/${contentId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ difficultyLevel: 'easy' });
  
        expect(res.status).toBe(200);
        expect(res.body.difficultyLevel).toBe('easy');
    });

    it('DELETE /:id - should delete content', async () => {
        const res = await request(app)
          .delete(`/api/admin/content/${contentId}`)
          .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.status).toBe(204);
    });
  });
});
