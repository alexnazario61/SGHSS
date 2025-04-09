import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, 
  Card, CardContent, CircularProgress,
  Button, Tabs, Tab, Select, MenuItem,
  FormControl, InputLabel, SelectChangeEvent
} from '@mui/material';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import { addDays, format, subDays, subMonths, parseISO } from 'date-fns';

import { dashboardService } from '../../services/api';
import useApi from '../../hooks/useApi';
import { useNotification } from '../../components/Notification';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardAvancado = () => {
  const [tabValue, setTabValue] = useState(0);
  const [periodoFiltro, setPeriodoFiltro] = useState('7dias');
  const [dataInicio, setDataInicio] = useState<Date>(subDays(new Date(), 7));
  const [dataFim, setDataFim] = useState<Date>(new Date());
  
  const { showNotification } = useNotification();
  
  const { 
    data: estatisticasGerais,
    loading: loadingEstatisticas,
    execute: carregarEstatisticas
  } = useApi(dashboardService.obterEstatisticasGerais);
  
  const { 
    data: consultasPorPeriodo,
    loading: loadingConsultas,
    execute: carregarConsultas
  } = useApi(dashboardService.obterConsultasPorPeriodo);
  
  const { 
    data: indicadores,
    loading: loadingIndicadores,
    execute: carregarIndicadores
  } = useApi(dashboardService.obterIndicadoresPrincipais);

  // Carregar dados iniciais
  useEffect(() => {
    carregarEstatisticas().catch(error => {
      showNotification('Erro ao carregar estatísticas: ' + error.message, 'error');
    });
    
    carregarIndicadores().catch(error => {
      showNotification('Erro ao carregar indicadores: ' + error.message, 'error');
    });
    
    atualizarPeriodoConsultas();
  }, []);
  
  // Atualizar datas quando o período mudar
  useEffect(() => {
    if (periodoFiltro === '7dias') {
      setDataInicio(subDays(new Date(), 7));
      setDataFim(new Date());
    } else if (periodoFiltro === '30dias') {
      setDataInicio(subDays(new Date(), 30));
      setDataFim(new Date());
    } else if (periodoFiltro === '3meses') {
      setDataInicio(subMonths(new Date(), 3));
      setDataFim(new Date());
    }
    // Quando periodoFiltro é 'personalizado', não fazemos nada pois o usuário define manualmente
  }, [periodoFiltro]);
  
  // Atualizar dados das consultas quando as datas mudarem
  useEffect(() => {
    if (periodoFiltro !== 'personalizado') {
      atualizarPeriodoConsultas();
    }
  }, [dataInicio, dataFim]);

  const atualizarPeriodoConsultas = () => {
    const dataInicioStr = format(dataInicio, 'yyyy-MM-dd');
    const dataFimStr = format(dataFim, 'yyyy-MM-dd');
    
    carregarConsultas(dataInicioStr, dataFimStr).catch(error => {
      showNotification('Erro ao carregar dados de consultas: ' + error.message, 'error');
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handlePeriodoChange = (event: SelectChangeEvent<string>) => {
    setPeriodoFiltro(event.target.value);
  };
  
  const handleAplicarFiltroPersonalizado = () => {
    atualizarPeriodoConsultas();
  };

  // Dados mock para demonstração (seriam substituídos pelos reais da API)
  const dadosMock = {
    consultasPorTipo: [
      { name: 'Clínico Geral', value: 85 },
      { name: 'Cardiologia', value: 45 },
      { name: 'Pediatria', value: 60 },
      { name: 'Ortopedia', value: 35 },
      { name: 'Outros', value: 55 }
    ],
    indicadoresAtendimento: [
      { name: 'Jan', presencial: 40, telemedicina: 24 },
      { name: 'Fev', presencial: 30, telemedicina: 28 },
      { name: 'Mar', presencial: 20, telemedicina: 39 },
      { name: 'Abr', presencial: 27, telemedicina: 30 },
      { name: 'Mai', presencial: 18, telemedicina: 38 },
      { name: 'Jun', presencial: 23, telemedicina: 43 }
    ],
    tempoEsperaMediana: [
      { name: 'Jan', tempo: 42 },
      { name: 'Fev', tempo: 38 },
      { name: 'Mar', tempo: 28 },
      { name: 'Abr', tempo: 32 },
      { name: 'Mai', tempo: 25 },
      { name: 'Jun', tempo: 21 }
    ]
  };

  // Renderização condicional com loading state
  if (loadingEstatisticas || loadingIndicadores) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Analítico
      </Typography>
      
      {/* Tabs para diferentes visualizações */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Visão Geral" />
          <Tab label="Consultas" />
          <Tab label="Financeiro" />
          <Tab label="Ocupação" />
        </Tabs>
      </Box>
      
      {/* Conteúdo da tab Visão Geral */}
      {tabValue === 0 && (
        <>
          {/* Cards de métricas principais */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Pacientes Ativos
                  </Typography>
                  <Typography variant="h4">
                    {indicadores?.pacientesAtivos || 1284}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +12% este mês
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Consultas Realizadas (mês)
                  </Typography>
                  <Typography variant="h4">
                    {indicadores?.consultasRealizadasMes || 756}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +8% vs. mês anterior
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Taxa de Ocupação
                  </Typography>
                  <Typography variant="h4">
                    {indicadores?.taxaOcupacao || '78%'}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    +5% vs. meta
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom>
                    Tempo Médio de Espera
                  </Typography>
                  <Typography variant="h4">
                    {indicadores?.tempoMedioEspera || '24 min'}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    +3 min vs. meta
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Gráficos */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 380 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Evolução de Atendimentos
                  </Typography>
                  <FormControl variant="outlined" size="small" sx={{ width: 140 }}>
                    <InputLabel>Período</InputLabel>
                    <Select
                      value={periodoFiltro}
                      onChange={handlePeriodoChange}
                      label="Período"
                    >
                      <MenuItem value="7dias">Últimos 7 dias</MenuItem>
                      <MenuItem value="30dias">Últimos 30 dias</MenuItem>
                      <MenuItem value="3meses">Últimos 3 meses</MenuItem>
                      <MenuItem value="personalizado">Personalizado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {periodoFiltro === 'personalizado' && (
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                      <DatePicker
                        label="Data Início"
                        value={dataInicio}
                        onChange={(newValue) => newValue && setDataInicio(newValue)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                      <DatePicker
                        label="Data Fim"
                        value={dataFim}
                        onChange={(newValue) => newValue && setDataFim(newValue)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                    </LocalizationProvider>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={handleAplicarFiltroPersonalizado}
                    >
                      Aplicar
                    </Button>
                  </Box>
                )}
                
                {loadingConsultas ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={consultasPorPeriodo?.dados || dadosMock.indicadoresAtendimento}
                      margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="presencial" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        name="Presencial"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="telemedicina" 
                        stroke="#82ca9d" 
                        name="Telemedicina"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 380 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Consultas por Especialidade
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={estatisticasGerais?.consultasPorEspecialidade || dadosMock.consultasPorTipo}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dadosMock.consultasPorTipo.map((item, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Tempo Médio de Espera por Mês (minutos)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={indicadores?.tempoEsperaMensal || dadosMock.tempoEsperaMediana}
                    margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tempo" fill="#8884d8" name="Tempo (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
      
      {/* Demais tabs seriam implementadas de forma similar */}
      {tabValue === 1 && (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          Detalhamento de Consultas - Conteúdo em desenvolvimento
        </Typography>
      )}
      
      {tabValue === 2 && (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          Indicadores Financeiros - Conteúdo em desenvolvimento
        </Typography>
      )}
      
      {tabValue === 3 && (
        <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          Ocupação de Leitos e Salas - Conteúdo em desenvolvimento
        </Typography>
      )}
    </Container>
  );
};

export default DashboardAvancado;