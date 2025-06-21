import React, { useState, useEffect } from 'react';
import { User } from '../../types/User';
import { Content } from '../../types/Content';
import { UserContentAssignment, getAssignmentsForUser, assignContentToUser, unassignContentFromUser } from '../../services/adminService';
import { getUsers } from '../../services/userService';
import { getContentItems } from '../../services/adminService';

const AssignmentManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<UserContentAssignment[]>([]);
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
    <div>
      <h2>Manage Content Assignments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <label>Select User:</label>
        <select onChange={(e) => setSelectedUser(Number(e.target.value))} value={selectedUser || ''}>
          <option value="">--Select a User--</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Content:</label>
        <select onChange={(e) => setSelectedContent(Number(e.target.value))} value={selectedContent || ''}>
          <option value="">--Select Content--</option>
          {content.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <button onClick={handleAssign} disabled={loading || !selectedUser || !selectedContent}>
        {loading ? 'Assigning...' : 'Assign Content'}
      </button>

      <hr />

      <h3>Assigned Content for Selected User</h3>
      {loading && <p>Loading assignments...</p>}
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>
            Content ID: {assignment.content_id} - Status: {assignment.status}
            <button onClick={() => handleUnassign(assignment.id)} disabled={loading}>
              Unassign
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentManager;
