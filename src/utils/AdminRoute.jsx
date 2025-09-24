import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '@services/AuthService'; 
import PropTypes from 'prop-types';

const AdminRoute = ({ children }) => {
  const isAuth = AuthService.isAuthenticated();
  const userRole = AuthService.getUser()?.role;
  const location = useLocation();

  if (userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return isAuth ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
