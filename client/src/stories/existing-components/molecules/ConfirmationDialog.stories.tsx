import type { Meta, StoryObj } from '@storybook/react';
import ConfirmationDialog from '../../../components/admin/ConfirmationDialog';
import ThemeProvider from '../../../ThemeProvider';
// Mock function for onClick handlers
const fn = () => () => {};
import { Box, Button, Typography, Stack } from '@mui/material';
import React from 'react';

/**
 * ConfirmationDialog is a reusable modal dialog for confirming destructive actions.
 * 
 * **Key Features:**
 * - Accessible dialog with ARIA labels
 * - Clear cancel and confirm actions
 * - Error color for destructive actions
 * - Keyboard navigation support
 * - Customizable title and message content
 * - Auto-focus on confirm button for safety
 */
const meta: Meta<typeof ConfirmationDialog> = {
  title: 'Existing Components/Molecules/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal confirmation dialog for destructive actions with accessibility features and clear visual hierarchy.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ minHeight: '400px', padding: '20px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls dialog visibility'
    },
    title: {
      control: 'text',
      description: 'Dialog title text'
    },
    message: {
      control: 'text', 
      description: 'Confirmation message content'
    },
    onClose: {
      action: 'closed',
      description: 'Called when dialog is cancelled'
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Called when action is confirmed'
    }
  },
  args: {
    onClose: fn(),
    onConfirm: fn()
  }
};

export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

/**
 * Default delete confirmation dialog
 */
export const Default: Story = {
  args: {
    open: true,
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.'
  }
};

/**
 * User deletion confirmation
 */
export const DeleteUser: Story = {
  args: {
    open: true,
    title: 'Delete User Account',
    message: 'Are you sure you want to delete this user account? All associated data will be permanently removed and cannot be recovered.'
  }
};

/**
 * Content removal confirmation
 */
export const DeleteContent: Story = {
  args: {
    open: true,
    title: 'Remove Content',
    message: 'This will permanently delete the selected content item and remove it from all learning paths. Students will no longer have access to this content.'
  }
};

/**
 * Topic deletion with consequences
 */
export const DeleteTopic: Story = {
  args: {
    open: true,
    title: 'Delete Topic',
    message: 'Deleting this topic will also remove all associated lessons, vocabulary, and student progress. This action affects multiple users and cannot be undone.'
  }
};

/**
 * Assignment cancellation
 */
export const CancelAssignment: Story = {
  args: {
    open: true,
    title: 'Cancel Assignment',
    message: 'Are you sure you want to cancel this assignment? Students who have already started will lose their progress.'
  }
};

/**
 * Data export confirmation
 */
export const ExportData: Story = {
  args: {
    open: true,
    title: 'Export User Data',
    message: 'You are about to export sensitive user data. Please ensure you have the necessary permissions and will handle this data according to privacy regulations.'
  }
};

/**
 * Reset progress warning
 */
export const ResetProgress: Story = {
  args: {
    open: true,
    title: 'Reset Learning Progress',
    message: 'This will reset all learning progress for the selected user. They will lose their current position, completed lessons, and achievement badges.'
  }
};

/**
 * System maintenance warning
 */
export const SystemMaintenance: Story = {
  args: {
    open: true,
    title: 'Start System Maintenance',
    message: 'Starting maintenance mode will temporarily disable the platform for all users. Active learning sessions will be interrupted.'
  }
};

/**
 * Bulk action confirmation
 */
export const BulkAction: Story = {
  args: {
    open: true,
    title: 'Apply Bulk Changes',
    message: 'You are about to modify 47 content items. This operation may take several minutes and will affect multiple learning paths.'
  }
};

/**
 * Closed state - hidden dialog
 */
export const Closed: Story = {
  args: {
    open: false,
    title: 'Hidden Dialog',
    message: 'This dialog is not visible when open is false.'
  }
};

/**
 * Interactive demo with trigger button
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [lastAction, setLastAction] = React.useState<string>('None');

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
      setIsOpen(false);
      setLastAction('Cancelled');
    };
    const handleConfirm = () => {
      setIsOpen(false);
      setLastAction('Confirmed');
    };

    return (
      <ThemeProvider>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Interactive Confirmation Dialog Demo
          </Typography>
          
          <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleOpen}
            >
              Delete Content Item
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              Last Action: <strong>{lastAction}</strong>
            </Typography>
          </Stack>

          <ConfirmationDialog
            open={isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            title="Delete Content Item"
            message="Are you sure you want to delete this content item? This action cannot be undone and will affect all associated learning paths."
          />
        </Box>
      </ThemeProvider>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Multiple dialog scenarios comparison
 */
export const DialogComparison: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = React.useState<string>('');

    const dialogs = [
      {
        id: 'delete',
        title: 'Delete Item',
        message: 'Standard deletion confirmation.',
        buttonText: 'Delete Item',
        buttonColor: 'error' as const
      },
      {
        id: 'warning',
        title: 'Warning Action',
        message: 'This action requires careful consideration.',
        buttonText: 'Proceed with Caution',
        buttonColor: 'warning' as const
      },
      {
        id: 'info',
        title: 'Information Confirm',
        message: 'Please confirm this informational action.',
        buttonText: 'Confirm Info',
        buttonColor: 'info' as const
      }
    ];

    return (
      <ThemeProvider>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Different Dialog Scenarios
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {dialogs.map((dialog) => (
              <Button
                key={dialog.id}
                variant="contained"
                color={dialog.buttonColor}
                onClick={() => setActiveDialog(dialog.id)}
              >
                {dialog.buttonText}
              </Button>
            ))}
          </Stack>

          {dialogs.map((dialog) => (
            <ConfirmationDialog
              key={dialog.id}
              open={activeDialog === dialog.id}
              onClose={() => setActiveDialog('')}
              onConfirm={() => setActiveDialog('')}
              title={dialog.title}
              message={dialog.message}
            />
          ))}
        </Box>
      </ThemeProvider>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
};

/**
 * Long message content handling
 */
export const LongMessage: Story = {
  args: {
    open: true,
    title: 'Complex Operation Confirmation',
    message: 'You are about to perform a complex operation that will affect multiple aspects of the system. This includes: 1) Removing all associated content items from the database, 2) Updating user progress records to reflect the changes, 3) Notifying affected students via email, 4) Creating a backup of the deleted data for recovery purposes, 5) Updating analytics and reporting dashboards, 6) Clearing cached data across all servers. This operation is irreversible and may take up to 15 minutes to complete. During this time, some features may be temporarily unavailable. Please ensure you have administrative approval before proceeding.'
  }
};

/**
 * Accessibility and keyboard navigation demo
 */
export const AccessibilityDemo: Story = {
  args: {
    open: true,
    title: 'Accessibility Features',
    message: 'This dialog demonstrates accessibility features: ARIA labels, keyboard navigation (Tab/Shift+Tab), focus management, and screen reader compatibility.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation: Tab to move between buttons, Enter/Space to activate, Escape to close.'
      }
    }
  }
};

/**
 * Responsive behavior on different screen sizes
 */
export const ResponsiveDemo: Story = {
  render: () => (
    <ThemeProvider>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Responsive Confirmation Dialog
        </Typography>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Mobile View (320px)</Typography>
            <Box sx={{ width: 320, height: 300, border: '1px solid #ddd', position: 'relative' }}>
              <ConfirmationDialog
                open={true}
                onClose={() => {}}
                onConfirm={() => {}}
                title="Mobile Dialog"
                message="This dialog adapts to mobile screen sizes with appropriate spacing and button layouts."
              />
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>Desktop View (600px)</Typography>
            <Box sx={{ width: 600, height: 300, border: '1px solid #ddd', position: 'relative' }}>
              <ConfirmationDialog
                open={true}
                onClose={() => {}}
                onConfirm={() => {}}
                title="Desktop Dialog"
                message="On larger screens, the dialog maintains optimal proportions and readability."
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};
