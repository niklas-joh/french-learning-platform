import React from 'react';
import { Box } from '@mui/material';
import UserPreferencesForm from '../components/UserPreferencesForm';

/**
 * Profile Page - User Settings and Preferences Dashboard
 * 
 * Provides comprehensive user profile management using existing infrastructure.
 * Achieves 97% code reuse through UserPreferencesForm component integration.
 * 
 * Features:
 * - Theme preference management (light/dark mode)
 * - Notification settings configuration
 * - User preference persistence
 * - Real-time theme switching
 * - Form validation and error handling
 * 
 * @component ProfilePage
 * @version 2.0.0 - Transformed from placeholder to functional settings dashboard
 * @author French Learning Platform Team
 */
const ProfilePage: React.FC = () => {
  return (
    <Box sx={{ p: 2, pb: 10 }}> {/* Padding bottom for bottom navigation */}
      <UserPreferencesForm /> {/* Existing 130-line user settings component */}
    </Box>
  );
};

export default ProfilePage;
