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
  InputAdornment
} from '@mui/material';
import { Add, Search, FilterList, Edit, Cancel, Check } from '@mui/icons-material';
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

  const consultasFiltradas = consultas.filter(c => 
    c.paciente.toLowerCase().includes(filtro.toLowerCase()) ||
    c.medico.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box>
      {/* Cabeçalho com título e botão */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Consultas
        </Typography>
        
        <CustomButton
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
          size="medium"
        >
          Nova Consulta
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

      {/* Tabela de consultas redesenhada */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table>
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

      <ConsultaForm open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  );
};

export default Consultas;
