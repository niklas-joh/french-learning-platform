import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// TODO: This is a placeholder component. It needs to be connected to a
// new service and hook to fetch the specific content for the given lessonId.
// e.g., useLessonContent(lessonId)

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  // Placeholder state
  const isLoading = false;
  const error = null;
  const lessonTitle = `Lesson ${lessonId}`; // Replace with actual data

  const handleBack = () => {
    navigate('/lessons');
  };

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
        sx={{ p: 3, minHeight: '70vh' }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Content for Lesson {lessonId}
            </Typography>
            <Typography>
              This is where the actual lesson content (e.g., vocabulary, grammar explanations,
              interactive exercises) will be rendered based on the lesson type.
            </Typography>
            {/* TODO: Implement content rendering components based on lesson.type */}
            {/* e.g., <VocabularyLesson content={lesson.content} /> */}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default LessonPage;
