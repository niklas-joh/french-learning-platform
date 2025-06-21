import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material';
import { Topic } from './../../types/Topic';

interface TopicFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (topic: Omit<Topic, 'id'> | Topic) => void;
  topic?: Topic | null;
}

const TopicForm: React.FC<TopicFormProps> = ({
  open,
  onClose,
  onSubmit,
  topic,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [topic, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const topicData = { name, description };
    if (topic) {
      onSubmit({ ...topic, ...topicData });
    } else {
      onSubmit(topicData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{topic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Topic Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {topic ? 'Save Changes' : 'Create Topic'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TopicForm;
