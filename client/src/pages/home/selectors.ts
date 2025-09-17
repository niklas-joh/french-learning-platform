import { AI_DASHBOARD_CONFIG, type ContentType } from '../../config/aiDashboardConfig';
import type { ContentRecommendation, DailyLearningPlan } from '../../types/AIDashboard';
import type { DifficultyLevel, LessonStatus } from '../../components/ai-dashboard/QuickActionCard';
import {
  FALLBACK_DAILY_PLAN,
  FALLBACK_RECOMMENDATIONS,
  FOCUS_CONFIG,
  DEFAULT_FOCUS_TOKEN,
  DEFAULT_SKILL_INSIGHTS,
  DEFAULT_STUDY_GUIDANCE,
  DEFAULT_USER_SNAPSHOT,
  type FocusToken,
} from './constants';

export type PlanLesson = {
  id: string;
  title: string;
  summary: string;
  focus: string;
  estimatedTime: number;
  status: LessonStatus;
  difficulty: string;
  icon: string;
  progress: number;
  contentType: string;
};

export type HeroMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
};

export type SkillInsight = {
  id: string;
  label: string;
  icon: string;
  accent: string;
  background: string;
  progress: number;
  helper: string;
};

export type StudyHighlight = {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: string;
  background: string;
};

export type DailyGoalProgress = {
  current: number;
  target: number;
  percentage: number;
};

export type UserSnapshot = typeof DEFAULT_USER_SNAPSHOT;

export type QuickActionLesson = {
  id: string;
  icon: string;
  title: string;
  description: string;
  contentType: ContentType;
  estimatedTime: number;
  disabled?: boolean;
  progress?: number;
  xpReward?: number;
  difficulty?: DifficultyLevel;
  status?: LessonStatus;
  aiPersonalization?: string;
};

const RECOMMENDATION_META: Record<ContentRecommendation['type'], { icon: string }> = {
  lesson: { icon: '📘' },
  vocabulary_drill: { icon: '🗂️' },
  grammar_exercise: { icon: '✏️' },
};

const STATUS_FALLBACK: LessonStatus = 'not_started';

const PROGRESS_HELPERS = [
  'Your responses sound more natural each session.',
  'You pick out key details faster than last week.',
  'Accuracy keeps improving with steady practice.',
];

const clampProgress = (value: unknown): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
};

const resolveFocusToken = (focus?: string): FocusToken => {
  if (!focus) {
    return DEFAULT_FOCUS_TOKEN;
  }

  const normalized = focus.toLowerCase().split(' ')[0];
  return FOCUS_CONFIG[normalized] ?? DEFAULT_FOCUS_TOKEN;
};

const mapDifficultyToBadge = (difficulty: string | undefined): DifficultyLevel => {
  if (!difficulty) return 'beginner';
  const upper = difficulty.toUpperCase();
  if (upper.startsWith('C')) return 'advanced';
  if (upper.startsWith('B')) return 'intermediate';
  return 'beginner';
};

export const resolveActivePlan = (plan?: DailyLearningPlan | null): DailyLearningPlan => {
  if (!plan || !Array.isArray(plan.lessons) || plan.lessons.length === 0) {
    return FALLBACK_DAILY_PLAN;
  }

  return {
    ...FALLBACK_DAILY_PLAN,
    ...plan,
    lessons: plan.lessons,
    metadata: {
      ...FALLBACK_DAILY_PLAN.metadata,
      ...plan.metadata,
    },
  };
};

export const selectFocusAreas = (plan: DailyLearningPlan): string[] => {
  const focusAreas = plan.metadata?.focusAreas;
  if (Array.isArray(focusAreas) && focusAreas.length > 0) {
    return focusAreas;
  }
  return FALLBACK_DAILY_PLAN.metadata?.focusAreas ?? [];
};

export const buildPlanLessons = (plan: DailyLearningPlan, focusAreas: string[]): PlanLesson[] => {
  return plan.lessons.map((lesson: any, index: number) => {
    const focusLabel = lesson.focus ?? focusAreas[index % focusAreas.length] ?? 'Lesson';
    const focusToken = resolveFocusToken(focusLabel);
    const status = (lesson.status ?? STATUS_FALLBACK) as LessonStatus;

    const derivedProgress = clampProgress(
      typeof lesson.progress === 'number'
        ? lesson.progress
        : status === 'completed'
          ? 100
          : status === 'in_progress'
            ? 40
            : 0,
    );

    return {
      id: String(lesson.id ?? `lesson-${index}`),
      title: String(lesson.title ?? `Lesson ${index + 1}`),
      summary: String(lesson.description ?? lesson.summary ?? `Focus on ${focusLabel.toLowerCase()}.`),
      focus: focusLabel,
      estimatedTime: typeof lesson.estimatedTime === 'number' ? lesson.estimatedTime : 15,
      status,
      difficulty: String(lesson.difficulty ?? plan.difficulty ?? 'A2'),
      icon: focusToken.icon,
      progress: derivedProgress,
      contentType: String(lesson.type ?? 'lesson'),
    };
  });
};

export const selectNextLesson = (lessons: PlanLesson[]): PlanLesson | undefined => {
  return lessons.find((lesson) => lesson.status === 'in_progress' || lesson.status === 'not_started')
    ?? lessons[0];
};

export const calculateDailyGoal = (snapshot: UserSnapshot): DailyGoalProgress => {
  const { current, target } = snapshot.dailyGoal;
  if (!target) {
    return { current, target, percentage: 0 };
  }
  const percentage = Math.min(100, Math.round((current / target) * 100));
  return { current, target, percentage };
};

export const calculatePlanConfidence = (plan: DailyLearningPlan): number => {
  const confidence = plan.metadata?.confidenceScore ?? FALLBACK_DAILY_PLAN.metadata?.confidenceScore ?? 0;
  return Math.round(confidence * 100);
};

export const buildHeroMetrics = (snapshot: UserSnapshot, planConfidence: number): HeroMetric[] => [
  {
    id: 'daily-goal',
    label: 'Daily goal',
    value: `${snapshot.dailyGoal.current}/${snapshot.dailyGoal.target}`,
    helper: snapshot.dailyGoal.current >= snapshot.dailyGoal.target
      ? 'Goal completed – bravo!'
      : `${snapshot.dailyGoal.target - snapshot.dailyGoal.current} lesson(s) left`,
  },
  {
    id: 'weekly-xp',
    label: 'Weekly XP',
    value: `${snapshot.weeklyXp}`,
    helper: 'Keep pace to reach 500 XP',
  },
  {
    id: 'streak',
    label: 'Current streak',
    value: `${snapshot.streak} days`,
    helper: 'Consistency unlocks badges',
  },
  {
    id: 'confidence',
    label: 'AI confidence',
    value: `${planConfidence}%`,
    helper: 'Personalised to your goals',
  },
];

export const buildPlanSummary = (
  snapshot: UserSnapshot,
  plan: DailyLearningPlan,
  lessons: PlanLesson[],
  planConfidence: number,
) => [
  { label: 'CEFR level', value: snapshot.cefrLevel },
  { label: 'Plan duration', value: `${plan.estimatedDuration} min` },
  { label: 'Activities', value: `${lessons.length}` },
  { label: 'Confidence', value: `${planConfidence}%` },
];

export const buildSkillInsights = (focusAreas: string[]): SkillInsight[] => {
  if (!focusAreas.length) {
    return DEFAULT_SKILL_INSIGHTS.map((insight) => ({ ...insight }));
  }

  return focusAreas.slice(0, 3).map((focus, index) => {
    const token = resolveFocusToken(focus);
    const base = DEFAULT_SKILL_INSIGHTS[index];
    const helper = PROGRESS_HELPERS[index % PROGRESS_HELPERS.length];

    return {
      id: `insight-${focus.toLowerCase().replace(/\s+/g, '-')}`,
      label: focus,
      icon: token.icon,
      accent: token.accent,
      background: token.background,
      progress: base ? base.progress : 55 + index * 8,
      helper,
    };
  });
};

export const buildStudyGuidance = (focusAreas: string[]): StudyHighlight[] => {
  if (!focusAreas.length) {
    return DEFAULT_STUDY_GUIDANCE.map((item) => ({ ...item }));
  }

  return focusAreas.slice(0, 3).map((focus, index) => {
    const token = resolveFocusToken(focus);
    const fallback = DEFAULT_STUDY_GUIDANCE[index];

    return {
      id: `guidance-${focus.toLowerCase().replace(/\s+/g, '-')}`,
      icon: token.icon,
      title: `${focus} micro-practice`,
      description: fallback?.description ?? `Spend five minutes reviewing ${focus.toLowerCase()}.`,
      accent: token.accent,
      background: token.background,
    };
  });
};

export const mapRecommendationsToLessons = (
  recommendations: ContentRecommendation[],
  isOffline: boolean,
): QuickActionLesson[] => {
  const source = recommendations.length > 0 ? recommendations : FALLBACK_RECOMMENDATIONS;

  return source.slice(0, AI_DASHBOARD_CONFIG.DEFAULTS.MAX_RECOMMENDATIONS).map((item) => {
    const meta = RECOMMENDATION_META[item.type];
    const badgeDifficulty = mapDifficultyToBadge(item.difficulty);
    const progress = item.confidenceScore ? Math.round(item.confidenceScore * 100) : undefined;

    return {
      id: item.id,
      icon: meta?.icon ?? '📘',
      title: item.title,
      description: item.description,
      contentType: item.type,
      estimatedTime: item.estimatedTime ?? AI_DASHBOARD_CONFIG.DEFAULTS.ESTIMATED_TIME,
      disabled: isOffline,
      progress,
      difficulty: badgeDifficulty,
      status: STATUS_FALLBACK,
      aiPersonalization: item.reason,
    };
  });
};

export const mapQuickActions = (isOffline: boolean) => {
  return AI_DASHBOARD_CONFIG.QUICK_ACTIONS.map((action) => ({
    ...action,
    disabled: isOffline,
  }));
};

export const getUserSnapshot = (): UserSnapshot => DEFAULT_USER_SNAPSHOT;

export const getFocusToken = (focus: string): FocusToken => resolveFocusToken(focus);
