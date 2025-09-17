import type { DailyLearningPlan, ContentRecommendation, CEFRLevel } from '../../types/AIDashboard';
import type { LessonStatus } from '../../components/ai-dashboard/QuickActionCard';

export type FocusToken = {
  icon: string;
  accent: string;
  background: string;
};

export type DefaultLesson = {
  id: string;
  title: string;
  description: string;
  focus: string;
  estimatedTime: number;
  type: string;
  status: LessonStatus;
  progress: number;
  difficulty: CEFRLevel;
};

export const FALLBACK_DAILY_PLAN: DailyLearningPlan = {
  id: 'fallback-plan',
  userId: 'demo-user',
  generatedAt: '2024-01-01T08:00:00.000Z',
  lessons: [
    {
      id: 'conversation-101',
      title: 'Warm-up conversation',
      description: 'Practice greeting a friend and asking simple questions.',
      focus: 'Conversation',
      estimatedTime: 12,
      type: 'conversation',
      status: 'in_progress',
      progress: 45,
      difficulty: 'A2',
    },
    {
      id: 'listening-lounge',
      title: 'Active listening',
      description: 'Listen for café vocabulary and answer short prompts.',
      focus: 'Listening',
      estimatedTime: 10,
      type: 'listening',
      status: 'not_started',
      progress: 0,
      difficulty: 'A2',
    },
    {
      id: 'grammar-refresh',
      title: 'Past tense essentials',
      description: 'Contrast passé composé and imparfait in short stories.',
      focus: 'Grammar',
      estimatedTime: 15,
      type: 'grammar',
      status: 'not_started',
      progress: 0,
      difficulty: 'A2',
    },
    {
      id: 'pronunciation-lab',
      title: 'Nasal vowel drill',
      description: 'Repeat and record three sentences with nasal vowels.',
      focus: 'Pronunciation',
      estimatedTime: 8,
      type: 'pronunciation',
      status: 'locked',
      progress: 0,
      difficulty: 'B1',
    },
  ] satisfies DefaultLesson[],
  recommendations: [],
  estimatedDuration: 45,
  difficulty: 'A2',
  metadata: {
    streakDays: 6,
    focusAreas: ['Conversation', 'Listening', 'Grammar'],
    confidenceScore: 0.82,
  },
};

export const FALLBACK_RECOMMENDATIONS: ContentRecommendation[] = [
  {
    id: 'rec-cafe-dialogue',
    title: 'Ordering at the café',
    description: 'Role-play a café order with polite forms and useful filler phrases.',
    type: 'lesson',
    difficulty: 'A2',
    estimatedTime: 15,
    reason: 'Build on your conversation warm-up with practical phrases.',
    priority: 'high',
    tags: ['conversation'],
    confidenceScore: 0.88,
  },
  {
    id: 'rec-aural-notes',
    title: 'Listening for key details',
    description: 'Identify numbers and times in a short train announcement.',
    type: 'lesson',
    difficulty: 'A2',
    estimatedTime: 12,
    reason: 'Strengthen your listening accuracy before the next lesson.',
    priority: 'medium',
    tags: ['listening'],
    confidenceScore: 0.82,
  },
  {
    id: 'rec-grammar-check',
    title: 'Passé composé challenge',
    description: 'Choose the correct tense in daily routine sentences.',
    type: 'grammar_exercise',
    difficulty: 'A2',
    estimatedTime: 10,
    reason: 'Reinforce tense contrast covered in your plan.',
    priority: 'medium',
    tags: ['grammar'],
    confidenceScore: 0.78,
  },
  {
    id: 'rec-vocab-topup',
    title: 'Café vocabulary deck',
    description: 'Revise ten phrases you can use when ordering.',
    type: 'vocabulary_drill',
    difficulty: 'A2',
    estimatedTime: 8,
    reason: 'Quick boost to match today\'s focus.',
    priority: 'low',
    tags: ['vocabulary'],
    confidenceScore: 0.75,
  },
];

export const FOCUS_CONFIG: Record<string, FocusToken> = {
  conversation: { icon: '💬', accent: 'var(--accent-purple)', background: 'var(--accent-purple-bg)' },
  listening: { icon: '🎧', accent: 'var(--accent-blue)', background: 'var(--accent-blue-bg)' },
  grammar: { icon: '📚', accent: 'var(--accent-orange)', background: 'var(--accent-orange-bg)' },
  vocabulary: { icon: '🔤', accent: 'var(--accent-blue)', background: 'var(--accent-blue-bg)' },
  pronunciation: { icon: '🗣️', accent: 'var(--accent-green)', background: 'var(--accent-green-bg)' },
};

export const DEFAULT_FOCUS_TOKEN: FocusToken = {
  icon: '🎯',
  accent: 'var(--accent-blue)',
  background: 'var(--accent-blue-bg)',
};

export const DEFAULT_SKILL_INSIGHTS = [
  {
    id: 'skill-conversation',
    label: 'Conversation',
    icon: FOCUS_CONFIG.conversation.icon,
    accent: FOCUS_CONFIG.conversation.accent,
    background: FOCUS_CONFIG.conversation.background,
    progress: 68,
    helper: 'You sustain longer turns when greeting and closing conversations.',
  },
  {
    id: 'skill-listening',
    label: 'Listening',
    icon: FOCUS_CONFIG.listening.icon,
    accent: FOCUS_CONFIG.listening.accent,
    background: FOCUS_CONFIG.listening.background,
    progress: 62,
    helper: 'You catch key details from native-speed clips more often.',
  },
  {
    id: 'skill-grammar',
    label: 'Grammar',
    icon: FOCUS_CONFIG.grammar.icon,
    accent: FOCUS_CONFIG.grammar.accent,
    background: FOCUS_CONFIG.grammar.background,
    progress: 54,
    helper: 'Verb endings are more consistent in your practice responses.',
  },
] as const;

export const DEFAULT_STUDY_GUIDANCE = [
  {
    id: 'guidance-voice-note',
    icon: '🎙️',
    title: 'Send a quick voice note',
    description: 'Record a 30-second café order to a friend and compare it with the model answer.',
    accent: 'var(--accent-purple)',
    background: 'var(--accent-purple-bg)',
  },
  {
    id: 'guidance-flashcards',
    icon: '🗂️',
    title: 'Review your flashcards',
    description: 'Run through the café deck to keep the phrases top of mind.',
    accent: 'var(--accent-blue)',
    background: 'var(--accent-blue-bg)',
  },
  {
    id: 'guidance-journal',
    icon: '📓',
    title: 'Write three lines',
    description: 'Describe what you ordered last weekend using both past tenses.',
    accent: 'var(--accent-orange)',
    background: 'var(--accent-orange-bg)',
  },
] as const;

export const DEFAULT_USER_SNAPSHOT = {
  userName: undefined as string | undefined,
  cefrLevel: 'A2' as CEFRLevel,
  progressPercentage: 72,
  streak: 6,
  weeklyXp: 320,
  dailyGoal: { current: 2, target: 3 },
  lastLessonTitle: 'Ordering coffee politely',
};
