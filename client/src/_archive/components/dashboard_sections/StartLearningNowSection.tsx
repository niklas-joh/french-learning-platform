import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { UserContentAssignmentWithContent } from '../../types/Assignment';
import { useNavigate } from 'react-router-dom';
// TODO: (ICON_HANDLING) Investigate using client/src/utils/iconMap.tsx for dynamic icons. Import specific icons as needed (e.g., PlayArrowIcon from @mui/icons-material).

interface StartLearningNowSectionProps {
  assignments: UserContentAssignmentWithContent[];
  // TODO: (LOADING_STATE) Consider if a dedicated isLoading prop is needed if assignments can be loading, or if parent Dashboard.tsx handles this sufficiently.
}

const StartLearningNowSection: React.FC<StartLearningNowSectionProps> = ({ assignments }) => {
  const navigate = useNavigate();

  const nextAssignment = React.useMemo(() => {
    const incompleteAssignments = assignments.filter(
      assignment => assignment.status === 'pending' || assignment.status === 'in-progress'
    );

    if (incompleteAssignments.length === 0) {
      return null;
    }

    // Sort by assigned_at date to get the earliest one as "next"
    // Ensure assigned_at is treated as a Date object for correct comparison
    incompleteAssignments.sort((a, b) => new Date(a.assigned_at).getTime() - new Date(b.assigned_at).getTime());
    // TODO: (SORTING_LOGIC) Confirm this sorting by assigned_at is the desired behavior for "next".
    // If an explicit 'assignment_order' field becomes available, it should be prioritized.

    return incompleteAssignments[0];
  }, [assignments]);

  const handleStartAssignment = (assignmentId: number, contentId: number | undefined) => {
    // TODO: (NAVIGATION_TARGET) Confirm the correct route structure for navigating to content.
    // Example: /content/:contentId or /learn/assignment/:assignmentId
    if (contentId) {
      navigate(`/content/${contentId}`);
    } else {
      // TODO: (NAVIGATION_FALLBACK) Decide fallback behavior if contentId is missing, though it should generally be present for an assignment.
      console.warn(`Attempted to start assignment ${assignmentId} without a valid contentId.`);
    }
  };

  const handleContinueLastActivity = () => {
    // TODO: (DYNAMIC_CONTINUE_ACTIVITY) This is a placeholder.
    // Future: Implement logic to fetch/determine and navigate to the actual last user activity.
    // This might involve new backend endpoints or client-side activity tracking.
    // For now, it could navigate to a general "all assignments" or "my progress" page if available.
    console.log('Continue last activity clicked (placeholder)');
    // Example placeholder navigation: navigate('/all-assignments');
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Start Learning Now
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="stretch"> {/* Added alignItems="stretch" for good measure, though it's default */}
        <Box flex={1} sx={{ minWidth: 0, display: 'flex' }}> {/* Added display: 'flex' to make Card stretch */}
          <Card sx={{ height: '100%', width: '100%' }}> {/* Added height and width 100% */}
            <CardContent>
              <Typography variant="h6">Continue Last Activity</Typography>
              <Typography variant="body2" color="text.secondary">
                {/* TODO: (DYNAMIC_CONTINUE_ACTIVITY_TEXT) Replace with dynamic text if last activity data becomes available. */}
                Pick up where you left off.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleContinueLastActivity}>
                {/* TODO: (DYNAMIC_CONTINUE_ACTIVITY_BUTTON) This button is currently a placeholder. Enable and implement its functionality. */}
                Continue
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box flex={1} sx={{ minWidth: 0, display: 'flex' }}> {/* Added display: 'flex' to make Card stretch */}
          <Card sx={{ height: '100%', width: '100%' }}> {/* Added height and width 100% */}
            <CardContent>
              <Typography variant="h6">Next Assigned Item</Typography>
              {nextAssignment && nextAssignment.content ? (
                <>
                  <Typography variant="body1">{nextAssignment.content.title || nextAssignment.content.name || 'Unnamed Assignment'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {/* TODO: (ICON_HANDLING) Integrate with iconMap.tsx or use a specific icon component here. */}
                    {/* Example: <ContentTypeIcon type={nextAssignment.content.type} /> */}
                    {nextAssignment.content.type || 'Activity'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleStartAssignment(nextAssignment.id, nextAssignment.content?.id)}
                    // startIcon={<PlayArrowIcon />} // TODO: (ICON_HANDLING) Add relevant icon from @mui/icons-material
                  >
                    Start Learning
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No pending assignments. Explore new topics!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default StartLearningNowSection;
