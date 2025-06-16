import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, Box } from '@mui/material';
import { getUserProfile, UserProfileData } from '../services/authService';
import { fetchSampleQuiz } from '../services/contentService';
import Quiz, { QuizData } from './Quiz';

// Use UserProfileData from authService to ensure consistency
// If UserProfileData needs optional email, it should be defined there.
// For now, assuming email is always present or UserProfileData handles optionality.
// type UserProfile = UserProfileData; // Alias if preferred, or use UserProfileData directly

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setUser(userData);
        const quiz = await fetchSampleQuiz();
        setQuizData(quiz);
      } catch (err: any) { // Explicitly type err as any or a more specific error type
        console.error("Failed to fetch user data:", err);
        const message = err.message || 'Failed to load user information. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        {quizData && (
          <Box sx={{ mt: 4 }}>
            <Quiz quizData={quizData[0]} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
