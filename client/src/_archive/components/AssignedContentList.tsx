import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContentAssignmentWithContent } from '../types/Assignment';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { formatDisplayName, formatStatus } from '../utils/textFormatters';
import { getIconForType } from '../utils/iconMap';


interface AssignedContentListProps {
  assignments: UserContentAssignmentWithContent[];
  /** Number of items to display. Omit to show all */
  limit?: number;
  /** Whether to hide assignments with status === 'completed' */
  showIncompleteOnly?: boolean;
}

const AssignedContentList: React.FC<AssignedContentListProps> = ({ assignments, limit, showIncompleteOnly = false }) => {
  const baseAssignments = assignments; // Keep original list for reference if needed
  const filteredAssignments = showIncompleteOnly ? baseAssignments.filter(a => a.status !== 'completed') : baseAssignments;

  if (filteredAssignments.length === 0) {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Assigned Content
        </Typography>
        <Typography>
         No content has been assigned to you yet.</Typography>
      </Box>
    );
  }

  const itemsToShow = typeof limit === 'number' ? filteredAssignments.slice(0, limit) : filteredAssignments;
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Assigned Content
      </Typography>
      <List disablePadding>
        {itemsToShow.map((assignment, index) => (
          <React.Fragment key={assignment.id}>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to={`/content/${assignment.content.id}`}> 
                <ListItemIcon>{getIconForType(assignment.content.type)}</ListItemIcon>
                <ListItemText
                  primary={formatDisplayName(assignment.content.name)}
                  secondary={formatDisplayName(assignment.content.type)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: '100px',
                    textAlign: 'right',
                    ml: 2, // Add margin to the left of the status
                    color: assignment.status === 'completed' ? 'success.main' : 
                           assignment.status === 'overdue' ? 'error.main' : 
                           'text.secondary'
                  }}
                >
                  {formatStatus(assignment.status)}
                </Typography>
              </ListItemButton>
            </ListItem>
            {index < itemsToShow.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      {/* This link is more useful on the dashboard view specifically */}
      {filteredAssignments.length > itemsToShow.length && (
         <Button component={RouterLink} to="/assignments" sx={{ mt: 2 }}>
           View All ({filteredAssignments.length})
         </Button>
      )}
    </Box>
  );
};

export default AssignedContentList;
