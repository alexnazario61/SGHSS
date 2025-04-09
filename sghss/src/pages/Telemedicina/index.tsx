import React, { useState } from 'react';
import { 
  Container, Typography, Box, Button, Grid, 
  Card, CardContent, CardActions, Chip 
} from '@mui/material';
import VideoCall from '../../components/Telemedicina/VideoCall';

const Telemedicina = () => {
  const [chamadaAtiva, setChamadaAtiva] = useState(false);
  const [consultaId, setConsultaId] = useState<number | null>(null);
  
  // Exemplos de consultas para demonstração
  const consultas = [
    { 
      id: 1, 
      paciente: 'João Silva', 
      data: '24/03/2025', 
      hora: '14:00', 
      status: 'agendada' 
    },
    { 
      id: 2, 
      paciente: 'Maria Oliveira', 
      data: '24/03/2025', 
      hora: '15:30', 
      status: 'agendada' 
    },
    { 
      id: 3, 
      paciente: 'Pedro Santos', 
      data: '24/03/2025', 
      hora: '16:45', 
      status: 'agendada' 
    }
  ];
  
  const iniciarChamada = (id: number) => {
    setConsultaId(id);
    setChamadaAtiva(true);
  };
  
  const encerrarChamada = () => {
    setChamadaAtiva(false);
    setConsultaId(null);
  };
  
  if (chamadaAtiva && consultaId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, height: 'calc(100vh - 120px)' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Teleconsulta em andamento
          </Typography>
          <Button variant="outlined" color="secondary" onClick={encerrarChamada}>
            Voltar à listagem
          </Button>
        </Box>
        <Box sx={{ height: 'calc(100% - 60px)' }}>
          <VideoCall consultaId={consultaId} onEndCall={encerrarChamada} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Telemedicina
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Consultas agendadas hoje
      </Typography>
      
      <Grid container spacing={3}>
        {consultas.map((consulta) => (
          <Grid item xs={12} md={4} key={consulta.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {consulta.paciente}
                </Typography>
                <Typography color="textSecondary">
                  {consulta.data} às {consulta.hora}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={consulta.status}
                    color={consulta.status === 'agendada' ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => iniciarChamada(consulta.id)}
                  fullWidth
                >
                  Iniciar Chamada
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Telemedicina;