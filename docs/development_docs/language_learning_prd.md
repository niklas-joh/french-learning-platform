# Language Learning Platform - Product Requirements Document

## 1. Executive Summary

**Project**: Transform existing quiz-based educational platform into a comprehensive language learning application focused on French language acquisition.

**Vision**: Create a state-of-the-art, AI-powered language learning platform that provides personalized, engaging, and effective French language education through modern mobile-first design and advanced AI integration.

**Success Metrics**:
- 70%+ daily user retention
- 80%+ lesson completion rate
- Average 15-20 minute session duration
- 60%+ users maintain 7+ day learning streaks

## 2. Current System Analysis

### 2.1 Current Architecture
```
Frontend: React + TypeScript + Material-UI
├── User Dashboard (quiz-focused)
├── Quiz Interface
├── Progress Tracker (basic)
├── All Assignments Page
├── Topic Content Page
└── Admin Dashboard

Backend: Node.js + Express
├── Authentication Service
├── User/Admin Controllers
├── Quiz Engine
├── Progress Service
├── Content Service
└── Analytics Service

Database: SQLite
├── users (id, email, password_hash, first_name, last_name, role, preferences)
├── topics (id, name, description, category, active)
├── content (id, topic_id, content_type_id, name, question_data, correct_answer, options)
├── content_types (id, name, description)
└── user_content_assignments (id, user_id, content_id, assigned_at, status)
```

### 2.2 Current Limitations
- **Single Dashboard Design**: Not optimized for mobile learning
- **Quiz-Centric**: Limited to question/answer format
- **No AI Integration**: Missing personalized learning and conversation practice
- **Basic Gamification**: No XP system, achievements, or streaks
- **Limited Content Types**: Primarily quiz-based content
- **No Speech Recognition**: Missing pronunciation practice
- **Static Progress Tracking**: Basic completion tracking only

## 3. Target User Requirements

### 3.1 Primary User Persona
- **Demographics**: Adults 18-45 learning French
- **Motivation**: Travel, career advancement, personal enrichment
- **Technology Comfort**: Mobile-first users expecting modern app experiences
- **Learning Preferences**: Bite-sized sessions (15-20 minutes), practical content, immediate feedback

### 3.2 User Journey Requirements
1. **Onboarding**: Quick setup with language preference and level assessment
2. **Daily Practice**: Easy access to personalized learning activities
3. **Skill Development**: Balanced practice across reading, writing, listening, speaking
4. **Progress Tracking**: Visual progress with gamified elements
5. **Motivation**: Streaks, achievements, and AI encouragement

## 4. Feature Requirements

### 4.1 Core Navigation System
**Requirement**: Transform from single dashboard to mobile-first bottom tab navigation

**Current State**: Single dashboard with multiple components
**Target State**: 5 distinct screens with bottom tab navigation

```typescript
// Required Navigation Structure
interface NavigationStructure {
  screens: {
    home: HomePage;      // Personalized learning hub
    lessons: LessonsPage; // Structured learning path
    practice: PracticePage; // AI-powered activities
    progress: ProgressPage; // Gamified analytics
    profile: ProfilePage;  // Settings and preferences
  };
  navigation: BottomTabNavigation;
}
```

### 4.2 AI Integration Requirements

#### 4.2.1 AI Tutor System
**Purpose**: Provide personalized, conversational learning assistance

**Requirements**:
- Real-time conversational interface
- Context-aware responses based on user progress
- Personality: Friendly, encouraging, knowledgeable French tutor named "Claude"
- Multi-modal interaction (text, voice)
- Learning adaptation based on user performance

**Technical Specifications**:
```typescript
interface AITutorService {
  generateResponse(prompt: string, context: LearningContext): Promise<AIResponse>;
  providePersonalizedFeedback(userInput: string, expectedAnswer: string): Promise<Feedback>;
  adaptDifficultyLevel(userPerformance: PerformanceMetrics): DifficultyAdjustment;
  generateConversationPrompts(topic: string, userLevel: CEFRLevel): Promise<ConversationPrompt[]>;
}

interface LearningContext {
  userId: number;
  currentLesson: string;
  userLevel: CEFRLevel; // A1, A2, B1, B2, C1, C2
  recentPerformance: PerformanceMetrics;
  learningGoals: string[];
}
```

#### 4.2.2 Speech Recognition System
**Purpose**: Enable pronunciation practice and speaking assessment

**Requirements**:
- Real-time speech-to-text conversion
- Pronunciation accuracy scoring
- Phonetic feedback and correction suggestions
- Support for French phonemes and accents
- Progress tracking for speaking skills

**Technical Specifications**:
```typescript
interface SpeechRecognitionService {
  startRecording(): Promise<void>;
  stopRecording(): Promise<AudioBuffer>;
  analyzePronunciation(audio: AudioBuffer, targetText: string): Promise<PronunciationResult>;
  provideSpeakingFeedback(result: PronunciationResult): SpeakingFeedback;
}

interface PronunciationResult {
  accuracy: number; // 0-100
  phonemeAnalysis: PhonemeScore[];
  suggestions: string[];
  overallFeedback: string;
}
```

### 4.3 Gamification System Requirements

#### 4.3.1 XP and Leveling System
**Purpose**: Motivate users through clear progression and achievement

**Requirements**:
- CEFR-based level progression (A1 → A2 → B1 → B2 → C1 → C2)
- XP points for completed activities
- Visual progress indicators
- Level-up celebrations

**Technical Specifications**:
```typescript
interface UserProgress {
  userId: number;
  currentLevel: CEFRLevel;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  streakDays: number;
  lastActivityDate: Date;
  lessonsCompleted: number;
  wordsLearned: number;
  timeSpentMinutes: number;
  accuracyRate: number;
}

interface XPSystem {
  calculateXP(activityType: ActivityType, performance: number, timeSpent: number): number;
  updateUserProgress(userId: number, activity: CompletedActivity): Promise<UserProgress>;
  checkLevelProgression(userProgress: UserProgress): LevelUpdateResult;
}
```

#### 4.3.2 Achievement System
**Purpose**: Recognize milestones and maintain engagement

**Requirements**:
- Progressive achievement unlocks
- Multiple achievement categories (streaks, accuracy, lessons, speaking)
- Visual achievement badges
- Achievement notifications

**Technical Specifications**:
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'accuracy' | 'lessons' | 'speaking' | 'vocabulary';
  criteria: AchievementCriteria;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementCriteria {
  type: 'streak' | 'lessons_completed' | 'accuracy_threshold' | 'words_learned';
  value: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
}
```

### 4.4 Content Management Requirements

#### 4.4.1 Learning Path System
**Purpose**: Provide structured, progressive learning experience

**Requirements**:
- Visual learning path with connected lessons
- Prerequisites and unlocking system
- Multiple content types (vocabulary, grammar, conversation, culture)
- Adaptive difficulty based on performance

**Technical Specifications**:
```typescript
interface LearningPath {
  id: string;
  language: 'french';
  units: LearningUnit[];
  totalLessons: number;
  estimatedDuration: number; // in hours
}

interface LearningUnit {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  lessons: Lesson[];
  prerequisites: string[];
  isUnlocked: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'culture' | 'pronunciation';
  estimatedTime: number; // in minutes
  content: LessonContent;
  activities: Activity[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
}
```

#### 4.4.2 Activity Types
**Requirements**: Support diverse learning activities beyond quizzes

```typescript
interface Activity {
  id: string;
  type: ActivityType;
  content: ActivityContent;
  metadata: ActivityMetadata;
}

type ActivityType = 
  | 'multiple_choice'
  | 'fill_in_blank'
  | 'pronunciation'
  | 'conversation'
  | 'listening'
  | 'writing'
  | 'matching'
  | 'flashcards';

interface ConversationActivity {
  scenario: string;
  aiPersona: string;
  targetPhrases: string[];
  context: string;
  difficultyLevel: CEFRLevel;
}

interface PronunciationActivity {
  targetPhrases: string[];
  phonemesFocus: string[];
  audioExamples: string[];
  accuracyThreshold: number;
}
```

### 4.5 User Interface Requirements

#### 4.5.1 Design System
**Requirements**: Modern, mobile-first design following 2025 trends

**Visual Specifications**:
```css
/* Design Token Requirements */
:root {
  /* French-themed color palette */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --french-blue: #667eea;
  --french-purple: #764ba2;
  
  /* Glassmorphism effects */
  --glass-background: rgba(255, 255, 255, 0.95);
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
}
```

#### 4.5.2 Animation Requirements
**Purpose**: Enhance user experience with smooth, meaningful animations

```typescript
interface AnimationConfig {
  pageTransitions: {
    duration: 300; // ms
    easing: 'ease-in-out';
    type: 'slide' | 'fade';
  };
  microInteractions: {
    hover: { scale: 1.02; duration: 200 };
    press: { scale: 0.95; duration: 150 };
    success: { bounce: true; duration: 600 };
  };
  progressAnimations: {
    xpBar: { duration: 2000; easing: 'ease-out' };
    levelUp: { confetti: true; duration: 3000 };
  };
}
```

## 5. Database Schema Changes

### 5.1 New Tables Required

```sql
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

-- Learning paths and lessons
CREATE TABLE learning_paths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL DEFAULT 'french',
    name TEXT NOT NULL,
    description TEXT,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    estimated_duration INTEGER, -- in hours
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_path_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL, -- A1, A2, B1, B2, C1, C2
    order_index INTEGER NOT NULL,
    prerequisites TEXT, -- JSON array of unit IDs
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
    type TEXT NOT NULL, -- vocabulary, grammar, conversation, culture, pronunciation
    estimated_time INTEGER NOT NULL, -- in minutes
    order_index INTEGER NOT NULL,
    content_data TEXT, -- JSON content
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_unit_id) REFERENCES learning_units(id)
);

-- User lesson progress
CREATE TABLE user_lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'locked', -- locked, available, in_progress, completed
    score REAL, -- 0-100
    time_spent INTEGER, -- in seconds
    attempts INTEGER DEFAULT 0,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    UNIQUE(user_id, lesson_id)
);

-- Activities and user activity progress
CREATE TABLE activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- multiple_choice, pronunciation, conversation, etc.
    title TEXT NOT NULL,
    content_data TEXT NOT NULL, -- JSON activity data
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE user_activity_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, skipped
    score REAL, -- 0-100
    response_data TEXT, -- JSON user responses
    ai_feedback TEXT, -- JSON AI feedback
    time_spent INTEGER, -- in seconds
    attempts INTEGER DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (activity_id) REFERENCES activities(id)
);

-- Achievements system
CREATE TABLE achievements (
    id TEXT PRIMARY KEY, -- e.g., 'streak_7_days'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL, -- streak, accuracy, lessons, speaking, vocabulary
    criteria_data TEXT NOT NULL, -- JSON criteria
    rarity TEXT NOT NULL DEFAULT 'common', -- common, rare, epic, legendary
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

-- AI conversation history
CREATE TABLE ai_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    message_type TEXT NOT NULL, -- user, ai
    content TEXT NOT NULL,
    context_data TEXT, -- JSON context
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User vocabulary progress
CREATE TABLE user_vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'french',
    proficiency_level INTEGER NOT NULL DEFAULT 0, -- 0-5 (unknown to mastered)
    times_practiced INTEGER NOT NULL DEFAULT 0,
    last_practiced DATETIME,
    learned_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, word, language)
);
```

### 5.2 Modified Tables

```sql
-- Add language learning specific fields to users table
ALTER TABLE users ADD COLUMN native_language TEXT DEFAULT 'english';
ALTER TABLE users ADD COLUMN target_languages TEXT; -- JSON array
ALTER TABLE users ADD COLUMN learning_goals TEXT; -- JSON array
ALTER TABLE users ADD COLUMN daily_goal_minutes INTEGER DEFAULT 15;
ALTER TABLE users ADD COLUMN preferred_learning_time TEXT; -- morning, afternoon, evening
ALTER TABLE users ADD COLUMN notification_preferences TEXT; -- JSON preferences

-- Enhance content table for new activity types
ALTER TABLE content ADD COLUMN activity_type TEXT DEFAULT 'multiple_choice';
ALTER TABLE content ADD COLUMN lesson_id INTEGER;
ALTER TABLE content ADD COLUMN skill_focus TEXT; -- reading, writing, listening, speaking
ALTER TABLE content ADD COLUMN estimated_time INTEGER; -- in minutes
ALTER TABLE content ADD COLUMN ai_feedback_enabled BOOLEAN DEFAULT FALSE;

-- Add foreign key for lesson relationship
-- Note: This requires recreating table in SQLite
```

## 6. API Endpoint Requirements

### 6.1 New API Endpoints

```typescript
// User Progress APIs
GET    /api/user/progress              // Get user's overall progress
PUT    /api/user/progress              // Update user progress
GET    /api/user/streak                // Get current streak information
POST   /api/user/activity-completed   // Record completed activity

// Learning Path APIs
GET    /api/learning-paths             // Get available learning paths
GET    /api/learning-paths/:id         // Get specific learning path
GET    /api/lessons/:id                // Get lesson details
GET    /api/user/lessons               // Get user's lesson progress
POST   /api/user/lessons/:id/start     // Start a lesson
POST   /api/user/lessons/:id/complete  // Complete a lesson

// AI Integration APIs
POST   /api/ai/chat                    // Send message to AI tutor
POST   /api/ai/pronunciation           // Analyze pronunciation
POST   /api/ai/feedback                // Get personalized feedback
GET    /api/ai/conversation-prompts    // Get conversation starters

// Gamification APIs
GET    /api/user/achievements          // Get user achievements
GET    /api/achievements               // Get all available achievements
POST   /api/user/achievements/check    // Check for new achievements
GET    /api/user/leaderboard          // Get user ranking (future)

// Speech Recognition APIs
POST   /api/speech/analyze             // Analyze recorded speech
POST   /api/speech/feedback            // Get pronunciation feedback
GET    /api/speech/examples/:phrase    // Get pronunciation examples

// Vocabulary APIs
GET    /api/user/vocabulary            // Get user's vocabulary progress
POST   /api/user/vocabulary/practice   // Record vocabulary practice
PUT    /api/user/vocabulary/:word      // Update word proficiency
```

### 6.2 Enhanced Existing APIs

```typescript
// Enhanced Authentication
POST   /api/auth/login                 // Add language preference return
POST   /api/auth/register              // Include language setup
GET    /api/auth/profile               // Return enhanced profile

// Enhanced Content APIs
GET    /api/content                    // Filter by activity type, skill focus
GET    /api/content/:id                // Include AI feedback capabilities
POST   /api/content/:id/response       // Enhanced response with AI feedback

// Enhanced Analytics
GET    /api/analytics/user/:id         // Include gamification metrics
GET    /api/analytics/learning-path    // Path completion analytics
GET    /api/analytics/engagement       // User engagement metrics
```

## 7. Technical Architecture Changes

### 7.1 Frontend Architecture Changes

```typescript
// New folder structure
src/
├── pages/
│   ├── HomePage.tsx                   // NEW: Personalized learning hub
│   ├── LessonsPage.tsx               // NEW: Learning path visualization
│   ├── PracticePage.tsx              // NEW: AI-powered practice
│   ├── ProgressPage.tsx              // NEW: Gamified progress
│   ├── ProfilePage.tsx               // NEW: User settings
│   └── Dashboard.tsx                 // DEPRECATED: Remove after migration
├── components/
│   ├── navigation/
│   │   └── BottomTabNavigation.tsx   // NEW: Mobile navigation
│   ├── ai/
│   │   ├── AITutor.tsx               // NEW: Conversational AI
│   │   ├── SpeechRecognition.tsx     // NEW: Speech input
│   │   └── ConversationPractice.tsx  // NEW: AI conversations
│   ├── learning/
│   │   ├── LearningPath.tsx          // NEW: Visual learning path
│   │   ├── LessonCard.tsx            // NEW: Lesson components
│   │   ├── ActivityContainer.tsx     // NEW: Activity wrapper
│   │   └── QuickActions.tsx          // NEW: Quick practice access
│   ├── gamification/
│   │   ├── XPDisplay.tsx             // NEW: XP and level display
│   │   ├── StreakCounter.tsx         // NEW: Streak visualization
│   │   ├── AchievementBadge.tsx      // NEW: Achievement display
│   │   └── ProgressRing.tsx          // NEW: Circular progress
│   └── ui/
│       ├── GlassCard.tsx             // NEW: Glassmorphism card
│       ├── GradientButton.tsx        // NEW: Modern button
│       └── AnimatedIcon.tsx          // NEW: Animated icons
├── services/
│   ├── aiService.ts                  // NEW: AI integration
│   ├── speechService.ts              // NEW: Speech recognition
│   ├── gamificationService.ts       // NEW: XP and achievements
│   ├── learningPathService.ts       // NEW: Learning path management
│   └── progressService.ts           // ENHANCED: Advanced analytics
├── hooks/
│   ├── useAITutor.ts                // NEW: AI tutor state
│   ├── useSpeechRecognition.ts      // NEW: Speech recognition
│   ├── useGamification.ts           // NEW: Gamification state
│   ├── useLearningPath.ts           // NEW: Learning path state
│   └── useProgress.ts               // ENHANCED: Advanced progress
├── types/
│   ├── LearningPath.ts              // NEW: Learning path types
│   ├── AI.ts                        // NEW: AI service types
│   ├── Gamification.ts              // NEW: Gamification types
│   └── Activity.ts                  // NEW: Activity types
└── styles/
    ├── design-tokens.css            // NEW: Design system
    ├── animations.css               // NEW: Animation library
    └── glassmorphism.css           // NEW: Modern effects
```

### 7.2 Backend Architecture Changes

```typescript
// Enhanced backend structure
src/
├── controllers/
│   ├── aiController.ts              // NEW: AI integration
│   ├── speechController.ts          // NEW: Speech recognition
│   ├── gamificationController.ts   // NEW: XP and achievements
│   ├── learningPathController.ts   // NEW: Learning paths
│   └── progressController.ts       // ENHANCED: Advanced progress
├── services/
│   ├── aiService.ts                 // NEW: AI service integration
│   ├── speechAnalysisService.ts    // NEW: Speech processing
│   ├── gamificationService.ts      // NEW: XP calculation
│   ├── achievementService.ts       // NEW: Achievement checking
│   └── adaptiveLearningService.ts  // NEW: Personalization
├── middleware/
│   ├── aiRateLimiting.ts           // NEW: AI request limiting
│   └── speechProcessing.ts         // NEW: Audio processing
├── models/
│   ├── UserProgress.ts             // NEW: Progress model
│   ├── LearningPath.ts             // NEW: Learning path model
│   ├── Achievement.ts              // NEW: Achievement model
│   └── AIConversation.ts           // NEW: AI chat model
└── utils/
    ├── aiPromptTemplates.ts        // NEW: AI prompt management
    ├── speechAnalysis.ts           // NEW: Speech processing utils
    └── gamificationCalculators.ts  // NEW: XP/level calculations
```

## 8. Implementation Plan

### Phase 1: Foundation (Weeks 1-2)
**Goal**: Establish new navigation structure and design system

#### Week 1: Navigation and Design System
**Tasks**:
1. Create new page components (HomePage, LessonsPage, PracticePage, ProgressPage, ProfilePage)
2. Implement BottomTabNavigation component
3. Set up new design system with glassmorphism effects
4. Create base layout components
5. Update routing to support new page structure

**Deliverables**:
- 5 new page components with basic layouts
- Working bottom tab navigation
- Design system with CSS variables and components
- Updated routing configuration

**AI Agent Instructions**:
```typescript
// Step 1: Create BottomTabNavigation component
// Location: src/components/navigation/BottomTabNavigation.tsx
// Requirements: 
// - 5 tabs: Home, Lessons, Practice, Progress, Profile
// - Material-UI bottom navigation
// - Icons: HomeIcon, SchoolIcon, FitnessCenterIcon, TimelineIcon, PersonIcon
// - Active state styling with French-themed colors
// - Smooth transitions between tabs

// Step 2: Create base page components
// Locations: src/pages/[HomePage|LessonsPage|PracticePage|ProgressPage|ProfilePage].tsx
// Requirements:
// - Basic layout with header and content area
// - Placeholder content indicating page purpose
// - Consistent styling using new design system
// - Responsive design for mobile-first approach

// Step 3: Update routing
// Location: src/App.tsx or src/router/index.tsx
// Requirements:
// - Replace Dashboard route with new page routes
// - Set HomePage as default route
// - Ensure proper navigation between pages
// - Maintain authentication requirements
```

#### Week 2: Database Schema and API Foundation
**Tasks**:
1. Create new database tables for gamification and learning paths
2. Set up API endpoints for user progress and learning paths
3. Create data models and TypeScript interfaces
4. Implement basic user progress tracking
5. Set up data seeding for learning content

**AI Agent Instructions**:
```sql
-- Step 1: Execute database schema updates
-- Run the SQL commands from section 5.1 to create new tables
-- Create database migration scripts for existing deployments

-- Step 2: Create data models
-- Location: src/models/
-- Create UserProgress, LearningPath, Lesson, Achievement models
-- Include proper TypeScript interfaces and validation

-- Step 3: Implement basic API endpoints
-- Location: src/controllers/
-- Create endpoints for /api/user/progress, /api/learning-paths
-- Implement basic CRUD operations with proper error handling
```

### Phase 2: Core Learning Features (Weeks 3-6)

#### Week 3-4: Learning Path System
**Tasks**:
1. Implement visual learning path component
2. Create lesson progression logic
3. Build lesson content rendering system
4. Implement lesson status tracking (locked, available, completed)
5. Create adaptive unlocking system

**AI Agent Instructions**:
```typescript
// Step 1: Create LearningPath visualization component
// Location: src/components/learning/LearningPath.tsx
// Requirements:
// - Vertical scrolling path with connected nodes
// - Visual indicators for lesson status (locked, current, completed)
// - Smooth animations for status changes
// - Mobile-optimized touch interactions
// - Progressive disclosure of content

// Step 2: Implement lesson progression logic
// Location: src/services/learningPathService.ts
// Requirements:
// - Check lesson prerequisites before unlocking
// - Calculate overall path progress
// - Handle lesson completion and status updates
// - Integrate with user progress tracking
```

#### Week 5-6: Basic Gamification
**Tasks**:
1. Implement XP system and level progression
2. Create achievement system
3. Build streak tracking
4. Design progress visualization components
5. Implement level-up celebrations

**AI Agent Instructions**:
```typescript
// Step 1: Implement XP and leveling system
// Location: src/services/gamificationService.ts
// Requirements:
// - XP calculation based on activity type and performance
// - CEFR level progression (A1, A2, B1, B2, C1, C2)
// - Level thresholds and progression logic
// - Integration with user progress updates

// Step 2: Create achievement system
// Location: src/services/achievementService.ts
// Requirements:
// - Achievement criteria checking
// - Badge unlocking logic
// - Achievement notifications
// - Progress towards achievement goals
```

### Phase 3: AI Integration (Weeks 7-10)

#### Week 7-8: AI Tutor Foundation
**Tasks**:
1. Set up AI service integration (Claude API)
2. Create conversational AI interface
3. Implement context-aware responses
4. Build AI feedback system
5. Create AI tutor personality and conversation flows

**AI Agent Instructions**:
```typescript
// Step 1: Implement AI service
// Location: src/services/aiService.ts
// Requirements:
// - Integration with Claude API or OpenAI
// - Conversation context management
// - Personalized response generation
// - Error handling and fallback responses
// - Rate limiting and cost management

// Step 2: Create AI Tutor UI component
// Location: src/components/ai/AITutor.tsx
// Requirements:
// - Chat-like interface with conversation bubbles
// - Typing indicators and smooth animations
// - Voice input button integration
// - Context-aware conversation starters
// - French tutor personality (encouraging, patient, knowledgeable)
```

#### Week 9-10: Speech Recognition
**Tasks**:
1. Integrate speech recognition API
2. Implement pronunciation analysis
3. Create speech feedback system
4. Build speaking practice activities
5. Add speech progress tracking

**AI Agent Instructions**:
```typescript
// Step 1: Implement speech recognition service
// Location: src/services/speechService.ts
// Requirements:
// - Web Speech API integration for basic recognition
// - Audio recording and processing
// - Pronunciation accuracy scoring
// - French phoneme analysis
// - Feedback generation for improvement

// Step 2: Create speech recognition UI
// Location: src/components/ai/SpeechRecognition.tsx
// Requirements:
// - Microphone button with recording indicator
// - Real-time audio level visualization
// - Pronunciation score display
// - Retry and practice flow
// - Accessibility for speech-impaired users
```

### Phase 4: Advanced Features (Weeks 11-14)

#### Week 11-12: Enhanced AI Features
**Tasks**:
1. Implement adaptive learning algorithms
2. Create personalized content recommendations
3. Build conversation practice scenarios
4. Implement AI-powered error correction
5. Add cultural context integration

#### Week 13-14: Polish and Optimization
**Tasks**:
1. Implement smooth animations and micro-interactions
2. Optimize performance for mobile devices
3. Add accessibility features
4. Implement comprehensive error handling
5. Create onboarding flow

### Phase 5: Testing and Deployment (Weeks 15-16)

#### Week 15: Testing and Quality Assurance
**Tasks**:
1. Comprehensive testing of all features
2. User acceptance testing
3. Performance optimization
4. Bug fixes and refinements
5. Documentation updates

#### Week 16: Deployment and Launch
**Tasks**:
1. Production deployment preparation
2. Database migration execution
3. Monitoring and analytics setup
4. User feedback collection system
5. Launch and initial user onboarding

## 9. Success Criteria and Testing

### 9.1 Functional Requirements Testing
- [ ] All 5 main screens load and navigate properly
- [ ] AI tutor responds appropriately to user inputs
- [ ] Speech recognition accurately processes French pronunciation
- [ ] Gamification system correctly tracks XP, levels, and achievements
- [ ] Learning path progression works according to prerequisites
- [ ] User progress is accurately tracked and displayed

### 9.2 Performance Requirements
- [ ] Page load times < 2 seconds
- [ ] Navigation transitions < 300ms
- [ ] AI response times < 3 seconds
- [ ] Speech recognition latency < 1 second
- [ ] Mobile performance maintains 60fps animations

### 9.3 User Experience Requirements
- [ ] Intuitive navigation requiring no tutorial
- [ ] Engaging visual design that feels modern and premium
- [ ] Smooth, delightful animations and interactions
- [ ] Clear progress feedback and motivation
- [ ] Accessible design for users with disabilities

## 10. Risk Mitigation

### 10.1 Technical Risks
- **AI API Costs**: Implement rate limiting and efficient prompt management
- **Speech Recognition Accuracy**: Provide fallback text input options
- **Performance on Low-end Devices**: Implement progressive enhancement
- **Database Migration**: Create comprehensive backup and rollback procedures

### 10.2 User Experience Risks
- **Learning Curve**: Implement gradual feature introduction and onboarding
- **Feature Complexity**: Maintain simple, intuitive interfaces
- **Motivation Retention**: Balance challenge with achievability in gamification

## 11. Post-Launch Considerations

### 11.1 Analytics and Monitoring
- User engagement metrics (DAU, session duration, retention)
- Learning effectiveness metrics (completion rates, progress speed)
- Technical performance metrics (load times, error rates)
- AI interaction quality metrics (conversation length, satisfaction)

### 11.2 Future Enhancements
- Additional language support (Spanish, Italian, German)
- Social features (friends, leaderboards, challenges)
- Offline learning capabilities
- Advanced AI conversation scenarios
- AR/VR integration for immersive learning

---

**This PRD provides comprehensive requirements for transforming the current quiz-based educational platform into a state-of-the-art language learning application. Each phase builds upon the previous one, ensuring a smooth transition while maintaining system stability and user experience quality.**