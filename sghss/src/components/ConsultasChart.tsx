import { Box, useTheme, useMediaQuery } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const ConsultasChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const data = [
    { nome: 'Jan', presencial: 65, telemedicina: 35 },
    { nome: 'Fev', presencial: 59, telemedicina: 41 },
    { nome: 'Mar', presencial: 80, telemedicina: 50 },
    { nome: 'Abr', presencial: 81, telemedicina: 55 },
    { nome: 'Mai', presencial: 56, telemedicina: 60 },
    { nome: 'Jun', presencial: 55, telemedicina: 45 },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        {isMobile ? (
          // Versão para mobile (gráfico de barras é melhor para telas pequenas)
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" scale="point" padding={{ left: 10, right: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar 
              dataKey="presencial" 
              name="Presencial" 
              fill="#1976d2" 
              radius={[2, 2, 0, 0]} 
            />
            <Bar 
              dataKey="telemedicina" 
              name="Telemedicina" 
              fill="#2e7d32" 
              radius={[2, 2, 0, 0]} 
            />
          </BarChart>
        ) : (
          // Versão para desktop/tablet
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="presencial"
              stroke="#1976d2"
              name="Consultas Presenciais"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="telemedicina"
              stroke="#2e7d32"
              name="Teleconsultas"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default ConsultasChart;
