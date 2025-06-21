import React, { useEffect, useState } from 'react';
import { getTopics, createTopic, updateTopic, deleteTopic } from '../../services/adminService';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Typography 
} from '@mui/material';
import TopicForm from './TopicForm';
import ConfirmationDialog from './ConfirmationDialog';
import { Topic } from '../../types/Topic';

const TopicManager: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<number | null>(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const fetchedTopics = await getTopics();
      setTopics(fetchedTopics);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch topics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleOpenDialog = (topic: Topic | null = null) => {
    setEditingTopic(topic);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingTopic(null);
    setDialogOpen(false);
  };

  const handleFormSubmit = async (topicData: Omit<Topic, 'id'> | Topic) => {
    try {
      if ('id' in topicData) {
        // This is an update
        await updateTopic(topicData.id, topicData);
      } else {
        // This is a create
        await createTopic(topicData);
      }
      fetchTopics(); // Refetch topics to show the changes
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to save topic.');
      console.error(err);
    }
  };

  const handleDelete = (topicId: number) => {
    setTopicToDelete(topicId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (topicToDelete !== null) {
      try {
        await deleteTopic(topicToDelete);
        fetchTopics(); // Refetch topics to show the changes
      } catch (err: any) {
        setError(err.message || 'Failed to delete topic.');
        console.error(err);
      } finally {
        setTopicToDelete(null);
        setConfirmDialogOpen(false);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Manage Topics</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>Add New Topic</Button>
      </Box>

      {loading && <p>Loading topics...</p>}
      {error && <p color="error">{error}</p>}
      
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>{topic.description}</TableCell>
                  <TableCell>
                    <Button size="small" sx={{ mr: 1 }} onClick={() => handleOpenDialog(topic)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(topic.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TopicForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        topic={editingTopic}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this topic? This action cannot be undone."
      />
    </Paper>
  );
};

export default TopicManager;
