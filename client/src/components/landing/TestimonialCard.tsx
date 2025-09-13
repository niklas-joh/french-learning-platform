import React from 'react';
import {
  Card,
  Typography,
  Box,
  Avatar,
  useTheme,
  Fade,
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  index: number;
}

/**
 * Reusable testimonial card component
 * Uses existing glass-card utility and consistent styling patterns
 */
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  rating,
  avatar,
  index,
}) => {
  const theme = useTheme();

  return (
    <Fade in timeout={800 + index * 200}>
      <Card
        className="glass-card"
        sx={{
          p: 4,
          height: '100%',
          borderRadius: 'var(--border-radius-medium)',
          boxShadow: 'var(--shadow-light)',
          transition: 'var(--transition-normal)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 'var(--shadow-medium)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={avatar}
            sx={{ width: 56, height: 56, mr: 2 }}
          >
            {name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mb: 2 }}>
          {[...Array(rating)].map((_, i) => (
            <Star key={i} sx={{ color: '#F59E0B', fontSize: 20 }} />
          ))}
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          "{content}"
        </Typography>
      </Card>
    </Fade>
  );
};

export default TestimonialCard;
