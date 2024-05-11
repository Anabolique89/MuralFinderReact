import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService'; 

const PrivateRoute = ({ children, ...rest }) => {
  const isAuth = AuthService.isAuthenticated();
  const location = useLocation();

  return isAuth ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
