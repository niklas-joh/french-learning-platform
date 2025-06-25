import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, Box } from '@mui/material';
import { logout } from '../services/authService';
import { getTopics, getAssignedContent } from '../services/contentService';
import { getCurrentUser } from '../services/userService';
import { Topic } from '../types/Topic';
import { User } from '../types/User';

import AssignedContentList from './AssignedContentList';
import { UserContentAssignmentWithContent } from '../types/Assignment';
import ProgressAnalytics from './ProgressAnalytics';
import ExploreTopics from './ExploreTopics';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [assignments, setAssignments] = useState<UserContentAssignmentWithContent[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        const topicList = await getTopics();
        setTopics(topicList);
        const assignedContent = await getAssignedContent();
        // console.log('Dashboard - Fetched Assigned Content:', JSON.stringify(assignedContent, null, 2)); // Log removed
        setAssignments(assignedContent);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        const message = err.message || 'Failed to load user information. Please try again later.';
        if (message.toLowerCase().includes('user not found')) {
          logout();
          window.location.reload();
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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
          Welcome, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is your personal dashboard. Here you will find your progress, available quizzes, and more.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <ProgressAnalytics />
        </Box>
        <Box sx={{ mt: 4 }}>
          {/* {console.log('Dashboard - Passing to AssignedContentList:', JSON.stringify(assignments, null, 2))} // Log removed */}
          <AssignedContentList assignments={assignments} limit={5} showIncompleteOnly />
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Explore Topics
          </Typography>
          <ExploreTopics topics={topics} />
        </Box>
        {/* Topic content preview has been removed in favor of dedicated pages */}
      </Paper>
    </Container>
  );
};

export default Dashboard;
