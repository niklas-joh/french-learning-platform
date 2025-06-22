import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Paper,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { login } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await login({ email: normalizedEmail, password });
      console.log('Login successful:', response);
      navigate('/dashboard', { replace: true });
      window.location.reload();
    } catch (apiError: any) {
      console.error('Login failed raw error:', apiError);
      const errorMessage = apiError && apiError.message
        ? apiError.message
        : 'Login failed. Please check your credentials or contact support.';
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Sign in to your account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign in
          </Button>
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
