/**
 * Administrative routes for managing content and users.
 */
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
    createContentType,
    updateContentType,
    deleteContentType,
    getContentItemById,
    updateContentItemById,
    deleteContentItemById,
    getAllUsers
} from '../controllers/admin.controller';
const router = express.Router();

// Test route for admin access
router.get('/test', protect, isAdmin, adminTestController);

// TODO: add finer-grained role checks for specific admin actions

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
router.post('/content-types', protect, isAdmin, createContentType);
router.put('/content-types/:id', protect, isAdmin, updateContentType);
router.delete('/content-types/:id', protect, isAdmin, deleteContentType);

// Content management routes
router.get('/content', protect, isAdmin, getAllContentItems);
router.post('/content', protect, isAdmin, createContentItem);
router.get('/content/:id', protect, isAdmin, getContentItemById);
router.put('/content/:id', protect, isAdmin, updateContentItemById);
router.delete('/content/:id', protect, isAdmin, deleteContentItemById);

// User management
router.get('/users', protect, isAdmin, getAllUsers);

export default router;
