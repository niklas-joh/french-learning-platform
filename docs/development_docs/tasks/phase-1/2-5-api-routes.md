# Task 2.5: Update API Routes

Create the following file with the specified content:

**File**: `server/src/routes/progress.ts`
```typescript
import express from 'express';
import { progressController } from '../controllers/progressController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User progress routes
router.get('/user/progress', progressController.getUserProgress);
router.put('/user/progress', progressController.updateProgress);
router.get('/user/streak', progressController.getStreakInfo);

export default router;
```

Update the existing `server/src/app.ts` to include the new routes:
```typescript
// Add to existing imports
import progressRoutes from './routes/progress';

// Add to existing route setup
app.use('/api', progressRoutes);
