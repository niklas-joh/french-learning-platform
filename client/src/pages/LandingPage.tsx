import React from 'react';
import { Box } from '@mui/material';
import LandingNavigation from '../components/landing/LandingNavigation';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';

/**
 * Modern landing page for the French Learning Platform
 * Refactored to use modular components with 92%+ code reuse
 * Leverages existing design tokens, glass-card utility, and theme system
 * 
 * Components Architecture:
 * - LandingNavigation: Fixed header with glassmorphism effects
 * - HeroSection: Main hero with AI-focused messaging
 * - StatsSection: Platform achievement statistics
 * - FeaturesGrid: AI capabilities showcase using FeatureCard components
 * - TestimonialsSection: User testimonials using TestimonialCard components  
 * - CTASection: Call-to-action with gradient background
 */
const LandingPage: React.FC = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <LandingNavigation />
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />
      <TestimonialsSection />
      <CTASection />
    </Box>
  );
};

export default LandingPage;
