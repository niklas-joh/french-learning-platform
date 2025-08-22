/**
 * AI Content Request Component
 * 
 * Performance-optimized component for requesting AI-generated learning content.
 * Implements strategic memoization for AI-specific interaction patterns,
 * following established performance patterns from existing components.
 * 
 * Features:
 * - React.memo for performance optimization
 * - Strategic memoization with useCallback and useMemo
 * - WCAG 2.1 compliant accessibility
 * - Integration with existing useAIContentGeneration hook
 * - Topic suggestions with keyboard navigation
 * - Form validation and error handling
 * 
 * @fileoverview AI Content Request Component
 * @version 1.0.0
 * @author French Learning Platform Team
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useAIContentGeneration } from '../../hooks/useAIContentGeneration.js';
import { 
  AI_DASHBOARD_CONFIG, 
  ContentType, 
  getContentTypeConfig 
} from '../../config/aiDashboardConfig.js';

/**
 * Props for AIContentRequest component
 */
interface AIContentRequestProps {
  /** Whether the component is disabled (e.g., offline) */
  disabled?: boolean;
  /** Additional CSS styles */
  sx?: object;
  /** Callback when content generation starts */
  onGenerationStart?: (topic: string, contentType: ContentType) => void;
  /** Callback when content generation completes */
  onGenerationComplete?: (content: any) => void;
  /** Default content type */
  defaultContentType?: ContentType;
}

/**
 * Topic Suggestions Component - Accessibility Optimized
 * 
 * Implements comprehensive ARIA patterns and keyboard navigation
 * following WCAG 2.1 guidelines and existing accessibility patterns.
 */
interface TopicSuggestionsProps {
  /** Array of suggested topics */
  topics: string[];
  /** Callback when topic is selected */
  onTopicSelect: (topic: string) => void;
  /** Whether suggestions are disabled */
  disabled?: boolean;
  /** Current filter text */
  filter?: string;
}

const TopicSuggestions = React.memo<TopicSuggestionsProps>(({ 
  topics, 
  onTopicSelect, 
  disabled = false,
  filter = ''
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  
  // Filter topics based on input text
  const filteredTopics = useMemo(() => {
    if (!filter || filter.length < 2) return topics.slice(0, 6);
    return topics
      .filter(topic => topic.toLowerCase().includes(filter.toLowerCase()))
      .slice(0, 6);
  }, [topics, filter]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredTopics.length - 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredTopics.length) {
          onTopicSelect(filteredTopics[focusedIndex]);
        }
        break;
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  }, [disabled, filteredTopics, onTopicSelect, focusedIndex]);
  
  if (filteredTopics.length === 0) return null;

  return (
    <Box
      role="group"
      aria-labelledby="topic-suggestions-label"
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
    >
      <Typography 
        id="topic-suggestions-label"
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 1 }}
        component="h4"
      >
        Popular topics:
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {filteredTopics.map((topic, index) => (
          <Chip
            key={topic}
            label={topic}
            variant="outlined"
            size="small"
            onClick={disabled ? undefined : () => onTopicSelect(topic)}
            disabled={disabled}
            tabIndex={focusedIndex === index ? 0 : -1}
            sx={{
              cursor: disabled ? 'default' : 'pointer',
              backgroundColor: focusedIndex === index ? 'action.focus' : undefined,
              '&:hover': !disabled ? {
                backgroundColor: 'action.hover'
              } : undefined
            }}
            aria-describedby="topic-selection-help"
            role="button"
            aria-label={`Select topic: ${topic}`}
          />
        ))}
      </Box>
      
      <Typography 
        id="topic-selection-help"
        variant="caption"
        color="text.secondary"
        sx={{ 
          position: 'absolute', 
          left: '-9999px' // Screen reader only
        }}
      >
        Use arrow keys to navigate and Enter to select a topic suggestion
      </Typography>
    </Box>
  );
});

TopicSuggestions.displayName = 'TopicSuggestions';

/**
 * AI Content Request Component - Performance Optimized
 * 
 * Implements strategic memoization for AI-specific interaction patterns,
 * following established performance patterns from existing components.
 */
export const AIContentRequest = React.memo<AIContentRequestProps>(({ 
  disabled = false, 
  sx,
  onGenerationStart,
  onGenerationComplete,
  defaultContentType = 'lesson'
}) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>(defaultContentType);
  const [localError, setLocalError] = useState<string | null>(null);
  const { generateContent, isGenerating } = useAIContentGeneration();
  
  // Memoize expensive topic filtering
  const filteredTopicSuggestions = useMemo(() => 
    AI_DASHBOARD_CONFIG.SUGGESTED_TOPICS.filter(suggestion =>
      topic.length > 2 ? suggestion.toLowerCase().includes(topic.toLowerCase()) : true
    ), [topic]
  );
  
  // Memoize content type configuration
  const selectedContentConfig = useMemo(() => 
    getContentTypeConfig(contentType), [contentType]
  );
  
  // Stable callback reference prevents unnecessary re-renders
  const handleSubmitCallback = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || disabled || isGenerating) return;
    
    try {
      // Notify parent component
      if (onGenerationStart) {
        onGenerationStart(topic.trim(), contentType);
      }
      
      const result = await generateContent({
        topic: topic.trim(),
        contentType,
        difficulty: AI_DASHBOARD_CONFIG.DEFAULTS.DIFFICULTY,
        estimatedTime: AI_DASHBOARD_CONFIG.DEFAULTS.ESTIMATED_TIME
      });
      
      // Notify parent component of completion
      if (onGenerationComplete) {
        onGenerationComplete(result);
      }
      
      setTopic(''); // Clear input after successful submission
    } catch (error) {
      // Error handling managed by hook and parent error boundary
      console.error('Content generation failed:', error);
    }
  }, [topic, contentType, disabled, isGenerating, generateContent, onGenerationStart, onGenerationComplete]);
  
  // Handle topic suggestion selection
  const handleTopicSuggestion = useCallback((suggestedTopic: string) => {
    setTopic(suggestedTopic);
  }, []);
  
  // Handle topic input changes
  const handleTopicChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  }, []);
  
  // Handle content type changes
  const handleContentTypeChange = useCallback((event: any) => {
    setContentType(event.target.value as ContentType);
  }, []);
  
  // Memoized styles prevent unnecessary recalculation
  const cardStyles = useMemo(() => ({
    ...sx,
    // Leverage existing design tokens
    borderRadius: 'var(--border-radius-medium)',
    transition: 'all var(--transition-normal)'
  }), [sx]);
  
  // Form validation
  const isFormValid = useMemo(() => 
    topic.trim().length > 0 && !isGenerating && !disabled, 
    [topic, isGenerating, disabled]
  );

  return (
    <Card className="glass-card" sx={cardStyles}>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: 'text.primary'
          }}
        >
          Generate Learning Content
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleSubmitCallback}
          noValidate
          role="form"
          aria-labelledby="content-request-title"
        >
          {/* Topic Input */}
          <TextField
            fullWidth
            label="Learning topic"
            placeholder="What would you like to learn about?"
            value={topic}
            onChange={handleTopicChange}
            disabled={disabled || isGenerating}
            sx={{ mb: 2 }}
            inputProps={{
              'aria-describedby': 'topic-help',
              'aria-invalid': localError ? 'true' : 'false'
            }}
            error={!!localError}
            helperText={localError ? 'Please try a different topic' : 'Enter a French topic you want to practice'}
          />
          
          {/* Content Type Selection */}
          <FormControl fullWidth sx={{ mb: 2 }} disabled={disabled || isGenerating}>
            <InputLabel id="content-type-label">Content Type</InputLabel>
            <Select
              labelId="content-type-label"
              value={contentType}
              onChange={handleContentTypeChange}
              label="Content Type"
              aria-describedby="content-type-help"
            >
              {AI_DASHBOARD_CONFIG.CONTENT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span role="img" aria-label={`${type.label} icon`}>
                      {type.icon}
                    </span>
                    <Box>
                      <Typography variant="body1">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <Typography 
              id="content-type-help" 
              variant="caption" 
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {selectedContentConfig?.description}
            </Typography>
          </FormControl>
          
          {/* Topic Suggestions */}
          <Box sx={{ mb: 3 }}>
            <TopicSuggestions
              topics={filteredTopicSuggestions}
              onTopicSelect={handleTopicSuggestion}
              disabled={disabled || isGenerating}
              filter={topic}
            />
          </Box>
          
          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isFormValid}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              background: 'var(--gradient-primary)',
              '&:hover': {
                background: 'var(--gradient-primary)',
                opacity: 0.9
              }
            }}
            aria-describedby="submit-help"
            startIcon={isGenerating && <CircularProgress size={20} />}
          >
            {isGenerating ? 
              AI_DASHBOARD_CONFIG.MESSAGES.LOADING.GENERATING_CONTENT : 
              `Generate ${selectedContentConfig?.label || 'Content'}`
            }
          </Button>
          
          <Typography 
            id="submit-help"
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 1 }}
          >
            {isGenerating ? 
              `Creating personalized ${selectedContentConfig?.label.toLowerCase()} content...` :
              `Estimated time: ${AI_DASHBOARD_CONFIG.DEFAULTS.ESTIMATED_TIME} minutes`
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for performance optimization
  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.defaultContentType === nextProps.defaultContentType &&
    JSON.stringify(prevProps.sx) === JSON.stringify(nextProps.sx)
  );
});

// Display name for debugging
AIContentRequest.displayName = 'AIContentRequest';
