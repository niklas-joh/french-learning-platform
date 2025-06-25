import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Topic } from '../types/Topic';
import { formatDisplayName } from '../utils/textFormatters';

interface ExploreTopicsProps {
  topics: Topic[];
}

const ExploreTopics: React.FC<ExploreTopicsProps> = ({ topics }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {topics.map(topic => (
        <Card key={topic.id} sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {formatDisplayName(topic.name)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {topic.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" component={RouterLink} to={`/topics/${topic.id}/learn`}>
              View Content
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default ExploreTopics;
