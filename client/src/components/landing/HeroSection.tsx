import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { ArrowForward, PlayArrow } from '@mui/icons-material';

/**
 * Hero section for the landing page with compelling AI-focused messaging
 * Uses existing design tokens and animation patterns
 */
const HeroSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 12,
        pb: 8,
        background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Animation Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 25% 25%, var(--french-blue) 0%, transparent 50%), 
            radial-gradient(circle at 75% 75%, var(--french-purple) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="🚀 Powered by Advanced AI"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--french-blue)',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 800,
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 50%, var(--french-blue) 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
              }}
            >
              Master French with
              <br />
              <Box component="span" sx={{ position: 'relative' }}>
                AI-Powered Learning
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--border-radius-small)',
                  }}
                />
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Experience the future of language learning with personalized AI tutoring, 
              dynamic content generation, and accelerated progress tracking.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-medium)',
                  transition: 'var(--transition-normal)',
                  '&:hover': {
                    boxShadow: 'var(--shadow-heavy)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Start Learning Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                  color: 'var(--french-blue)',
                  transition: 'var(--transition-normal)',
                  '&:hover': {
                    borderColor: 'var(--french-blue)',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  },
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default HeroSection;
