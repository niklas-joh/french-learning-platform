import React from 'react';
import { Container, Box } from '@mui/material';
import Dashboard from '../components/Dashboard'; // Import the new Dashboard component

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Dashboard /> {/* Render the Dashboard component */}
      </Box>
    </Container>
  );
};

export default DashboardPage;
