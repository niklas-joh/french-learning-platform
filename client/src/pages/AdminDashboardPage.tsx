import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Alert } from '@mui/material';
import apiClient from '../services/authService'; // Or your specific API client for admin endpoints

const AdminDashboardPage: React.FC = () => {
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Attempt to fetch data from the placeholder admin API endpoint
        const response = await apiClient.get('/admin/test'); // Assuming admin routes are under /api
        setAdminMessage(response.data.message || 'Successfully accessed admin area.');
      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch admin data. Ensure you are logged in as admin.');
      }
    };

    fetchAdminData();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        {adminMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{adminMessage}</Alert>}
        <Typography variant="body1">
          Welcome to the admin control panel. More features will be added here.
        </Typography>
        {/* Placeholder for future admin functionalities */}
      </Paper>
    </Container>
  );
};

export default AdminDashboardPage;
