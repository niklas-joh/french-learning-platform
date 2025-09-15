import type { Meta, StoryObj } from '@storybook/react';
import MainLayout from './MainLayout';

const meta = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main layout component that wraps the entire application with mobile-first responsive design.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default main layout with gradient background and mobile-first container.',
      },
    },
  },
};

export const WithMockContent: Story = {
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h2>French Learning Platform</h2>
          <p>This is the main layout wrapper</p>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Main layout with mock content to show how it would look with actual content.',
      },
    },
  },
};
