import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';
import { getAnalyticsSummary } from '../controllers/admin.controller';

const router = express.Router();

// Example admin-only route
router.get('/test', protect, isAdmin, (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the admin area!' });
});

// Analytics routes
router.get('/analytics/summary', protect, isAdmin, getAnalyticsSummary);

// Add other admin-specific routes here in the future

export default router;
