import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ProgressAnalytics from '../ProgressAnalytics';

const MyProgressOverviewSectionWrapper: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
      {/* The ProgressAnalytics component already includes a title "My Progress".
          If a different section title like "My Progress Overview" is preferred for the dashboard,
          it can be added here using <Typography variant="h5" component="h2" gutterBottom>.
          For now, we rely on the title within ProgressAnalytics.
      */}
      <ProgressAnalytics />
    </Paper>
  );
};

export default MyProgressOverviewSectionWrapper;
