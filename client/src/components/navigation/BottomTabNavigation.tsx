import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  FitnessCenter as PracticeIcon,
  Timeline as ProgressIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const navigationItems = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Lessons', icon: <SchoolIcon />, path: '/lessons' },
  { label: 'Practice', icon: <PracticeIcon />, path: '/practice' },
  { label: 'Progress', icon: <ProgressIcon />, path: '/progress' },
  { label: 'Profile', icon: <PersonIcon />, path: '/profile' }
];

const BottomTabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
  
  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    navigate(navigationItems[newValue].path);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        maxWidth: '430px',
        margin: '0 auto',
        borderRadius: '20px 20px 0 0',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur)',
        borderTop: '1px solid var(--glass-border)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)'
      }} 
      elevation={0}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={handleNavigation}
        showLabels
        sx={{
          background: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: '#8e8e93',
            '&.Mui-selected': {
              color: 'var(--french-blue)',
            }
          }
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              minWidth: 'auto',
              padding: '6px 12px',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 500
              }
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomTabNavigation;
