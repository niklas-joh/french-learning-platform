/**
 * AI Component Error Boundary
 * 
 * Provides intelligent error handling and recovery for AI dashboard components.
 * Follows React error boundary patterns with enhanced UX for AI-specific failures.
 * 
 * Features:
 * - Graceful degradation for AI service failures
 * - User-friendly error messages with retry functionality  
 * - Error logging for debugging and monitoring
 * - Accessibility-compliant error states
 * - Integration with existing Material-UI design patterns
 * 
 * @fileoverview Error boundary for AI Dashboard Components
 * @version 1.0.0
 * @author French Learning Platform Team
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, Button, Box, Typography } from '@mui/material';
import { AI_DASHBOARD_CONFIG } from '../../config/aiDashboardConfig.js';

/**
 * Props for AIComponentErrorBoundary
 */
interface AIComponentErrorBoundaryProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;
  /** Optional fallback component for custom error display */
  fallback?: ReactNode;
  /** Callback called when error occurs (for logging) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Component name for error tracking */
  componentName?: string;
}

/**
 * State for error boundary
 */
interface AIComponentErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Additional error information */
  errorInfo: ErrorInfo | null;
  /** Number of retry attempts */
  retryCount: number;
}

/**
 * Error boundary component for AI dashboard components
 * 
 * Catches JavaScript errors anywhere in the AI component tree,
 * logs those errors, and displays a fallback UI with retry functionality.
 * 
 * @example
 * ```tsx
 * <AIComponentErrorBoundary componentName="AIContentRequest">
 *   <AIContentRequest />
 * </AIComponentErrorBoundary>
 * ```
 */
export class AIComponentErrorBoundary extends Component<
  AIComponentErrorBoundaryProps,
  AIComponentErrorBoundaryState
> {
  private readonly maxRetries = 3;

  constructor(props: AIComponentErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  /**
   * Catches errors during rendering and updates state to show fallback UI
   * @param error - The error that was thrown
   * @returns New state with error information
   */
  static getDerivedStateFromError(error: Error): Partial<AIComponentErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Catches errors during rendering, in lifecycle methods, and in constructors
   * @param error - The error that was thrown
   * @param errorInfo - Additional error information including component stack
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error info for display
    this.setState({
      errorInfo
    });

    // Log error for debugging and monitoring
    console.error('AI Component Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName || 'Unknown AI Component',
      retryCount: this.state.retryCount
    });

    // Call optional error callback for external error tracking
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Attempts to recover from error by resetting error state
   * Limited number of retries to prevent infinite retry loops
   */
  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  /**
   * Resets the error boundary to initial state
   * Useful for programmatic recovery
   */
  public resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  /**
   * Determines appropriate error message based on error type
   * @returns User-friendly error message
   */
  private getErrorMessage(): string {
    if (!this.state.error) {
      return AI_DASHBOARD_CONFIG.MESSAGES.ERRORS.GENERIC_ERROR;
    }

    // Network-related errors
    if (this.state.error.message.includes('fetch') || 
        this.state.error.message.includes('network') ||
        this.state.error.message.includes('NetworkError')) {
      return AI_DASHBOARD_CONFIG.MESSAGES.ERRORS.NETWORK_ERROR;
    }

    // AI generation specific errors
    if (this.state.error.message.includes('generation') ||
        this.state.error.message.includes('AI') ||
        this.state.error.message.includes('content')) {
      return AI_DASHBOARD_CONFIG.MESSAGES.ERRORS.GENERATION_FAILED;
    }

    // Quota/rate limiting errors
    if (this.state.error.message.includes('quota') ||
        this.state.error.message.includes('limit') ||
        this.state.error.message.includes('429')) {
      return AI_DASHBOARD_CONFIG.MESSAGES.ERRORS.QUOTA_EXCEEDED;
    }

    // Generic fallback
    return AI_DASHBOARD_CONFIG.MESSAGES.ERRORS.GENERIC_ERROR;
  }

  /**
   * Renders the error fallback UI
   * @returns Error fallback component
   */
  private renderErrorFallback() {
    const canRetry = this.state.retryCount < this.maxRetries;
    const errorMessage = this.getErrorMessage();

    // Use custom fallback if provided
    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 'var(--border-radius-medium)',
          maxWidth: 500
        }}
        role="alert"
        aria-live="assertive"
      >
        <Alert 
          severity="error"
          sx={{
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          action={
            canRetry && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={this.handleRetry}
                aria-label="Retry loading component"
              >
                Retry ({this.maxRetries - this.state.retryCount} left)
              </Button>
            )
          }
        >
          <AlertTitle>AI Component Temporarily Unavailable</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {errorMessage}
          </Typography>
          
          {!canRetry && (
            <Typography variant="caption" color="text.secondary">
              Please refresh the page if the problem persists.
            </Typography>
          )}
        </Alert>

        {/* Development error details - only show in development */}
        {process.env.NODE_ENV === 'development' && this.state.error && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
              <strong>Error:</strong> {this.state.error.message}
            </Typography>
            {this.state.errorInfo && (
              <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', mt: 1 }}>
                <strong>Component Stack:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 'var(--font-size-xs)' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  }

  /**
   * Renders either the children or error fallback based on error state
   * @returns React element
   */
  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with AI error boundary
 * Note: This simplifies the usage pattern for AI components
 * 
 * @param componentName - Name of the component for error tracking
 * @returns Error boundary wrapper function
 */
export const withAIErrorBoundary = (componentName: string) => {
  return <P extends object>(Component: React.ComponentType<P>) => {
    const WrappedComponent: React.FC<P> = (props) => (
      <AIComponentErrorBoundary componentName={componentName}>
        <Component {...props} />
      </AIComponentErrorBoundary>
    );

    WrappedComponent.displayName = `withAIErrorBoundary(${componentName})`;
    return WrappedComponent;
  };
};

/**
 * Simple error fallback component for AI dashboard layout
 * @returns Simplified error display for layout-level errors
 */
export const AIDashboardErrorFallback: React.FC = () => (
  <Box
    sx={{
      p: 3,
      textAlign: 'center',
      borderRadius: 'var(--border-radius-medium)'
    }}
    role="alert"
    aria-live="polite"
  >
    <Typography variant="h6" color="error" gutterBottom>
      🤖 AI Dashboard Unavailable
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      The AI dashboard is temporarily unavailable. Core learning features remain accessible.
    </Typography>
    <Button 
      variant="outlined" 
      size="small"
      onClick={() => window.location.reload()}
      aria-label="Refresh page to retry loading AI dashboard"
    >
      Refresh Page
    </Button>
  </Box>
);
