import request from 'supertest';
import express from 'express';
import userRoutes from '../user.routes';
import knex from '../../config/db'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

// Mock the auth middleware to bypass actual JWT validation for some tests
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User API Endpoints', () => {
  let testUserToken: string;
  let testUserId: number;

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
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [user] = await knex('users').insert({
      email: 'testuser@example.com',
      passwordHash: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
    }).returning(['id']);
    
    if (typeof user === 'object') {
      testUserId = user.id;
    } else {
      testUserId = user;
    }

    // Generate a simple token for testing
    testUserToken = jwt.sign({ userId: testUserId, role: 'user' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('GET /api/users/me', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/users/me');
      // Check if the actual authMiddleware would deny access
      // This depends on how the real middleware behaves when req.user is not set
      // For now, we assume if req.user is not set by the mock, the route protection works
      // A more accurate test would involve not mocking the middleware for this specific case
      // or ensuring the mock simulates the "no req.user" scenario leading to 401.
      // The current mock will let it pass to the controller if no token,
      // so the controller's check for req.user is important.
      // Let's assume the controller handles it.
      // If controller expects req.user to always be there due to real middleware, this test needs adjustment.
      // Given the prompt, the middleware *should* protect.
      // To properly test the middleware's protection, we might need to unmock it for a test.
      // However, for simplicity with the current mock:
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });

    it('should return user profile if token is valid', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
      expect(response.body).toHaveProperty('firstName', 'Test');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .send({ firstName: 'Updated' });
      expect(res.status).toBe(401);
    });

    it('should update user profile if token is valid and data is valid', async () => {
      const updatedData = {
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        email: 'updateduser@example.com',
        preferences: { theme: 'dark' }, // Send as an object, not a string
      };
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body.firstName).toBe(updatedData.firstName);
      expect(response.body.lastName).toBe(updatedData.lastName);
      expect(response.body.email).toBe(updatedData.email);
      expect(response.body.preferences).toEqual(updatedData.preferences);

      // Verify in DB
      const dbUser = await knex('users').where({ id: testUserId }).first();
      expect(dbUser.firstName).toBe(updatedData.firstName);
      expect(dbUser.email).toBe(updatedData.email);
      expect(JSON.parse(dbUser.preferences)).toEqual(updatedData.preferences);
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ email: 'invalidemail' });
      expect(response.status).toBe(400);
    });

    it('should return 400 if no valid fields are provided for update', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ email: "" }); // Sending an empty email is not a valid update field
      expect(response.status).toBe(400);
    });


    it('should not update password via this route', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ password: 'newpassword123' });
      expect(response.status).toBe(400);
    });
  });
});
