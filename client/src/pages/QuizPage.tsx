import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, CircularProgress, Alert, Box } from '@mui/material';
import { getContentById } from '../services/contentService';
import { Content } from '../types/Content';
import Quiz from '../components/Quiz';

const QuizPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) {
        setError('Content ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contentData = await getContentById(contentId);
        setContent(contentData);
      } catch (err: any) {
        console.error('Failed to fetch content:', err);
        setError(err.message || 'Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const handleAnswer = (isCorrect: boolean) => {
    console.log('Answered correctly:', isCorrect);
    // Future implementation: update user progress
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Container>
    );
  }

  if (!content) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>No content found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box>
        <Quiz content={content} onAnswer={handleAnswer} />
      </Box>
    </Container>
  );
};

export default QuizPage;
