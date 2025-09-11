import React, { useState } from 'react';
import {
  LessonComponentProps,
  VocabularyContent,
} from '../../../types/LessonContentTypes';
import LessonContentContainer from './LessonContentContainer';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  Chip, 
  IconButton,
  Collapse
} from '@mui/material';
import { ExpandMore, VolumeUp } from '@mui/icons-material';
import { getInteractiveCapabilities } from '../../../services/contentService';

const VocabularyLesson: React.FC<LessonComponentProps<VocabularyContent>> = ({
  content,
}) => {
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const capabilities = getInteractiveCapabilities('vocabulary');

  if (!content || !content.vocabulary) {
    return (
      <LessonContentContainer title="Vocabulary">
        <Typography>No vocabulary content available.</Typography>
      </LessonContentContainer>
    );
  }

  const handleExpandClick = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handlePronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'fr-FR';
      speechSynthesis.speak(utterance);
    }
  };

  // Flashcard mode rendering
  if (flashcardMode && content.vocabulary.length > 0) {
    const currentItem = content.vocabulary[currentCard];
    
    return (
      <LessonContentContainer title="Vocabulary Flashcards">
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Card {currentCard + 1} of {content.vocabulary.length}
          </Typography>
        </Box>
        
        <Card 
          sx={{ 
            minHeight: 200, 
            cursor: 'pointer',
            mb: 2,
            backgroundColor: showDefinition ? 'primary.light' : 'background.paper'
          }}
          onClick={() => setShowDefinition(!showDefinition)}
        >
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {showDefinition ? currentItem.definition : currentItem.word}
            </Typography>
            {showDefinition && currentItem.pronunciation && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                [{currentItem.pronunciation}]
              </Typography>
            )}
            {!showDefinition && (
              <Typography variant="body2" color="text.secondary">
                Click to reveal definition
              </Typography>
            )}
          </CardContent>
        </Card>

        {showDefinition && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>Examples:</Typography>
            {currentItem.examples.map((example, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 0.5, fontStyle: 'italic' }}>
                • {example}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => setFlashcardMode(false)}
          >
            Exit Flashcards
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={() => {
                setCurrentCard(Math.max(0, currentCard - 1));
                setShowDefinition(false);
              }}
              disabled={currentCard === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={() => {
                setCurrentCard(Math.min(content.vocabulary.length - 1, currentCard + 1));
                setShowDefinition(false);
              }}
              disabled={currentCard === content.vocabulary.length - 1}
            >
              Next
            </Button>
          </Box>
        </Box>
      </LessonContentContainer>
    );
  }

  // Standard list mode rendering with interactive features
  return (
    <LessonContentContainer title="Vocabulary">
      {capabilities.hasFlashcards && content.vocabulary.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setFlashcardMode(true)}
            sx={{ mr: 2 }}
          >
            Start Flashcards
          </Button>
        </Box>
      )}

      <List>
        {content.vocabulary.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" component="span">
                    {item.word}
                  </Typography>
                  {item.difficulty && (
                    <Chip 
                      label={item.difficulty} 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                    />
                  )}
                  {capabilities.hasPronunciation && (
                    <IconButton 
                      size="small" 
                      onClick={() => handlePronunciation(item.word)}
                      title="Listen to pronunciation"
                    >
                      <VolumeUp fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              secondary={
                <>
                  <Typography component="span" variant="body1" color="text.primary">
                    {item.definition}
                  </Typography>
                  {item.pronunciation && (
                    <>
                      <br />
                      <Typography component="span" variant="body2" color="text.secondary">
                        [{item.pronunciation}]
                      </Typography>
                    </>
                  )}
                  
                  {item.examples && item.examples.length > 0 && (
                    <>
                      <IconButton 
                        onClick={() => handleExpandClick(index)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <ExpandMore 
                          sx={{ 
                            transform: expandedItems.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }} 
                        />
                      </IconButton>
                      <Collapse in={expandedItems.includes(index)} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Examples:
                          </Typography>
                          {item.examples.map((example, exampleIndex) => (
                            <Typography 
                              key={exampleIndex} 
                              variant="body2" 
                              sx={{ 
                                fontStyle: 'italic',
                                pl: 1,
                                borderLeft: '2px solid',
                                borderColor: 'primary.light',
                                mb: 0.5
                              }}
                            >
                              {example}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </LessonContentContainer>
  );
};

export default VocabularyLesson;
