# Detailed Implementation Plan for AI Coding Agent

## Quick Start Instructions for AI Agent

**IMPORTANT**: This is a major architectural transformation. Follow the phases sequentially to avoid breaking the existing system.

### Current System Overview
- **Framework**: React + TypeScript + Material-UI
- **Backend**: Node.js + Express + SQLite
- **Current Structure**: Single dashboard with quiz-focused components
- **Target**: Mobile-first language learning platform with 5 distinct screens

### Pre-Implementation Checklist
1. [x] Backup current database
2. [x] Create feature branch: `git checkout -b language-learning-redesign`
3. [x] Install new dependencies (list provided in each phase)
4. [x] Review current component structure in `/client/src/components/`

---
**IMPORTANT NOTE: This document serves as a living implementation plan. It MUST be updated after each significant code change and commit to accurately reflect the project's progress. Ensure all relevant checklist items are marked appropriately.**
---

## PHASE 1 COMPLETION CHECKLIST

Before proceeding to Phase 2, ensure all Phase 1 tasks are completed:

- [x] Design system CSS variables created
- [ ] Bottom tab navigation component working
- [ ] All 5 base page components created with placeholder content
- [ ] Main layout with mobile-first design implemented
- [ ] Routing updated to support new page structure
- [ ] Database schema updated with new tables
- [ ] User progress API endpoints created and tested
- [ ] Progress service with XP and streak calculation working
- [ ] Navigation between all 5 screens functional

**Testing Phase 1:**
1. Navigate between all 5 screens using bottom tab
2. Verify glassmorphism effects and modern styling
3. Test API endpoints with Postman or similar tool
4. Verify database tables created successfully
5. Check mobile responsiveness

**Phase 1 Success Criteria:**
- User can navigate between 5 distinct screens
- Modern design system is applied consistently
- Basic user progress tracking is functional
- No breaking changes to existing authentication

---

## PHASE 1: FOUNDATION (WEEKS 1-2)

### Week 1: Navigation and Design System

#### Task 1.1: Install Dependencies
```bash
npm install @mui/icons-material framer-motion react-router-dom@latest
npm install --save-dev @types/web-speech-api
```

#### Task 1.2: Create Design System
**File**: `client/src/styles/design-tokens.css`
```css
:root {
  /* French-themed color palette */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --french-blue: #667eea;
  --french-purple: #764ba2;
  --french-accent: #ff6b6b;
  
  /* Glassmorphism effects */
  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(255, 255, 255, 0.2);
  --backdrop-blur: blur(20px);
  
  /* Rounded design */
  --border-radius-small: 12px;
  --border-radius-medium: 20px;
  --border-radius-large: 30px;
  
  /* Modern shadows */
  --shadow-light: 0 8px 25px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 15px 40px rgba(0, 0, 0, 0.15);
  --shadow-heavy: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  /* Animation timings */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
}

/* Global glassmorphism utilities */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-light);
  transition: all var(--transition-normal);
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

/* Mobile-first responsive breakpoints */
@media (min-width: 768px) {
  .glass-card {
    border-radius: var(--border-radius-large);
  }
}
```

#### Task 1.3: Create Bottom Tab Navigation
**File**: `client/src/components/navigation/BottomTabNavigation.tsx`
```typescript
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  FitnessCenter as PracticeIcon,
  Timeline as ProgressIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const navigationItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Lessons', icon: <SchoolIcon />, path: '/lessons' },
  { label: 'Practice', icon: <PracticeIcon />, path: '/practice' },
  { label: 'Progress', icon: <ProgressIcon />, path: '/progress' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' }
];

const BottomTabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
  
  const handleNavigation = (index: number) => {
    navigate(navigationItems[index].path);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderRadius: '20px 20px 0 0',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)'
      }} 
      elevation={0}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={(event, newValue) => handleNavigation(newValue)}
        sx={{
          background: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: '#8e8e93',
            '&.Mui-selected': {
              color: 'var(--french-blue)',
            }
          }
        }}
      >
        {navigationItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 500
              }
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomTabNavigation;
```

#### Task 1.4: Create Main Layout Component
**File**: `client/src/components/layout/MainLayout.tsx`
```typescript
import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import BottomTabNavigation from '../navigation/BottomTabNavigation';

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'var(--gradient-primary)',
        paddingBottom: '80px', // Space for bottom navigation
        position: 'relative'
      }}
    >
      <Box
        sx={{
          maxWidth: '430px', // Mobile-first max width
          margin: '0 auto',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Outlet />
        <BottomTabNavigation />
      </Box>
    </Box>
  );
};

export default MainLayout;
```

#### Task 1.5: Create Base Page Components
**File**: `client/src/pages/HomePage.tsx`
```typescript
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import '../styles/design-tokens.css';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* Header */}
      <Box
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 3,
          mb: 3,
          borderRadius: 'var(--border-radius-large)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bonjour! 🇫🇷
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Ready for your French lesson today?
        </Typography>
        
        {/* Progress Ring Placeholder */}
        <Box
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700
          }}
        >
          75%
        </Box>
      </Box>

      {/* Quick Actions Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          mb: 3
        }}
      >
        <Card className="glass-card">
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Quick Lesson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              5 min practice
            </Typography>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>🎤</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Speaking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pronunciation
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* AI Tutor Card Placeholder */}
      <Card
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 2
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontSize: '20px'
              }}
            >
              🤖
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Claude, your AI tutor
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Online and ready to help
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">
            Salut! Ready to practice some French conversation today?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomePage;
```

**Files**: Create similar base components for:
- `client/src/pages/LessonsPage.tsx`
- `client/src/pages/PracticePage.tsx`
- `client/src/pages/ProgressPage.tsx`
- `client/src/pages/ProfilePage.tsx`

*Each should follow the same pattern with placeholder content and proper styling.*

#### Task 1.6: Update Routing
**File**: `client/src/App.tsx` (Update existing)
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage'; // Keep existing
import RegisterPage from './pages/RegisterPage'; // Keep existing
import ProtectedRoute from './components/ProtectedRoute'; // Keep existing
import './styles/design-tokens.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected main application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
          
          {/* Redirect old dashboard route */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

### Week 2: Database Schema and API Foundation

#### Task 2.1: Database Schema Updates
**Details**: The database schema is managed by Knex.js migration files located in `database/migrations/`. These migrations define the creation and alteration of tables. Key tables for this phase include `user_progress`, `learning_paths`, `learning_units`, `lessons`, `achievements`, and `user_achievements`. Refer to the migration files (e.g., `20250625000000_create_core_learning_tables.ts`) for the precise SQL definitions. The illustrative SQL below shows the general structure of these tables.
```sql
-- Illustrative SQL for new tables (actual definitions are in Knex migrations):

-- User progress and gamification

-- User progress and gamification
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    current_level TEXT NOT NULL DEFAULT 'A1',
    current_xp INTEGER NOT NULL DEFAULT 0,
    total_xp INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    words_learned INTEGER NOT NULL DEFAULT 0,
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    accuracy_rate REAL NOT NULL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Learning paths and structure
CREATE TABLE learning_paths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL DEFAULT 'french',
    name TEXT NOT NULL,
    description TEXT,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    estimated_duration INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_path_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id)
);

CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_unit_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    estimated_time INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    content_data TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_unit_id) REFERENCES learning_units(id)
);

-- Achievements system
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    criteria_data TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'common',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);

-- Insert initial learning path data
INSERT INTO learning_paths (language, name, description, total_lessons, estimated_duration) 
VALUES ('french', 'French for Beginners', 'Complete French course from A1 to B2 level', 50, 100);

-- Insert sample achievements
INSERT INTO achievements (id, name, description, icon, category, criteria_data, rarity) VALUES
('first_lesson', 'First Steps', 'Complete your first lesson', '🎯', 'lessons', '{"type": "lessons_completed", "value": 1}', 'common'),
('streak_7', 'Week Warrior', 'Maintain a 7-day learning streak', '🔥', 'streak', '{"type": "streak", "value": 7}', 'rare'),
('perfect_quiz', 'Perfectionist', 'Score 100% on any quiz', '⭐', 'accuracy', '{"type": "accuracy_threshold", "value": 100}', 'epic');
```

#### Task 2.2: Create Data Models
**File**: `server/src/models/UserProgress.ts`
```typescript
export interface UserProgress {
  id?: number;
  userId: number;
  currentLevel: CEFRLevel;
  currentXP: number;
  totalXP: number;
  streakDays: number;
  lastActivityDate?: Date;
  lessonsCompleted: number;
  wordsLearned: number;
  timeSpentMinutes: number;
  accuracyRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LevelThreshold {
  level: CEFRLevel;
  xpRequired: number;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 'A1', xpRequired: 0 },
  { level: 'A2', xpRequired: 1000 },
  { level: 'B1', xpRequired: 3000 },
  { level: 'B2', xpRequired: 6000 },
  { level: 'C1', xpRequired: 10000 },
  { level: 'C2', xpRequired: 15000 }
];
```

**File**: `server/src/models/LearningPath.ts`
```typescript
export interface LearningPath {
  id?: number;
  language: string;
  name: string;
  description?: string;
  totalLessons: number;
  estimatedDuration?: number;
  isActive: boolean;
  units?: LearningUnit[];
}

export interface LearningUnit {
  id?: number;
  learningPathId: number;
  title: string;
  description?: string;
  level: CEFRLevel;
  orderIndex: number;
  prerequisites?: string[];
  isActive: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id?: number;
  learningUnitId: number;
  title: string;
  description?: string;
  type: LessonType;
  estimatedTime: number;
  orderIndex: number;
  contentData?: any;
  isActive: boolean;
  status?: LessonStatus;
}

export type LessonType = 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'pronunciation';
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';
```

#### Task 2.3: Create API Controllers
**File**: `server/src/controllers/progressController.ts`
```typescript
import { Request, Response } from 'express';
import { progressService } from '../services/progressService';

export class ProgressController {
  async getUserProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const progress = await progressService.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  }

  async updateProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { activityType, performance, timeSpent } = req.body;
      const updatedProgress = await progressService.updateProgress(
        userId,
        activityType,
        performance,
        timeSpent
      );

      res.json(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  }

  async getStreakInfo(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const streakInfo = await progressService.getStreakInfo(userId);
      res.json(streakInfo);
    } catch (error) {
      console.error('Error fetching streak info:', error);
      res.status(500).json({ error: 'Failed to fetch streak info' });
    }
  }
}

export const progressController = new ProgressController();
```

#### Task 2.4: Create Progress Service
**File**: `server/src/services/progressService.ts`
```typescript
import { db } from '../database/database';
import { UserProgress, CEFRLevel, LEVEL_THRESHOLDS } from '../models/UserProgress';

export class ProgressService {
  async getUserProgress(userId: number): Promise<UserProgress> {
    const query = `
      SELECT * FROM user_progress WHERE user_id = ?
    `;
    
    let progress = db.prepare(query).get(userId) as UserProgress;
    
    // Initialize progress if doesn't exist
    if (!progress) {
      progress = await this.initializeUserProgress(userId);
    }
    
    return progress;
  }

  async initializeUserProgress(userId: number): Promise<UserProgress> {
    const insertQuery = `
      INSERT INTO user_progress (
        user_id, current_level, current_xp, total_xp, streak_days,
        lessons_completed, words_learned, time_spent_minutes, accuracy_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [userId, 'A1', 0, 0, 0, 0, 0, 0, 0.0];
    db.prepare(insertQuery).run(values);
    
    return this.getUserProgress(userId);
  }

  async updateProgress(
    userId: number,
    activityType: string,
    performance: number,
    timeSpent: number
  ): Promise<UserProgress> {
    const currentProgress = await this.getUserProgress(userId);
    
    // Calculate XP gained
    const xpGained = this.calculateXP(activityType, performance, timeSpent);
    const newTotalXP = currentProgress.totalXP + xpGained;
    const newCurrentXP = currentProgress.currentXP + xpGained;
    
    // Check for level progression
    const newLevel = this.calculateLevel(newTotalXP);
    
    // Update streak if activity is today
    const { streakDays, lastActivityDate } = this.updateStreak(
      currentProgress.streakDays,
      currentProgress.lastActivityDate
    );

    const updateQuery = `
      UPDATE user_progress SET
        current_level = ?,
        current_xp = ?,
        total_xp = ?,
        streak_days = ?,
        last_activity_date = ?,
        time_spent_minutes = time_spent_minutes + ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    
    db.prepare(updateQuery).run([
      newLevel,
      newCurrentXP,
      newTotalXP,
      streakDays,
      lastActivityDate,
      Math.floor(timeSpent / 60), // Convert seconds to minutes
      userId
    ]);
    
    return this.getUserProgress(userId);
  }

  private calculateXP(activityType: string, performance: number, timeSpent: number): number {
    const baseXP: Record<string, number> = {
      lesson: 50,
      practice: 25,
      quiz: 75,
      conversation: 100,
      pronunciation: 30
    };
    
    const base = baseXP[activityType] || 25;
    const performanceMultiplier = performance / 100;
    const timeBonus = Math.min(timeSpent / 300, 1.5); // Bonus for time spent, capped at 1.5x
    
    return Math.floor(base * performanceMultiplier * timeBonus);
  }

  private calculateLevel(totalXP: number): CEFRLevel {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i].xpRequired) {
        return LEVEL_THRESHOLDS[i].level;
      }
    }
    return 'A1';
  }

  private updateStreak(currentStreak: number, lastActivity?: Date): { streakDays: number; lastActivityDate: string } {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (!lastActivity) {
      return { streakDays: 1, lastActivityDate: today };
    }
    
    const lastActivityDate = new Date(lastActivity).toISOString().split('T')[0];
    
    if (lastActivityDate === today) {
      // Already practiced today, maintain streak
      return { streakDays: currentStreak, lastActivityDate: today };
    } else if (lastActivityDate === yesterday) {
      // Practiced yesterday, continue streak
      return { streakDays: currentStreak + 1, lastActivityDate: today };
    } else {
      // Streak broken, start new
      return { streakDays: 1, lastActivityDate: today };
    }
  }

  async getStreakInfo(userId: number) {
    const progress = await this.getUserProgress(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = progress.lastActivityDate 
      ? new Date(progress.lastActivityDate).toISOString().split('T')[0]
      : null;
    
    return {
      streakDays: progress.streakDays,
      practiceToday: lastActivity === today,
      lastActivityDate: progress.lastActivityDate
    };
  }
}

export const progressService = new ProgressService();
```

#### Task 2.5: Update API Routes
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

**File**: `server/src/app.ts` (Update to include new routes)
```typescript
// Add to existing imports
import progressRoutes from './routes/progress';

// Add to existing route setup
app.use('/api', progressRoutes);
```

---

## PHASE 2: CORE LEARNING FEATURES (WEEKS 3-6)

**Goal**: Implement the core learning experience, including visual learning paths, lesson progression, and basic gamification elements.

### Week 3-4: Learning Path System

#### [x] Prerequisite Task P0: Seed Initial Learning Units and Lessons
*   **Objective**: Populate the database with initial learning units and lessons for development and testing of the "French for Beginners" learning path.
*   **Key Actions**:
    1.  Create/Update a seed file (e.g., `database/seeds/06_learning_content.ts` or add to `001_language_learning_schema.sql` if appropriate for initial setup).
    2.  Insert sample data for `learning_units` linked to the existing "French for Beginners" path.
    3.  Insert sample data for `lessons` linked to these new units.
    ```sql
    -- Example SQL for seeding (actual implementation might use Knex in a .ts seed file):
    -- Assuming learning_paths ID 1 is 'French for Beginners'
    -- INSERT INTO learning_units (learning_path_id, title, description, level, order_index) VALUES
    -- (1, 'Unit 1: Greetings', 'Learn basic French greetings', 'A1', 1),
    -- (1, 'Unit 2: Introductions', 'Introduce yourself and others', 'A1', 2);

    -- Assuming Unit 1 ID is 1, Unit 2 ID is 2 after insertion (IDs will be auto-generated)
    -- INSERT INTO lessons (learning_unit_id, title, type, estimated_time, order_index, content_data) VALUES
    -- ( (SELECT id from learning_units WHERE title = 'Unit 1: Greetings'), 'Lesson 1.1: Common Greetings', 'vocabulary', 10, 1, '{"details": "Bonjour, Salut, Ça va?"}'),
    -- ( (SELECT id from learning_units WHERE title = 'Unit 1: Greetings'), 'Lesson 1.2: Saying Goodbye', 'vocabulary', 5, 2, '{"details": "Au revoir, À bientôt"}'),
    -- ( (SELECT id from learning_units WHERE title = 'Unit 2: Introductions'), 'Lesson 2.1: My Name Is...', 'conversation', 15, 1, '{"scenario": "Je m''appelle..."}');
    ```
*   **Impacted Files**: New/Updated seed file in `database/seeds/`.

#### [x] Prerequisite Task P1: Update Database Schema for Lesson Progress
*   **Objective**: Add the `user_lesson_progress` table to track individual user status on each lesson.
*   **Key Actions**:
    1.  Create migration: `server/database/migrations/YYYYMMDDHHMMSS_create_user_lesson_progress_table.ts` (using Knex schema builder).
    2.  Define `user_lesson_progress` table schema (columns: `id`, `user_id`, `lesson_id`, `status` (TEXT, default 'locked'), `score` (REAL), `time_spent` (INTEGER), `attempts` (INTEGER, default 0), `started_at` (DATETIME), `completed_at` (DATETIME), `created_at` (DATETIME, default CURRENT_TIMESTAMP), `updated_at` (DATETIME, default CURRENT_TIMESTAMP). Add Foreign Keys for `user_id` to `users(id)` and `lesson_id` to `lessons(id)`. Add `UNIQUE(user_id, lesson_id)` constraint).
    3.  Run migration.
*   **Impacted Files**: New Knex migration files in `database/migrations/`, `database/schema.sql` (generated dump, for reference), `docs/development_docs/database_schema.mermaid`.

#### [x] Prerequisite Task P2: Implement Backend APIs for Learning Paths and Lesson Progress (Refined)
*   **Objective**: Create backend services, controllers, and routes to serve a consolidated learning path structure including user-specific lesson statuses.
*   **Key Actions**:
    1.  Create/Update Models: `server/src/models/UserLessonProgress.ts` (interface for the table).
    2.  Create Service: `server/src/services/learningPathService.ts`.
        *   Method `getLearningPathUserView(pathId: number, userId: number): Promise<LearningPathWithUserProgress>`. This method fetches the path, its units, and lessons. For each lesson, it joins with `user_lesson_progress` to get the user's status or defaults it (e.g., to 'locked', then 'available' if first/prerequisites met).
    3.  Create Controller: `server/src/controllers/learningPathController.ts`.
        *   Handler for `GET /api/learning-paths/:pathId/user-view` (or similar) that calls `learningPathService.getLearningPathUserView`.
    4.  Create Routes: `server/src/routes/learningPathRoutes.ts`.
    5.  Update `server/src/app.ts` to use new routes.
*   **Impacted Files**: New model, service, controller, routes files in `server/src/`; update `server/src/app.ts`, `docs/development_docs/architecture_diagram.mermaid`.

#### [x] Task 2.1: Implement Visual Learning Path Component

*   **[x] Subtask 2.1.A: Define Client-Side Data Models**
    *   **Objective**: Create TypeScript interfaces for the consolidated learning path data.
    *   **Action**: Created `client/src/types/LearningPath.ts` with `ClientLearningPath`, `ClientLearningUnit`, and `ClientLesson` interfaces.
    *   **Impacted Files**: `client/src/types/LearningPath.ts`.

*   **[x] Subtask 2.1.B: Implement Client API Service**
    *   **Objective**: Create a service to fetch the consolidated learning path data.
    *   **Action**: Created `client/src/services/learningPathService.ts` with `fetchLearningPath` function. Added `TODO` for future API pagination.
    *   **Impacted Files**: `client/src/services/learningPathService.ts`.

*   **[x] Subtask 2.1.C: Create `LearningPath` State Management Hook**
    *   **Objective**: Manage data fetching and state for the learning path.
    *   **Action**: Created `client/src/hooks/useLearningPath.ts`. This hook manages `loading`, `error`, and `data` states. Added `TODO` for future migration to a server-state library.
    *   **Impacted Files**: `client/src/hooks/useLearningPath.ts`.

*   **[x] Subtask 2.1.D: Develop `LearningPath.tsx` Structure & Sub-Components**
    *   **Objective**: Create the main UI component and sub-components for units and lesson nodes.
    *   **Action**: Created `LessonNode.tsx` and `LearningUnit.tsx`. Both are memoized for performance.
    *   **Impacted Files**: `client/src/components/learning/LessonNode.tsx`, `client/src/components/learning/LearningUnit.tsx`.

*   **[x] Subtask 2.1.E: Implement Visual Connections and Styling**
    *   **Objective**: Visually connect lesson nodes and apply consistent styling.
    *   **Action**: Used a simple `border-left` approach in `LearningUnit.tsx` for a clean and maintainable visual path connector.
    *   **Impacted Files**: `client/src/components/learning/LearningUnit.tsx`.

*   **[x] Subtask 2.1.F: Integrate into `LessonsPage.tsx`**
    *   **Objective**: Display the learning path on the Lessons screen.
    *   **Action**: Created `client/src/pages/LessonsPage.tsx` and integrated the `LearningPath` component.
    *   **Impacted Files**: `client/src/pages/LessonsPage.tsx`.

*   **[x] Subtask 2.1.G: Implement Animations & Touch Interactions**
    *   **Objective**: Enhance UX with smooth animations and mobile-friendly interactions.
    *   **Action**: Used `framer-motion` for fade-in and hover/tap animations on the components.
    *   **Impacted Files**: `client/src/components/learning/LearningPath.tsx`, `client/src/components/learning/LessonNode.tsx`.

*   **[x] Subtask 2.1.H: Implement Progressive Disclosure & Basic Error/Loading States**
    *   **Objective**: Manage information density and provide user feedback.
    *   **Action**: Implemented loading (`CircularProgress`) and error (`Alert` with retry button) states in `LearningPath.tsx`. Added `TODO` for future virtualization.
    *   **Impacted Files**: `client/src/components/learning/LearningPath.tsx`.

#### Task 2.2: Integrate Authentication with New Layout
*   **Objective**: Ensure that the authentication token from the login process is correctly stored and made available to the API services used by the new layout.
*   **Key Actions**:
    1.  Review the `authService.ts` and `LoginPage.tsx` to understand the current token storage mechanism (e.g., `localStorage`).
    2.  Ensure the `ProtectedRoute` and API services (`learningPathService.ts`) are correctly retrieving the token.
    3.  Refactor the login success logic to navigate to the new root (`/`) instead of the old `/dashboard`.
    4.  Implement a global state or context for the user object to be accessible throughout the new layout, replacing the logic that was removed from `App.tsx`.
*   **Impacted Files**: `client/src/pages/LoginPage.tsx`, `client/src/services/authService.ts`, `client/src/components/ProtectedRoute.tsx`, potentially a new `client/src/context/AuthContext.tsx`.

---
(The plan would continue with other tasks for Week 3-4 like "Create lesson progression logic", "Build lesson content rendering system", etc., as outlined in the PRD, but broken down into similar actionable subtasks.)

## Notes for AI Agent

1.  **Incremental Development**: Each task builds on the previous one. Complete tasks in order.
2.  **Error Handling**: Always include proper error handling and loading states, both backend and frontend.
3.  **Type Safety**: Maintain strict TypeScript typing throughout.
4.  **Mobile First**: All components should be optimized for mobile devices first.
5.  **Performance**: Use React best practices for performance (memo, callback, etc.). Consider performance implications of data fetching and rendering.
6.  **Testing**: Test each component and API endpoint thoroughly before moving to the next task. (Unit tests, integration tests where appropriate).
7.  **Git Workflow**: Commit after each major sub-task completion with clear, conventional commit messages.
8.  **Seed Data**: Ensure seed data is available and used for development to visualize components with realistic data.

## Getting Help

If any task is unclear or needs clarification:
1. Review the complete PRD for context
2. Check existing code patterns in the current codebase
3. Follow Material-UI documentation for component APIs
4. Ensure mobile-first responsive design principles

**Start with Task 1.1 and proceed sequentially through each task.**
