/**
 * AI Tutor Card Component
 * 
 * Enhanced AI tutor interaction card with offline support and state management.
 * Follows established Material-UI patterns and integrates with AI dashboard architecture.
 * 
 * Features:
 * - Offline-aware functionality
 * - Performance optimized with React.memo
 * - Accessibility compliant with ARIA support
 * - Integration with existing design tokens
 * - Dynamic greeting based on time of day
 * - AI status indicators
 * 
 * @fileoverview AI Tutor Card Component
 * @version 1.0.0
 * @author French Learning Platform Team
 */

import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { useOfflineDetection } from '../../hooks/useOfflineDetection.js';

/**
 * Props for AITutorCard component
 */
interface AITutorCardProps {
  /** Whether the component is offline */
  isOffline?: boolean;
  /** Callback when tutor interaction is initiated */
  onInteractionStart?: () => void;
  /** Additional CSS styles */
  sx?: object;
  /** User's name for personalized greetings */
  userName?: string;
  /** Current user progress percentage */
  progressPercentage?: number;
}

/**
 * AI Tutor Card Component
 * 
 * Displays an interactive AI tutor card that adapts to online/offline status
 * and provides contextual learning assistance. Enhanced version of the
 * original HomePage tutor card with improved state management and accessibility.
 * 
 * @example
 * ```tsx
 * <AITutorCard
 *   userName="Marie"
 *   progressPercentage={75}
 *   onInteractionStart={() => console.log('Starting AI interaction')}
 * />
 * ```
 */
export const AITutorCard = React.memo<AITutorCardProps>(({
  isOffline: propIsOffline,
  onInteractionStart,
  sx,
  userName,
  progressPercentage = 75
}) => {
  // Use hook if offline status not provided via props
  const { isOffline: hookIsOffline } = useOfflineDetection();
  const isOffline = propIsOffline ?? hookIsOffline;

  /**
   * Generate time-based greeting
   * Provides contextual greetings based on current time
   */
  const generateGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    const greetings = {
      morning: ['Bonjour', 'Salut', 'Bonne matinée'],
      afternoon: ['Bon après-midi', 'Salut', 'Comment allez-vous?'],
      evening: ['Bonsoir', 'Salut', 'Bonne soirée']
    };

    let timeOfDay: keyof typeof greetings;
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    const timeGreetings = greetings[timeOfDay];
    return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
  }, []);

  /**
   * Generate contextual message based on user progress and status
   */
  const contextualMessage = useMemo((): string => {
    if (isOffline) {
      return "Je suis hors ligne, mais vous pouvez continuer à apprendre avec le contenu téléchargé!";
    }

    const messages = {
      beginner: [
        "Ready to practice some French conversation today?",
        "Let's start with some basic French vocabulary!",
        "Shall we work on your French pronunciation?"
      ],
      intermediate: [
        "Ready for some advanced French conversation?",
        "Let's explore more complex French grammar today!",
        "How about practicing some French idioms?"
      ],
      advanced: [
        "Prêt pour une conversation entièrement en français?",
        "Explorons la littérature française aujourd'hui!",
        "Discutons de sujets complexes en français!"
      ]
    };

    let level: keyof typeof messages;
    if (progressPercentage < 30) level = 'beginner';
    else if (progressPercentage < 70) level = 'intermediate';
    else level = 'advanced';

    const levelMessages = messages[level];
    return levelMessages[Math.floor(Math.random() * levelMessages.length)];
  }, [isOffline, progressPercentage]);

  /**
   * Generate dynamic tutor name based on progress
   */
  const tutorName = useMemo((): string => {
    const names = ['Claude', 'Marie', 'Pierre', 'Sophie'];
    // Use progress percentage to consistently select the same tutor
    const index = Math.floor((progressPercentage || 0) / 25) % names.length;
    return names[index];
  }, [progressPercentage]);

  /**
   * Handle tutor interaction
   */
  const handleInteraction = useCallback(() => {
    if (!isOffline && onInteractionStart) {
      onInteractionStart();
    }
  }, [isOffline, onInteractionStart]);

  /**
   * Generate appropriate button text based on status
   */
  const buttonText = useMemo((): string => {
    if (isOffline) return 'Offline Mode';
    return 'Start Conversation';
  }, [isOffline]);

  return (
    <Card
      className="glass-card"
      sx={{
        background: isOffline ? 
          'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)' : 
          'var(--gradient-primary)',
        color: 'white',
        p: 2,
        transition: 'all var(--transition-normal)',
        // Subtle animation for online status
        ...(isOffline ? {} : {
          animation: 'pulse 2s infinite alternate',
          '@keyframes pulse': {
            '0%': { opacity: 0.9 },
            '100%': { opacity: 1.0 }
          }
        }),
        ...sx
      }}
      role="region"
      aria-label={`AI Tutor ${tutorName}`}
      aria-describedby="tutor-status"
    >
      <CardContent>
        {/* Status Indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Chip
            size="small"
            label={isOffline ? 'Offline' : 'Online'}
            sx={{
              backgroundColor: isOffline ? 'error.dark' : 'success.dark',
              color: 'white',
              fontSize: '0.75rem'
            }}
            aria-label={`Tutor status: ${isOffline ? 'offline' : 'online'}`}
          />
        </Box>

        {/* Tutor Avatar and Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: isOffline ? 
                'rgba(255, 255, 255, 0.1)' : 
                'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              fontSize: '20px',
              border: isOffline ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'
            }}
            role="img"
            aria-label={`${tutorName} avatar`}
          >
            {isOffline ? '😴' : '🤖'}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 0.5
              }}
              component="h3"
            >
              {tutorName}, your AI tutor
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8,
                fontSize: '0.875rem'
              }}
              id="tutor-status"
            >
              {isOffline ? 'Offline - Limited functionality' : 'Online and ready to help'}
            </Typography>
          </Box>

          {/* Progress Indicator */}
          {progressPercentage !== undefined && (
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                position: 'relative'
              }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Learning progress: ${progressPercentage}%`}
            >
              {progressPercentage}%
            </Box>
          )}
        </Box>

        {/* Greeting and Message */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1,
              fontSize: '1.1rem'
            }}
          >
            {generateGreeting()}{userName ? `, ${userName}` : ''}! 👋
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{ 
              lineHeight: 1.5,
              fontSize: '0.95rem'
            }}
          >
            {contextualMessage}
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          variant={isOffline ? 'outlined' : 'contained'}
          fullWidth
          onClick={handleInteraction}
          disabled={isOffline}
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: isOffline ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: 'white',
            '&:hover': isOffline ? undefined : {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.7)'
            },
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }
          }}
          aria-describedby="interaction-help"
        >
          {buttonText}
        </Button>

        <Typography 
          id="interaction-help"
          variant="caption"
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 1,
            opacity: 0.7,
            fontSize: '0.75rem'
          }}
        >
          {isOffline ? 
            'Connect to internet for full AI assistance' :
            'Click to start an AI-powered learning session'
          }
        </Typography>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for performance optimization
  return (
    prevProps.isOffline === nextProps.isOffline &&
    prevProps.userName === nextProps.userName &&
    prevProps.progressPercentage === nextProps.progressPercentage &&
    JSON.stringify(prevProps.sx) === JSON.stringify(nextProps.sx)
  );
});

// Display name for debugging
AITutorCard.displayName = 'AITutorCard';
