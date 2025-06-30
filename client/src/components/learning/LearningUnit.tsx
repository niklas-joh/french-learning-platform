import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { ClientLearningUnit } from '../../types/LearningPath';
import LessonNode from './LessonNode';

interface LearningUnitProps {
  unit: ClientLearningUnit;
}

const LearningUnit: React.FC<LearningUnitProps> = ({ unit }) => {
  return (
    <Box
      className="glass-card"
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 4,
        position: 'relative',
        overflow: 'visible', // Allow connector to be visible
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {unit.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {unit.description}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ position: 'relative' }}>
        {/* This is the visual path connector line */}
        <Box
          sx={{
            position: 'absolute',
            left: '35px', // Aligns with the center of the lesson node icon
            top: '20px',
            bottom: '20px',
            width: '2px',
            backgroundColor: 'grey.200',
            zIndex: 0,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {unit.lessons.map((lesson) => (
            <LessonNode key={lesson.id} lesson={lesson} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(LearningUnit);
