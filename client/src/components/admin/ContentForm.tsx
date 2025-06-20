import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Content } from '../../types/Content';
import { Topic } from '../../types/Topic';

interface ContentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: Omit<Content, 'id'> | Content) => void;
  content?: Content | null;
  topics: Topic[];
}

const ContentForm: React.FC<ContentFormProps> = ({
  open,
  onClose,
  onSubmit,
  content,
  topics,
}) => {
  const [topicId, setTopicId] = useState<number | ''>('');
  const [type, setType] = useState('');
  const [questionData, setQuestionData] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (content) {
      setTopicId(content.topicId);
      setType(content.type);
      setQuestionData(JSON.stringify(content.questionData, null, 2));
      setActive(content.active);
      setError('');
    } else {
      setTopicId('');
      setType('');
      setQuestionData('');
      setActive(true);
      setError('');
    }
  }, [content, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let parsedQuestionData;
    try {
      parsedQuestionData = JSON.parse(questionData);
      setError('');
    } catch (err) {
      setError('Invalid JSON in Question Data field.');
      return;
    }

    if (!topicId) {
      setError('Topic is required.');
      return;
    }

    const contentData = {
      topicId: Number(topicId),
      type,
      questionData: parsedQuestionData,
      active,
    };

    if (content) {
      onSubmit({ ...content, ...contentData });
    } else {
      onSubmit(contentData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{content ? 'Edit Content' : 'Add New Content'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="topic-select-label">Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topicId"
              value={topicId}
              label="Topic"
              onChange={(e) => setTopicId(e.target.value as number)}
            >
              {topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="type"
            label="Content Type"
            type="text"
            fullWidth
            variant="outlined"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="questionData"
            label="Question Data (JSON format)"
            type="text"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={questionData}
            onChange={(e) => setQuestionData(e.target.value)}
            required
            error={!!error}
            helperText={error}
          />
          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                name="active"
                color="primary"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {content ? 'Save Changes' : 'Create Content'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ContentForm;
