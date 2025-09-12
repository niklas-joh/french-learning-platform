/**
 * Express application bootstrap.
 *
 * This file wires together all middleware and routes used by the API.
 * It is imported in tests to start an in-memory server.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import learningRoutes from './routes/learning.routes.js';
import metaRoutes from './routes/meta.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { createAssessmentRoutes } from './routes/assessmentRoutes.js';
import { aiServiceFactory } from './services/ai/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5175' }));
app.use(morgan('combined'));
app.use(express.json());

// Debug middleware to log all incoming requests. Useful during development
// to trace API usage. Consider removing or making conditional in production.
// TODO: respect an environment variable to toggle request logging.
app.use((req, res, next) => {
  console.log(`🔍 Incoming request: ${req.method} ${req.url}`);
  next();
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes); // Note: This now contains more than just profile data
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/learning', learningRoutes);
app.use('/api/v1/meta', metaRoutes);
app.use('/api/v1/ai', aiRoutes); // AI routes (moved to v1 for consistency)

// AI Assessment Routes
const assessmentController = aiServiceFactory.getAssessmentController();
const assessmentRouter = createAssessmentRoutes(assessmentController);
app.use('/api/v1/assessment', assessmentRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the HTTP server. When running in tests the listener is closed after
// each suite to avoid port collisions.
const server = app.listen(PORT, () => {
  // Only log when not in test environment
  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Server listening and ready for connections`);
  }
});

// Add error handling to prevent uncaught exceptions from crashing the server
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Keep the process alive by ensuring the server stays active
setInterval(() => {
  // This interval ensures the event loop stays active
  // It's a lightweight way to prevent the process from exiting
}, 30000); // Check every 30 seconds

// Debug: Log that server setup is complete
console.log(`🔧 Server setup complete, event loop should stay active`);

// Exporting the app and server allows the test suite to import and
// gracefully shut down the server after running.
export { app, server };
