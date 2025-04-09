import { Box } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ConsultasChart = () => {
  const data = [
    { nome: 'Janeiro', presencial: 65, telemedicina: 35 },
    { nome: 'Fevereiro', presencial: 59, telemedicina: 41 },
    { nome: 'Março', presencial: 80, telemedicina: 50 },
    { nome: 'Abril', presencial: 81, telemedicina: 55 },
    { nome: 'Maio', presencial: 56, telemedicina: 60 },
    { nome: 'Junho', presencial: 55, telemedicina: 45 },
  ];

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
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
          />
          <Line
            type="monotone"
            dataKey="telemedicina"
            stroke="#2e7d32"
            name="Teleconsultas"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ConsultasChart;
