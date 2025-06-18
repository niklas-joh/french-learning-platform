import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, Box } from '@mui/material';
import { getUserProfile, UserProfileData } from '../services/authService';
import { getTopics, getContentForTopic } from '../services/contentService';
import Quiz, { QuizData } from './Quiz';
import { ApiContentItem, mapApiContentToQuizData } from '../utils/data-mappers';

// Use UserProfileData from authService to ensure consistency
// If UserProfileData needs optional email, it should be defined there.
// For now, assuming email is always present or UserProfileData handles optionality.
// type UserProfile = UserProfileData; // Alias if preferred, or use UserProfileData directly

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Array<{ id: number; name: string }>>([]);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setUser(userData);
        const topicList = await getTopics();
        setTopics(topicList);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        const message = err.message || 'Failed to load user information. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleTopicClick = async (topicId: number) => {
    try {
      setSelectedTopicId(topicId);
      setLoading(true);
      const content: ApiContentItem[] = await getContentForTopic(topicId);
      const quizzesOnly = content.filter(
        (item) => item.type === 'multiple-choice' || item.type === 'quiz'
      );
      const mapped = quizzesOnly.map(mapApiContentToQuizData);
      setQuizzes(mapped);
    } catch (err: any) {
      console.error('Error fetching topic content:', err);
      setError('Failed to load quizzes for this topic.');
    } finally {
      setLoading(false);
    }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.username || 'User'}!
        </Typography>
        <Typography variant="body1">
          This is your personal dashboard. Here you will find your progress, available quizzes, and more.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {topics.map((topic) => (
            <Typography
              key={topic.id}
              variant="h6"
              sx={{ cursor: 'pointer', mb: 1 }}
              onClick={() => handleTopicClick(topic.id)}
            >
              {topic.name}
            </Typography>
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          {selectedTopicId && quizzes.length === 0 && (
            <Typography>No quizzes found for this topic.</Typography>
          )}
          {quizzes.map((quiz) => (
            <Box key={quiz.id} sx={{ mb: 3 }}>
              <Quiz quizData={quiz} />
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
