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
  TextField, 
  IconButton, 
  InputAdornment,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Button,
  Grid
} from '@mui/material';
import { Add, Search, FilterList, Edit, Delete, VisibilityOutlined } from '@mui/icons-material';
import PacienteForm from '../components/PacienteForm';
import CustomButton from '../components/CustomButton';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  [key: string]: string | number;
}

const Pacientes = () => {
  const [openForm, setOpenForm] = useState(false);
  const [pacientes] = useState<Paciente[]>([
    { id: 1, nome: 'João Silva', cpf: '123.456.789-00', telefone: '(41) 99999-9999' },
    { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00', telefone: '(41) 88888-8888' },
  ]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, _setOrdenacao] = useState<keyof Paciente>('nome');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const pacientesFiltrados = pacientes
    .filter(p => 
      p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      p.cpf.includes(filtro) ||
      p.telefone.includes(filtro)
    );

  const pacientesOrdenados = [...pacientesFiltrados]
    .sort((a, b) => String(a[ordenacao]).localeCompare(String(b[ordenacao])));

  // Layout de Cards para dispositivos móveis
  const PacientesCardView = () => (
    <Grid container spacing={2}>
      {pacientesOrdenados.length > 0 ? (
        pacientesOrdenados.map((paciente) => (
          <Grid item xs={12} key={paciente.id}>
            <Card sx={{ mb: 1 }}>
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {paciente.nome}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>CPF:</strong> {paciente.cpf}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Telefone:</strong> {paciente.telefone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityOutlined />}
                    sx={{ mr: 1 }}
                  >
                    Ver
                  </Button>
                  <Box>
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">Nenhum paciente encontrado</Typography>
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
          Pacientes
        </Typography>
        
        <CustomButton
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
          size={isMobile ? "small" : "medium"}
          fullWidth={isMobile}
        >
          {isMobile ? "Novo" : "Novo Paciente"}
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
          placeholder="Buscar pacientes..."
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

      {/* Tabela para desktop / tablet ou cards para mobile */}
      {isMobile ? (
        <PacientesCardView />
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
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>CPF</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacientesOrdenados.length > 0 ? (
                pacientesOrdenados.map((paciente) => (
                  <TableRow 
                    key={paciente.id}
                    sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}
                  >
                    <TableCell>
                      <Typography variant={isTablet ? "body2" : "body1"} sx={{ fontWeight: 500 }}>
                        {paciente.nome}
                      </Typography>
                    </TableCell>
                    <TableCell>{paciente.cpf}</TableCell>
                    <TableCell>{paciente.telefone}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="info">
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      Nenhum paciente encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de cadastro de pacientes */}
      <PacienteForm 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
      />
    </Box>
  );
};

export default Pacientes;
