import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Icon } from '@mui/material';
import { motion } from 'framer-motion';
import { Lock, PlayCircleOutline, CheckCircle, HourglassTop } from '@mui/icons-material';
import { ClientLesson, LessonStatus } from '../../types/LearningPath';

interface LessonNodeProps {
  lesson: ClientLesson;
}

const statusMap = {
  locked: {
    icon: Lock,
    color: 'text.disabled',
    bgColor: 'grey.200',
    borderColor: 'grey.300',
  },
  available: {
    icon: PlayCircleOutline,
    color: 'var(--french-blue)',
    bgColor: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'var(--french-blue)',
  },
  in_progress: {
    icon: HourglassTop,
    color: 'var(--french-purple)',
    bgColor: 'rgba(118, 75, 162, 0.1)',
    borderColor: 'var(--french-purple)',
  },
  completed: {
    icon: CheckCircle,
    color: 'success.main',
    bgColor: 'rgba(46, 125, 50, 0.1)',
    borderColor: 'success.main',
  },
};

const LessonNode: React.FC<LessonNodeProps> = ({ lesson }) => {
  const navigate = useNavigate();
  const statusDetails = statusMap[lesson.status] || statusMap.locked;
  const { icon: StatusIcon, color, bgColor, borderColor } = statusDetails;

  const handleLessonClick = () => {
    if (lesson.status !== 'locked') {
      navigate(`/lessons/${lesson.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: lesson.status !== 'locked' ? 1.05 : 1 }}
      whileTap={{ scale: lesson.status !== 'locked' ? 0.98 : 1 }}
    >
      <Box
        onClick={handleLessonClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          my: 1,
          borderRadius: 'var(--border-radius-medium)',
          cursor: lesson.status === 'locked' ? 'not-allowed' : 'pointer',
          transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
          backgroundColor: lesson.status === 'locked' ? 'grey.100' : 'rgba(255, 255, 255, 0.6)',
          border: '1px solid',
          borderColor: lesson.status === 'locked' ? 'grey.300' : 'var(--glass-border)',
          opacity: lesson.status === 'locked' ? 0.7 : 1,
          '&:hover': {
            backgroundColor: lesson.status !== 'locked' ? 'rgba(255, 255, 255, 1)' : 'grey.100',
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
            color: color,
            mr: 2,
          }}
        >
          <StatusIcon />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: lesson.status === 'locked' ? 'text.disabled' : 'text.primary',
            }}
          >
            {lesson.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lesson.estimatedTime} min · {lesson.type}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default React.memo(LessonNode);
