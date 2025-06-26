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
// import HeaderSection from './dashboard_sections/HeaderSection'; // Removed
import StartLearningNowSection from './dashboard_sections/StartLearningNowSection';
import MyAssignmentsSection from './dashboard_sections/MyAssignmentsSection';
import LearningJourneysSection from './dashboard_sections/LearningJourneysSection';
import ExploreTopicsSectionWrapper from './dashboard_sections/ExploreTopicsSectionWrapper';

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
      {/* 
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is your personal dashboard. Here you will find your progress, available quizzes, and more.
        </Typography>
      */}

      {/* Phase 2: New Section Components will be integrated here */}
      
      {/* HeaderSection user={user} /> // Removed as functionality moved to App.tsx AppBar */}

      {/* 1. StartLearningNowSection (was 2) */}
      <StartLearningNowSection assignments={assignments} />

      {/* 3. MyAssignmentsSection */}
      <MyAssignmentsSection assignments={assignments} />

      {/* 4. LearningJourneysSection */}
      <LearningJourneysSection />

      {/* 5. ExploreTopicsSectionWrapper */}
      <ExploreTopicsSectionWrapper topics={topics} />

      {/* 6. MyProgressOverviewSectionWrapper */}
      {/* <MyProgressOverviewSectionWrapper /> */}
      <Box sx={{ mb: 3, p: 2, border: '1px dashed grey' }}> {/* Placeholder for MyProgressOverviewSectionWrapper */}
        <Typography variant="h5">Placeholder: My Progress Overview Section</Typography>
        <Typography>ProgressAnalytics component will be wrapped here.</Typography>
        {/* <ProgressAnalytics /> */}
      </Box>

    </Container>
  );
};

export default Dashboard;
