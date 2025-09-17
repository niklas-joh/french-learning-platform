import React, { useCallback, useMemo } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { AIDashboardLayout, AIEnhancedHeader } from '../components/ai-dashboard/AIDashboardLayout';
import { DashboardSkeleton } from '../components/ai-dashboard/LoadingStates';
import { useOfflineDetection } from '../hooks/useOfflineDetection';
import { useAIDashboard } from '../hooks/useAIDashboard';
import type { ContentType } from '../config/aiDashboardConfig';
import {
  resolveActivePlan,
  selectFocusAreas,
  buildPlanLessons,
  selectNextLesson,
  calculateDailyGoal,
  calculatePlanConfidence,
  buildHeroMetrics,
  buildPlanSummary,
  buildSkillInsights,
  buildStudyGuidance,
  mapQuickActions,
  mapRecommendationsToLessons,
  getUserSnapshot,
  getFocusToken,
} from './home/selectors';
import {
  PlanOverviewCard,
  MetricsSection,
  FocusJourneySection,
  QuickActionsSection,
  SkillInsightsSection,
  TutorAndGuidance,
} from './home/components';

import '../styles/design-tokens.css';

const HomePage: React.FC = () => {
  const { isOffline } = useOfflineDetection();
  const {
    dailyPlan,
    recommendations,
    isLoading,
    error,
    clearError,
  } = useAIDashboard();

  const activePlan = useMemo(() => resolveActivePlan(dailyPlan), [dailyPlan]);
  const focusAreas = useMemo(() => selectFocusAreas(activePlan), [activePlan]);
  const planLessons = useMemo(() => buildPlanLessons(activePlan, focusAreas), [activePlan, focusAreas]);
  const nextLesson = useMemo(() => selectNextLesson(planLessons), [planLessons]);

  const snapshot = useMemo(() => getUserSnapshot(), []);
  const planConfidence = useMemo(() => calculatePlanConfidence(activePlan), [activePlan]);
  const dailyGoal = useMemo(() => calculateDailyGoal(snapshot), [snapshot]);
  const heroMetrics = useMemo(() => buildHeroMetrics(snapshot, planConfidence), [snapshot, planConfidence]);
  const planSummary = useMemo(
    () => buildPlanSummary(snapshot, activePlan, planLessons, planConfidence),
    [snapshot, activePlan, planLessons, planConfidence],
  );
  const skillInsights = useMemo(() => buildSkillInsights(focusAreas), [focusAreas]);
  const studyGuidance = useMemo(() => buildStudyGuidance(focusAreas), [focusAreas]);
  const quickActions = useMemo(() => mapQuickActions(isOffline), [isOffline]);
  const recommendedLessons = useMemo(
    () => mapRecommendationsToLessons(recommendations, isOffline),
    [recommendations, isOffline],
  );
  const focusChips = useMemo(
    () => focusAreas.slice(0, 3).map((label) => ({ label, token: getFocusToken(label) })),
    [focusAreas],
  );

  const showSkeleton = isLoading && planLessons.length === 0 && recommendedLessons.length === 0;

  const handleQuickAction = useCallback((actionId: string, contentType: ContentType) => {
    if (isOffline) {
      return;
    }

    console.log('[Dashboard] Quick action selected', { actionId, contentType });
  }, [isOffline]);

  const handlePlanLesson = useCallback((lessonId: string, contentType: string) => {
    if (isOffline) {
      return;
    }

    console.log('[Dashboard] Plan lesson selected', { lessonId, contentType });
  }, [isOffline]);

  const handleTutorStart = useCallback(() => {
    if (isOffline) {
      return;
    }

    console.log('[Dashboard] Start AI tutor session');
  }, [isOffline]);

  if (showSkeleton) {
    return <DashboardSkeleton />;
  }

  return (
    <AIDashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 'var(--spacing-6)', md: 'var(--spacing-8)' } }}>
        <Box
          component="section"
          sx={{ display: 'grid', gap: 'var(--spacing-6)', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}
        >
          <AIEnhancedHeader
            userName={snapshot.userName}
            progressPercentage={snapshot.progressPercentage}
            currentStreak={snapshot.streak}
            sx={{
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          />

          <PlanOverviewCard
            nextLesson={nextLesson}
            focusChips={focusChips}
            dailyGoal={dailyGoal}
            summary={planSummary}
            lastLessonTitle={snapshot.lastLessonTitle}
            isOffline={isOffline}
            onStartLesson={handlePlanLesson}
          />
        </Box>

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            Today at a glance
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Track your momentum and stay aligned with your plan.
          </Typography>
          <MetricsSection metrics={heroMetrics} />
        </Box>

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            Today&apos;s focus journey
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Move through the curated lessons to balance conversation, listening, and grammar.
          </Typography>
          <FocusJourneySection
            lessons={planLessons}
            onLessonClick={handlePlanLesson}
            isOffline={isOffline}
          />
        </Box>

        <QuickActionsSection
          title="Quick practice boosts"
          description="Need a fast refresher? Jump into a focused activity that fits your schedule."
          actions={quickActions}
          onActionClick={handleQuickAction}
          isOffline={isOffline}
        />

        <QuickActionsSection
          title="Recommended for you"
          description="AI-curated lessons crafted from your progress and preferred focus areas."
          actions={recommendedLessons}
          onActionClick={handleQuickAction}
          isOffline={isOffline}
          renderMode="lesson-card"
          showProgress={recommendedLessons.some((lesson) => typeof lesson.progress === 'number')}
        />

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            Skill insights
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            Visualise how your skills are evolving week over week.
          </Typography>
          <SkillInsightsSection insights={skillInsights} />
        </Box>

        <TutorAndGuidance
          userName={snapshot.userName}
          progressPercentage={snapshot.progressPercentage}
          onStartTutor={handleTutorStart}
          isOffline={isOffline}
          highlights={studyGuidance}
        />
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </AIDashboardLayout>
  );
};

export default HomePage;
