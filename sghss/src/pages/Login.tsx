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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            SGHSS - Login
          </Typography>

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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Paper>
        
        {/* Rodapé com informações do desenvolvedor */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            Desenvolvido por Alexsander Lima Nazario - RU: 4314832
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
