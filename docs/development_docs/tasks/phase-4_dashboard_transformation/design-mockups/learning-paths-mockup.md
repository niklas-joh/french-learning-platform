# Learning Paths Mockup - Modern Clean Design

## Overview
This mockup demonstrates the transformation of the learning paths interface using the modern, clean card-based design system. The design focuses on structured learning progression with clear visual hierarchy, dependency management, and gamified progress tracking.

## Design Philosophy
- **Clean Card-Based UI**: White backgrounds with subtle shadows and borders
- **Professional Typography**: System font stack for excellent readability
- **Semantic Color Coding**: Visual difficulty indication through color
- **Infrastructure Reuse**: 95% leverage of existing components and design tokens

## Visual Design Specifications

### Color Palette
- **Primary Background**: `#ffffff` (Clean white cards)
- **Card Borders**: `#e5e7eb` (Subtle gray borders)
- **Text Primary**: `#1f2937` (Dark gray for headers)
- **Text Secondary**: `#6b7280` (Medium gray for descriptions)
- **Path Colors**: 
  - **Beginner Path**: `#10b981` (Emerald green)
  - **Intermediate Path**: `#3b82f6` (Blue)  
  - **Advanced Path**: `#f59e0b` (Amber)
  - **Specialized Path**: `#8b5cf6` (Purple)

### Typography Scale
- **Page Title**: 2rem (32px), font-weight: 700
- **Path Title**: 1.5rem (24px), font-weight: 600
- **Lesson Title**: 1.125rem (18px), font-weight: 500
- **Description**: 0.875rem (14px), font-weight: 400
- **Metadata**: 0.75rem (12px), font-weight: 500

## Layout Structure

### Header Section
```
📚 Learning Paths
Structured learning journeys designed for your level

[Search Paths...] [Filter: All Levels ▼] [Sort: Recommended ▼]
```

### Path Cards Grid
```
┌─────────────────────────────────────────────────────────┐
│ 🌱 Beginner French Foundation                          │
│ Master the basics of French language                    │
│                                                         │
│ ████████░░ 80% Complete (8/10 lessons)                 │
│ ⏱️ 15min avg • 🎯 A1 Level • ⭐ 450 XP earned          │
│                                                         │
│ Next: Les Articles (the, a, an)                        │
│ [Continue Learning]                    [Preview Path]   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔥 Intermediate Conversation                           │
│ Build confidence in real conversations                  │
│                                                         │
│ ░░░░░░░░░░ 0% Complete (0/12 lessons)                  │
│ ⏱️ 20min avg • 🎯 B1 Level • 🔒 Unlock: Complete A2    │
│                                                         │
│ First: Common Conversation Starters                     │
│ [Start Path]                          [Preview Path]   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 💼 Business French                                     │
│ Professional French for work environments               │
│                                                         │
│ ░░░░░░░░░░ 0% Complete (0/15 lessons)                  │
│ ⏱️ 25min avg • 🎯 B2 Level • 🔒 Unlock: Complete B1    │
│                                                         │
│ First: Business Email Etiquette                        │
│ [Start Path]                          [Preview Path]   │
└─────────────────────────────────────────────────────────┘
```

## Interactive Elements

### Path Card Components
- **Progress Bar**: Animated progress indicator with gradient fill
- **Lesson Count**: Clear indicator of completion status
- **Difficulty Badge**: Color-coded level indicators
- **Time Estimates**: Average lesson duration
- **XP Rewards**: Gamification element showing earned/potential XP
- **Prerequisites**: Clear dependency indicators with lock icons
- **Action Buttons**: Primary/secondary button styling

### Hover States
- **Card Elevation**: Subtle shadow increase on hover
- **Button Highlights**: Color transitions on interactive elements
- **Preview Functionality**: Quick lesson overview on hover

## Responsive Design

### Desktop (1024px+)
- **3-column grid layout**
- **Full path descriptions visible**
- **Side-by-side action buttons**

### Tablet (640px - 1023px)
- **2-column grid layout**
- **Condensed descriptions**
- **Stacked action buttons**

### Mobile (< 640px)
- **Single column layout**
- **Compact card design**
- **Touch-optimized button sizing**

## Path Detail Modal (Preview)
```
┌─────────────────────────────────────────────┐
│ ✕                                          │
│                                            │
│ 🌱 Beginner French Foundation              │
│ Master the basics of French language       │
│                                            │
│ 📊 Path Overview:                          │
│ • 10 lessons total                         │
│ • 3-4 hours estimated completion           │
│ • A1 level certification                   │
│ • 600 XP total rewards                     │
│                                            │
│ 📚 Lesson Sequence:                        │
│ ✅ 1. French Alphabet & Pronunciation      │
│ ✅ 2. Basic Greetings                      │
│ ✅ 3. Numbers 1-20                         │
│ ▶️ 4. Les Articles (the, a, an)           │
│ 🔒 5. Common Adjectives                    │
│ 🔒 6. Present Tense Verbs                  │
│ ... 4 more lessons                         │
│                                            │
│ [Start Next Lesson] [Back to Paths]       │
└─────────────────────────────────────────────┘
```

## Accessibility Features
- **Semantic HTML Structure**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: 4.5:1 minimum contrast ratios
- **Focus Indicators**: Clear visual focus states

## Component Reuse Strategy

### Existing Infrastructure Leveraged
- **Card Components**: Extend existing card patterns
- **Button Components**: Reuse Material-UI button variants
- **Progress Components**: Enhance existing progress indicators
- **Grid Layout**: Leverage existing responsive grid system

### New Components Required
- **PathCard**: Enhanced card component with progress integration
- **PathDetailModal**: Preview modal with lesson sequence
- **DifficultyBadge**: Color-coded level indicators
- **PrerequisiteLock**: Visual dependency indicators

## Content Strategy

### Realistic Path Examples
1. **Beginner Foundation** (A1): Alphabet, greetings, numbers, articles
2. **Everyday Conversations** (A2): Shopping, dining, directions, weather
3. **Intermediate Grammar** (B1): Past tenses, subjunctive, conditionals
4. **Advanced Fluency** (B2): Literature, complex discussions, nuances
5. **Business French** (Specialized): Emails, meetings, presentations
6. **Travel French** (Specialized): Airport, hotel, emergency situations

### Gamification Elements
- **XP System**: Clear reward structure for path completion
- **Achievement Badges**: Path-specific accomplishments
- **Streak Bonuses**: Daily learning streak multipliers
- **Social Progress**: Compare progress with friends

## Implementation Notes

### Data Structure
```typescript
interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: 'foundation' | 'conversation' | 'grammar' | 'specialized';
  lessons: LessonSummary[];
  estimatedHours: number;
  xpReward: number;
  prerequisites?: string[];
  userProgress: {
    completedLessons: number;
    currentLesson?: string;
    percentComplete: number;
    xpEarned: number;
  };
}
```

### Performance Considerations
- **Lazy Loading**: Load path details on demand
- **Image Optimization**: WebP format with fallbacks
- **Smooth Animations**: CSS transitions under 300ms
- **Memory Management**: Efficient component unmounting

## Success Metrics
- **User Engagement**: Path completion rates
- **Navigation Efficiency**: Time to start lessons
- **Accessibility Score**: 100% WCAG 2.1 AA compliance
- **Performance**: <3s load time, >90 Lighthouse score

This learning paths interface provides a clean, intuitive way for users to navigate their French learning journey while maintaining the modern design system established in the other mockups.
