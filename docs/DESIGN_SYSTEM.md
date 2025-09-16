# French Learning Platform Design System

## Overview

This document outlines the comprehensive design system for the French learning platform, establishing visual identity, design principles, component patterns, and implementation guidelines that ensure consistency across the application.

## Design Philosophy

### Core Principles

1. **Accessibility First**: WCAG 2.1 AA compliance across all components
2. **Progressive Enhancement**: Mobile-first responsive design approach
3. **Atomic Design Methodology**: Systematic component hierarchy for scalable development
4. **Gamification Integration**: Engaging learning experience through visual feedback
5. **AI-Focused Branding**: Modern, professional aesthetic emphasizing AI-powered learning

### Design Approach

- **Component-Driven Development**: Independent, reusable components with comprehensive Storybook documentation
- **Consistent Visual Language**: Unified styling patterns across all interface elements
- **Performance Optimization**: Efficient rendering through React.memo and strategic memoization
- **User-Centered Design**: Intuitive navigation and clear information hierarchy

## Visual Identity

### Brand Colors

#### Primary Palette - Subtle & Clean
```css
/* Neutral Foundation - Primary Background Colors */
--background-primary: #FFFFFF;
--background-secondary: #FAFBFC;
--background-tertiary: #F4F5F7;

/* Subtle Grays - Main Interface Colors */
--gray-50: #FAFBFC;
--gray-100: #F4F5F7;
--gray-200: #E7E8EA;
--gray-300: #D3D5D9;
--gray-400: #9AA0A6;
--gray-500: #6B7280;
--gray-600: #4E5563;
--gray-700: #394150;
--gray-800: #252A33;
--gray-900: #1A1F26;

/* Colorful Accents - Strategic Use Only */
--accent-green: #16A34A;        /* Beginner level */
--accent-green-light: #22C55E;
--accent-green-bg: #F0FDF4;

--accent-amber: #D97706;        /* Intermediate level */
--accent-amber-light: #F59E0B;
--accent-amber-bg: #FFFBEB;

--accent-red: #DC2626;          /* Advanced level */
--accent-red-light: #EF4444;
--accent-red-bg: #FEF2F2;

--accent-blue: #2563EB;         /* Interactive elements */
--accent-blue-light: #3B82F6;
--accent-blue-bg: #EFF6FF;

--accent-purple: #7C3AED;       /* AI features */
--accent-purple-light: #8B5CF6;
--accent-purple-bg: #F5F3FF;

--accent-orange: #EA580C;       /* Grammar/Practice */
--accent-orange-light: #F97316;
--accent-orange-bg: #FFF7ED;

/* Semantic Colors */
--success: #16A34A;
--warning: #D97706;
--error: #DC2626;
--info: #2563EB;
```

#### Usage Guidelines
- **Background Colors**: Clean white and very light grey foundations
- **Colorful Accents**: Used sparingly for badges, difficulty levels, and feature categorization
- **Text Colors**: Primarily grey scale with occasional colorful accents for emphasis
- **Interactive Elements**: Subtle hover states with minimal color changes

### Typography

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

#### Typography Scale
```css
/* Headings */
--font-size-h1: 2.5rem;    /* 40px */
--font-size-h2: 2rem;      /* 32px */
--font-size-h3: 1.5rem;    /* 24px */
--font-size-h4: 1.25rem;   /* 20px */
--font-size-h5: 1.125rem;  /* 18px */
--font-size-h6: 1rem;      /* 16px */

/* Body Text */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-base: 1rem;    /* 16px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-xs: 0.75rem;   /* 12px */

/* Font Weights */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Spacing System

#### Spacing Scale
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
```

## Component Design Patterns

### Card System

#### Base Card Style
```css
.card-base {
  background: #FFFFFF;
  border: 1px solid #E7E8EA;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
}

.card-base:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #D3D5D9;
}
```

#### Card Variations
- **Standard Card**: Clean white background with minimal borders and shadows
- **Lesson Card**: Subtle background with colorful accent borders based on difficulty
- **Progress Card**: Light grey background (#F4F5F7) for dashboard sections
- **Feature Card**: Clean white with strategic colorful icons or accents

### Button System

#### Button Hierarchy
1. **Primary**: Dark grey background (#252A33), white text - main actions like "Continue"
2. **Secondary**: White background, subtle border (#E7E8EA), grey text - secondary actions
3. **Text**: No background, grey text (#4E5563) - tertiary actions
4. **Icon**: Icon-only buttons with subtle grey backgrounds

#### Button Styles
```css
/* Primary Button */
.btn-primary {
  background: #252A33;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background: #394150;
}

/* Secondary Button */
.btn-secondary {
  background: #FFFFFF;
  color: #4E5563;
  border: 1px solid #E7E8EA;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover {
  border-color: #D3D5D9;
  background: #FAFBFC;
}
```

#### Button Sizes
- **Large**: 48px height - hero sections, primary CTAs
- **Medium**: 40px height - standard forms, cards  
- **Small**: 32px height - compact interfaces, inline actions

### Badge and Status System

#### Badge Types and Colors
- **Difficulty Badges**: Strategic use of accent colors
  - **Beginner**: Green accent (#16A34A) with light background (#F0FDF4)
  - **Intermediate**: Amber accent (#D97706) with light background (#FFFBEB)
  - **Advanced**: Red accent (#DC2626) with light background (#FEF2F2)
- **Feature Category Badges**:
  - **Grammar/Practice**: Orange accent (#EA580C) with light background (#FFF7ED)
  - **AI Features**: Purple accent (#7C3AED) with light background (#F5F3FF)
  - **Interactive Elements**: Blue accent (#2563EB) with light background (#EFF6FF)
- **Progress Badges**: XP counters with subtle grey backgrounds and colorful text accents
- **Status Badges**: Success/warning/error states with corresponding semantic colors

#### Badge Styling
```css
.badge-base {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Difficulty Badges */
.badge-beginner {
  background: #F0FDF4;
  color: #16A34A;
  border: 1px solid #BBF7D0;
}

.badge-intermediate {
  background: #FFFBEB;
  color: #D97706;
  border: 1px solid #FED7AA;
}

.badge-advanced {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
}
```

### Animation Guidelines

#### Transition Timing
```css
--transition-fast: 0.15s ease-out;
--transition-base: 0.2s ease-in-out;
--transition-slow: 0.3s ease-in-out;
```

#### Animation Patterns
- **Staggered Entrance**: Cards appear with 100ms delays
- **Hover Effects**: Subtle scale and shadow transformations
- **Loading States**: Skeleton screens with shimmer effects
- **Progress Animations**: Smooth progress bar transitions

## Responsive Design System

### Breakpoint System
```css
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### Grid Patterns

#### Layout Grids
- **1 Column**: Mobile (< 640px) - stacked layout
- **2 Column**: Tablet (640px - 1024px) - balanced content
- **3 Column**: Desktop (1024px+) - optimal content density
- **4 Column**: Large screens (1280px+) - maximum utilization

#### Component Responsive Patterns
```css
/* Mobile-first responsive grid */
.responsive-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .responsive-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .responsive-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1280px) {
  .responsive-grid { grid-template-columns: repeat(4, 1fr); }
}
```

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clear visual focus indicators

#### Keyboard Navigation
- **Tab Order**: Logical, predictable navigation sequence
- **Focus Management**: Visible focus indicators on all interactive elements
- **Keyboard Shortcuts**: Standard patterns for common actions

#### Screen Reader Support
```html
<!-- Proper ARIA labeling -->
<button aria-label="Start French lesson" aria-describedby="lesson-description">
  Commencer
</button>

<!-- Semantic HTML structure -->
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>
```

### Accessibility Features
- **High Contrast Mode**: Alternative color schemes for visual impairments
- **Reduced Motion**: Respects user's motion preferences
- **Screen Reader Optimization**: Comprehensive ARIA labeling
- **Keyboard-Only Navigation**: Full functionality without mouse

## Gamification Design Elements

### Progress Visualization

#### Progress Rings
```css
.progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-ring-circle {
  stroke: #e5e7eb;
  stroke-width: 8;
  fill: transparent;
  r: 52;
  cx: 60;
  cy: 60;
}

.progress-ring-progress {
  stroke: #6366f1;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease-in-out;
}
```

#### XP and Streak Counters
- **XP Display**: Large numbers with subtle animations
- **Streak Visualization**: Fire icons with numeric counters
- **Level Progression**: Progress bars with milestone indicators

### Achievement Systems
- **Badges**: Collectible achievements with unique designs
- **Certificates**: Completion recognition with elegant layouts
- **Leaderboards**: Competitive elements with ranking displays

## AI Dashboard Components

### AI-Specific Design Patterns

#### AI Tutor Cards
```typescript
// Example AI card styling
const aiCardStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden'
};
```

#### Content Generation Interfaces
- **Request Forms**: Clean, intuitive input interfaces
- **Progress Indicators**: Real-time generation status
- **Result Displays**: Elegant content presentation
- **Error Handling**: User-friendly error messages with recovery options

### Loading States
- **Skeleton Screens**: Content placeholders during loading
- **Spinner Animations**: Activity indicators for quick actions
- **Progress Bars**: Long-running operation feedback

## Component Library Structure

### Atomic Design Implementation

#### Atoms (Basic Building Blocks)
```
/atoms/
├── Button.stories.tsx           - Primary UI buttons
├── Badge.stories.tsx            - Status and gamification badges
├── ProgressIndicator.stories.tsx - Progress visualization
└── LoadingStates.stories.tsx    - Loading animations
```

#### Molecules (Simple Component Groups)
```
/molecules/
├── LessonCard.stories.tsx       - Learning content cards
├── AITutorCard.stories.tsx      - AI interaction cards
├── QuickActionCard.stories.tsx  - Dashboard action cards
├── ConfirmationDialog.stories.tsx - User confirmation dialogs
├── BottomTabNavigation.stories.tsx - Mobile navigation
├── FeatureCard.stories.tsx      - Landing page features
└── LessonNode.stories.tsx       - Learning path nodes
```

#### Organisms (Complex Component Systems)
```
/organisms/
├── EnhancedHeader.stories.tsx   - Main navigation header
├── AIDashboardLayout.stories.tsx - AI dashboard container
├── AIContentRequest.stories.tsx - Content generation interface
├── ContentManager.stories.tsx   - Admin content management
├── HeroSection.stories.tsx      - Landing page hero
├── FeaturesGrid.stories.tsx     - Feature showcase grid
├── LearningUnit.stories.tsx     - Learning module container
└── LearningPath.stories.tsx     - Complete learning journey
```

#### Templates (Page Layouts)
```
/templates/
└── DashboardTemplate.stories.tsx - Main dashboard layout
```

#### Pages (Complete Interfaces)
```
/pages/
└── HomePage.stories.tsx - Complete homepage example
```

## Material-UI Integration

### Theme Configuration
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#252A33',      // Dark grey for primary buttons
      light: '#394150',     // Hover state
      dark: '#1A1F26',     // Pressed state
    },
    secondary: {
      main: '#4E5563',      // Secondary text/buttons
      light: '#6B7280',     // Lighter grey
      dark: '#394150',     // Darker grey
    },
    background: {
      default: '#FAFBFC',   // Page background
      paper: '#FFFFFF',     // Card background
    },
    text: {
      primary: '#252A33',   // Primary text
      secondary: '#4E5563', // Secondary text
      disabled: '#9AA0A6',  // Disabled text
    },
    divider: '#E7E8EA',     // Border colors
    // Accent colors for specific use cases
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
    },
    warning: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#B45309',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
    },
    info: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
    }
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
    h1: { fontWeight: 600, color: '#252A33' },
    h2: { fontWeight: 600, color: '#252A33' },
    h3: { fontWeight: 600, color: '#252A33' },
    h4: { fontWeight: 500, color: '#252A33' },
    h5: { fontWeight: 500, color: '#252A33' },
    h6: { fontWeight: 500, color: '#252A33' },
    body1: { color: '#4E5563' },
    body2: { color: '#6B7280' },
  },
  shape: {
    borderRadius: 16,  // Increased for more modern look
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.04)',
    '0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.12)',
    // ... extend as needed with subtle shadows
  ] as any,
});
```

### Styling Patterns
```typescript
// Consistent sx prop patterns for the new subtle design
const cardStyles = {
  background: '#FFFFFF',
  border: '1px solid #E7E8EA',
  borderRadius: '16px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    borderColor: '#D3D5D9',
  }
};

// Lesson card with difficulty accent
const lessonCardStyles = {
  ...cardStyles,
  position: 'relative',
  '&.beginner': {
    borderTopColor: '#16A34A',
    borderTopWidth: '3px',
  },
  '&.intermediate': {
    borderTopColor: '#D97706',
    borderTopWidth: '3px',
  },
  '&.advanced': {
    borderTopColor: '#DC2626',
    borderTopWidth: '3px',
  }
};

// Progress/Dashboard card with subtle background
const dashboardCardStyles = {
  background: '#F4F5F7',
  border: '1px solid #E7E8EA',
  borderRadius: '16px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s ease-in-out',
};
```

## Implementation Guidelines

### Development Best Practices

#### Component Development
1. **Start with Atoms**: Build smallest components first
2. **Progressive Assembly**: Combine atoms into molecules, then organisms
3. **Story-Driven Development**: Create stories before implementing features
4. **Accessibility Testing**: Test keyboard navigation and screen readers
5. **Responsive Testing**: Verify layouts across all breakpoints

#### Code Standards
```typescript
// Example component structure
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick
}) => {
  return (
    <Box
      component="button"
      sx={{
        // Consistent styling patterns
      }}
      onClick={onClick}
      disabled={disabled}
      aria-label="Descriptive label"
    >
      {children}
    </Box>
  );
};

export default React.memo(Component);
```

#### Performance Optimization
- **React.memo**: Prevent unnecessary re-renders
- **Strategic Memoization**: Use useMemo and useCallback appropriately
- **Lazy Loading**: Dynamic imports for large components
- **Image Optimization**: Responsive images with proper formats

### Testing Strategy
- **Unit Tests**: Component behavior and props
- **Integration Tests**: Component interactions
- **Accessibility Tests**: WCAG compliance
- **Visual Regression Tests**: Consistent visual appearance
- **Performance Tests**: Rendering performance metrics

## Usage Guidelines

### When to Use Each Component

#### Buttons
- **Primary Button**: Main actions (Submit, Save, Continue)
- **Secondary Button**: Alternative actions (Cancel, Back, Skip)
- **Text Button**: Tertiary actions (Learn more, View details)

#### Cards
- **Lesson Card**: Learning content presentation
- **Feature Card**: Marketing and informational content
- **Tutor Card**: AI interaction interfaces
- **Action Card**: Quick dashboard actions

#### Navigation
- **Bottom Tab Navigation**: Mobile primary navigation
- **Enhanced Header**: Desktop primary navigation
- **Breadcrumbs**: Hierarchical navigation context

### Customization Guidelines
- **Theme Overrides**: Use Material-UI theme customization
- **Prop Variations**: Leverage component prop APIs
- **Style Extensions**: Use sx prop for component-specific styling
- **Custom Hooks**: Create reusable logic patterns

## Future Considerations

### Planned Enhancements
- **Dark Mode Support**: Complete dark theme implementation
- **Internationalization**: Multi-language support patterns
- **Advanced Animations**: Motion design library integration
- **Component Variants**: Extended prop-based customization

### Maintenance Guidelines
- **Regular Audits**: Quarterly design system reviews
- **Usage Analytics**: Track component adoption and usage patterns
- **Feedback Integration**: Incorporate developer and user feedback
- **Documentation Updates**: Keep guidelines current with implementation

---

## Quick Reference

### Updated Color Palette - Subtle & Clean
**Primary Greys:**
- Background: #FFFFFF (primary), #FAFBFC (secondary), #F4F5F7 (tertiary)
- Text: #252A33 (primary), #4E5563 (secondary), #6B7280 (tertiary)
- Borders: #E7E8EA (primary), #D3D5D9 (secondary)

**Colorful Accents (Strategic Use Only):**
- Beginner: #16A34A (green), Intermediate: #D97706 (amber), Advanced: #DC2626 (red)
- AI Features: #7C3AED (purple), Grammar: #EA580C (orange), Interactive: #2563EB (blue)
- Semantic: Success #16A34A, Warning #D97706, Error #DC2626, Info #2563EB

### Spacing Scale
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px

### Typography Scale
40px, 32px, 24px, 20px, 18px, 16px, 14px, 12px

### Border Radius
Standard: 12px, Small: 8px, Large: 16px

### Breakpoints
640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1536px (2xl)

This design system serves as the foundation for all UI development in the French learning platform, ensuring consistency, accessibility, and maintainability across the entire application.
