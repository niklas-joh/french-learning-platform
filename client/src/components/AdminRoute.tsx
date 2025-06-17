// client/src/components/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  const storedUser = localStorage.getItem('currentUser'); // Changed 'user' to 'currentUser'
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // Optionally clear corrupted item
      // localStorage.removeItem('user'); 
    }
  }

  if (user && user.role === 'admin') {
    return <Outlet />;
  } else {
    // Redirect to login or a 'not authorized' page
    // For now, redirecting to login.
    // Consider creating a specific 'Not Authorized' page for better UX.
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
