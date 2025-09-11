import React, { useState } from 'react';
import {
  LessonComponentProps,
  PracticeContent,
} from '../../../types/LessonContentTypes';
import LessonContentContainer from './LessonContentContainer';
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  TextField,
  Alert,
  Chip
} from '@mui/material';
import { CheckCircle, Cancel, Edit } from '@mui/icons-material';

const PracticeLesson: React.FC<LessonComponentProps<PracticeContent>> = ({
  content,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!content || !content.question) {
    return (
      <LessonContentContainer title="Practice">
        <Typography>No practice content available.</Typography>
      </LessonContentContainer>
    );
  }

  const handleSubmit = () => {
    setSubmitted(true);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setUserAnswer('');
    setSubmitted(false);
    setShowExplanation(false);
  };

  // Simple answer comparison - could be enhanced with fuzzy matching
  const isCorrect = submitted && userAnswer.trim().toLowerCase() === content.answer.toLowerCase();

  return (
    <LessonContentContainer title="Practice">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Edit color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Practice Exercise
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {content.question}
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            label="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={submitted}
            multiline={userAnswer.length > 50}
            rows={userAnswer.length > 50 ? 3 : 1}
            sx={{ mb: 3 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && userAnswer.trim()) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {!submitted ? (
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                fullWidth
              >
                Submit Answer
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Press Enter to submit
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Alert 
                severity={isCorrect ? "success" : "error"} 
                icon={isCorrect ? <CheckCircle /> : <Cancel />}
                sx={{ mb: 2 }}
              >
                <Typography variant="body1">
                  {isCorrect ? content.feedback.correct : content.feedback.incorrect}
                </Typography>
                {!isCorrect && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Correct answer:</strong> {content.answer}
                  </Typography>
                )}
              </Alert>

              {content.explanation && showExplanation && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Explanation:</strong> {content.explanation}
                  </Typography>
                </Alert>
              )}

              <Button 
                variant="outlined" 
                onClick={handleReset}
                fullWidth
              >
                Try Again
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {submitted && (
        <Box sx={{ textAlign: 'center' }}>
          <Chip 
            label={isCorrect ? "Correct!" : "Keep practicing!"} 
            color={isCorrect ? "success" : "warning"}
            variant="filled"
            size="medium"
          />
        </Box>
      )}
    </LessonContentContainer>
  );
};

export default PracticeLesson;
