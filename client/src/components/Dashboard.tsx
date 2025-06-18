import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, Box, List, ListItemButton, ListItemText, Divider } from '@mui/material'; // Changed ListItem to ListItemButton
import { getUserProfile, UserProfileData } from '../services/authService';
import { getTopics, Topic } from '../services/contentService'; // Changed to getTopics and Topic
// import Quiz, { QuizData } from './Quiz'; // Quiz component might be used later, but not for displaying the list

// Use UserProfileData from authService to ensure consistency
// If UserProfileData needs optional email, it should be defined there.
// For now, assuming email is always present or UserProfileData handles optionality.

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[] | null>(null); // Changed quizData to topics

  useEffect(() => {
    const fetchDashboardData = async () => { // Renamed for clarity
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setUser(userData);
        const fetchedTopics = await getTopics(); // Call getTopics
        setTopics(fetchedTopics); // Set topics state
      } catch (err: any) { // Explicitly type err as any or a more specific error type
        console.error("Failed to fetch dashboard data:", err); // Updated error message
        const message = err.message || 'Failed to load user information. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData(); // Corrected function call
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
          Welcome, {user?.firstName || user?.email || 'User'}! {/* Updated to use firstName or email */}
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is your personal dashboard. Here you will find your progress, available quizzes, and more.
        </Typography>
        
        {topics && topics.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Available Quizzes (Topics)
            </Typography>
            <List>
              {topics.map((topic, index) => (
                <React.Fragment key={topic.id}>
                  <ListItemButton onClick={() => console.log(`Topic ${topic.id} clicked`)}> {/* Changed ListItem to ListItemButton and removed button prop */}
                    <ListItemText 
                      primary={topic.name} 
                      secondary={topic.description || 'No description available.'} 
                    />
                  </ListItemButton>
                  {index < topics.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
        {topics && topics.length === 0 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No quizzes available at the moment. Please check back later.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
