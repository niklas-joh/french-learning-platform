# Task 3.1.D.3: AI Dashboard Components Implementation

## **Overview**
Transform the existing HomePage.tsx with AI-enhanced layout and implement core AI dashboard components including the "What do you want to learn today?" interface, personalized daily learning plan display, and AI recommendations with progress-based suggestions.

## **Duration**: 2.5 hours

## **Dependencies**
- ✅ Task 3.1.D.1 (API Service Extension) - Provides API methods and types
- ✅ Task 3.1.D.2 (Dashboard Hooks) - Provides state management hooks
- ✅ Existing Material-UI components and design system
- ✅ Current HomePage.tsx structure and styling

## **Technical Approach**

### **Enhance Existing HomePage (Don't Replace)**
- Transform current HomePage.tsx with AI integration while maintaining familiar UI patterns
- Preserve existing Material-UI design tokens and styling
- Add AI components as progressive enhancements to existing layout

### **Component Architecture Strategy**
- Single responsibility components with clear interfaces
- Reusable AI components that can be used across different pages
- Consistent error handling and loading states
- Mobile-first responsive design following existing patterns

### **AI-First User Experience**
- "What do you want to learn today?" as primary interaction
- Personalized daily learning plans with AI-generated content
- Smart recommendations based on user progress and learning patterns
- Real-time job status tracking with progress indicators

## **Implementation Details**

### **1. Transform HomePage with AI Integration (45 minutes)**

**File**: `client/src/pages/HomePage.tsx` (modify existing)

```typescript
import React from 'react';
import { Box, Typography, Card, CardContent, Alert, Snackbar } from '@mui/material';
import { useAIDashboard } from '../hooks/useAIDashboard.js';
import { useOfflineDetection } from '../hooks/useOfflineDetection.js';
import { AIContentRequest } from '../components/ai-dashboard/AIContentRequest.js';
import { DailyLearningPlan } from '../components/ai-dashboard/DailyLearningPlan.js';
import { AIRecommendations } from '../components/ai-dashboard/AIRecommendations.js';
import { AILoadingStates } from '../components/ai-dashboard/AILoadingStates.js';
import '../styles/design-tokens.css';

const HomePage: React.FC = () => {
  const {
    dailyPlan,
    recommendations,
    activeJobs,
    isLoading,
    error,
    lastUpdated,
    refreshDailyPlan,
    clearError
  } = useAIDashboard();

  const { isOffline, retryConnection } = useOfflineDetection();

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* Offline Banner */}
      {isOffline && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Typography 
              variant="body2" 
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={retryConnection}
            >
              Retry
            </Typography>
          }
        >
          You're offline. Some AI features may not be available.
        </Alert>
      )}

      {/* AI-Enhanced Header */}
      <Box
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 3,
          mb: 3,
          borderRadius: 'var(--border-radius-large)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bonjour! 🇫🇷
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
          Your AI tutor is ready to personalize your French learning journey
        </Typography>
        
        {/* Progress Ring - Enhanced with AI insights */}
        <Box
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700
          }}
        >
          75%
        </Box>
      </Box>

      {/* AI Content Request - Primary Feature */}
      <AIContentRequest 
        disabled={isOffline}
        sx={{ mb: 3 }}
      />

      {/* Daily Learning Plan */}
      {dailyPlan && (
        <DailyLearningPlan 
          plan={dailyPlan}
          onRefresh={refreshDailyPlan}
          isLoading={isLoading}
          sx={{ mb: 3 }}
        />
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <AIRecommendations 
          recommendations={recommendations}
          sx={{ mb: 3 }}
        />
      )}

      {/* Active Jobs Status */}
      {activeJobs.length > 0 && (
        <AILoadingStates 
          jobs={activeJobs}
          sx={{ mb: 3 }}
        />
      )}

      {/* Quick Actions Grid - Enhanced with AI */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          mb: 3
        }}
      >
        <Card className="glass-card">
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Quick Lesson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-generated • 5 min
            </Typography>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>🎤</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Speaking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI pronunciation coach
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* AI Tutor Card - Enhanced */}
      <Card
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 2
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontSize: '20px'
              }}
            >
              🤖
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Claude, your AI tutor
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {isOffline ? 'Offline mode' : 'Online and ready to help'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">
            {isOffline 
              ? "I'm working with cached content while you're offline."
              : "Salut! Ready to practice some French conversation today?"
            }
          </Typography>
        </CardContent>
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
```

### **2. AI Content Request Component (30 minutes)**

**File**: `client/src/components/ai-dashboard/AIContentRequest.tsx`

```typescript
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  CircularProgress,
  SxProps,
  Theme
} from '@mui/material';
import { AutoAwesome, Send } from '@mui/icons-material';
import { useAIContentGeneration } from '../../hooks/useAIContentGeneration.js';
import { ContentGenerationRequest } from '../../types/AIDashboard.js';

interface AIContentRequestProps {
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const SUGGESTED_TOPICS = [
  'French greetings',
  'Ordering food',
  'Past tense verbs',
  'French culture',
  'Travel phrases',
  'Business French'
];

const CONTENT_TYPES = [
  { value: 'lesson', label: 'Interactive Lesson', icon: '📚' },
  { value: 'vocabulary_drill', label: 'Vocabulary Practice', icon: '🔤' },
  { value: 'grammar_exercise', label: 'Grammar Exercise', icon: '✏️' }
] as const;

export const AIContentRequest: React.FC<AIContentRequestProps> = ({ 
  disabled = false, 
  sx 
}) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'lesson' | 'vocabulary_drill' | 'grammar_exercise'>('lesson');
  const { generateContent, isGenerating } = useAIContentGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || disabled) return;

    const request: ContentGenerationRequest = {
      topic: topic.trim(),
      contentType,
      difficulty: 'A1', // TODO: Get from user profile
      estimatedTime: 15
    };

    try {
      await generateContent(request);
      setTopic(''); // Clear input after successful submission
    } catch (error) {
      console.error('Failed to generate content:', error);
      // Error handling is managed by the hook and displayed in parent
    }
  };

  const handleTopicSuggestion = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
  };

  return (
    <Card className="glass-card" sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            What do you want to learn today?
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="e.g., French restaurant vocabulary, past tense conjugation..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={disabled || isGenerating}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!topic.trim() || disabled || isGenerating}
                  sx={{ ml: 1 }}
                  startIcon={isGenerating ? <CircularProgress size={16} /> : <Send />}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              )
            }}
          />

          {/* Content Type Selection */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Content Type:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {CONTENT_TYPES.map((type) => (
                <Chip
                  key={type.value}
                  label={`${type.icon} ${type.label}`}
                  variant={contentType === type.value ? 'filled' : 'outlined'}
                  color={contentType === type.value ? 'primary' : 'default'}
                  onClick={() => setContentType(type.value)}
                  disabled={disabled || isGenerating}
                />
              ))}
            </Box>
          </Box>

          {/* Topic Suggestions */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Popular topics:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {SUGGESTED_TOPICS.map((suggestedTopic) => (
                <Chip
                  key={suggestedTopic}
                  label={suggestedTopic}
                  variant="outlined"
                  size="small"
                  onClick={() => handleTopicSuggestion(suggestedTopic)}
                  disabled={disabled || isGenerating}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};
```

### **3. Daily Learning Plan Component (30 minutes)**

**File**: `client/src/components/ai-dashboard/DailyLearningPlan.tsx`

```typescript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  SxProps,
  Theme
} from '@mui/material';
import { Refresh, PlayArrow, Schedule, TrendingUp } from '@mui/icons-material';
import { DailyLearningPlan as DailyPlan } from '../../types/AIDashboard.js';

interface DailyLearningPlanProps {
  plan: DailyPlan;
  onRefresh: () => void;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}

export const DailyLearningPlan: React.FC<DailyLearningPlanProps> = ({
  plan,
  onRefresh,
  isLoading = false,
  sx
}) => {
  const completedLessons = plan.lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / plan.lessons.length) * 100;

  return (
    <Card className="glass-card" sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Daily AI Plan
            </Typography>
          </Box>
          <IconButton 
            onClick={onRefresh} 
            disabled={isLoading}
            size="small"
          >
            <Refresh sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Plan Overview */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress Today
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedLessons}/{plan.lessons.length} lessons
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Plan Metadata */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<Schedule />}
            label={`${plan.estimatedDuration} min`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={plan.difficulty}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label="AI Generated"
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>

        {/* Lessons List */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Today's Lessons
          </Typography>
          {plan.lessons.slice(0, 3).map((lesson, index) => (
            <Box
              key={lesson.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                mb: 1,
                borderRadius: 2,
                backgroundColor: lesson.completed ? 'success.light' : 'background.paper',
                border: '1px solid',
                borderColor: lesson.completed ? 'success.main' : 'divider',
                opacity: lesson.completed ? 0.8 : 1
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {lesson.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {lesson.description}
                </Typography>
              </Box>
              <Button
                variant={lesson.completed ? "outlined" : "contained"}
                size="small"
                startIcon={<PlayArrow />}
                disabled={lesson.completed}
                sx={{ ml: 2 }}
              >
                {lesson.completed ? 'Completed' : 'Start'}
              </Button>
            </Box>
          ))}

          {plan.lessons.length > 3 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
              +{plan.lessons.length - 3} more lessons in your plan
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
```

### **4. AI Recommendations Component (30 minutes)**

**File**: `client/src/components/ai-dashboard/AIRecommendations.tsx`

```typescript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  SxProps,
  Theme
} from '@mui/material';
import { Lightbulb, PlayArrow, Schedule, Star } from '@mui/icons-material';
import { ContentRecommendation } from '../../types/AIDashboard.js';

interface AIRecommendationsProps {
  recommendations: ContentRecommendation[];
  sx?: SxProps<Theme>;
}

const PRIORITY_COLORS = {
  high: 'error',
  medium: 'warning',
  low: 'info'
} as const;

const TYPE_ICONS = {
  lesson: '📚',
  vocabulary_drill: '🔤',
  grammar_exercise: '✏️'
} as const;

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  sx
}) => {
  const priorityRecommendations = recommendations
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 4); // Show top 4 recommendations

  return (
    <Card className="glass-card" sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Recommendations
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {priorityRecommendations.map((recommendation) => (
            <Box
              key={recommendation.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.light',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mr: 1 }}>
                      {TYPE_ICONS[recommendation.type]} {recommendation.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={recommendation.priority}
                      color={PRIORITY_COLORS[recommendation.priority]}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {recommendation.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    💡 {recommendation.reason}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    icon={<Schedule />}
                    label={`${recommendation.estimatedTime} min`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={recommendation.difficulty}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayArrow />}
                >
                  Start
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {recommendations.length > 4 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="text" size="small">
              View All Recommendations ({recommendations.length})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
```

### **5. AI Loading States Component (15 minutes)**

**File**: `client/src/components/ai-dashboard/AILoadingStates.tsx`

```typescript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Chip,
  SxProps,
  Theme
} from '@mui/material';
import { Close, AutoAwesome } from '@mui/icons-material';
import { AIGenerationJob } from '../../types/AIDashboard.js';
import { useAIContentGeneration } from '../../hooks/useAIContentGeneration.js';

interface AILoadingStatesProps {
  jobs: AIGenerationJob[];
  sx?: SxProps<Theme>;
}

const STATUS_COLORS = {
  pending: 'info',
  processing: 'primary',
  completed: 'success',
  failed: 'error'
} as const;

export const AILoadingStates: React.FC<AILoadingStatesProps> = ({
  jobs,
  sx
}) => {
  const { cancelJob } = useAIContentGeneration();

  const activeJobs = jobs.filter(job => 
    job.status === 'pending' || job.status === 'processing'
  );

  if (activeJobs.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card" sx={sx}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI is working on your content...
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activeJobs.map((job) => (
            <Box
              key={job.jobId}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Generating content...
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={job.status}
                    size="small"
                    color={STATUS_COLORS[job.status]}
                    variant="outlined"
                  />
                  <IconButton
                    size="small"
                    onClick={() => cancelJob(job.jobId)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <LinearProgress
                variant={job.progress ? 'determinate' : 'indeterminate'}
                value={job.progress || 0}
                sx={{ height: 6, borderRadius: 3 }}
              />

              {job.progress && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {Math.round(job.progress)}% complete
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
```

## **Files Created/Modified**

### **Modified Files**
- `client/src/pages/HomePage.tsx` - Enhanced with AI integration while preserving existing structure

### **New Files**
- `client/src/components/ai-dashboard/AIContentRequest.tsx` - "What do you want to learn today?" interface
- `client/src/components/ai-dashboard/DailyLearningPlan.tsx` - AI-generated daily plan display
- `client/src/components/ai-dashboard/AIRecommendations.tsx` - Personalized recommendations
- `client/src/components/ai-dashboard/AILoadingStates.tsx` - Job status and loading indicators

## **Key Technical Decisions**

### **1. Enhance vs Replace HomePage**
**Decision**: Transform existing HomePage.tsx rather than replacing it
**Rationale**:
- Maintains familiar user experience and navigation patterns
- Preserves existing Material-UI design tokens and styling
- Progressive enhancement approach with graceful degradation
- Reduces risk of breaking existing functionality

### **2. Component Composition Strategy**
**Decision**: Create focused, reusable AI components
**Rationale**:
- Single responsibility principle for each component
- Reusable across different pages and contexts
- Easier testing and maintenance
- Clear separation of concerns

### **3. Mobile-First Responsive Design**
**Decision**: Follow existing responsive patterns with AI enhancements
**Rationale**:
- Consistent with existing codebase patterns
- Maintains accessibility and usability standards
- Optimized for mobile learning scenarios
- Progressive enhancement for larger screens

### **4. Error Handling & Loading States**
**Decision**: Comprehensive error handling with user-friendly messages
**Rationale**:
- Better user experience during AI processing delays
- Clear feedback for network issues and failures
- Graceful degradation when AI services unavailable
- Consistent error handling patterns across components

## **Performance Optimizations**

### **Component Memoization**
```typescript
// ✅ Memoize expensive components
const AIContentRequest = React.memo(({ disabled, sx }) => {
  // Component implementation
});

// ✅ Optimize re-renders with stable props
const memoizedRecommendations = useMemo(() => 
  recommendations.slice(0, 4), [recommendations]
);
```

### **Conditional Rendering**
```typescript
// ✅ Only render components when data is available
{dailyPlan && (
  <DailyLearningPlan 
    plan={dailyPlan}
    onRefresh={refreshDailyPlan}
    isLoading={isLoading}
  />
)}

// ✅ Early return for empty states
if (activeJobs.length === 0) {
  return null;
}
```

### **Efficient State Updates**
```typescript
// ✅ Use hooks from previous subtask for optimized state management
const {
  dailyPlan,
  recommendations,
  activeJobs,
  isLoading,
  error
} = useAIDashboard(); // Optimized with useReducer and memoization
```

## **Accessibility Considerations**

### **ARIA Labels and Roles**
- Proper ARIA labels for AI-generated content
- Screen reader friendly job status updates
- Keyboard navigation support for all interactive elements
- Focus management for dynamic content updates

### **Loading States**
- Clear loading indicators with descriptive text
- Progress bars with percentage completion
- Timeout handling with user feedback
- Alternative content when AI services unavailable

## **Testing Strategy**

### **Component Tests Required**
```typescript
// client/src/components/ai-dashboard/__tests__/AIContentRequest.test.tsx
describe('AIContentRequest', () => {
  test('should submit content generation request');
  test('should handle topic suggestions correctly');
  test('should disable form when offline');
  test('should show loading state during generation');
});

// client/src/components/ai-dashboard/__tests__/DailyLearningPlan.test.tsx
describe('DailyLearningPlan', () => {
  test('should display plan with correct progress');
  test('should handle refresh action');
  test('should show completed lessons correctly');
});

// client/src/pages/__tests__/HomePage.test.tsx
describe('Enhanced HomePage', () => {
  test('should render AI components when data available');
  test('should handle offline state gracefully');
  test('should display error messages correctly');
});
```

## **Integration Points**

### **Hook Integration**
- Uses `useAIDashboard` for state management
- Uses `useAIContentGeneration` for content generation
- Uses `useOfflineDetection
