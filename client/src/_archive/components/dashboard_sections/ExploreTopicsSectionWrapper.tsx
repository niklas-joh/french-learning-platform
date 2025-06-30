import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ExploreTopics from '../ExploreTopics';
import { Topic } from '../../types/Topic';

interface ExploreTopicsSectionWrapperProps {
  topics: Topic[];
}

const ExploreTopicsSectionWrapper: React.FC<ExploreTopicsSectionWrapperProps> = ({ topics }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
        Explore Topics
      </Typography>
      <ExploreTopics topics={topics} />
    </Paper>
  );
};

export default ExploreTopicsSectionWrapper;
