import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import { startLesson, completeLesson } from '../services/learningPathService';
import { useLearningPath } from '../hooks/useLearningPath';
import DynamicLessonContent from '../components/learning/content/DynamicLessonContent';

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    isLoading: isPathLoading,
    error: pathError,
    refetch: refreshLearningPath,
    findLessonById,
  } = useLearningPath(1); // Assuming pathId 1 for now

  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const lesson = lessonId ? findLessonById(parseInt(lessonId, 10)) : undefined;

  useEffect(() => {
    if (lesson) {
      setIsCompleted(lesson.status === 'completed');
    }
    if (lessonId && lesson?.status !== 'completed') {
      startLesson(parseInt(lessonId, 10));
    }
  }, [lessonId, lesson]);

  const handleCompleteLesson = async () => {
    if (!lessonId) return;

    setIsCompleting(true);
    setCompletionError(null);
    try {
      await completeLesson(parseInt(lessonId, 10));
      setIsCompleted(true); // Immediately update UI
      await refreshLearningPath(); // Refresh data in the background
      setTimeout(() => navigate('/lessons'), 1000); // Navigate after a short delay
    } catch (err) {
      setCompletionError('Failed to mark lesson as complete. Please try again.');
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleBack = () => {
    navigate('/lessons');
  };

  const isLoading = isPathLoading || !lesson;
  const error = pathError;
  const lessonTitle = lesson ? lesson.title : `Lesson ${lessonId}`;

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ArrowBack
          onClick={handleBack}
          sx={{ cursor: 'pointer', mr: 1 }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isLoading ? 'Loading Lesson...' : lessonTitle}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        className="glass-card"
        sx={{ p: 3, minHeight: '70vh', display: 'flex', flexDirection: 'column' }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : lesson ? (
          <DynamicLessonContent lesson={lesson} />
        ) : (
          <Alert severity="warning">Lesson not found.</Alert>
        )}

        {lesson && !isCompleted && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CheckCircle />}
              onClick={handleCompleteLesson}
              disabled={isCompleting}
            >
              {isCompleting ? 'Completing...' : 'Complete Lesson'}
            </Button>
          </Box>
        )}
        {isCompleted && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Lesson completed! Redirecting...
          </Alert>
        )}
        {completionError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {completionError}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default LessonPage;
