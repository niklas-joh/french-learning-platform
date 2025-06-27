import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import CustomThemeProvider from './ThemeProvider'; // Assuming theme is defined here
import MainLayout from './components/layout/MainLayout'; // Assuming you create this
import HomePage from './pages/HomePage'; // Assuming you create this
import LessonsPage from './pages/LessonsPage';
import PracticePage from './pages/PracticePage'; // Assuming you create this
import ProgressPage from './pages/ProgressPage'; // Assuming you create this
import ProfilePage from './pages/ProfilePage'; // Assuming you create this
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRoute from './components/AdminRoute'; // Keep existing for admin
import AdminDashboardPage from './pages/AdminDashboardPage'; // Keep existing for admin
import ProtectedRoute from './components/ProtectedRoute'; // You will need a generic protected route
import './styles/design-tokens.css';

// Main application component
function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected main application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
          </Route>

          {/* Redirect old dashboard route */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
