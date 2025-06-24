import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, CircularProgress, Alert } from '@mui/material';
import Quiz from '../components/Quiz';
import { Content } from '../types/Content';
import { getContentById } from '../services/contentService';

const ContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError('No content ID provided');
          return;
        }
        const item = await getContentById(id);
        setContent(item);
      } catch (err: any) {
        console.error('Failed to fetch content:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  if (!content) {
    return null;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Quiz content={content} onAnswer={() => {}} />
    </Container>
  );
};

export default ContentPage;
