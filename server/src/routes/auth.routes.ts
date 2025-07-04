/**
 * Authentication related API routes.
 */
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// TODO: implement password reset endpoints

export default router;
