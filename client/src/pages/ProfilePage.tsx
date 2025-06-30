import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Profile
      </Typography>
      <Typography variant="body1">
        Your profile settings will be here.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
