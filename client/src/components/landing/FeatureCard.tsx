import React from 'react';
import {
  Card,
  Typography,
  Box,
  useTheme,
  alpha,
  Zoom,
} from '@mui/material';

interface FeatureCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
  index: number;
}

/**
 * Reusable feature card component with glassmorphism effects
 * Uses existing glass-card utility and design tokens
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  index,
}) => {
  const theme = useTheme();

  return (
    <Zoom in timeout={600 + index * 100}>
      <Card
        className="glass-card"
        sx={{
          height: '100%',
          p: 3,
          border: `1px solid ${alpha(color, 0.1)}`,
          boxShadow: `0 8px 25px ${alpha(color, 0.1)}`,
          borderRadius: 'var(--border-radius-medium)',
          transition: 'var(--transition-normal)',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 16px 40px ${alpha(color, 0.2)}`,
            borderColor: alpha(color, 0.3),
          },
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 'var(--border-radius-medium)',
            background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.2)} 100%)`,
            color: color,
            mb: 3,
            fontSize: 40,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Card>
    </Zoom>
  );
};

export default FeatureCard;
