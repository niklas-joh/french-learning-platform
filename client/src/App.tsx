import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import CustomThemeProvider from './ThemeProvider'; // Assuming theme is a default export
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/design-tokens.css';

// Main application component
function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected main application routes */}
            <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/:lessonId" element={<LessonPage />} />
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
        </AuthProvider>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
