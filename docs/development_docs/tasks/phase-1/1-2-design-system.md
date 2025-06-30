# Task 1.2: Create Design System

Create the following file with the specified content:

**File**: `client/src/styles/design-tokens.css`
```css
:root {
  /* French-themed color palette */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --french-blue: #667eea;
  --french-purple: #764ba2;
  --french-accent: #ff6b6b;
  
  /* Glassmorphism effects */
  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(255, 255, 255, 0.2);
  --backdrop-blur: blur(20px);
  
  /* Rounded design */
  --border-radius-small: 12px;
  --border-radius-medium: 20px;
  --border-radius-large: 30px;
  
  /* Modern shadows */
  --shadow-light: 0 8px 25px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 15px 40px rgba(0, 0, 0, 0.15);
  --shadow-heavy: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  /* Animation timings */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
}

/* Global glassmorphism utilities */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-light);
  transition: all var(--transition-normal);
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

/* Mobile-first responsive breakpoints */
@media (min-width: 768px) {
  .glass-card {
    border-radius: var(--border-radius-large);
  }
}
