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
