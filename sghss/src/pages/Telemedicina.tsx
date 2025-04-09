import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { VideoCall, Chat, Description } from '@mui/icons-material';

const Telemedicina = () => {
  const [consultas] = useState([
    {
      id: 1,
      paciente: 'João Silva',
      medico: 'Dr. Paulo Santos',
      horario: '14:00',
      status: 'Aguardando',
    },
    {
      id: 2,
      paciente: 'Maria Santos',
      medico: 'Dra. Ana Lima',
      horario: '15:30',
      status: 'Em Andamento',
    },
  ]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Telemedicina
      </Typography>

      <Grid container spacing={3}>
        {consultas.map((consulta) => (
          <Grid item xs={12} md={6} key={consulta.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>{consulta.paciente[0]}</Avatar>
                  <Box>
                    <Typography variant="h6">{consulta.paciente}</Typography>
                    <Typography color="textSecondary">{consulta.medico}</Typography>
                  </Box>
                  <Chip
                    label={consulta.status}
                    color={consulta.status === 'Em Andamento' ? 'success' : 'primary'}
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Horário: {consulta.horario}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<VideoCall />}
                    fullWidth
                  >
                    Iniciar Chamada
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Chat />}
                  >
                    Chat
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Description />}
                  >
                    Prontuário
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Telemedicina;
