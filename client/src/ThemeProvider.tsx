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

// Helper function to get computed CSS variable values
const getCSSVariableValue = (variable: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    return value;
  }
  // Fallback values for SSR
  const fallbacks: Record<string, string> = {
    '--accent-blue': '#2563EB',
    '--accent-blue-light': '#3B82F6',
    '--accent-green': '#16A34A',
    '--accent-green-light': '#22C55E',
    '--accent-amber': '#D97706',
    '--accent-amber-light': '#F59E0B',
    '--accent-red': '#DC2626',
    '--accent-red-light': '#EF4444',
    '--gray-700': '#394150',
    '--gray-600': '#4E5563',
    '--gray-800': '#252A33',
    '--background-primary': '#FFFFFF',
    '--background-secondary': '#FAFBFC',
    '--text-primary': '#252A33',
    '--text-secondary': '#4E5563',
    '--text-tertiary': '#6B7280',
    '--border-light': '#E7E8EA',
  };
  return fallbacks[variable] || '#000000';
};

// Design System Theme Configuration
const createDesignSystemTheme = (mode: ThemeMode) => {
  const isLight = mode === 'light';
  
  // Get actual color values from CSS variables for MUI theme
  // This maintains single source of truth while providing MUI-compatible values
  const colors = {
    accentBlue: getCSSVariableValue('--accent-blue'),
    accentBlueLight: getCSSVariableValue('--accent-blue-light'),
    accentGreen: getCSSVariableValue('--accent-green'),
    accentGreenLight: getCSSVariableValue('--accent-green-light'),
    accentAmber: getCSSVariableValue('--accent-amber'),
    accentAmberLight: getCSSVariableValue('--accent-amber-light'),
    accentRed: getCSSVariableValue('--accent-red'),
    accentRedLight: getCSSVariableValue('--accent-red-light'),
    gray700: getCSSVariableValue('--gray-700'),
    gray600: getCSSVariableValue('--gray-600'),
    gray800: getCSSVariableValue('--gray-800'),
    backgroundPrimary: getCSSVariableValue('--background-primary'),
    backgroundSecondary: getCSSVariableValue('--background-secondary'),
    textPrimary: getCSSVariableValue('--text-primary'),
    textSecondary: getCSSVariableValue('--text-secondary'),
    textTertiary: getCSSVariableValue('--text-tertiary'),
    borderLight: getCSSVariableValue('--border-light'),
  };
  
  return createTheme({
    palette: {
      mode,
      // Align MUI palette to design token values
      primary: {
        main: colors.accentBlue,
        light: colors.accentBlueLight,
        dark: colors.accentBlue,
        contrastText: colors.backgroundPrimary,
      },
      secondary: {
        main: colors.gray700,
        light: colors.gray600,
        dark: colors.gray800,
        contrastText: colors.backgroundPrimary,
      },
      background: {
        default: colors.backgroundSecondary,   // Page background
        paper: colors.backgroundPrimary,       // Card background
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        disabled: colors.textTertiary,
      },
      divider: colors.borderLight,
      
      // Semantic colors using actual values
      success: {
        main: colors.accentGreen,
        light: colors.accentGreenLight,
        dark: colors.accentGreen,
        contrastText: colors.backgroundPrimary,
      },
      warning: {
        main: colors.accentAmber,
        light: colors.accentAmberLight,
        dark: colors.accentAmber,
        contrastText: colors.backgroundPrimary,
      },
      error: {
        main: colors.accentRed,
        light: colors.accentRedLight,
        dark: colors.accentRed,
        contrastText: colors.backgroundPrimary,
      },
      info: {
        main: colors.accentBlue,
        light: colors.accentBlueLight,
        dark: colors.accentBlue,
        contrastText: colors.backgroundPrimary,
      },
      
      // Reference design token greys for consistency
      grey: {
        50: 'var(--gray-50)',
        100: 'var(--gray-100)',
        200: 'var(--gray-200)',
        300: 'var(--gray-300)',
        400: 'var(--gray-400)',
        500: 'var(--gray-500)',
        600: 'var(--gray-600)',
        700: 'var(--gray-700)',
        800: 'var(--gray-800)',
        900: 'var(--gray-900)',
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
      
      // Typography scale using design token values
      h1: { 
        fontSize: 'var(--font-size-h1)',
        fontWeight: 'var(--font-weight-semibold)', 
        color: colors.textPrimary,
        lineHeight: 1.2,
      },
      h2: { 
        fontSize: 'var(--font-size-h2)',
        fontWeight: 'var(--font-weight-semibold)', 
        color: colors.textPrimary,
        lineHeight: 1.3,
      },
      h3: { 
        fontSize: 'var(--font-size-h3)',
        fontWeight: 'var(--font-weight-semibold)', 
        color: colors.textPrimary,
        lineHeight: 1.4,
      },
      h4: { 
        fontSize: 'var(--font-size-h4)',
        fontWeight: 'var(--font-weight-medium)', 
        color: colors.textPrimary,
        lineHeight: 1.4,
      },
      h5: { 
        fontSize: 'var(--font-size-h5)',
        fontWeight: 'var(--font-weight-medium)', 
        color: colors.textPrimary,
        lineHeight: 1.5,
      },
      h6: { 
        fontSize: 'var(--font-size-h6)',
        fontWeight: 'var(--font-weight-medium)', 
        color: colors.textPrimary,
        lineHeight: 1.5,
      },
      body1: { 
        fontSize: 'var(--font-size-base)',
        color: colors.textSecondary,
        lineHeight: 1.6,
      },
      body2: { 
        fontSize: 'var(--font-size-sm)',
        color: colors.textSecondary,
        lineHeight: 1.6,
      },
      caption: {
        fontSize: 'var(--font-size-xs)',
        color: colors.textTertiary,
      },
    },
    
    shape: {
      borderRadius: 'var(--border-radius-large)',  // Reference design token
    },
    
    spacing: 8, // Base spacing unit (8px) - MUI expects number
    
    shadows: [
      'none',
      'var(--shadow-light)',
      'var(--shadow-medium)',
      'var(--shadow-heavy)',
      'var(--shadow-heavy)',
      'var(--shadow-heavy)',
      // Fill remaining slots with design token values
      ...Array(19).fill('var(--shadow-heavy)'),
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
            backgroundColor: 'var(--gray-800)',
            color: 'var(--background-primary)',
            '&:hover': {
              backgroundColor: 'var(--gray-700)',
              boxShadow: 'var(--shadow-medium)',
            },
          },
          outlined: {
            borderColor: 'var(--border-light)',
            color: 'var(--text-secondary)',
            '&:hover': {
              borderColor: 'var(--border-medium)',
              backgroundColor: 'var(--background-secondary)',
            },
          },
        },
      },
      
      // Card component overrides
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--border-radius-large)',
            border: `1px solid var(--border-light)`,
            boxShadow: 'var(--shadow-light)',
            transition: 'var(--transition-normal)',
            '&:hover': {
              boxShadow: 'var(--shadow-medium)',
              borderColor: 'var(--border-medium)',
            },
          },
        },
      },
      
      // Chip/Badge component overrides
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--border-radius-small)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
          },
        },
      },
      
      // Paper component overrides
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--border-radius-large)',
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
    
    // Set data-theme attribute on document root for CSS variable switching
    document.documentElement.setAttribute('data-theme', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // Set initial theme attribute on mount
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(() => {
    const baseTheme = createDesignSystemTheme(mode);
    
    // Add our custom design system colors using CSS variables
    return createTheme(baseTheme, {
      designSystem: {
        colors: {
          accent: {
            green: { main: 'var(--accent-green)', light: 'var(--accent-green-light)', bg: 'var(--accent-green-bg)' },
            amber: { main: 'var(--accent-amber)', light: 'var(--accent-amber-light)', bg: 'var(--accent-amber-bg)' },
            red: { main: 'var(--accent-red)', light: 'var(--accent-red-light)', bg: 'var(--accent-red-bg)' },
            blue: { main: 'var(--accent-blue)', light: 'var(--accent-blue-light)', bg: 'var(--accent-blue-bg)' },
            purple: { main: 'var(--accent-purple)', light: 'var(--accent-purple-light)', bg: 'var(--accent-purple-bg)' },
            orange: { main: 'var(--accent-orange)', light: 'var(--accent-orange-light)', bg: 'var(--accent-orange-bg)' },
          },
          backgrounds: {
            primary: 'var(--background-primary)',
            secondary: 'var(--background-secondary)',
            tertiary: 'var(--background-tertiary)',
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
