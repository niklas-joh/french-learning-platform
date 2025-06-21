import React, { useEffect, useState } from 'react';
import { getAdminAnalyticsSummary, AnalyticsSummary } from '../services/adminService';
import TopicManager from '../components/admin/TopicManager';
import ContentManager from '../components/admin/ContentManager';
import { Container, Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAdminAnalyticsSummary();
        setData(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch admin data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!data) return <Alert severity="info" sx={{ m: 2 }}>No admin data available.</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper elevation={3} sx={{ p: 2, flexGrow: 1, minWidth: '300px' }}>
          <Typography variant="h6">Total Users</Typography>
          <Typography variant="h4">{data.totalUsers ?? 'N/A'}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flexGrow: 1, minWidth: '300px' }}>
          <Typography variant="h6">Users by Role</Typography>
          {data.usersByRole && data.usersByRole.length > 0 ? (
            <ul>
              {data.usersByRole.map((roleInfo: { role: string; count: number }) => (
                <li key={roleInfo.role}>
                  <Typography>{roleInfo.role}: {roleInfo.count}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <p>No role data available.</p>
          )}
        </Paper>
        <Paper elevation={3} sx={{ p: 2, flexGrow: 1, minWidth: '300px' }}>
          <Typography variant="h6">Total Content Items</Typography>
          <Typography variant="h4">{data.totalContentItems ?? 'N/A'}</Typography>
        </Paper>
      </Box>

      <TopicManager />
      <ContentManager />
    </Container>
  );
};

export default AdminDashboardPage;
