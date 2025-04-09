import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  Person,
  CalendarMonth,
  Videocam,
  TrendingUp
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import ConsultasChart from '../components/ConsultasChart';

const Dashboard = () => {
  const stats = [
    { title: 'Total de Pacientes', value: '150', icon: <Person />, color: '#1976d2' },
    { title: 'Consultas Hoje', value: '12', icon: <CalendarMonth />, color: '#2e7d32' },
    { title: 'Teleconsultas', value: '5', icon: <Videocam />, color: '#ed6c02' },
    { title: 'Taxa de Ocupação', value: '75%', icon: <TrendingUp />, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Consultas por Período
            </Typography>
            <ConsultasChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
