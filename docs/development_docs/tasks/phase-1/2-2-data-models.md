# Task 2.2: Create Data Models

Create the following files with the specified content:

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
