import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

/**
 * Call-to-action section with gradient background
 * Uses existing design tokens and consistent styling patterns
 */
const CTASection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 12,
        background: 'var(--gradient-primary)',
        color: theme.palette.common.white,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 25% 25%, ${theme.palette.common.white} 0%, transparent 50%), 
            radial-gradient(circle at 75% 75%, ${theme.palette.common.white} 0%, transparent 50%)
          `,
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              mb: 3,
            }}
          >
            Ready to Transform Your French?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Join the AI revolution in language learning. Start your personalized French journey today
            with a 7-day free trial. No credit card required.
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
                backgroundColor: theme.palette.common.white,
                color: 'var(--french-blue)',
                boxShadow: 'var(--shadow-medium)',
                transition: 'var(--transition-normal)',
                '&:hover': {
                  backgroundColor: '#F8FAFC',
                  boxShadow: 'var(--shadow-heavy)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: theme.palette.common.white,
                color: theme.palette.common.white,
                transition: 'var(--transition-normal)',
                '&:hover': {
                  borderColor: theme.palette.common.white,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
