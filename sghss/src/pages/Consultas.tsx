import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Button,
  Grid
} from '@mui/material';
import { 
  Add, 
  Search, 
  FilterList, 
  Edit, 
  Cancel, 
  Check,
  EventNote,
  AccessTime
} from '@mui/icons-material';
import ConsultaForm from '../components/ConsultaForm';
import CustomButton from '../components/CustomButton';

const Consultas = () => {
  const [openForm, setOpenForm] = useState(false);
  const [consultas] = useState([
    { 
      id: 1, 
      paciente: 'João Silva', 
      medico: 'Dr. Paulo Santos',
      data: '2023-12-01',
      hora: '14:00',
      status: 'Agendada',
      tipo: 'Presencial'
    },
    { 
      id: 2, 
      paciente: 'Maria Santos', 
      medico: 'Dra. Ana Lima',
      data: '2023-12-02',
      hora: '10:30',
      status: 'Confirmada',
      tipo: 'Telemedicina'
    },
  ]);
  const [filtro, setFiltro] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const consultasFiltradas = consultas.filter(c => 
    c.paciente.toLowerCase().includes(filtro.toLowerCase()) ||
    c.medico.toLowerCase().includes(filtro.toLowerCase())
  );

  // Componente de Cards para visualização em dispositivos móveis
  const ConsultasCardView = () => (
    <Grid container spacing={2}>
      {consultasFiltradas.map((consulta) => (
        <Grid item xs={12} key={consulta.id}>
          <Card sx={{ mb: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6">
                  {consulta.paciente}
                </Typography>
                <Chip 
                  label={consulta.status}
                  color={
                    consulta.status === 'Confirmada' ? 'success' : 
                    consulta.status === 'Agendada' ? 'primary' :
                    consulta.status === 'Cancelada' ? 'error' : 'default'
                  }
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {consulta.medico}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EventNote fontSize="small" color="action" />
                <Typography variant="body2">
                  {new Date(consulta.data).toLocaleDateString('pt-BR')}
                </Typography>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2">
                  {consulta.hora}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={consulta.tipo}
                  variant="outlined"
                  color={consulta.tipo === 'Telemedicina' ? 'info' : 'default'}
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  startIcon={<Edit />} 
                  size="small" 
                  variant="outlined"
                >
                  Editar
                </Button>
                
                {consulta.status === 'Agendada' && (
                  <Box>
                    <Button 
                      startIcon={<Check />} 
                      size="small" 
                      color="success" 
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      Confirmar
                    </Button>
                    <Button 
                      startIcon={<Cancel />} 
                      size="small" 
                      color="error" 
                      variant="outlined"
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      
      {consultasFiltradas.length === 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">Nenhuma consulta encontrada</Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box>
      {/* Cabeçalho com título e botão */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        mb: 3,
        gap: isMobile ? 2 : 0
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ fontWeight: 500 }}
        >
          Consultas
        </Typography>
        
        <CustomButton
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          {isMobile ? "Nova" : "Nova Consulta"}
        </CustomButton>
      </Box>

      {/* Barra de busca aprimorada */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 3, 
          p: 1, 
          border: '1px solid #e0e0e0',
          borderRadius: 2
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar consultas..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FilterList />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ '& fieldset': { border: 'none' } }}
        />
      </Paper>

      {/* Tabela para desktop/tablet ou cards para mobile */}
      {isMobile ? (
        <ConsultasCardView />
      ) : (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Table size={isTablet ? "small" : "medium"}>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Paciente</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Médico</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Hora</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultasFiltradas.map((consulta) => (
                <TableRow 
                  key={consulta.id} 
                  data-testid="consulta-row"
                  sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}
                >
                  <TableCell>{consulta.paciente}</TableCell>
                  <TableCell>{consulta.medico}</TableCell>
                  <TableCell>
                    {new Date(consulta.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{consulta.hora}</TableCell>
                  <TableCell>
                    <Chip 
                      label={consulta.status}
                      color={
                        consulta.status === 'Confirmada' ? 'success' : 
                        consulta.status === 'Agendada' ? 'primary' :
                        consulta.status === 'Cancelada' ? 'error' : 'default'
                      }
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={consulta.tipo}
                      variant="outlined"
                      color={consulta.tipo === 'Telemedicina' ? 'info' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      {consulta.status === 'Agendada' && (
                        <>
                          <IconButton size="small" color="success">
                            <Check fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Cancel fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConsultaForm open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  );
};

export default Consultas;
