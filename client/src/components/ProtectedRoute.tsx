import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Temporary development bypass - REMOVE AFTER TESTING
  const allowTestAccess = import.meta.env.DEV && window.location.search.includes('testing=true');

  if (allowTestAccess) {
    return <Outlet />;
  }

  if (isLoading) {
    // While checking for authentication, show a loading spinner
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If loading is finished and there's no user, redirect to the landing page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
