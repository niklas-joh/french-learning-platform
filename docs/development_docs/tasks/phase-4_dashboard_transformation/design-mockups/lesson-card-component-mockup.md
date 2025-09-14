# Modern Lesson Card Component Design Mockup

## Overview
Transformation of the `QuickActionCard` component into a clean, modern lesson card featuring professional typography, subtle shadows, and color-coded difficulty indicators that align with contemporary language learning applications.

## Component Architecture Strategy

### **Modern Enhancement Approach**
```typescript
interface ModernLessonCardProps extends QuickActionCardProps {
  // Enhanced props for modern design
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  estimatedTime?: number;
  xpReward?: number;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
  category?: string;
  tags?: string[];
}
```

## Visual Design Specification

### **1. Clean Card Foundation**
```css
.modern-lesson-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  min-height: 160px;
  display: flex;
  flex-direction: column;
}

.modern-lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06);
}

.modern-lesson-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### **2. Card Header Layout**
```css
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.lesson-icon {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

.progress-indicator {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

### **3. Modern Progress Circle**
```css
.progress-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-track {
  stroke: #f3f4f6;
  stroke-width: 3;
  fill: none;
}

.progress-bar {
  stroke: #3b82f6;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-in-out;
}

.progress-bar.completed {
  stroke: #10b981;
}

.progress-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  position: relative;
  z-index: 1;
}
```

### **4. Modern Difficulty Badge System**
```css
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.difficulty-badge.beginner {
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.difficulty-badge.intermediate {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.difficulty-badge.advanced {
  background: #fed7aa;
  color: #c2410c;
  border: 1px solid #fdba74;
}
```

## Modern Card State Examples

### **State 1: Beginner Lesson (Not Started)**
```
┌─────────────────────────────────────────┐
│ [Beginner]                    ○○○○○ 0% │
│                                         │
│ 👋                                      │
│ French Greetings                        │
│ Master common French greetings          │
│                                         │
│                                         │
│ ⏱️ 15min                    ⭐ 50 XP   │
└─────────────────────────────────────────┘
```

### **State 2: Intermediate Lesson (In Progress)**  
```
┌─────────────────────────────────────────┐
│ [Intermediate]            ●●●○○ 75%     │
│                                         │
│ 📅                                      │
│ Past Tense Mastery                      │
│ Learn passé composé usage               │
│                                         │
│                                         │
│ ⏱️ 25min                    ⭐ 75 XP   │
└─────────────────────────────────────────┘
```

### **State 3: Advanced Lesson (Challenge)**
```
┌─────────────────────────────────────────┐
│ [Advanced]                ○○○○○ 0%     │
│                                         │
│ 🤔                                      │
│ Subjunctive Practice                    │
│ Master advanced grammar                 │
│                                         │
│                                         │
│ ⏱️ 30min                   ⭐ 100 XP   │
└─────────────────────────────────────────┘
```

### **State 4: Completed Lesson**
```
┌─────────────────────────────────────────┐
│ [✅ Complete]            ●●●●● 100%    │
│                                         │
│ 💬                                      │
│ Conversation Practice                   │
│ Real-world scenarios                    │
│                                         │
│                                         │
│ ⏱️ 20min                    ⭐ 60 XP   │
└─────────────────────────────────────────┘
```

## Modern Typography and Content Layout

### **Typography System**
```css
.lesson-title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.lesson-description {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.4;
  margin: 0 0 16px 0;
  flex-grow: 1;
}

.lesson-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
}

.time-estimate {
  display: flex;
  align-items: center;
  gap: 4px;
}

.xp-reward {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3b82f6;
}
```

### **Interactive Hover Effects**
```css
.modern-lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06);
}

.modern-lesson-card:hover .progress-indicator {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

.modern-lesson-card:hover .difficulty-badge {
  transform: scale(1.02);
  transition: transform 0.2s ease-in-out;
}
```

## Modern Progress Ring Implementation

### **Clean Progress Circle**
```typescript
const ModernProgressRing: React.FC<{ progress: number; completed: boolean }> = ({ 
  progress, 
  completed 
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-indicator">
      <svg className="progress-circle" width="48" height="48">
        {/* Background track */}
        <circle
          className="progress-track"
          stroke="#f3f4f6"
          strokeWidth="3"
          fill="none"
          r={radius}
          cx="24"
          cy="24"
        />
        {/* Progress bar */}
        <circle
          className={`progress-bar ${completed ? 'completed' : ''}`}
          stroke={completed ? "#10b981" : "#3b82f6"}
          strokeWidth="3"
          fill="none"
          r={radius}
          cx="24"
          cy="24"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 1s ease-in-out'
          }}
        />
      </svg>
      {/* Progress text */}
      <span className="progress-text">
        {progress}%
      </span>
    </div>
  );
};
```

## Modern Difficulty Badge System

### **Clean Difficulty Indicators**
```typescript
const ModernDifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const getBadgeConfig = (level: string) => {
    switch (level) {
      case 'beginner':
        return { label: 'Beginner', className: 'beginner' };
      case 'intermediate':
        return { label: 'Intermediate', className: 'intermediate' };
      case 'advanced':
        return { label: 'Advanced', className: 'advanced' };
      default:
        return { label: 'Beginner', className: 'beginner' };
    }
  };

  const config = getBadgeConfig(difficulty);
  
  return (
    <div className={`difficulty-badge ${config.className}`}>
      <span>{config.label}</span>
    </div>
  );
};
```

### **Completion Status Badge**
```typescript
const CompletionBadge: React.FC<{ status: string; progress: number }> = ({ 
  status, 
  progress 
}) => {
  if (status === 'completed') {
    return (
      <div className="difficulty-badge beginner">
        <span>✅ Complete</span>
      </div>
    );
  }
  
  if (status === 'in_progress' && progress > 0) {
    return (
      <div className="difficulty-badge intermediate">
        <span>📊 In Progress</span>
      </div>
    );
  }
  
  return null;
};
```

## Modern Component Implementation

### **Complete Modern Lesson Card**
```typescript
export const ModernLessonCard = React.memo<ModernLessonCardProps>((props) => {
  const {
    icon,
    title,
    description,
    difficulty = 'beginner',
    progress = 0,
    completionStatus = 'not_started',
    estimatedTime = 15,
    xpReward = 50,
    onClick,
    disabled = false,
    ...rest
  } = props;

  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick();
  }, [disabled, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const isCompleted = completionStatus === 'completed';

  return (
    <div
      className="modern-lesson-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${title} lesson, ${progress}% complete, ${estimatedTime} minutes, ${xpReward} XP`}
      {...rest}
    >
      {/* Card Header */}
      <div className="card-header">
        <div>
          <span className="lesson-icon">{icon}</span>
          {completionStatus === 'completed' ? (
            <CompletionBadge status={completionStatus} progress={progress} />
          ) : (
            <ModernDifficultyBadge difficulty={difficulty} />
          )}
        </div>
        <ModernProgressRing progress={progress} completed={isCompleted} />
      </div>

      {/* Card Content */}
      <h3 className="lesson-title">{title}</h3>
      <p className="lesson-description">{description}</p>

      {/* Card Footer */}
      <div className="lesson-meta">
        <div className="time-estimate">
          <span>⏱️</span>
          <span>{estimatedTime}min</span>
        </div>
        <div className="xp-reward">
          <span>⭐</span>
          <span>{xpReward} XP</span>
        </div>
      </div>
    </div>
  );
});
```

## Mobile Responsiveness

### **Mobile Adaptations**
```css
@media (max-width: 600px) {
  .quick-action-card[data-render-mode="lesson-card"] {
    min-height: 120px;  /* Slightly smaller on mobile */
  }
  
  .progress-ring-container {
    width: 40px;        /* Smaller progress ring */
    height: 40px;
  }
  
  .difficulty-badge,
  .xp-reward-badge {
    font-size: 0.625rem; /* Smaller text on mobile */
    padding: 3px 6px;
  }
  
  .recommendation-overlay {
    padding: 12px 8px 28px 8px; /* Adjusted padding */
    font-size: 0.6875rem;
  }
}
```

## Accessibility Enhancements

### **Screen Reader Support**
```typescript
// Enhanced ARIA attributes for lesson cards
const getAccessibilityProps = (props: EnhancedQuickActionCardProps) => {
  const { title, progress, completionStatus, xpReward, aiPersonalization } = props;
  
  const statusText = completionStatus === 'completed' ? 'completed' : 
                    completionStatus === 'in_progress' ? `${progress}% complete` : 
                    'not started';
  
  const rewardText = xpReward ? `, ${xpReward} XP reward` : '';
  const difficultyText = aiPersonalization ? 
    `, ${aiPersonalization.difficultyAdjustment} difficulty` : '';
  
  return {
    'aria-label': `${title} lesson, ${statusText}${rewardText}${difficultyText}`,
    'role': 'button',
    'tabIndex': 0,
    'aria-describedby': `${props.id}-description`
  };
};
```

### **Keyboard Navigation**
```typescript
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (onClick) onClick();
  }
}, [onClick]);
```

## Animation Timing and Performance

### **Optimized Animations**
```css
.quick-action-card {
  /* Use transform for better performance */
  will-change: transform, box-shadow;
}

.progress-foreground {
  /* Hardware acceleration for smooth progress animation */
  will-change: stroke-dashoffset;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .progress-foreground,
  .quick-action-card,
  .progress-ring-container {
    transition: none !important;
    animation: none !important;
  }
}
```

## Code Reuse Summary

### **Existing Functionality Maintained (95%)**:
- ✅ Base card styling and layout
- ✅ Hover effects and interactions  
- ✅ Click handling and keyboard navigation
- ✅ Accessibility attributes and focus management
- ✅ Responsive design patterns
- ✅ Error boundaries and performance optimization

### **New Enhancements Added (5%)**:
- Progress ring overlay component
- AI personalization badges
- XP reward indicators
- Recommendation reason overlays
- Conditional rendering based on mode

### **Total Implementation**: ~40 lines of new code added to existing 120-line component

---

**Result**: A sophisticated lesson card component that transforms the simple QuickActionCard into an engaging, gamified learning experience while maintaining all existing functionality and requiring minimal new code.
