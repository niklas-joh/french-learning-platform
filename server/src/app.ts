import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports (create these files)
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import contentRoutes from './routes/content.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`🔍 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, () => {
  // Only log when not in test environment
  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server running on port ${PORT}`);
  }
});

export { app, server };
