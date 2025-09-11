import React, { useState } from 'react';
import {
  LessonComponentProps,
  QuizContent,
} from '../../../types/LessonContentTypes';
import LessonContentContainer from './LessonContentContainer';
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Alert,
  Chip
} from '@mui/material';
import { CheckCircle, Cancel, Quiz } from '@mui/icons-material';

const QuizLesson: React.FC<LessonComponentProps<QuizContent>> = ({
  content,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!content || !content.question) {
    return (
      <LessonContentContainer title="Quiz">
        <Typography>No quiz content available.</Typography>
      </LessonContentContainer>
    );
  }

  const handleSubmit = () => {
    setSubmitted(true);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelectedAnswer('');
    setSubmitted(false);
    setShowExplanation(false);
  };

  const isCorrect = submitted && selectedAnswer === content.answer;

  return (
    <LessonContentContainer title="Quiz">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Quiz color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Question
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {content.question}
          </Typography>

          {content.options && content.options.length > 0 ? (
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            >
              {content.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio disabled={submitted} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{option}</Typography>
                      {submitted && option === content.answer && (
                        <CheckCircle color="success" fontSize="small" />
                      )}
                      {submitted && option === selectedAnswer && option !== content.answer && (
                        <Cancel color="error" fontSize="small" />
                      )}
                    </Box>
                  }
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      width: '100%'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Expected Answer:</strong> {content.answer}
              </Typography>
            </Alert>
          )}

          {!submitted ? (
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={content.options ? !selectedAnswer : false}
                fullWidth
              >
                Submit Answer
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 3 }}>
              <Alert 
                severity={isCorrect ? "success" : "error"} 
                icon={isCorrect ? <CheckCircle /> : <Cancel />}
                sx={{ mb: 2 }}
              >
                <Typography variant="body1">
                  {isCorrect ? content.feedback.correct : content.feedback.incorrect}
                </Typography>
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
            label={isCorrect ? "Correct!" : "Incorrect"} 
            color={isCorrect ? "success" : "error"}
            variant="filled"
            size="medium"
          />
        </Box>
      )}
    </LessonContentContainer>
  );
};

export default QuizLesson;
