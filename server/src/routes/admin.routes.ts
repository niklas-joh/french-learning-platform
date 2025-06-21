import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';
import {
    adminTestController,
    getAnalyticsSummary,
    getAllTopics,
    createTopic,
    getTopicById,
    updateTopicById,
    deleteTopicById,
    createContentItem,
    getAllContentItems,
    getAllContentTypes,
    getContentItemById,
    updateContentItemById,
    deleteContentItemById
} from '../controllers/admin.controller';
import {
    assignContentToUser,
    getAssignmentsForUser,
    unassignContentFromUser
} from '../controllers/assignment.controller';

const router = express.Router();

// Test route for admin access
router.get('/test', protect, isAdmin, adminTestController);

// Analytics summary route
router.get('/analytics/summary', protect, isAdmin, getAnalyticsSummary);

// Topic management routes
router.get('/topics', protect, isAdmin, getAllTopics);
router.post('/topics', protect, isAdmin, createTopic);
router.get('/topics/:id', protect, isAdmin, getTopicById);
router.put('/topics/:id', protect, isAdmin, updateTopicById);
router.delete('/topics/:id', protect, isAdmin, deleteTopicById);

// Content Types
router.get('/content-types', protect, isAdmin, getAllContentTypes);

// Content management routes
router.get('/content', protect, isAdmin, getAllContentItems);
router.post('/content', protect, isAdmin, createContentItem);
router.get('/content/:id', protect, isAdmin, getContentItemById);
router.put('/content/:id', protect, isAdmin, updateContentItemById);
router.delete('/content/:id', protect, isAdmin, deleteContentItemById);

// User-Content Assignment Routes
router.post('/assignments', protect, isAdmin, assignContentToUser);
router.get('/assignments/user/:userId', protect, isAdmin, getAssignmentsForUser);
router.delete('/assignments/:assignmentId', protect, isAdmin, unassignContentFromUser);

export default router;
