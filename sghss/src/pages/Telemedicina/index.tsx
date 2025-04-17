import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Grid, 
  Card, CardContent, CardActions, Chip, CircularProgress 
} from '@mui/material';
import { useNotification } from '../../components/Notification';

// Versão atualizada do componente de chamada de vídeo com exemplos visuais
const MockVideoCall = ({ onEndCall }: { onEndCall: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  // Simula carregamento da chamada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      showNotification('Chamada conectada em modo simulado', 'success');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Cria uma stream de vídeo de exemplo usando canvas
  useEffect(() => {
    if (!isLoading) {
      // Função para criar vídeo simulado para o médico
      const createMockStream = (canvasId: string, color: string, text: string) => {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const drawFrame = () => {
          // Desenha background
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Adiciona texto
          ctx.fillStyle = 'white';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(text, canvas.width / 2, canvas.height / 2);
          
          // Simula movimento para parecer um vídeo
          const date = new Date();
          ctx.fillText(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, 
            canvas.width / 2, canvas.height / 2 + 30);
          
          requestAnimationFrame(drawFrame);
        };
        
        drawFrame();
        
        // Conecta o canvas a um elemento de vídeo como stream
        const mockVideo = document.getElementById(`video-${canvasId}`) as HTMLVideoElement;
        if (mockVideo && canvas) {
          try {
            // @ts-ignore - Canvas captureStream é uma API experimental
            const stream = canvas.captureStream(30);
            mockVideo.srcObject = stream;
            mockVideo.play().catch(e => console.error("Erro ao iniciar vídeo:", e));
          } catch (error) {
            console.error("Navegador não suporta captureStream:", error);
          }
        }
      };
      
      // Iniciar vídeos simulados
      setTimeout(() => {
        createMockStream('canvas-medico', '#2196f3', 'MÉDICO');
        createMockStream('canvas-paciente', '#4caf50', 'PACIENTE');
      }, 500);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Conectando chamada...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      bgcolor: '#121212', 
      position: 'relative',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      {/* Vídeo principal - médico */}
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}>
        <canvas 
          id="canvas-medico" 
          width="640" 
          height="480" 
          style={{ display: 'none' }}
        ></canvas>
        <video 
          id="video-canvas-medico"
          autoPlay 
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        ></video>
        
        {/* Vídeo do paciente (picture-in-picture) */}
        <Box sx={{
          position: 'absolute',
          right: 20,
          top: 20,
          width: '180px',
          height: '120px',
          borderRadius: 2,
          overflow: 'hidden',
          border: '2px solid #ffffff70',
          bgcolor: '#4caf50'
        }}>
          <canvas 
            id="canvas-paciente" 
            width="320" 
            height="240" 
            style={{ display: 'none' }}
          ></canvas>
          <video 
            id="video-canvas-paciente"
            autoPlay 
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          ></video>
        </Box>
        
        {/* Controles da chamada */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          background: 'rgba(0, 0, 0, 0.5)'
        }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={onEndCall}
            sx={{ borderRadius: 8 }}
          >
            Encerrar Chamada
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const Telemedicina = () => {
  const [chamadaAtiva, setChamadaAtiva] = useState(false);
  const [consultaId, setConsultaId] = useState<number | null>(null);
  const { showNotification } = useNotification();
  
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
    showNotification('Iniciando chamada...', 'info');
  };
  
  const encerrarChamada = () => {
    setChamadaAtiva(false);
    setConsultaId(null);
    showNotification('Chamada encerrada', 'info');
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
          <MockVideoCall onEndCall={encerrarChamada} />
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