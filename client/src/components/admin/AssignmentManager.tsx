import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { User } from '../../types/User';
import { Content } from '../../types/Content';
import { UserContentAssignmentWithContent, getAssignmentsForUser, assignContentToUser, unassignContentFromUser } from '../../services/adminService';
import { getUsers } from '../../services/userService';
import { getContentItems } from '../../services/adminService';

const AssignmentManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<UserContentAssignmentWithContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [usersData, contentData] = await Promise.all([getUsers(), getContentItems()]);
        setUsers(usersData);
        setContent(contentData);
      } catch (err) {
        setError('Failed to load initial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchAssignments = async () => {
        try {
          setLoading(true);
          const userAssignments = await getAssignmentsForUser(selectedUser);
          setAssignments(userAssignments);
        } catch (err) {
          setError('Failed to load assignments for the selected user.');
        } finally {
          setLoading(false);
        }
      };
      fetchAssignments();
    } else {
      setAssignments([]);
    }
  }, [selectedUser]);

  const handleAssign = async () => {
    if (!selectedUser || !selectedContent) {
      setError('Please select a user and a piece of content to assign.');
      return;
    }
    try {
      setLoading(true);
      await assignContentToUser(selectedUser, selectedContent);
      // Refresh assignments for the current user
      const userAssignments = await getAssignmentsForUser(selectedUser);
      setAssignments(userAssignments);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to assign content.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (assignmentId: number) => {
    try {
      setLoading(true);
      await unassignContentFromUser(assignmentId);
      // Refresh assignments for the current user
      if (selectedUser) {
        const userAssignments = await getAssignmentsForUser(selectedUser);
        setAssignments(userAssignments);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to unassign content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Content Assignments</Typography>
      {error && <Typography color="error">{error}</Typography>}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select User</InputLabel>
          <Select onChange={(e) => setSelectedUser(Number(e.target.value))} value={selectedUser || ''}>
            <MenuItem value="">--Select a User--</MenuItem>
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Content</InputLabel>
          <Select onChange={(e) => setSelectedContent(Number(e.target.value))} value={selectedContent || ''}>
            <MenuItem value="">--Select Content--</MenuItem>
            {content.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleAssign} disabled={loading || !selectedUser || !selectedContent} variant="contained">
          {loading ? <CircularProgress size={24} /> : 'Assign Content'}
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>Assigned Content for Selected User</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              assignments.map(assignment => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.content.name}</TableCell>
                  <TableCell>{assignment.content.type}</TableCell>
                  <TableCell>{assignment.status}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => handleUnassign(assignment.id)} disabled={loading} color="secondary">
                      Unassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignmentManager;
