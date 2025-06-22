import React, { useState, useEffect, useContext } from 'react';
import { getUserPreferences, saveUserPreferences } from '../services/userService';
import { UserPreferences } from '../types/Preference';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { ThemeModeContext } from '../ThemeProvider';

const UserPreferencesForm: React.FC = () => {
  const { setMode } = useContext(ThemeModeContext);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications: { email: false },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getUserPreferences();
        if (data && Object.keys(data).length > 0) {
          setPreferences(data);
          if (data.theme) {
            setMode(data.theme);
          }
        }
      } catch (err) {
        setError('Failed to load preferences.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === 'theme') {
        const newMode = preferences.theme === 'dark' ? 'light' : 'dark';
        setPreferences(prev => ({ ...prev, theme: newMode }));
        setMode(newMode);
    } else {
        const [category, key] = name.split('.');
        if (category === 'notifications' && (key === 'email' || key === 'sms')) {
            setPreferences(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [key]: checked,
                },
            }));
        }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await saveUserPreferences(preferences);
      setSuccess(true);
    } catch (err) {
      setError('Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        User Preferences
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.theme === 'dark'}
                  onChange={handleChange}
                  name="theme"
                />
              }
              label="Dark Mode"
            />
            <Typography variant="h6" sx={{ mt: 2 }}>Notifications</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications?.email || false}
                  onChange={handleChange}
                  name="notifications.email"
                />
              }
              label="Email Notifications"
            />
          </FormGroup>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            Save Preferences
          </Button>
        </FormControl>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Preferences saved successfully!"
      />
    </Paper>
  );
};

export default UserPreferencesForm;
