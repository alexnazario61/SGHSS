import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardAvancado from './pages/Dashboard/DashboardAvancado';
import Pacientes from './pages/Pacientes';
import Consultas from './pages/Consultas';
// Importar o componente correto de Telemedicina 
import Telemedicina from './pages/Telemedicina/index';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard-avancado" element={<DashboardAvancado />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="consultas" element={<Consultas />} />
            <Route path="telemedicina" element={<Telemedicina />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
