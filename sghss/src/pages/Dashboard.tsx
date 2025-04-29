import { Box, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  Person,
  CalendarMonth,
  Videocam,
  TrendingUp
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import ConsultasChart from '../components/ConsultasChart';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const stats = [
    { title: 'Total de Pacientes', value: '150', icon: <Person />, color: '#1976d2' },
    { title: 'Consultas Hoje', value: '12', icon: <CalendarMonth />, color: '#2e7d32' },
    { title: 'Teleconsultas', value: '5', icon: <Videocam />, color: '#ed6c02' },
    { title: 'Taxa de Ocupação', value: '75%', icon: <TrendingUp />, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={isMobile ? 2 : 3}>
        {stats.map((stat) => (
          <Grid item xs={6} md={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Consultas por Período
            </Typography>
            <Box sx={{ height: isMobile ? 280 : 400 }}>
              <ConsultasChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
