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
import { Language } from '@mui/icons-material';

/**
 * Fixed navigation header for the landing page
 * Uses existing design tokens and glassmorphism effects
 */
const LandingNavigation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'var(--backdrop-blur)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Language sx={{ fontSize: 32, color: 'var(--french-blue)' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'var(--gradient-primary)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              FrenchAI
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: 'var(--french-blue)',
                color: 'var(--french-blue)',
                transition: 'var(--transition-normal)',
                '&:hover': {
                  borderColor: 'var(--french-purple)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-light)',
                transition: 'var(--transition-normal)',
                '&:hover': {
                  boxShadow: 'var(--shadow-medium)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Start Free Trial
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingNavigation;
