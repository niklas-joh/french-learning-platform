import { Router } from 'express';
import * as aiController from '../controllers/aiController';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All AI routes should be protected
router.use(protect);

router.post('/chat', aiController.chatWithAI);
router.get('/conversation-prompts', aiController.getPrompts);

export default router;
