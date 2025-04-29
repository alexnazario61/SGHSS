import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Tooltip,
  ClickAwayListener
} from '@mui/material';
import {
  Home,
  Person,
  CalendarMonth,
  Videocam,
  Dashboard as DashboardIcon,
  Settings,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// Drawer width quando expandido
const DRAWER_WIDTH = 250;
// Drawer width quando recolhido
const MINI_DRAWER_WIDTH = 65;

const menuItems = [
  { text: 'Dashboard', icon: <Home />, path: '/' },
  { text: 'Dashboard Avançado', icon: <DashboardIcon />, path: '/dashboard-avancado' },
  { text: 'Pacientes', icon: <Person />, path: '/pacientes' },
  { text: 'Consultas', icon: <CalendarMonth />, path: '/consultas' },
  { text: 'Telemedicina', icon: <Videocam />, path: '/telemedicina' },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Iniciar com a navbar recolhida
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true);
  
  // Ref para o drawer para detectar cliques fora
  const drawerRef = useRef<HTMLDivElement>(null);

  // Função para lidar com cliques nos itens de menu
  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Função para alternar entre drawer expandido e recolhido
  const toggleDrawerCollapsed = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };
  
  // Função para fechar o drawer quando clicar fora dele
  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    // Só fecha automaticamente se estiver expandido e não for mobile
    if (!isMobile && !isDrawerCollapsed) {
      // Verifica se o clique não foi em um elemento dentro da AppBar
      const appBar = document.querySelector('.MuiAppBar-root');
      if (appBar && appBar.contains(event.target as Node)) {
        return;
      }
      
      setIsDrawerCollapsed(true);
    }
  };

  // Determinar a largura atual do drawer
  const currentDrawerWidth = !isMobile 
    ? (isDrawerCollapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH) 
    : DRAWER_WIDTH;

  // Drawer Conteúdo
  const drawer = (
    <>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: isDrawerCollapsed ? 'center' : 'flex-end',
          minHeight: '64px !important'
        }}
      >
        {!isMobile && (
          <IconButton onClick={toggleDrawerCollapsed} size="small">
            {isDrawerCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'hidden' }}>
        <List component="nav" sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => handleMenuClick(item.path)}
              sx={{ 
                mb: 0.5, 
                borderRadius: isDrawerCollapsed ? undefined : '0 24px 24px 0',
                justifyContent: isDrawerCollapsed ? 'center' : 'flex-start',
                px: isDrawerCollapsed ? 1 : 2,
                ml: isDrawerCollapsed ? 0 : 1,
                pr: isDrawerCollapsed ? 1 : 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Tooltip title={isDrawerCollapsed ? item.text : ''} placement="right" arrow>
                <ListItemIcon 
                  sx={{ 
                    minWidth: isDrawerCollapsed ? 24 : 40,
                    color: theme.palette.primary.main
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {!isDrawerCollapsed && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem 
            button 
            onClick={() => handleMenuClick('/configuracoes')}
            sx={{ 
              borderRadius: isDrawerCollapsed ? undefined : '0 24px 24px 0',
              justifyContent: isDrawerCollapsed ? 'center' : 'flex-start',
              px: isDrawerCollapsed ? 1 : 2,
              ml: isDrawerCollapsed ? 0 : 1
            }}
          >
            <Tooltip title={isDrawerCollapsed ? "Configurações" : ''} placement="right" arrow>
              <ListItemIcon sx={{ minWidth: isDrawerCollapsed ? 24 : 40 }}>
                <Settings />
              </ListItemIcon>
            </Tooltip>
            {!isDrawerCollapsed && <ListItemText primary="Configurações" />}
          </ListItem>
          <ListItem 
            button 
            onClick={logout} 
            sx={{ 
              borderRadius: isDrawerCollapsed ? undefined : '0 24px 24px 0',
              justifyContent: isDrawerCollapsed ? 'center' : 'flex-start',
              px: isDrawerCollapsed ? 1 : 2,
              ml: isDrawerCollapsed ? 0 : 1
            }}
          >
            <Tooltip title={isDrawerCollapsed ? "Sair" : ''} placement="right" arrow>
              <ListItemIcon sx={{ minWidth: isDrawerCollapsed ? 24 : 40 }}>
                <Logout />
              </ListItemIcon>
            </Tooltip>
            {!isDrawerCollapsed && <ListItemText primary="Sair" />}
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar com z-index maior que o drawer */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: 3,
          bgcolor: 'primary.main',
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
        className="app-bar"
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo.png" 
              alt="SGHSS Logo" 
              style={{ height: 40, marginRight: 16, display: isMobile ? 'none' : 'block' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              SGHSS
            </Typography>
          </Box>
          
          {/* Perfil do usuário */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Typography variant="body2" sx={{ mr: 1 }}>
                {usuario?.nome || 'Usuário'}
              </Typography>
            )}
            <Avatar 
              sx={{ 
                bgcolor: 'secondary.main', 
                width: isMobile ? 28 : 32, 
                height: isMobile ? 28 : 32 
              }}
            >
              {(usuario?.nome?.[0] || 'U').toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer com versão responsiva e recolhível */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box
          ref={drawerRef}
          component="nav"
          sx={{ 
            width: { md: currentDrawerWidth }, 
            flexShrink: { md: 0 },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            })
          }}
        >
          {/* Versão móvel (temporária) */}
          {isMobile ? (
            <SwipeableDrawer
              variant="temporary"
              open={mobileOpen}
              onOpen={() => setMobileOpen(true)}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Melhor desempenho em dispositivos móveis
              }}
              sx={{
                '& .MuiDrawer-paper': { 
                  width: DRAWER_WIDTH,
                  boxSizing: 'border-box',
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen
                  }),
                  overflowX: 'hidden' // Impede scroll horizontal
                },
              }}
            >
              {drawer}
            </SwipeableDrawer>
          ) : (
            // Versão desktop (permanente e recolhível)
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': { 
                  width: isDrawerCollapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH, 
                  boxSizing: 'border-box',
                  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                  overflowX: 'hidden', // Impede scroll horizontal
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                  whiteSpace: 'nowrap'
                },
                display: { xs: 'none', md: 'block' }
              }}
              open={!isDrawerCollapsed}
            >
              {drawer}
            </Drawer>
          )}
        </Box>
      </ClickAwayListener>

      {/* Conteúdo principal com padding adequado */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          width: { 
            xs: '100%', 
            md: `calc(100% - ${currentDrawerWidth}px)` 
          },
          overflow: 'auto',
          bgcolor: '#f5f5f5', 
          height: '100vh',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Espaço para a toolbar */}
        <Toolbar />
        
        {/* Container para o conteúdo */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2,
          boxShadow: 1,
          p: { xs: 2, sm: 3 },
          minHeight: 'calc(100vh - 128px)'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
