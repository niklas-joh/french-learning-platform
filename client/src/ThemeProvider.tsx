import React, { createContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleMode: () => {},
  setMode: () => {},
});

interface Props {
  children: ReactNode;
}

// Design System Theme Configuration
const createDesignSystemTheme = (mode: ThemeMode) => {
  const isLight = mode === 'light';
  
  // Extract actual color values from design tokens
  const colors = {
    light: {
      accentBlue: '#2563EB',
      accentBlueLight: '#3B82F6',
      accentGreen: '#16A34A',
      accentGreenLight: '#22C55E',
      accentAmber: '#D97706',
      accentAmberLight: '#F59E0B',
      accentRed: '#DC2626',
      accentRedLight: '#EF4444',
      gray700: '#394150',
      gray600: '#4E5563',
      gray800: '#252A33',
      backgroundPrimary: '#FFFFFF',
      backgroundSecondary: '#FAFBFC',
      textPrimary: '#252A33',
      textSecondary: '#4E5563',
      textTertiary: '#6B7280',
      borderLight: '#E7E8EA',
    },
    dark: {
      accentBlue: '#3B82F6',
      accentBlueLight: '#60A5FA',
      accentGreen: '#22C55E',
      accentGreenLight: '#4ADE80',
      accentAmber: '#F59E0B',
      accentAmberLight: '#FBBF24',
      accentRed: '#EF4444',
      accentRedLight: '#F87171',
      gray700: '#6B7280',
      gray600: '#9AA0A6',
      gray800: '#374151',
      backgroundPrimary: '#252A33',
      backgroundSecondary: '#1A1F26',
      textPrimary: '#FFFFFF',
      textSecondary: '#9AA0A6',
      textTertiary: '#6B7280',
      borderLight: '#394150',
    },
  };
  
  const currentColors = isLight ? colors.light : colors.dark;
  
  return createTheme({
    palette: {
      mode,
      // Align MUI palette to design token values
      primary: {
        main: currentColors.accentBlue,
        light: currentColors.accentBlueLight,
        dark: currentColors.accentBlue,
        contrastText: currentColors.backgroundPrimary,
      },
      secondary: {
        main: currentColors.gray700,
        light: currentColors.gray600,
        dark: currentColors.gray800,
        contrastText: currentColors.backgroundPrimary,
      },
      background: {
        default: currentColors.backgroundSecondary,   // Page background
        paper: currentColors.backgroundPrimary,       // Card background
      },
      text: {
        primary: currentColors.textPrimary,
        secondary: currentColors.textSecondary,
        disabled: currentColors.textTertiary,
      },
      divider: currentColors.borderLight,
      
      // Semantic colors using actual values
      success: {
        main: currentColors.accentGreen,
        light: currentColors.accentGreenLight,
        dark: currentColors.accentGreen,
        contrastText: currentColors.backgroundPrimary,
      },
      warning: {
        main: currentColors.accentAmber,
        light: currentColors.accentAmberLight,
        dark: currentColors.accentAmber,
        contrastText: currentColors.backgroundPrimary,
      },
      error: {
        main: currentColors.accentRed,
        light: currentColors.accentRedLight,
        dark: currentColors.accentRed,
        contrastText: currentColors.backgroundPrimary,
      },
      info: {
        main: currentColors.accentBlue,
        light: currentColors.accentBlueLight,
        dark: currentColors.accentBlue,
        contrastText: currentColors.backgroundPrimary,
      },
      
      // Custom greys reference tokens for consistency
      grey: {
        50: '#FAFBFC',
        100: '#F4F5F7',
        200: '#E7E8EA',
        300: '#D3D5D9',
        400: '#9AA0A6',
        500: '#6B7280',
        600: '#4E5563',
        700: '#394150',
        800: '#252A33',
        900: '#1A1F26',
      },
    },
    
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      
      // Typography scale using actual values
      h1: { 
        fontSize: '2.5rem',    // 40px
        fontWeight: 600, 
        color: currentColors.textPrimary,
        lineHeight: 1.2,
      },
      h2: { 
        fontSize: '2rem',      // 32px
        fontWeight: 600, 
        color: currentColors.textPrimary,
        lineHeight: 1.3,
      },
      h3: { 
        fontSize: '1.5rem',    // 24px
        fontWeight: 600, 
        color: currentColors.textPrimary,
        lineHeight: 1.4,
      },
      h4: { 
        fontSize: '1.25rem',   // 20px
        fontWeight: 500, 
        color: currentColors.textPrimary,
        lineHeight: 1.4,
      },
      h5: { 
        fontSize: '1.125rem',  // 18px
        fontWeight: 500, 
        color: isLight ? '#252A33' : '#FFFFFF',
        lineHeight: 1.5,
      },
      h6: { 
        fontSize: '1rem',      // 16px
        fontWeight: 500, 
        color: isLight ? '#252A33' : '#FFFFFF',
        lineHeight: 1.5,
      },
      body1: { 
        fontSize: '1rem',      // 16px
        color: isLight ? '#4E5563' : '#9AA0A6',
        lineHeight: 1.6,
      },
      body2: { 
        fontSize: '0.875rem',  // 14px
        color: isLight ? '#6B7280' : '#9AA0A6',
        lineHeight: 1.6,
      },
      caption: {
        fontSize: '0.75rem',   // 12px
        color: isLight ? '#6B7280' : '#9AA0A6',
      },
    },
    
    shape: {
      borderRadius: 16,  // Modern look from design system
    },
    
    spacing: 8, // Base spacing unit (8px)
    
    shadows: [
      'none',
      '0 1px 2px rgba(0, 0, 0, 0.04)',
      '0 2px 8px rgba(0, 0, 0, 0.08)',
      '0 4px 12px rgba(0, 0, 0, 0.12)',
      '0 8px 16px rgba(0, 0, 0, 0.16)',
      '0 12px 24px rgba(0, 0, 0, 0.20)',
      // ... extend as needed with subtle shadows
      ...Array(19).fill('0 12px 24px rgba(0, 0, 0, 0.20)'), // Fill remaining slots
    ] as any,
    
    components: {
      // Button component overrides
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            backgroundColor: '#252A33',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#394150',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            },
          },
          outlined: {
            borderColor: '#E7E8EA',
            color: '#4E5563',
            '&:hover': {
              borderColor: '#D3D5D9',
              backgroundColor: '#FAFBFC',
            },
          },
        },
      },
      
      // Card component overrides
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isLight ? '#E7E8EA' : '#394150'}`,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderColor: isLight ? '#D3D5D9' : '#4E5563',
            },
          },
        },
      },
      
      // Chip/Badge component overrides
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,    // --border-radius-small
            fontSize: '0.75rem', // --font-size-xs (12px)
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
          },
        },
      },
      
      // Paper component overrides
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,   // --border-radius-large
          },
        },
      },
    },
  });
};

// Custom theme augmentation for our design system colors
declare module '@mui/material/styles' {
  interface Theme {
    designSystem: {
      colors: {
        // Accent colors with backgrounds for badges
        accent: {
          green: { main: string; light: string; bg: string };
          amber: { main: string; light: string; bg: string };
          red: { main: string; light: string; bg: string };
          blue: { main: string; light: string; bg: string };
          purple: { main: string; light: string; bg: string };
          orange: { main: string; light: string; bg: string };
        };
        // Background variations
        backgrounds: {
          primary: string;
          secondary: string;
          tertiary: string;
        };
      };
    };
  }
  
  interface ThemeOptions {
    designSystem?: {
      colors?: {
        accent?: {
          green?: { main: string; light: string; bg: string };
          amber?: { main: string; light: string; bg: string };
          red?: { main: string; light: string; bg: string };
          blue?: { main: string; light: string; bg: string };
          purple?: { main: string; light: string; bg: string };
          orange?: { main: string; light: string; bg: string };
        };
        backgrounds?: {
          primary: string;
          secondary: string;
          tertiary: string;
        };
      };
    };
  }
}

const ThemeProviderWrapper: React.FC<Props> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('themeMode');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const setMode = (newMode: ThemeMode) => {
    localStorage.setItem('themeMode', newMode);
    setModeState(newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(() => {
    const baseTheme = createDesignSystemTheme(mode);
    
    // Add our custom design system colors
    return createTheme(baseTheme, {
      designSystem: {
        colors: {
          accent: {
            green: { main: '#16A34A', light: '#22C55E', bg: '#F0FDF4' },
            amber: { main: '#D97706', light: '#F59E0B', bg: '#FFFBEB' },
            red: { main: '#DC2626', light: '#EF4444', bg: '#FEF2F2' },
            blue: { main: '#2563EB', light: '#3B82F6', bg: '#EFF6FF' },
            purple: { main: '#7C3AED', light: '#8B5CF6', bg: '#F5F3FF' },
            orange: { main: '#EA580C', light: '#F97316', bg: '#FFF7ED' },
          },
          backgrounds: {
            primary: mode === 'light' ? '#FFFFFF' : '#252A33',
            secondary: mode === 'light' ? '#FAFBFC' : '#1A1F26',
            tertiary: mode === 'light' ? '#F4F5F7' : '#394150',
          },
        },
      },
    });
  }, [mode]);

  const contextValue = useMemo(() => ({ mode, toggleMode, setMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeProviderWrapper;
