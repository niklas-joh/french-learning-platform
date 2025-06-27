import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import BottomTabNavigation from '../navigation/BottomTabNavigation'; // This will be created next

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'var(--gradient-primary)',
        paddingBottom: '80px', // Space for bottom navigation
        position: 'relative'
      }}
    >
      <Box
        sx={{
          maxWidth: '430px', // Mobile-first max width
          margin: '0 auto',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Outlet />
        <BottomTabNavigation />
      </Box>
    </Box>
  );
};

export default MainLayout;
