import React, { useState, useEffect } from 'react';
import { getUserProgress } from '../services/userService';
import { UserOverallProgress } from '../types/Progress';
import { Card, CardContent, Typography, Box, LinearProgress, CircularProgress, Alert, Paper } from '@mui/material';

const ProgressAnalytics: React.FC = () => {
  const [progress, setProgress] = useState<UserOverallProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getUserProgress();
        setProgress(data);
        setError(null);
      } catch (err) {
        setError('Failed to load progress data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          My Progress
        </Typography>
        {!progress || (progress.topicProgress.length === 0 && progress.assignedContentProgress.totalCount === 0) ? (
          <Typography variant="body1" color="text.secondary">
            No progress data available yet. Complete some exercises to see your progress!
          </Typography>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              {/* Assigned Content Progress */}
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Assigned Content</Typography>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle1" component="span" fontWeight="medium">
                        Overall Completion
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`${progress.assignedContentProgress.completedCount} / ${progress.assignedContentProgress.totalCount} (${progress.assignedContentProgress.percentage}%)`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress.assignedContentProgress.percentage}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                </Paper>
              </Box>

              {/* Journeys Placeholder */}
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" gutterBottom>Learning Journeys</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Custom learning paths are coming soon!
                  </Typography>
                  {/* TODO: Implement journey progress visualization */}
                </Paper>
              </Box>
            </Box>

            {/* Topic Progress */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Progress by Topic</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                {progress.topicProgress.map((item) => (
                  <Box key={item.topicId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle1" component="span" fontWeight="medium">
                        {item.topicName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`${item.completedCount} / ${item.totalCount} (${item.percentage}%)`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressAnalytics;
