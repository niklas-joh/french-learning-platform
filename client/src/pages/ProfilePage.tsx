import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Your Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User settings and preferences are coming soon!
      </Typography>
    </Box>
  );
};

export default ProfilePage;
