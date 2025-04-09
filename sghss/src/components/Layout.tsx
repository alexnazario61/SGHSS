import React from 'react';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import { Home, Person, CalendarMonth, Videocam, Dashboard as DashboardIcon, Settings, Logout } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const DRAWER_WIDTH = 250;

const menuItems = [
  { text: 'Dashboard', icon: <Home />, path: '/' },
  { text: 'Dashboard Avançado', icon: <DashboardIcon />, path: '/dashboard-avancado' },
  { text: 'Pacientes', icon: <Person />, path: '/pacientes' },
  { text: 'Consultas', icon: <CalendarMonth />, path: '/consultas' },
  { text: 'Telemedicina', icon: <Videocam />, path: '/telemedicina' },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useApp();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar ajustada com sombra e melhor contraste */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 3,
          bgcolor: 'primary.main'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="SGHSS Logo" 
              style={{ height: 40, marginRight: 16 }}
              onError={(e) => {
                // Fallback se a imagem não existir
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              SGHSS
            </Typography>
          </Box>
          
          {/* Perfil do usuário */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {usuario?.nome || 'Usuário'}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              {(usuario?.nome?.[0] || 'U').toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer com espaçamento adequado */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: DRAWER_WIDTH, 
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: 'none'
          },
        }}
      >
        {/* Espaço para toolbar */}
        <Toolbar />
        
        {/* Menu de navegação */}
        <List component="nav" sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{ 
                mb: 0.5, 
                borderRadius: '0 24px 24px 0', 
                ml: 1,
                pr: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        
        {/* Opções de conta na parte inferior */}
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <List>
            <ListItem button sx={{ borderRadius: '0 24px 24px 0', ml: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Settings /></ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItem>
            <ListItem button sx={{ borderRadius: '0 24px 24px 0', ml: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Logout /></ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal com padding adequado */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          overflow: 'auto',
          bgcolor: '#f5f5f5', 
          height: '100vh'
        }}
      >
        {/* Espaço para a toolbar */}
        <Toolbar />
        
        {/* Container para o conteúdo */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2,
          boxShadow: 1,
          p: 3,
          minHeight: 'calc(100vh - 128px)'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
