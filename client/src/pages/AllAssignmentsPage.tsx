import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { getAssignedContent } from '../services/contentService';
import { UserContentAssignmentWithContent } from '../types/Assignment';
import AssignedContentList from '../components/AssignedContentList';

const AllAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<UserContentAssignmentWithContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const allAssignments = await getAssignedContent();
        // TODO: Filter for incomplete assignments once status is available
        setAssignments(allAssignments);
        setError(null);
      } catch (err) {
        setError('Failed to load assigned content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Assigned Content
        </Typography>
        <AssignedContentList assignments={assignments} />
      </Paper>
    </Container>
  );
};

export default AllAssignmentsPage;
