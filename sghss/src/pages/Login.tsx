import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useApp } from '../contexts/AppContext';
import { authService } from '../services/api';

// Função para extrair parâmetros de query da URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Login = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const { setUsuario, usuario } = useApp();
  const [error, setError] = useState('');
  const redirectPath = query.get('redirect') || '/';
  
  // Uso de MediaQuery para responsividade
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Se já estiver autenticado, redireciona
  useEffect(() => {
    if (usuario) {
      navigate(redirectPath);
    }
  }, [usuario, navigate, redirectPath]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await authService.login(
        formData.get('email') as string,
        formData.get('senha') as string
      );
      
      setUsuario(response.usuario || response.user);
      navigate(redirectPath);
    } catch (err) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth={isMobile ? 'xs' : 'sm'}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 3
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography 
          component="h1" 
          variant={isMobile ? 'h5' : 'h4'} 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          SGHSS - Login
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            width: '100%',
            maxWidth: isMobile ? '100%' : isTablet ? '450px' : '500px',
            borderRadius: 2
          }}
        >
          {query.get('expired') && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Sessão expirada. Por favor, faça login novamente.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              autoComplete="current-password"
              size={isMobile ? "small" : "medium"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: isMobile ? 1.2 : 1.5,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Entrar
            </Button>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontStyle: 'italic',
              fontSize: isMobile ? '0.7rem' : '0.8rem' 
            }}
          >
            Desenvolvido por Alexsander Lima Nazario - RU: 4314832
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
