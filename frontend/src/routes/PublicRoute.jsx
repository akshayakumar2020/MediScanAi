import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardPath } from '../utils/roleUtils';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;
