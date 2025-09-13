import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  TrendingUp,
  Groups,
  Speed,
  School,
} from '@mui/icons-material';
import FeatureCard from './FeatureCard';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
}

/**
 * Features grid section showcasing AI capabilities
 * Uses modular FeatureCard components with existing design tokens
 */
const FeaturesGrid: React.FC = () => {
  const theme = useTheme();

  const features: Feature[] = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Learning',
      description: 'Advanced AI creates personalized lessons tailored to your learning style and pace.',
      color: '#6366F1',
    },
    {
      icon: <AutoAwesome />,
      title: 'Dynamic Content Generation',
      description: 'Fresh, engaging content generated on-demand to keep your learning experience exciting.',
      color: '#8B5CF6',
    },
    {
      icon: <TrendingUp />,
      title: 'Adaptive Progress Tracking',
      description: 'Intelligent analytics track your progress and identify areas for improvement.',
      color: '#06B6D4',
    },
    {
      icon: <Groups />,
      title: 'AI Conversation Partner',
      description: 'Practice speaking with an AI tutor available 24/7 for realistic conversations.',
      color: '#10B981',
    },
    {
      icon: <Speed />,
      title: 'Accelerated Learning',
      description: 'Learn 3x faster with AI-optimized spaced repetition and memory techniques.',
      color: '#F59E0B',
    },
    {
      icon: <School />,
      title: 'Expert Curriculum',
      description: 'Curriculum designed by language experts and enhanced by cutting-edge AI.',
      color: '#EF4444',
    },
  ];

  return (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              mb: 3,
              color: theme.palette.text.primary,
            }}
          >
            Revolutionary AI Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Discover how artificial intelligence transforms your French learning journey
            with personalized, adaptive, and engaging experiences.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              index={index}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesGrid;
