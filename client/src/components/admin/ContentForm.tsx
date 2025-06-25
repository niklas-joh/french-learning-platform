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
  Typography,
} from '@mui/material';
import { Content } from '../../types/Content';
import { Topic } from '../../types/Topic';
import { ContentType, getContentTypes } from '../../services/adminService';
import MultipleChoiceSpecificForm from './content_type_forms/MultipleChoiceSpecificForm';
import FillInTheBlankSpecificForm from './content_type_forms/FillInTheBlankSpecificForm';
import TrueFalseSpecificForm from './content_type_forms/TrueFalseSpecificForm';
import SentenceCorrectionSpecificForm from './content_type_forms/SentenceCorrectionSpecificForm';

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
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState<number | ''>('');
  const [contentTypeId, setContentTypeId] = useState<number | ''>('');
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [questionData, setQuestionData] = useState<any>({});
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  // Fetch content types when the form is opened
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getContentTypes();
        setContentTypes(types);
        setError('');
      } catch (err) {
        console.error('Failed to fetch content types:', err);
        setError('Failed to load content types.');
      }
    };

    if (open) {
      fetchTypes();
    }
  }, [open]);

  // Populate form when content or contentTypes are loaded/changed
  useEffect(() => {
    if (open) {
      if (content && contentTypes.length > 0) {
        const currentContentType = contentTypes.find(
          (ct) => ct.name === content.type
        );

        setName(content.name);
        setTitle(content.title || '');
        setTopicId(content.topicId);
        setContentTypeId(currentContentType ? currentContentType.id : '');
        setActive(content.active);

        // Handle both object and stringified JSON for backward compatibility
        if (typeof content.questionData === 'string') {
          try {
            setQuestionData(JSON.parse(content.questionData));
          } catch (e) {
            console.error('Failed to parse questionData JSON:', e);
            setQuestionData({});
            setError('Failed to parse existing question data.');
          }
        } else {
          setQuestionData(content.questionData || {});
        }
        setError('');
      } else if (!content) {
        // Reset for new content form
        setName('');
        setTitle('');
        setTopicId('');
        setContentTypeId('');
        setQuestionData({});
        setActive(true);
        setError('');
      }
    }
  }, [content, open, contentTypes]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!topicId) {
      setError('Topic is required.');
      return;
    }
    if (!contentTypeId) {
      setError('Content Type is required.');
      return;
    }

    const selectedType = contentTypes.find(ct => ct.id === contentTypeId);

    const contentData = {
      name,
      title,
      topicId: Number(topicId),
      contentTypeId: Number(contentTypeId),
      type: selectedType ? selectedType.name : '',
      questionData: questionData, // questionData is now an object
      active,
    } as Omit<Content, 'id'>;

    if (content) {
      onSubmit({ ...content, ...contentData } as Content);
    } else {
      onSubmit(contentData as Omit<Content, 'id'>);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{content ? 'Edit Content' : 'Add New Content'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Content Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="name"
            label="Content Identifier (Name)"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            helperText="Unique machine-readable identifier (e.g., food_phrase_blank)"
          />
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
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="content-type-select-label">Content Type</InputLabel>
            <Select
              labelId="content-type-select-label"
              id="contentTypeId"
              value={contentTypeId}
              label="Content Type"
              onChange={(e) => setContentTypeId(e.target.value as number)}
            >
              {contentTypes.map((contentType) => (
                <MenuItem key={contentType.id} value={contentType.id}>
                  {contentType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Interactive Content Form Area */}
          <Box sx={{ mt: 2, mb: 1 }}>
            {(() => {
              const selectedType = contentTypes.find(ct => ct.id === contentTypeId);
              if (!selectedType) return null;

              switch (selectedType.name) {
                case 'multiple-choice':
                  return (
                    <MultipleChoiceSpecificForm
                      data={questionData}
                      onChange={setQuestionData}
                    />
                  );
                case 'fill-in-the-blank':
                  return (
                    <FillInTheBlankSpecificForm
                      data={questionData}
                      onChange={setQuestionData}
                    />
                  );
                case 'true-false':
                  return (
                    <TrueFalseSpecificForm
                      data={questionData}
                      onChange={setQuestionData}
                    />
                  );
                case 'sentence-correction':
                  return (
                    <SentenceCorrectionSpecificForm
                      data={questionData}
                      onChange={setQuestionData}
                    />
                  );
                default:
                  if (selectedType.name) {
                    return (
                      <Typography variant="caption" color="textSecondary">
                        Interactive form for type '{selectedType.name}' is not yet implemented.
                      </Typography>
                    );
                  }
                  return null; // Nothing selected yet
              }
            })()}
          </Box>

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
