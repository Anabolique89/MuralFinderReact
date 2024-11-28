import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService'; 

const AdminRoute = ({ children, ...rest }) => {
  const isAuth = AuthService.isAuthenticated();
  const user = AuthService.getUser()?.role;

  if (user !== 'admin') {
    return <Navigate to="/" replace />
  }

  const location = useLocation();

  return isAuth ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AdminRoute;
