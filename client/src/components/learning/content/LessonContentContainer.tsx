import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface LessonContentContainerProps {
  title: string;
  children: React.ReactNode;
}

const LessonContentContainer: React.FC<LessonContentContainerProps> = ({ title, children }) => {
  return (
    <Box 
      sx={{ 
        p: 2.5, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'var(--border-radius-medium)', 
        my: 2.5 
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        {children}
      </Box>
    </Box>
  );
};

export default LessonContentContainer;
