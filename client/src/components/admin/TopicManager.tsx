import React, { useEffect, useState } from 'react';
import { getTopics } from '../../services/adminService';
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

export interface Topic {
  id: number;
  name: string;
  description?: string | null;
  category?: string | null;
  active?: boolean;
}

const TopicManager: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchTopics();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Manage Topics</Typography>
        <Button variant="contained">Add New Topic</Button>
      </Box>

      {loading && <p>Loading topics...</p>}
      {error && <p color="error">{error}</p>}
      
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>{topic.category ?? 'N/A'}</TableCell>
                  <TableCell>{topic.active ? 'Active' : 'Inactive'}</TableCell>
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

export default TopicManager;
