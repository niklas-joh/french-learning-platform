import { Router } from 'express';
import * as progressController from '../controllers/progressController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All progress routes should be protected
router.use(protect);

router.get('/progress', progressController.getUserProgress);
router.get('/streak', progressController.getUserStreak);
router.post('/activity-completed', progressController.recordActivityCompleted);

export default router;
