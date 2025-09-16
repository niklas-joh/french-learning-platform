import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { 
  AIComponentErrorBoundary, 
  withAIErrorBoundary, 
  AIDashboardErrorFallback 
} from '../../../components/ai-dashboard/AIComponentErrorBoundary';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent,
  Alert,
  Stack
} from '@mui/material';

/**
 * AIComponentErrorBoundary provides intelligent error handling and recovery 
 * for AI dashboard components with graceful degradation patterns.
 * 
 * **Key Features:**
 * - Graceful degradation for AI service failures
 * - User-friendly error messages with retry functionality  
 * - Error logging for debugging and monitoring
 * - Accessibility-compliant error states
 * - Integration with Material-UI design patterns
 * - Higher-order component wrapper for easy integration
 */
const meta: Meta<typeof AIComponentErrorBoundary> = {
  title: 'Existing Components/Organisms/AIComponentErrorBoundary',
  component: AIComponentErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Error boundary specifically designed for AI dashboard components with intelligent error handling, retry functionality, and graceful degradation patterns.'
      }
    }
  },
  argTypes: {
    children: {
      control: false,
      description: 'Child components to wrap with error boundary'
    },
    fallback: {
      control: false,
      description: 'Optional fallback component for custom error display'
    },
    onError: {
      action: 'error-caught',
      description: 'Callback called when error occurs (for logging)'
    },
    componentName: {
      control: 'text',
      description: 'Component name for error tracking'
    }
  },
  args: {
    onError: () => () => {},
    componentName: 'ExampleAIComponent'
  }
};

export default meta;
type Story = StoryObj<typeof AIComponentErrorBoundary>;

// Mock component that can throw different types of errors
const ErrorThrowingComponent: React.FC<{
  errorType?: 'none' | 'network' | 'generation' | 'quota' | 'generic';
  delay?: number;
}> = ({ errorType = 'none', delay = 0 }) => {
  const [loading, setLoading] = useState(delay > 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setLoading(false);
        if (errorType !== 'none') {
          throwError(errorType);
        }
      }, delay);
      return () => clearTimeout(timer);
    } else if (errorType !== 'none') {
      throwError(errorType);
    }
  }, [errorType, delay]);

  const throwError = (type: string) => {
    switch (type) {
      case 'network':
        throw new Error('NetworkError: Failed to fetch AI content from server');
      case 'generation':
        throw new Error('AI content generation failed: Model timeout');
      case 'quota':
        throw new Error('API quota limit exceeded: 429 Too Many Requests');
      case 'generic':
        throw new Error('Unexpected error in component render');
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Card sx={{ minWidth: 300, minHeight: 100 }}>
        <CardContent>
          <Typography variant="h6">🤖 AI Component Loading...</Typography>
          <Typography variant="body2" color="text.secondary">
            Simulating component initialization...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ minWidth: 300, minHeight: 100 }}>
      <CardContent>
        <Typography variant="h6" color="primary">
          ✅ AI Component Working
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This component is functioning normally without any errors.
        </Typography>
      </CardContent>
    </Card>
  );
};

/**
 * Normal state showing the error boundary wrapping a healthy component
 */
export const Default: Story = {
  args: {
    componentName: 'HealthyAIComponent'
  },
  render: (args) => (
    <AIComponentErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="none" />
    </AIComponentErrorBoundary>
  )
};

/**
 * Network error with retry functionality
 */
export const NetworkError: Story = {
  args: {
    componentName: 'AIContentRequest'
  },
  render: (args) => (
    <AIComponentErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="network" />
    </AIComponentErrorBoundary>
  )
};

/**
 * AI generation failure error
 */
export const GenerationError: Story = {
  args: {
    componentName: 'AIContentGenerator'
  },
  render: (args) => (
    <AIComponentErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="generation" />
    </AIComponentErrorBoundary>
  )
};

/**
 * Quota exceeded error for rate limiting scenarios
 */
export const QuotaError: Story = {
  args: {
    componentName: 'AIAPIClient'
  },
  render: (args) => (
    <AIComponentErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="quota" />
    </AIComponentErrorBoundary>
  )
};

/**
 * Generic error fallback
 */
export const GenericError: Story = {
  args: {
    componentName: 'UnknownAIComponent'
  },
  render: (args) => (
    <AIComponentErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="generic" />
    </AIComponentErrorBoundary>
  )
};

/**
 * Custom fallback component usage
 */
export const CustomFallback: Story = {
  args: {
    componentName: 'CustomizedAIComponent',
    fallback: (
      <Card sx={{ minWidth: 300, p: 2, bgcolor: 'warning.light' }}>
        <Typography variant="h6" color="warning.dark">
          🔧 Custom Error Handler
        </Typography>
        <Typography variant="body2">
          This is a custom fallback component for this specific AI feature.
        </Typography>
        <Button size="small" sx={{ mt: 1 }}>
          Contact Support
        </Button>
      </Card>
    )
  },
  render: (args) => (
    <AIComponentErrorBoundary {...args}>
      <ErrorThrowingComponent errorType="network" />
    </AIComponentErrorBoundary>
  )
};

/**
 * Interactive retry demonstration
 */
export const RetryDemo: Story = {
  args: {
    componentName: 'RetryableAIComponent'
  },
  render: (args) => {
    const [errorType, setErrorType] = useState<'none' | 'network'>('network');
    const [key, setKey] = useState(0);

    const handleFixError = () => {
      setErrorType('none');
      setKey(prev => prev + 1); // Force remount
    };

    return (
      <Stack spacing={2} alignItems="center">
        <AIComponentErrorBoundary key={key} {...args}>
          <ErrorThrowingComponent errorType={errorType} />
        </AIComponentErrorBoundary>
        
        {errorType === 'network' && (
          <Alert severity="info">
            <Typography variant="body2">
              Click "Fix Network" below to simulate resolving the network issue, 
              then try the Retry button in the error boundary.
            </Typography>
          </Alert>
        )}
        
        <Button 
          onClick={handleFixError}
          variant="contained"
          size="small"
        >
          Fix Network Issue
        </Button>
      </Stack>
    );
  }
};

/**
 * Higher-order component wrapper demonstration
 */
export const HOCWrapper: Story = {
  render: () => {
    // Create a component wrapped with the HOC
    const WrappedComponent = withAIErrorBoundary('HOCExampleComponent')(() => (
      <ErrorThrowingComponent errorType="generation" />
    ));

    return (
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6">Component with HOC Wrapper</Typography>
        <WrappedComponent />
        <Typography variant="caption" color="text.secondary">
          This component was automatically wrapped using withAIErrorBoundary HOC
        </Typography>
      </Stack>
    );
  }
};

/**
 * Dashboard-level error fallback component
 */
export const DashboardFallback: Story = {
  render: () => (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h6">Dashboard Error Fallback</Typography>
      <AIDashboardErrorFallback />
      <Typography variant="caption" color="text.secondary">
        Simplified error display for dashboard-level failures
      </Typography>
    </Stack>
  )
};

/**
 * Multiple error boundaries showing different error types
 */
export const ErrorComparison: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h5" align="center">
        Error Type Comparison
      </Typography>
      
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2}>
        <Box>
          <Typography variant="h6" gutterBottom>Network Error</Typography>
          <AIComponentErrorBoundary componentName="NetworkComponent">
            <ErrorThrowingComponent errorType="network" />
          </AIComponentErrorBoundary>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Generation Error</Typography>
          <AIComponentErrorBoundary componentName="GenerationComponent">
            <ErrorThrowingComponent errorType="generation" />
          </AIComponentErrorBoundary>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Quota Error</Typography>
          <AIComponentErrorBoundary componentName="QuotaComponent">
            <ErrorThrowingComponent errorType="quota" />
          </AIComponentErrorBoundary>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Generic Error</Typography>
          <AIComponentErrorBoundary componentName="GenericComponent">
            <ErrorThrowingComponent errorType="generic" />
          </AIComponentErrorBoundary>
        </Box>
      </Box>
    </Stack>
  )
};

/**
 * Loading then error sequence
 */
export const LoadingToError: Story = {
  args: {
    componentName: 'DelayedErrorComponent'
  },
  render: (args) => (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h6">Simulated Loading → Error</Typography>
      <AIComponentErrorBoundary {...args}>
        <ErrorThrowingComponent errorType="network" delay={2000} />
      </AIComponentErrorBoundary>
      <Typography variant="caption" color="text.secondary">
        Component loads for 2 seconds then throws a network error
      </Typography>
    </Stack>
  )
};

/**
 * Accessibility-focused error boundary
 */
export const AccessibilityDemo: Story = {
  args: {
    componentName: 'AccessibleAIComponent'
  },
  render: (args) => (
    <Stack spacing={2}>
      <Alert severity="info">
        <Typography variant="body2">
          This demonstrates accessibility features:
          <br />• ARIA role="alert" for screen readers
          <br />• aria-live="assertive" for immediate announcements
          <br />• Descriptive aria-label on retry button
          <br />• Semantic error structure
        </Typography>
      </Alert>
      
      <AIComponentErrorBoundary {...args}>
        <ErrorThrowingComponent errorType="generation" />
      </AIComponentErrorBoundary>
    </Stack>
  )
};
