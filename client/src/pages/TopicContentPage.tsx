import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Paper, List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';
import { getContentForTopic, getTopicById } from '../services/contentService';
import { Content } from '../types/Content';
import { Topic } from '../types/Topic';

const TopicContentPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) {
        setError('No topic ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const topicData = await getTopicById(topicId);
        setTopic(topicData);
        const contentData = await getContentForTopic(topicId);
        setContentList(contentData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch topic content:', err);
        setError('Failed to load content for this topic.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topicId]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content for: {topic?.name || 'Topic'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {topic?.description || 'Here you can find all the exercises related to this topic.'}
        </Typography>
        <List>
          {contentList.length > 0 ? (
            contentList.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to={`/content/${item.id}`}>
                    <ListItemText primary={item.name} secondary={`Type: ${item.type}`} />
                  </ListItemButton>
                </ListItem>
                {index < contentList.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Typography>No content found for this topic.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default TopicContentPage;
