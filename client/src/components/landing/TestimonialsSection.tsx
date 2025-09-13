import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

/**
 * Testimonials section showcasing user success stories
 * Uses modular TestimonialCard components with existing design patterns
 */
const TestimonialsSection: React.FC = () => {
  const theme = useTheme();

  const testimonials: Testimonial[] = [
    {
      name: 'Marie Dubois',
      role: 'Marketing Manager',
      content: 'I went from zero French to conversational in just 3 months! The AI tutor feels like talking to a real person.',
      rating: 5,
      avatar: '/api/placeholder/64/64',
    },
    {
      name: 'James Chen',
      role: 'Software Engineer',
      content: 'The personalized lessons adapt to my busy schedule. I love how the AI knows exactly what I need to work on.',
      rating: 5,
      avatar: '/api/placeholder/64/64',
    },
    {
      name: 'Sarah Williams',
      role: 'Teacher',
      content: 'As an educator, I\'m impressed by the pedagogical sophistication. This is the future of language learning.',
      rating: 5,
      avatar: '/api/placeholder/64/64',
    },
  ];

  return (
    <Box
      sx={{
        py: 12,
        background: `linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)`,
      }}
    >
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
            Loved by Learners Worldwide
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
            Join thousands of successful French learners who've accelerated their journey with AI.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: 4,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
              avatar={testimonial.avatar}
              index={index}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
