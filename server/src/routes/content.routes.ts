import { Router } from 'express';
import { getAllTopics, getContentForTopic } from '../controllers/content.controller';
// import { protect } from '../middleware/auth.middleware'; // Uncomment if auth is needed

const router = Router();

// @route   GET /api/topics
// @desc    Get all topics
// @access  Public (for now)
router.get('/topics', getAllTopics);

// @route   GET /api/topics/:topicId/content
// @desc    Get all content for a specific topic
// @access  Public (for now)
router.get('/topics/:topicId/content', getContentForTopic);

// TODO: Define other content/topic routes if needed (e.g., get single topic/content by ID)

export default router;
