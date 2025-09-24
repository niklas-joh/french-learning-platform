import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CustomThemeProvider from './ThemeProvider'; // Assuming theme is a default export
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LessonsPage from './pages/LessonsPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { TwentyFirstToolbar } from '@21st-extension/toolbar-react';
import { ReactPlugin } from '@21st-extension/react';

// Main application component
function App() {
  return (
    <CustomThemeProvider>
      <TwentyFirstToolbar
        config={{
          plugins: [ReactPlugin],
        }}
      />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected main application routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/lessons" element={<LessonsPage />} />
                <Route path="/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/friends" element={<FriendsPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminRoute />}>
              <Route index element={<AdminDashboardPage />} />
            </Route>

            {/* Redirect old dashboard route to new home */}
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
