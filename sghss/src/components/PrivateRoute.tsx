import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { CircularProgress, Box, Typography } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { usuario, setUsuario } = useApp();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          setUsuario(JSON.parse(storedUser));
          setLoading(false);
        } catch (error) {
          console.error("Erro ao processar dados do usuário:", error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Verificando autenticação...</Typography>
      </Box>
    );
  }
  
  if (!usuario) {
    // Redirecionar para o login, preservando a rota que o usuário tentou acessar
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
