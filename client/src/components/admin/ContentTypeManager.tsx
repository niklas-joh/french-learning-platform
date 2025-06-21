import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  getContentTypes,
  createContentType,
  updateContentType,
  deleteContentType,
  ContentType,
} from '../../services/adminService';
import ConfirmationDialog from './ConfirmationDialog';

const ContentTypeManager: React.FC = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const types = await getContentTypes();
      setContentTypes(types);
      setError(null);
    } catch (err) {
      setError('Failed to fetch content types.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleOpenForm = (type: ContentType | null = null) => {
    setSelectedType(type);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedType(null);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      if (selectedType) {
        await updateContentType(selectedType.id, { name, description });
      } else {
        await createContentType({ name, description });
      }
      fetchTypes();
      handleCloseForm();
    } catch (err) {
      setError('Failed to save content type.');
      console.error(err);
    }
  };

  const handleDeleteClick = (id: number) => {
    setTypeToDelete(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (typeToDelete) {
      try {
        await deleteContentType(typeToDelete);
        fetchTypes();
        setTypeToDelete(null);
        setOpenConfirm(false);
      } catch (err) {
        setError('Failed to delete content type.');
        console.error(err);
      }
    }
  };

  if (loading) return <Typography>Loading content types...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Content Types
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
        Add New Content Type
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contentTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.id}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenForm(type)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(type.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{selectedType ? 'Edit' : 'Add'} Content Type</DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              defaultValue={selectedType?.name || ''}
              required
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedType?.description || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Cancel</Button>
            <Button type="submit">{selectedType ? 'Save' : 'Create'}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this content type? This action cannot be undone."
      />
    </Box>
  );
};

export default ContentTypeManager;
