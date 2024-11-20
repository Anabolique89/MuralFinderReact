import { Navigate, useLocation } from 'react-router-dom';
<<<<<<< Updated upstream
import AuthService from '../services/AuthService'; 
=======
import AuthService from '../services/AuthService';
>>>>>>> Stashed changes

const AdminRoute = ({ children, ...rest }) => {
  const isAuth = AuthService.isAuthenticated();
  const user = AuthService.getUser()?.role;
<<<<<<< Updated upstream
=======
  const location = useLocation();
>>>>>>> Stashed changes

  if (user !== 'admin') {
    return <Navigate to="/" replace />
  }

<<<<<<< Updated upstream
  const location = useLocation();
=======
>>>>>>> Stashed changes

  return isAuth ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AdminRoute;
