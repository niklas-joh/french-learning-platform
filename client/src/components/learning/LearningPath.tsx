import React from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useLearningPath } from '../../hooks/useLearningPath';
import LearningUnit from './LearningUnit';
import { motion } from 'framer-motion';

interface LearningPathProps {
  pathId: number;
}

// TODO: For very long learning paths, this component should be optimized
// with a virtualization library like 'react-window' or 'react-virtual'
// to ensure high performance by only rendering the visible units.

const LearningPath: React.FC<LearningPathProps> = ({ pathId }) => {
  const { data, isLoading, error, refetch } = useLearningPath(pathId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={refetch}>
          Retry
        </Button>
      }>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return <Typography>No learning path data available.</Typography>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: 'var(--french-purple)' }}>
          {data.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {data.description}
        </Typography>

        {data.units.map((unit) => (
          <LearningUnit key={unit.id} unit={unit} />
        ))}
      </Box>
    </motion.div>
  );
};

export default LearningPath;
