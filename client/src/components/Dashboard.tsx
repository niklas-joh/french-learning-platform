import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // TODO: Replace mock data with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        const mockUser: UserProfile = { id: '1', username: 'ExempleUtilisateur' }; // Mock user data
        setUser(mockUser);

      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError('Failed to load user information. Please try again later.');
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
      </Paper>
    </Container>
  );
};

export default Dashboard;
