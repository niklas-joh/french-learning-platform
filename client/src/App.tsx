import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Box, Avatar, IconButton, Modal } from '@mui/material'; // Added Box, Avatar, IconButton, Modal
import { getCurrentUser, isAuthenticated, logout as authLogout } from './services/authService';
import { User } from './types/User'; // Added User type
import UserPreferencesForm from './components/UserPreferencesForm'; // Added UserPreferencesForm
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ContentPage from './pages/ContentPage';
import AdminRoute from './components/AdminRoute';
import AllAssignmentsPage from './pages/AllAssignmentsPage';
import TopicContentPage from './pages/TopicContentPage';

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
  // Helper to get initials from firstName and potentially lastName
  const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName) return '';
    const firstInitial = firstName.charAt(0).toUpperCase();
    if (!lastName) return firstInitial;
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated());
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Added user state
  const [isModalOpen, setIsModalOpen] = useState(false); // Added modal state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      setIsUserAuthenticated(authStatus);
      if (authStatus) {
        const currentUserData = getCurrentUser();
        if (currentUserData) {
          const transformedUser: User = {
            id: currentUserData.id,
            email: currentUserData.email,
            firstName: currentUserData.firstName || '', // Default to empty string
            lastName: currentUserData.lastName || '',   // Default to empty string
            role: (currentUserData.role === 'admin' || currentUserData.role === 'user') ? currentUserData.role : 'user', // Ensure role is valid
          };
          setUser(transformedUser);
          setCurrentUserRole(transformedUser.role);
        } else {
          setUser(null);
          setCurrentUserRole(null);
        }
      } else {
        setUser(null); // Clear user object on logout
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    authLogout();
    setIsUserAuthenticated(false);
    setCurrentUserRole(null);
    setUser(null); // Clear user object on logout
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isUserAuthenticated && user ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              {currentUserRole === 'admin' && (
                <Button color="inherit" component={Link} to="/admin/dashboard">
                  Admin Panel
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} /> {/* Pushes subsequent items to the right */}
              <Typography sx={{ mr: 2 }}>
                Welcome, {user.firstName}!
              </Typography>
              <IconButton onClick={handleOpenModal} color="inherit" sx={{ p: 0, mr: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {getInitials(user.firstName, user.lastName)}
                </Avatar>
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* For unauthenticated users, push login/register to the right */}
              <Box sx={{ flexGrow: 1 }} />
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
      {/* Modal for User Preferences */}
      {user && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="user-preferences-modal-title"
          aria-describedby="user-preferences-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="user-preferences-modal-title" variant="h6" component="h2" gutterBottom>
              User Preferences
            </Typography>
            <UserPreferencesForm />
          </Box>
        </Modal>
      )}
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
          <Route path="/assignments" element={<AllAssignmentsPage />} />
          <Route path="/topics/:topicId/learn" element={<TopicContentPage />} />
          <Route path="/content/:id" element={<ContentPage />} />
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
