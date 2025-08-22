/**
 * AI Dashboard Layout Component
 * 
 * Provides the structural layout for AI dashboard components while maintaining
 * compatibility with existing HomePage patterns and Material-UI design tokens.
 * 
 * Features:
 * - Error boundary integration for graceful failure handling
 * - Consistent spacing and layout following existing patterns
 * - Responsive design with proper accessibility
 * - Integration with existing design tokens
 * - Support for offline banner and loading states
 * 
 * @fileoverview Layout wrapper for AI Dashboard Components
 * @version 1.0.0
 * @author French Learning Platform Team
 */

import React, { ReactNode } from 'react';
import { Box, Alert, AlertTitle } from '@mui/material';
import { AIComponentErrorBoundary, AIDashboardErrorFallback } from './AIComponentErrorBoundary.js';
import { useOfflineDetection } from '../../hooks/useOfflineDetection.js';

/**
 * Props for AIDashboardLayout component
 */
interface AIDashboardLayoutProps {
  /** Child components to render within the layout */
  children: ReactNode;
  /** Whether to show offline banner */
  showOfflineBanner?: boolean;
  /** Additional CSS styles for the container */
  sx?: object;
}

/**
 * Offline Banner Component
 * 
 * Displays a non-intrusive banner when the user is offline,
 * informing them about limited functionality while maintaining
 * access to core features.
 */
const OfflineBanner: React.FC = React.memo(() => {
  const { isOffline } = useOfflineDetection();
  
  if (!isOffline) return null;

  return (
    <Alert 
      severity="warning" 
      sx={{ 
        mb: 2,
        borderRadius: 'var(--border-radius-medium)',
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
      role="banner"
      aria-live="polite"
    >
      <AlertTitle>Working Offline</AlertTitle>
      AI features are limited while offline. Basic learning content remains available.
    </Alert>
  );
});

OfflineBanner.displayName = 'OfflineBanner';

/**
 * AI Dashboard Layout Component
 * 
 * Provides the structural foundation for AI dashboard components with proper
 * error boundaries, responsive layout, and accessibility features. Follows
 * the established patterns from the existing HomePage while adding enhanced
 * error handling and offline support.
 * 
 * @example
 * ```tsx
 * <AIDashboardLayout>
 *   <AIEnhancedHeader />
 *   <AIContentRequest />
 *   <QuickActionsGrid actions={actions} />
 *   <AITutorCard />
 * </AIDashboardLayout>
 * ```
 */
export const AIDashboardLayout: React.FC<AIDashboardLayoutProps> = React.memo(({
  children,
  showOfflineBanner = true,
  sx
}) => {
  return (
    <AIComponentErrorBoundary 
      componentName="AIDashboardLayout"
      fallback={<AIDashboardErrorFallback />}
    >
      <Box
        sx={{
          p: 2,
          pb: 10, // Following existing HomePage pattern for bottom navigation clearance
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Consistent spacing between components
          minHeight: '100vh', // Ensure full viewport height
          // Responsive adjustments
          '@media (max-width: 600px)': {
            p: 1.5,
            gap: 1.5
          },
          ...sx
        }}
        component="main"
        role="main"
        aria-label="AI Learning Dashboard"
        data-testid="ai-dashboard-layout"
      >
        {/* Offline Status Banner */}
        {showOfflineBanner && <OfflineBanner />}
        
        {/* Dashboard Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flex: 1
          }}
        >
          {children}
        </Box>
      </Box>
    </AIComponentErrorBoundary>
  );
});

AIDashboardLayout.displayName = 'AIDashboardLayout';

/**
 * AI Enhanced Header Component
 * 
 * Enhanced version of the original HomePage header with AI-specific features
 * and improved accessibility. Maintains visual consistency while adding
 * dynamic content and better semantic structure.
 * 
 * @example
 * ```tsx
 * <AIEnhancedHeader 
 *   userName="Marie"
 *   progressPercentage={75}
 *   currentStreak={5}
 * />
 * ```
 */
interface AIEnhancedHeaderProps {
  /** User's name for personalized greeting */
  userName?: string;
  /** Current learning progress percentage */
  progressPercentage?: number;
  /** Current learning streak in days */
  currentStreak?: number;
  /** Additional CSS styles */
  sx?: object;
}

export const AIEnhancedHeader: React.FC<AIEnhancedHeaderProps> = React.memo(({
  userName,
  progressPercentage = 75,
  currentStreak = 0,
  sx
}) => {
  /**
   * Generate dynamic greeting message
   */
  const getGreetingMessage = (): string => {
    const hour = new Date().getHours();
    let timeGreeting: string;
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';
    
    if (userName) {
      return `${timeGreeting}, ${userName}!`;
    }
    return timeGreeting + '!';
  };

  /**
   * Generate encouraging subtitle based on progress
   */
  const getSubtitle = (): string => {
    if (currentStreak > 0) {
      return `${currentStreak} day streak! Ready for your French lesson today?`;
    }
    
    if (progressPercentage >= 80) {
      return "You're making excellent progress! Ready for an advanced lesson?";
    } else if (progressPercentage >= 50) {
      return "Great progress! Ready to continue your French journey?";
    } else {
      return "Ready for your French lesson today?";
    }
  };

  return (
    <AIComponentErrorBoundary componentName="AIEnhancedHeader">
      <Box
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 3,
          borderRadius: 'var(--border-radius-large)',
          position: 'relative',
          overflow: 'hidden',
          // Enhanced visual effects
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          },
          ...sx
        }}
        component="header"
        role="banner"
        aria-labelledby="dashboard-greeting"
        data-testid="ai-enhanced-header"
      >
        {/* Main Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <h1 id="dashboard-greeting" style={{ margin: 0, marginBottom: 8 }}>
            <Box
              component="span"
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                display: 'block'
              }}
            >
              Bonjour! 🇫🇷
            </Box>
          </h1>
          
          <Box
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              opacity: 0.9,
              lineHeight: 1.4,
              maxWidth: { xs: '100%', sm: '70%' }
            }}
            aria-describedby="progress-indicator"
          >
            {getSubtitle()}
          </Box>
        </Box>
        
        {/* Progress Ring */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 16, sm: 20 },
            top: '50%',
            transform: 'translateY(-50%)',
            width: { xs: 50, sm: 60 },
            height: { xs: 50, sm: 60 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: { xs: '12px', sm: '14px' },
            fontWeight: 700,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            // Subtle animation
            animation: 'rotate 20s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'translateY(-50%) rotate(0deg)' },
              '100%': { transform: 'translateY(-50%) rotate(360deg)' }
            }
          }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Learning progress: ${progressPercentage} percent`}
          id="progress-indicator"
        >
          {progressPercentage}%
        </Box>

        {/* Streak Indicator */}
        {currentStreak > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--border-radius-small)',
              px: 1,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
            role="status"
            aria-label={`${currentStreak} day learning streak`}
          >
            🔥 {currentStreak}
          </Box>
        )}
      </Box>
    </AIComponentErrorBoundary>
  );
});

AIEnhancedHeader.displayName = 'AIEnhancedHeader';
