import React, { useEffect, useState } from 'react';
import { getContentItems } from '../../services/adminService';
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

export interface Content {
  id: number;
  topicId?: number | null;
  type: string;
  questionData: any;
  difficultyLevel?: string | null;
  active?: boolean;
}

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const fetchedContent = await getContentItems();
        setContent(fetchedContent);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Manage Content</Typography>
        <Button variant="contained">Add New Content</Button>
      </Box>

      {loading && <p>Loading content...</p>}
      {error && <p color="error">{error}</p>}
      
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Topic ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.topicId ?? 'N/A'}</TableCell>
                  <TableCell>{item.active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button size="small" sx={{ mr: 1 }}>Edit</Button>
                    <Button size="small" color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ContentManager;
