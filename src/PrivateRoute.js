// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './components/context/AuthContext';
const PrivateRoute = ({ element, role, redirectTo }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if the user has the required role
  if (role && user.role !== role) {
    return <Navigate to={redirectTo || '/'} />;  // Redirect to a custom path if `redirectTo` is provided, or the default '/'
  }

  return element;
};

export default PrivateRoute;
