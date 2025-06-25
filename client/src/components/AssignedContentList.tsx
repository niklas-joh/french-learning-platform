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
import {formatDisplayName } from '../utils/textFormatters';
import { getIconForType } from '../utils/iconMap';


interface AssignedContentListProps {
  assignments: UserContentAssignmentWithContent[];
  /** Number of items to display. Omit to show all */
  limit?: number;
  /** Whether to hide assignments with status === 'completed' */
  showIncompleteOnly?: boolean;
}

const AssignedContentList: React.FC<AssignedContentListProps> = ({ assignments, limit, showIncompleteOnly = false }) => {
  const filteredAssignments = showIncompleteOnly ? assignments.filter(a => a.status !== 'completed') : assignments;

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
