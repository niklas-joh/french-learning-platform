import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContentAssignmentWithContent } from '../types/Assignment';
import { Typography, List, ListItem, ListItemText, Divider, Box, Button, ListItemButton } from '@mui/material';

interface AssignedContentListProps {
  assignments: UserContentAssignmentWithContent[];
}

const AssignedContentList: React.FC<AssignedContentListProps> = ({ assignments }) => {
  if (assignments.length === 0) {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Assigned Content
        </Typography>
        <Typography>No content has been assigned to you yet.</Typography>
      </Box>
    );
  }

  // In a future step, this could be limited to e.g. 5 items on the dashboard
  const itemsToShow = assignments;

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
                <ListItemText
                  primary={assignment.content.title}
                  secondary={assignment.content.type}
                />
              </ListItemButton>
            </ListItem>
            {index < itemsToShow.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      {/* This link is more useful on the dashboard view specifically */}
      {assignments.length > itemsToShow.length && (
         <Button component={RouterLink} to="/assignments" sx={{ mt: 2 }}>
           View All ({assignments.length})
         </Button>
      )}
    </Box>
  );
};

export default AssignedContentList;
