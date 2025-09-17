import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Button,
  Divider,
} from '@mui/material';
import { QuickActionsGrid } from '../../components/ai-dashboard/QuickActionCard';
import { AITutorCard } from '../../components/ai-dashboard/AITutorCard';
import type { ContentType } from '../../config/aiDashboardConfig';
import type {
  PlanLesson,
  HeroMetric,
  SkillInsight,
  StudyHighlight,
  DailyGoalProgress,
  QuickActionLesson,
} from './selectors';
import type { FocusToken } from './constants';

const cardBaseSx = {
  backgroundColor: 'var(--bg-primary)',
  borderRadius: 'var(--border-radius-medium)',
  border: '1px solid var(--border-light)',
  boxShadow: 'var(--shadow-light)',
};

const chipBaseSx = {
  borderRadius: 'var(--border-radius-small)',
  fontWeight: 600,
};

const statusTokens: Record<string, { label: string; color: string; background: string }> = {
  not_started: { label: 'Ready', color: 'var(--accent-blue)', background: 'var(--accent-blue-bg)' },
  in_progress: { label: 'In progress', color: 'var(--accent-amber)', background: 'var(--accent-amber-bg)' },
  completed: { label: 'Completed', color: 'var(--accent-green)', background: 'var(--accent-green-bg)' },
  locked: { label: 'Locked', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)' },
  review: { label: 'Review', color: 'var(--accent-purple)', background: 'var(--accent-purple-bg)' },
};

export type PlanOverviewCardProps = {
  nextLesson?: PlanLesson;
  focusChips: Array<{ label: string; token: FocusToken }>;
  dailyGoal: DailyGoalProgress;
  summary: Array<{ label: string; value: string }>;
  lastLessonTitle: string;
  isOffline: boolean;
  onStartLesson: (lessonId: string, contentType: string) => void;
};

export const PlanOverviewCard: React.FC<PlanOverviewCardProps> = ({
  nextLesson,
  focusChips,
  dailyGoal,
  summary,
  lastLessonTitle,
  isOffline,
  onStartLesson,
}) => {
  return (
    <Card sx={{ ...cardBaseSx, borderRadius: 'var(--border-radius-large)', height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          <Typography variant="overline" sx={{ color: 'var(--text-tertiary)', letterSpacing: 1 }}>
            Up next
          </Typography>
          <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {nextLesson?.title ?? 'Continue learning'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {nextLesson?.summary ?? 'Choose a lesson to keep building momentum.'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
          {focusChips.map(({ label, token }) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{ ...chipBaseSx, backgroundColor: token.background, color: token.accent }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', letterSpacing: 0.5 }}>
            Daily progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={dailyGoal.percentage}
                sx={{
                  height: 8,
                  borderRadius: 'var(--border-radius-small)',
                  backgroundColor: 'var(--bg-tertiary)',
                  '& .MuiLinearProgress-bar': { backgroundColor: 'var(--accent-purple)' },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {dailyGoal.percentage}%
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
            {dailyGoal.current}/{dailyGoal.target} lessons completed today
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'var(--border-light)' }} />

        <Box sx={{ display: 'grid', gap: 'var(--spacing-3)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {summary.map((stat) => (
            <Box key={stat.label} sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', letterSpacing: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
            Last session: {lastLessonTitle}
          </Typography>
          <Button
            variant="contained"
            onClick={() => nextLesson && onStartLesson(nextLesson.id, nextLesson.contentType)}
            disabled={!nextLesson || isOffline}
            sx={{
              alignSelf: 'flex-start',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 'var(--border-radius-small)',
              px: 'var(--spacing-5)',
              py: 'var(--spacing-2)',
              background: 'var(--accent-purple)',
              '&:hover': { background: 'var(--accent-purple-light)' },
              '&.Mui-disabled': { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' },
            }}
          >
            {isOffline ? 'Offline mode' : 'Resume lesson'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export type MetricsSectionProps = {
  metrics: HeroMetric[];
};

export const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 'var(--spacing-4)',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
    }}
  >
    {metrics.map((metric) => (
      <Box
        key={metric.id}
        sx={{
          ...cardBaseSx,
          padding: 'var(--spacing-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-2)',
        }}
      >
        <Typography variant="overline" sx={{ color: 'var(--text-tertiary)', letterSpacing: 0.8 }}>
          {metric.label}
        </Typography>
        <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {metric.value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {metric.helper}
        </Typography>
      </Box>
    ))}
  </Box>
);

export type FocusJourneySectionProps = {
  lessons: PlanLesson[];
  onLessonClick: (lessonId: string, contentType: string) => void;
  isOffline: boolean;
};

export const FocusJourneySection: React.FC<FocusJourneySectionProps> = ({ lessons, onLessonClick, isOffline }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
    {lessons.map((lesson) => {
      const status = statusTokens[lesson.status] ?? statusTokens.not_started;
      return (
        <Box
          key={lesson.id}
          sx={{
            ...cardBaseSx,
            borderRadius: 'var(--border-radius-large)',
            padding: 'var(--spacing-5)',
            display: 'grid',
            gap: { xs: 'var(--spacing-3)', md: 'var(--spacing-5)' },
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Box
              aria-hidden
              sx={{
                width: 52,
                height: 52,
                borderRadius: 'var(--border-radius-medium)',
                border: `1px solid ${status.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
              }}
            >
              {lesson.icon}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {lesson.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                {lesson.summary}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                <Chip
                  label={lesson.focus}
                  size="small"
                  sx={{ ...chipBaseSx, backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                />
                <Chip
                  label={status.label}
                  size="small"
                  sx={{ ...chipBaseSx, backgroundColor: status.background, color: status.color }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', letterSpacing: 0.5 }}>
              Lesson details
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {lesson.estimatedTime} min • {lesson.difficulty}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', letterSpacing: 0.5 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={lesson.progress}
              sx={{
                height: 8,
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: 'var(--bg-tertiary)',
                '& .MuiLinearProgress-bar': { backgroundColor: status.color },
              }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => onLessonClick(lesson.id, lesson.contentType)}
              disabled={isOffline}
              sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start' }}
            >
              {isOffline ? 'Offline' : 'Open lesson'}
            </Button>
          </Box>
        </Box>
      );
    })}
  </Box>
);

export type QuickActionsSectionProps = {
  title: string;
  description: string;
  actions: QuickActionLesson[];
  onActionClick: (id: string, contentType: ContentType) => void;
  isOffline: boolean;
  renderMode?: 'quick-action' | 'lesson-card';
  showProgress?: boolean;
};

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  title,
  description,
  actions,
  onActionClick,
  isOffline,
  renderMode = 'quick-action',
  showProgress,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
    <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
      {description}
    </Typography>
    <QuickActionsGrid
      actions={actions}
      onActionClick={onActionClick}
      disabled={isOffline}
      renderMode={renderMode}
      showProgress={showProgress}
      sx={{ gap: 'var(--spacing-4)' }}
    />
  </Box>
);

export type SkillInsightsSectionProps = {
  insights: SkillInsight[];
};

export const SkillInsightsSection: React.FC<SkillInsightsSectionProps> = ({ insights }) => (
  <Box
    sx={{
      display: 'grid',
      gap: 'var(--spacing-4)',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
    }}
  >
    {insights.map((insight) => (
      <Box
        key={insight.id}
        sx={{
          ...cardBaseSx,
          backgroundColor: insight.background,
          padding: 'var(--spacing-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', fontWeight: 600, display: 'flex', gap: 'var(--spacing-2)' }}>
            <span role="img" aria-hidden>
              {insight.icon}
            </span>
            {insight.label}
          </Typography>
          <Typography variant="body2" sx={{ color: insight.accent, fontWeight: 600 }}>
            {insight.progress}%
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
          {insight.helper}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={insight.progress}
          sx={{
            height: 8,
            borderRadius: 'var(--border-radius-small)',
            backgroundColor: 'var(--bg-tertiary)',
            '& .MuiLinearProgress-bar': { backgroundColor: insight.accent },
          }}
        />
      </Box>
    ))}
  </Box>
);

export type TutorAndGuidanceProps = {
  userName?: string;
  progressPercentage: number;
  onStartTutor: () => void;
  isOffline: boolean;
  highlights: StudyHighlight[];
};

export const TutorAndGuidance: React.FC<TutorAndGuidanceProps> = ({
  userName,
  progressPercentage,
  onStartTutor,
  isOffline,
  highlights,
}) => (
  <Box
    sx={{
      display: 'grid',
      gap: 'var(--spacing-4)',
      gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) minmax(0, 1fr)' },
    }}
  >
    <AITutorCard
      userName={userName}
      progressPercentage={progressPercentage}
      onInteractionStart={onStartTutor}
      isOffline={isOffline}
      sx={{ height: '100%' }}
    />

    <Card sx={{ ...cardBaseSx, borderRadius: 'var(--border-radius-large)' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'var(--text-tertiary)', letterSpacing: 1 }}>
            Study guidance
          </Typography>
          <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            Micro-actions to try today
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 'var(--spacing-1)' }}>
            Reinforce what you learn with quick, focused routines.
          </Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {highlights.map((highlight) => (
            <Box
              key={highlight.id}
              component="li"
              sx={{
                display: 'flex',
                gap: 'var(--spacing-3)',
                alignItems: 'flex-start',
                backgroundColor: highlight.background,
                borderRadius: 'var(--border-radius-medium)',
                border: '1px solid var(--border-light)',
                padding: 'var(--spacing-4)',
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-primary)',
                  border: `1px solid ${highlight.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                {highlight.icon}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {highlight.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  {highlight.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  </Box>
);
