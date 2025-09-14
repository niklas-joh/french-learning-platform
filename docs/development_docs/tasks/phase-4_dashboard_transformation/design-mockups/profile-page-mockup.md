# Profile Page Mockup - Modern Clean Design

## Overview
This mockup demonstrates the user profile interface transformation using the modern, clean card-based design system. The design focuses on user account management, learning preferences, achievement showcase, and social features.

## Design Philosophy
- **User-Centric Interface**: Personalized dashboard with user control
- **Clean Information Architecture**: Organized sections for different profile aspects
- **Social Integration**: Achievement sharing and friend connectivity
- **Accessibility First**: Comprehensive accessibility features

## Visual Design Specifications

### Color Palette
- **Primary Background**: `#f9fafb` (Light gray background)
- **Content Cards**: `#ffffff` (Clean white cards)
- **Card Borders**: `#e5e7eb` (Subtle gray borders)
- **Profile Accents**: `#3b82f6` (Blue for primary actions)
- **Achievement Gold**: `#f59e0b` (Amber for badges)
- **Social Green**: `#10b981` (Green for social features)

### Typography Scale
- **Profile Name**: 2rem (32px), font-weight: 700
- **Section Headers**: 1.5rem (24px), font-weight: 600
- **Setting Labels**: 1rem (16px), font-weight: 500
- **Status Text**: 0.875rem (14px), font-weight: 400

## Layout Structure

### Profile Header
```
┌─────────────────────────────────────────────────────────┐
│  [Profile Photo]    Marie Dubois                      │
│      [Edit]         French Language Learner            │
│                     🇫🇷 A2 Level • 1,247 XP • 23 days │
│                     Joined March 2024                  │
│                                                         │
│  [Edit Profile] [Share Profile] [Account Settings]     │
└─────────────────────────────────────────────────────────┘
```

### Account Settings Section
```
┌─────────────────────────────────────────────────────────┐
│                    ⚙️ Account Settings                  │
│                                                         │
│ Email               marie.dubois@email.com    [Change] │
│ Password            ••••••••••••••••••••••    [Change] │
│ Language Interface  English                   [Change] │
│ Timezone           Europe/Paris                [Change] │
│                                                         │
│ [Delete Account]                                        │
└─────────────────────────────────────────────────────────┘
```

### Learning Preferences Section
```
┌─────────────────────────────────────────────────────────┐
│                 📚 Learning Preferences                 │
│                                                         │
│ Daily Goal         30 minutes            [●●●○○]       │
│ XP Target          200 XP per week       [Adjust]      │
│ Difficulty         Adaptive              [Manual]      │
│ Review Frequency   Daily                 [Weekly]      │
│ Audio Speed        Normal                [Slow/Fast]   │
│                                                         │
│ 🔔 Notifications                                       │
│ Daily Reminders    [✓] 8:00 AM                        │
│ Streak Alerts      [✓] Enabled                        │
│ Achievement Alerts [✓] Enabled                        │
│ Friend Activity    [○] Disabled                       │
└─────────────────────────────────────────────────────────┘
```

### Achievement Showcase
```
┌─────────────────────────────────────────────────────────┐
│                   🏆 Achievement Gallery                │
│                                                         │
│ Recent Badges (5 of 23 total):                         │
│                                                         │
│ 🔥 Week Warrior  📚 Lesson Master  ⭐ XP Champion      │
│ 7 days ago       5 days ago        3 days ago         │
│                                                         │
│ 🎯 Grammar Pro   💬 Conversation                       │
│ 2 weeks ago      1 month ago                           │
│                                                         │
│ [View All Achievements] [Share Gallery]                │
└─────────────────────────────────────────────────────────┘
```

### Social Features Section
```
┌─────────────────────────────────────────────────────────┐
│                    👥 Social Learning                   │
│                                                         │
│ Friends            12 friends        [Manage Friends]  │
│ Following          8 learners        [Find More]       │
│ Followers          15 people         [View All]        │
│                                                         │
│ This Week's Leaderboard:                               │
│ 1. 🥇 Thomas K.    420 XP                             │
│ 2. 🥈 You          385 XP                             │
│ 3. 🥉 Sarah M.     360 XP                             │
│                                                         │
│ [Join Study Group] [Challenge Friends]                 │
└─────────────────────────────────────────────────────────┘
```

## Interactive Elements

### Profile Editing Modal
- **Photo Upload**: Drag-and-drop or click to select
- **Bio Editor**: Rich text editing for profile description
- **Privacy Controls**: Public/private profile toggle
- **Language Goals**: Set target proficiency levels

### Achievement Details
- **Badge Information**: Unlocking requirements and progress
- **Sharing Options**: Social media integration
- **Progress Tracking**: Visual progress toward next achievements

### Friend Management
- **Friend Requests**: Incoming and outgoing requests
- **Activity Feed**: Friends' recent learning activity
- **Study Groups**: Create and join collaborative learning groups

## Responsive Design

### Desktop (1024px+)
- **Two-column layout**: Profile info and settings side-by-side
- **Expandable sections**: Detailed views for each category
- **Rich interactions**: Hover states and animations

### Tablet (640px - 1023px)
- **Single column**: Stacked sections with good spacing
- **Touch-optimized**: Larger buttons and input fields
- **Swipeable galleries**: Achievement and friend carousels

### Mobile (< 640px)
- **Compact cards**: Essential information prioritized
- **Bottom navigation**: Quick access to key actions
- **Progressive disclosure**: Collapsible sections

## Accessibility Features
- **Screen Reader Support**: Comprehensive ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility options
- **Voice Control**: Integration with browser voice commands

## Component Reuse Strategy
- **Form Components**: Leverage existing input and button styles
- **Card Layout**: Extend current card-based system
- **Modal System**: Reuse existing modal components
- **Navigation**: Integrate with current routing system

## Success Metrics
- **Profile Completion**: Percentage of users with complete profiles
- **Settings Engagement**: Usage of customization features
- **Social Participation**: Friend connections and interactions
- **Achievement Sharing**: Social media engagement rates

This profile interface provides comprehensive user account management while maintaining the clean, modern design system and encouraging social learning engagement.
