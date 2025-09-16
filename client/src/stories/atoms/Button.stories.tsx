import type { Meta, StoryObj } from '@storybook/react';
import { Button, Box } from '@mui/material';

// Mock function for onClick handlers
const fn = () => () => {};

// Atomic Button Component based on design mockups
const AtomicButton = ({ 
  variant = 'primary',
  size = 'medium',
  children,
  disabled = false,
  fullWidth = false,
  onClick,
  sx,
  ...props 
}: {
  variant?: 'primary' | 'secondary' | 'action' | 'lesson';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  sx?: object;
}) => {
  const getButtonProps = () => {
    switch (variant) {
      case 'primary':
        return {
          sx: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
            fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
            '&:hover': disabled ? {} : {
              background: '#2563eb',
              transform: 'translateY(-1px)',
            },
          }
        };
      case 'secondary':
        return {
          sx: {
            background: 'white',
            color: '#3b82f6',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
            fontWeight: 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
            '&:hover': disabled ? {} : {
              background: '#3b82f6',
              color: 'white',
            },
          }
        };
      case 'action':
        return {
          sx: {
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
            fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
            '&:hover': disabled ? {} : {
              background: '#059669',
            },
          }
        };
      case 'lesson':
        return {
          sx: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
            fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: disabled ? 0.6 : 1,
            boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
            '&:hover': disabled ? {} : {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            },
          }
        };
      default:
        return {};
    }
  };

  const buttonProps = getButtonProps();
  
  return (
    <Button
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      {...buttonProps}
      sx={{ ...buttonProps.sx, ...sx }}
      {...props}
    >
      {children}
    </Button>
  );
};

const meta: Meta<typeof AtomicButton> = {
  title: 'Atoms/Button',
  component: AtomicButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Basic button atoms used throughout the French learning platform. Based on the design mockups with consistent styling and interactions.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'action', 'lesson'],
      description: 'Button style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Button States and Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Continue Learning',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Preview Path',
  },
};

export const Action: Story = {
  args: {
    variant: 'action',
    children: 'Check Answers',
  },
};

export const Lesson: Story = {
  args: {
    variant: 'lesson',
    children: 'Start Lesson',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '300px' }}>
        <Story />
      </Box>
    ),
  ],
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: '200px' }}>
      <AtomicButton variant="primary">Primary Button</AtomicButton>
      <AtomicButton variant="secondary">Secondary Button</AtomicButton>
      <AtomicButton variant="action">Action Button</AtomicButton>
      <AtomicButton variant="lesson">Lesson Button</AtomicButton>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants showcased together.',
      },
    },
  },
};

// Interactive States
export const InteractiveStates: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, minWidth: '600px' }}>
      <Box sx={{ textAlign: 'center' }}>
        <h4>Normal</h4>
        <AtomicButton variant="primary">Button</AtomicButton>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <h4>Hover</h4>
        <AtomicButton variant="primary" sx={{ '&:hover': { background: '#2563eb', transform: 'translateY(-1px)' } }}>
          Button
        </AtomicButton>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <h4>Active</h4>
        <AtomicButton variant="primary" sx={{ background: '#1d4ed8', transform: 'translateY(0px)' }}>
          Button
        </AtomicButton>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <h4>Disabled</h4>
        <AtomicButton variant="primary" disabled>Button</AtomicButton>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive states of the primary button.',
      },
    },
  },
};
