# Task 1.4: Create Main Layout Component

Create the following file with the specified content:

**File**: `client/src/components/layout/MainLayout.tsx`
```typescript
import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import BottomTabNavigation from '../navigation/BottomTabNavigation';

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
