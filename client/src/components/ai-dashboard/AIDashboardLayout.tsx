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
          p: {
            xs: 'var(--spacing-6)',  // 24px on mobile
            sm: 'var(--spacing-8)',  // 32px on tablet+
          },
          pb: 10, // Following existing HomePage pattern for bottom navigation clearance
          display: 'flex',
          flexDirection: 'column',
          gap: {
            xs: 'var(--spacing-6)',  // 24px gap on mobile
            sm: 'var(--spacing-8)',  // 32px gap on tablet+
          },
          minHeight: '100vh', // Ensure full viewport height
          // Responsive width management using design system
          width: '100%',
          maxWidth: '100%',
          flex: 1,
          // Responsive padding adjustments using design system breakpoints
          '@media (max-width: 640px)': {
            p: 'var(--spacing-6)', // 24px
            gap: 'var(--spacing-6)' // 24px
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
      return `${timeGreeting}, ${userName}`;
    }
    return timeGreeting;
  };

  /**
   * Generate simple subtitle
   */
  const getSubtitle = (): string => {
    return "Continue your French learning journey";
  };

  return (
    <AIComponentErrorBoundary componentName="AIEnhancedHeader">
      <Box
        sx={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          p: 2,
          borderRadius: 'var(--border-radius-medium)',
          border: '1px solid var(--border-light)',
          position: 'relative',
          ...sx
        }}
        component="header"
        role="banner"
        aria-labelledby="dashboard-greeting"
        data-testid="ai-enhanced-header"
      >
        {/* Main Content */}
        <Box>
          <h1 id="dashboard-greeting" style={{ margin: 0, marginBottom: 4 }}>
            <Box
              component="span"
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 500,
                lineHeight: 1.2,
                display: 'block',
                color: 'var(--text-primary)'
              }}
            >
              {getGreetingMessage()}
            </Box>
          </h1>
          
          <Box
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              lineHeight: 1.4,
              color: 'var(--text-secondary)'
            }}
          >
            {getSubtitle()}
          </Box>
        </Box>
        
        {/* Simple Progress Indicator */}
        {currentStreak > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'var(--text-tertiary)',
              fontSize: '0.75rem',
              fontWeight: 500
            }}
            role="status"
            aria-label={`${currentStreak} day learning streak`}
          >
            {currentStreak} day streak
          </Box>
        )}
      </Box>
    </AIComponentErrorBoundary>
  );
});

AIEnhancedHeader.displayName = 'AIEnhancedHeader';
