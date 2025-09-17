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
          // Responsive max width using design system layout constraints
          maxWidth: {
            xs: 'var(--layout-max-width-mobile)',      // 430px on mobile
            sm: 'var(--layout-max-width-tablet)',       // 100% on small tablets (640px+)
            md: 'var(--layout-max-width-tablet)',       // 100% on tablets (768px+)
            lg: 'var(--layout-max-width-desktop)',      // 100% on laptops (1024px+)
            xl: 'var(--layout-max-width-large-desktop)' // 100% on desktops (1280px+)
          },
          margin: '0 auto',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, var(--background-secondary) 0%, var(--accent-blue-bg) 100%)',
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
