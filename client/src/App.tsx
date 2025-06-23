import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography } from '@mui/material';
import { getCurrentUser, isAuthenticated, logout as authLogout } from './services/authService';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
import QuizPage from './pages/QuizPage';

const NotFoundPage = () => (
  <Container sx={{ textAlign: 'center', mt: 4 }}>
    <Typography variant="h3" component="h1" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Button component={Link} to="/" variant="contained" color="primary">
      Go Home
    </Button>
  </Container>
);

// AppContent component to use router hooks correctly
const AppContent: React.FC = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated());
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      setIsUserAuthenticated(authStatus);
      if (authStatus) {
        const user = getCurrentUser();
        setCurrentUserRole(user?.role || null);
      } else {
        setCurrentUserRole(null);
      }
    };

    checkAuthStatus(); // Check on component mount and location change

    // Optional: Listen to storage events to sync auth state across tabs
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [location.pathname]); // Re-check when route changes

  const handleLogout = () => {
    authLogout();
    setIsUserAuthenticated(false);
    setCurrentUserRole(null);
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isUserAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              {currentUserRole === 'admin' && (
                <Button color="inherit" component={Link} to="/admin/dashboard">
                  Admin Panel
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
              {/* The Dashboard link for non-authenticated users will likely redirect to login if DashboardPage is protected */}
               <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Consider protecting DashboardPage similar to AdminDashboardPage if it requires auth */}
          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/admin/dashboard" element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
            {/* Add more nested admin routes here if needed */}
          </Route>
          <Route path="/content/:contentId" element={<QuizPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
};

// Main App component wraps AppContent with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
