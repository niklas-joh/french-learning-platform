import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import adminRoutes from '../admin.routes'; // The router we are testing
import { adminTestController, getAnalyticsSummary } from '../../controllers/admin.controller'; // To potentially mock parts of controllers if needed

// Mock the actual controllers to prevent unintended side effects (like DB calls) during route tests
// We are testing routing and middleware integration here, not controller logic itself (that's for controller unit tests)
jest.mock('../../controllers/admin.controller', () => ({
  adminTestController: jest.fn((req: Request, res: Response) => res.status(200).json({ message: 'Mocked Admin Test OK' })),
  getAnalyticsSummary: jest.fn((req: Request, res: Response) => res.status(200).json({ summary: 'Mocked Analytics OK' })),
}));

// Mock middleware
// Mock protect from auth.middleware.ts
let mockUser: { userId: number; role?: string } | null = null;
jest.mock('../../middleware/auth.middleware', () => ({
  protect: (req: Request, res: Response, next: NextFunction) => {
    if (mockUser) {
      (req as any).user = mockUser;
      next();
    } else {
      // Simulate scenario where protect would deny access
      res.status(401).json({ message: 'Unauthorized by mock protect' });
    }
  },
}));

// isAdmin is already unit-tested. For integration, we rely on the actual isAdmin.
// If we wanted to mock isAdmin as well:
// jest.mock('../../middleware/admin.middleware', () => ({
//   isAdmin: (req: Request, res: Response, next: NextFunction) => {
//     // Mock logic for isAdmin if needed, e.g., always allow or check a specific flag
//     next(); 
//   }
// }));


const app: Express = express();
app.use(express.json());
app.use('/api/admin', adminRoutes); // Mount the admin routes under /api/admin

describe('Admin Routes Integration Tests', () => {
  afterEach(() => {
    mockUser = null; // Reset mock user state
    // Clear mocks for controllers
    (adminTestController as jest.Mock).mockClear();
    (getAnalyticsSummary as jest.Mock).mockClear();
  });

  describe('GET /api/admin/test', () => {
    test('should allow access for admin user and call adminTestController', async () => {
      mockUser = { userId: 1, role: 'admin' };
      const response = await request(app).get('/api/admin/test');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Mocked Admin Test OK' }); // From mocked controller
      expect(adminTestController).toHaveBeenCalledTimes(1);
    });

    test('should deny access for non-admin user', async () => {
      mockUser = { userId: 2, role: 'user' };
      const response = await request(app).get('/api/admin/test');
      expect(response.status).toBe(403); // isAdmin middleware should return 403
      expect(response.body).toEqual({ message: 'Forbidden: Admin access required.' });
      expect(adminTestController).not.toHaveBeenCalled();
    });

    test('should deny access if user role is undefined', async () => {
      mockUser = { userId: 3 }; // Role undefined
      const response = await request(app).get('/api/admin/test');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'Forbidden: Admin access required.' });
      expect(adminTestController).not.toHaveBeenCalled();
    });
    
    test('should deny access if not authenticated (mock protect denies)', async () => {
      mockUser = null; // Simulate protect middleware denying access
      const response = await request(app).get('/api/admin/test');
      expect(response.status).toBe(401); // From our mock protect
      expect(response.body).toEqual({ message: 'Unauthorized by mock protect' });
      expect(adminTestController).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/admin/analytics', () => {
    test('should allow access for admin user and call getAnalyticsSummary', async () => {
      mockUser = { userId: 1, role: 'admin' };
      const response = await request(app).get('/api/admin/analytics');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ summary: 'Mocked Analytics OK' }); // From mocked controller
      expect(getAnalyticsSummary).toHaveBeenCalledTimes(1);
    });

    test('should deny access for non-admin user', async () => {
      mockUser = { userId: 2, role: 'user' };
      const response = await request(app).get('/api/admin/analytics');
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'Forbidden: Admin access required.' });
      expect(getAnalyticsSummary).not.toHaveBeenCalled();
    });

    test('should deny access if not authenticated (mock protect denies)', async () => {
      mockUser = null;
      const response = await request(app).get('/api/admin/analytics');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Unauthorized by mock protect' });
      expect(getAnalyticsSummary).not.toHaveBeenCalled();
    });
  });
});
