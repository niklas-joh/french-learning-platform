# Task 1.5: Create Base Page Components

Create the following file with the specified content:

**File**: `client/src/pages/HomePage.tsx`
```typescript
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import '../styles/design-tokens.css';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* Header */}
      <Box
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 3,
          mb: 3,
          borderRadius: 'var(--border-radius-large)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bonjour! 🇫🇷
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Ready for your French lesson today?
        </Typography>
        
        {/* Progress Ring Placeholder */}
        <Box
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700
          }}
        >
          75%
        </Box>
      </Box>

      {/* Quick Actions Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          mb: 3
        }}
      >
        <Card className="glass-card">
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Quick Lesson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              5 min practice
            </Typography>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ mb: 1 }}>🎤</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Speaking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pronunciation
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* AI Tutor Card Placeholder */}
      <Card
        className="glass-card"
        sx={{
          background: 'var(--gradient-primary)',
          color: 'white',
          p: 2
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontSize: '20px'
              }}
            >
              🤖
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Claude, your AI tutor
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Online and ready to help
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">
            Salut! Ready to practice some French conversation today?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomePage;
```

Create similar base components for:
- `client/src/pages/LessonsPage.tsx`
- `client/src/pages/PracticePage.tsx`
- `client/src/pages/ProgressPage.tsx`
- `client/src/pages/ProfilePage.tsx`

*Each should follow the same pattern with placeholder content and proper styling.*
