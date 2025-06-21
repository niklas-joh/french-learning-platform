import React, { useEffect, useState, useCallback } from 'react';
import {
  getContentItems,
  getTopics,
  createContentItem,
  updateContentItem,
  deleteContentItem,
} from '../../services/adminService';
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
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Content } from '../../types/Content';
import { Topic } from '../../types/Topic';
import ContentForm from './ContentForm';
import ConfirmationDialog from './ConfirmationDialog';

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingContentId, setDeletingContentId] = useState<number | null>(
    null
  );

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedContent, fetchedTopics] = await Promise.all([
        getContentItems(),
        getTopics(),
      ]);
      setContent(fetchedContent);
      setTopics(fetchedTopics);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddContent = () => {
    setEditingContent(null);
    setIsFormOpen(true);
  };

  const handleEditContent = (contentItem: Content) => {
    setEditingContent(contentItem);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingContent(null);
  };

  const handleFormSubmit = async (
    contentData: Omit<Content, 'id'> | Content
  ) => {
    try {
      if ('id' in contentData) {
        // Editing existing content
        await updateContentItem(contentData.id, contentData);
      } else {
        // Creating new content
        await createContentItem(contentData);
      }
      await fetchAllData(); // Refetch to show the changes
      handleFormClose();
    } catch (err: any) {
      setError(
        err.message ||
          `Failed to ${'id' in contentData ? 'update' : 'create'} content.`
      );
      console.error(err);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingContentId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingContentId) {
      try {
        await deleteContentItem(deletingContentId);
        await fetchAllData(); // Refetch to show the item is gone
      } catch (err: any) {
        setError(err.message || 'Failed to delete content.');
        console.error(err);
      } finally {
        setIsConfirmOpen(false);
        setDeletingContentId(null);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">Manage Content</Typography>
        <Button variant="contained" onClick={handleAddContent}>
          Add New Content
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {error && <p color="error">{error}</p>}
      
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((item) => {
                const topicName =
                  topics.find((t) => t.id === item.topicId)?.name ?? 'N/A';
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{topicName}</TableCell>
                    <TableCell>{item.active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditContent(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ContentForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        content={editingContent}
        topics={topics}
      />
      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this content item? This action cannot be undone."
      />
    </Paper>
  );
};

export default ContentManager;
