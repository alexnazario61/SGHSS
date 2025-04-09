import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { usuario } = useApp();
  
  return usuario ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
