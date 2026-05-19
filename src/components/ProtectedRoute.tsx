import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component
 * Checks for a valid token in localStorage.
 * If not found, redirects to the /login page.
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected content if token exists
  return <>{children}</>;
};

export default ProtectedRoute;
