import React from 'react';
import { Box, Typography } from '@mui/material';
import AssignedContentList from '../AssignedContentList';
import { UserContentAssignmentWithContent } from '../../types/Assignment';

interface MyAssignmentsSectionProps {
  assignments: UserContentAssignmentWithContent[];
}

const MyAssignmentsSection: React.FC<MyAssignmentsSectionProps> = ({ assignments }) => {
  // TODO: Consider making limit and showIncompleteOnly configurable if needed in other contexts,
  // but for the dashboard summary, these defaults are likely good.
  const displayLimit = 3;
  const showOnlyIncomplete = true;

  return (
    <Box sx={{ mb: 4 }}>
      {/* TODO: (REFACTOR_TO_GENERIC_SECTION) Consider refactoring to use a generic DashboardSection component as outlined in future_implementation_considerations.md (item 1.5). */}
      <Typography variant="h5" component="h2" gutterBottom>
        My Assignments
      </Typography>
      <AssignedContentList
        assignments={assignments}
        limit={displayLimit}
        showIncompleteOnly={showOnlyIncomplete}
      />
    </Box>
  );
};

export default MyAssignmentsSection;
