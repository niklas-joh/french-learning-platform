import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Groups,
  EmojiEvents,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';

interface StatItem {
  number: string;
  label: string;
  icon: React.ReactElement;
}

/**
 * Statistics section showcasing platform achievements
 * Uses existing design tokens and animation patterns
 */
const StatsSection: React.FC = () => {
  const theme = useTheme();

  const stats: StatItem[] = [
    { number: '10K+', label: 'Active Learners', icon: <Groups /> },
    { number: '95%', label: 'Success Rate', icon: <EmojiEvents /> },
    { number: '3x', label: 'Faster Learning', icon: <TrendingUp /> },
    { number: '24/7', label: 'AI Tutor Access', icon: <Psychology /> },
  ];

  return (
    <Container maxWidth="lg">
      <Fade in timeout={1200}>
        <Box 
          sx={{ 
            mt: 4,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center'
          }}
        >
          {stats.map((stat, index) => (
            <Zoom in timeout={800 + index * 200} key={index}>
              <Box sx={{ textAlign: 'center', minWidth: { xs: '140px', sm: '160px' } }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    color: theme.palette.common.white,
                    mb: 2,
                    boxShadow: 'var(--shadow-light)',
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Zoom>
          ))}
        </Box>
      </Fade>
    </Container>
  );
};

export default StatsSection;
