import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MemoryRouter } from 'react-router-dom';

// Create a theme similar to your app's theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8faff',
    },
  },
});

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f8faff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ minHeight: '100vh', background: 'var(--gradient-primary, linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%))' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
