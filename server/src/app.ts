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

// Route imports (create these files)
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import contentRoutes from './routes/content.routes';
import adminRoutes from './routes/admin.routes'; // Added admin routes
import learningPathRoutes from './routes/learningPathRoutes'; // Added learning path routes

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes); // Added admin routes
app.use('/api/learning-paths', learningPathRoutes); // Added learning path routes

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
  }
});

// Exporting the app and server allows the test suite to import and
// gracefully shut down the server after running.
export { app, server };
