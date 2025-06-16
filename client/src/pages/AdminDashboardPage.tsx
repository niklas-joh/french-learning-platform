import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Alert, CircularProgress, Grid, Card, CardContent, List, ListItem, ListItemText, Divider
} from '@mui/material';
// Removed apiClient import as we'll use the specific service
import { getAdminAnalyticsSummary, AnalyticsSummary } from '../services/adminService';

const AdminDashboardPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminAnalyticsSummary();
        setAnalyticsData(data);
      } catch (err: any) {
        console.error("Error fetching admin analytics:", err);
        setError(err.message || 'Failed to fetch admin analytics. Ensure you are logged in as admin and the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {loading && (
          <Grid container justifyContent="center" sx={{ marginY: 4 }}>
            <CircularProgress />
          </Grid>
        )}

        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

        {analyticsData && !loading && (
          <div style={{ marginTop: '16px' }}>
            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Users
                </Typography>
                <Typography variant="h3" component="div">
                  {analyticsData.totalUsers}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Content Items
                </Typography>
                <Typography variant="h3" component="div">
                  {analyticsData.totalContentItems}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  (Based on .json files in content/topics)
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Users by Role
                </Typography>
                <List dense>
                  {analyticsData.usersByRole.map((roleStat) => (
                    <React.Fragment key={roleStat.role}>
                      <ListItem>
                        <ListItemText
                          primary={roleStat.role.charAt(0).toUpperCase() + roleStat.role.slice(1)}
                          secondary={roleStat.count}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </div>
        )}
        {!loading && !analyticsData && !error && (
            <Typography variant="body1" sx={{marginTop: 2}}>
                No analytics data available.
            </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboardPage;
