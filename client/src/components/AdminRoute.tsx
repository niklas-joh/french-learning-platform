import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/authService';

interface AdminRouteProps {
  // No specific props needed for now, but can be extended
}

const AdminRoute: React.FC<AdminRouteProps> = () => {
  const location = useLocation();
  const userIsAuthenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  if (!userIsAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser?.role !== 'admin') {
    // User is authenticated but not an admin
    // Redirect to a "not authorized" page or dashboard
    // For now, let's redirect to the main dashboard
    // You might want to create a specific "Access Denied" page later
    return <Navigate to="/dashboard" state={{ message: "Access Denied: Admin privileges required." }} replace />;
  }

  // If authenticated and an admin, render the child routes/component
  return <Outlet />;
};

export default AdminRoute;
