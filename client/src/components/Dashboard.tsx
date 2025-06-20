import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, Box, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { getUserProfile, UserProfileData } from '../services/authService';
import { getTopics, getContentForTopic, getAssignedContent } from '../services/contentService';
import { Topic } from '../types/Topic';
import Quiz, { QuizData } from './Quiz';
import { ApiContentItem, mapApiContentToQuizData } from '../utils/data-mappers';
import AssignedContentList from './AssignedContentList';
import { UserContentAssignmentWithContent } from '../types/Assignment';
import ProgressAnalytics from './ProgressAnalytics';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<UserContentAssignmentWithContent[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setUser(userData);
        const topicList = await getTopics();
        setTopics(topicList);
        const assignedContent = await getAssignedContent();
        setAssignments(assignedContent);
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
      console.log('Raw content from API:', content);

      const quizzesOnly = content.filter(
        (item) => item.type.trim().toLowerCase() === 'multiple_choice' || item.type.trim().toLowerCase() === 'quiz'
      );
      console.log('Filtered quizzes:', quizzesOnly);

      const mapped = quizzesOnly.map(mapApiContentToQuizData);
      console.log('Mapped quiz data:', mapped);
      
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
          Welcome, {user?.firstName || user?.email || 'User'}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is your personal dashboard. Here you will find your progress, available quizzes, and more.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <ProgressAnalytics />
        </Box>
        <Box sx={{ mt: 4 }}>
          <AssignedContentList assignments={assignments} />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Explore Topics
          </Typography>
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
