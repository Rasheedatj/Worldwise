import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/FakeAuthContext';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isUserAuthenticated) navigate('/');
    },
    [isUserAuthenticated, navigate]
  );

  return children;
}

export default ProtectedRoute;
