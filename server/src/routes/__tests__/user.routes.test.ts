import request from 'supertest';
import { app, server } from '../../app'; // Adjust path as necessary
import knex from '../../config/db'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

// Mock the auth middleware to bypass actual JWT validation for some tests
// or to provide a controlled authenticated user
jest.mock('../../middleware/auth.middleware', () => ({
  protect: jest.fn((req, res, next) => { // Changed authMiddleware to protect
    // If a mock user is attached to the request, use it
    if (req.mockUser) {
      req.user = req.mockUser;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer testtoken_')) {
      // Simulate token validation for specific test tokens
      const token = req.headers.authorization.split(' ')[1];
      const userId = parseInt(token.split('_')[1]); // e.g., testtoken_1
      req.user = { id: userId, email: `user${userId}@example.com` };
    }
    // For tests that should fail auth, this mock won't set req.user if no valid mock token/user
    next();
  }),
}));


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
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [user] = await knex('users').insert({
      email: 'testuser@example.com',
      password_hash: hashedPassword,
      first_name: 'Test',
      last_name: 'User',
    }).returning(['id']);
    
    if (typeof user === 'object') {
      testUserId = user.id;
    } else {
      testUserId = user;
    }

    // Generate a simple token for testing
    testUserToken = `testtoken_${testUserId}`;
  });

  afterAll((done) => {
    // Close the server and database connection
    server.close(() => {
      knex.destroy().then(done);
    });
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
      // We expect the controller to fail if req.user is undefined.
      // This test might need to be adapted based on actual auth.middleware.ts behavior when not mocked.
      // For now, let's assume the controller sends 401 if req.user is missing.
      // This test is more about the *route's behavior* including its guards.
      // The mock above will not set req.user if no valid token.
      const res = await request(app)
        .get('/api/users/me')
        // No Authorization header
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'User not authenticated');


    });

    it('should return user profile if token is valid', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
      expect(response.body).toHaveProperty('first_name', 'Test');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should return 401 if no token is provided', async () => {
       const res = await request(app)
        .put('/api/users/me')
        .send({ first_name: 'Updated' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'User not authenticated');
    });

    it('should update user profile if token is valid and data is valid', async () => {
      const updatedData = {
        first_name: 'UpdatedFirstName',
        last_name: 'UpdatedLastName',
        email: 'updateduser@example.com',
        preferences: { theme: 'dark' }, // Send as an object, not a string
      };
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body.first_name).toBe(updatedData.first_name);
      expect(response.body.last_name).toBe(updatedData.last_name);
      expect(response.body.email).toBe(updatedData.email);
      // The response will be a JSON string, so parse it before comparing
      expect(JSON.parse(response.body.preferences)).toEqual(updatedData.preferences);

      // Verify in DB
      const dbUser = await knex('users').where({ id: testUserId }).first();
      expect(dbUser.first_name).toBe(updatedData.first_name);
      expect(dbUser.email).toBe(updatedData.email);
      // Also parse the value from the DB before comparing
      expect(JSON.parse(dbUser.preferences)).toEqual(updatedData.preferences);
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ email: 'invalidemail' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid email format.');
    });

    it('should return 400 if no valid fields are provided for update', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ email: "" }); // Sending an empty email is not a valid update field
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'No update fields provided');
    });


    it('should not update password via this route', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ password: 'newpassword123' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Password cannot be updated through this route.');
    });
  });
});
