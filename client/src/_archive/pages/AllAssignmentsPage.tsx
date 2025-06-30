import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, CircularProgress, Alert, Paper, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getAssignedContent } from '../services/contentService';
import { UserContentAssignmentWithContent } from '../types/Assignment';
import AssignedContentList from '../components/AssignedContentList';

const AllAssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<UserContentAssignmentWithContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'completed', 'not-completed'
  const [topicFilter, setTopicFilter] = useState<string>('all'); // Placeholder
  const [journeyFilter, setJourneyFilter] = useState<string>('all'); // Placeholder

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const allAssignments = await getAssignedContent();
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

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleTopicFilterChange = (event: SelectChangeEvent<string>) => {
    setTopicFilter(event.target.value);
  };

  const handleJourneyFilterChange = (event: SelectChangeEvent<string>) => {
    setJourneyFilter(event.target.value);
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      // Status filter logic
      if (statusFilter === 'completed' && assignment.status !== 'completed') {
        return false;
      }
      if (statusFilter === 'not-completed' && assignment.status === 'completed') {
        return false;
      }
      // Placeholder for topic and journey filters
      // if (topicFilter !== 'all' /* && assignment.content.topicId !== topicFilter */) return false;
      // if (journeyFilter !== 'all' /* && assignment.content.journeyId !== journeyFilter */) return false;
      return true;
    });
  }, [assignments, statusFilter, topicFilter, journeyFilter]);

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

        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="not-completed">Not Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} disabled>
            <InputLabel id="topic-filter-label">Topic</InputLabel>
            <Select
              labelId="topic-filter-label"
              id="topic-filter"
              value={topicFilter}
              label="Topic"
              onChange={handleTopicFilterChange}
            >
              <MenuItem value="all">All Topics</MenuItem>
              {/* Placeholder options - these would be populated dynamically */}
              <MenuItem value="topic1" disabled>Topic Placeholder 1</MenuItem>
              <MenuItem value="topic2" disabled>Topic Placeholder 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }} disabled>
            <InputLabel id="journey-filter-label">Journey</InputLabel>
            <Select
              labelId="journey-filter-label"
              id="journey-filter"
              value={journeyFilter}
              label="Journey"
              onChange={handleJourneyFilterChange}
            >
              <MenuItem value="all">All Journeys</MenuItem>
              {/* Placeholder options */}
              <MenuItem value="journey1" disabled>Journey Placeholder 1</MenuItem>
              <MenuItem value="journey2" disabled>Journey Placeholder 2</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <AssignedContentList assignments={filteredAssignments} />
      </Paper>
    </Container>
  );
};

export default AllAssignmentsPage;
