import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ProgressAnalytics from '../ProgressAnalytics';

const MyProgressOverviewSectionWrapper: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
      {/* TODO: (REFACTOR_TO_GENERIC_SECTION) Consider refactoring to use a generic DashboardSection component as outlined in future_implementation_considerations.md (item 1.5). */}
      <Typography variant="h5" component="h2" gutterBottom>
        My Progress Overview
      </Typography>
      <ProgressAnalytics />
    </Paper>
  );
};

export default MyProgressOverviewSectionWrapper;
