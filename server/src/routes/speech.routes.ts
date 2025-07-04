import { Router } from 'express';
import * as speechController from '../controllers/speechController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All speech routes should be protected
router.use(protect);

router.post('/analyze', speechController.analyzeSpeech);

export default router;
