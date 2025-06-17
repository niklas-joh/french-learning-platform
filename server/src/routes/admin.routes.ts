// server/src/routes/admin.routes.ts
import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';
import { adminTestController, getAnalyticsSummary } from '../controllers/admin.controller';

const router = express.Router();

// Test route for admin access
router.get('/test', protect, isAdmin, adminTestController);

// Analytics summary route (already existed in controller, now formally routed)
router.get('/analytics', protect, isAdmin, getAnalyticsSummary);

export default router;
