import request from 'supertest';
import express from 'express';
import authRoutes from '../auth.routes';
import knex from '../../config/db';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Endpoints', () => {
  beforeAll(async () => {
    const schemaPath = path.resolve(__dirname, '../../../../database/schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf-8');
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
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      // Clear the users table before each test
      await knex('users').delete();
    });

    it('should register a new user successfully', async () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.firstName).toBe(newUser.firstName);
      expect(response.body.user.lastName).toBe(newUser.lastName);
      expect(response.body.user.email).toBe(newUser.email);

      // Verify the user is in the database
      const userInDb = await knex('users').where({ email: newUser.email }).first();
      expect(userInDb).toBeDefined();
      expect(userInDb.firstName).toBe(newUser.firstName);
    });

    it('should not register a user with an existing email', async () => {
      const existingUser = {
        firstName: 'Existing',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'password123',
      };
      // First, create the user
      await request(app).post('/api/auth/register').send(existingUser);

      // Then, attempt to register again with the same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should not register a user with invalid data', async () => {
      const invalidUser = {
        // Missing email and password
        name: 'Invalid User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(500); // Expecting a 500 error because of how the controller is written
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Clear the users table before each test
      await knex('users').delete();
    });

    it('should log in an existing user successfully', async () => {
      const user = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      // First, register the user
      await request(app).post('/api/auth/register').send(user);

      // Then, log in
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(user.email);
    });

    it('should not log in with incorrect credentials', async () => {
      const user = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      };
      // First, register the user
      await request(app).post('/api/auth/register').send(user);

      // Then, attempt to log in with the wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not log in a non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
