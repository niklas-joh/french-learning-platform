import { Router } from 'express';
import * as gamificationController from '../controllers/gamificationController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All gamification routes should be protected
router.use(protect);

router.get('/achievements', gamificationController.getAllAchievements);
router.get('/user/achievements', gamificationController.getUserAchievements);

export default router;
