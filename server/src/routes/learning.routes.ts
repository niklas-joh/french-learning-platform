/**
 * Routes for learning content, AI interactions, and speech analysis.
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';

// Import controllers
import learningPathController from '../controllers/learningPathController';
import { chatWithAI, getPrompts } from '../controllers/aiController';
import { analyzeSpeech } from '../controllers/speechController';

const router = Router();

// === Learning Path & Lessons ===
// TODO: Implement GET /learning-paths to get all available paths
// router.get('/learning-paths', protect, learningPathController.getLearningPaths);

router.get('/learning-paths/:pathId/user-view', protect, learningPathController.getLearningPathForUser);

// TODO: Implement GET /lessons/:id to get specific lesson details
// router.get('/lessons/:id', protect, learningPathController.getLesson);


// === AI Interaction ===
router.post('/ai/chat', protect, chatWithAI);
router.get('/ai/conversation-prompts', protect, getPrompts);
// TODO: Implement POST /ai/feedback


// === Speech Analysis ===
router.post('/speech/analyze', protect, analyzeSpeech);
// TODO: Implement POST /speech/feedback
// TODO: Implement GET /speech/examples/:phrase


export default router;
