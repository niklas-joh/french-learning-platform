import { Router } from 'express';
import * as speechController from '../controllers/speechController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All speech routes should be protected
router.use(protect);

router.post('/analyze', speechController.analyzeSpeech);

export default router;
