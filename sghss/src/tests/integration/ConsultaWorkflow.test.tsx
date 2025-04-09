import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

import Login from '../../pages/Login';
import ConsultaForm from '../../components/ConsultaForm';
import Consultas from '../../pages/Consultas';
import { NotificationProvider } from '../../components/Notification';
import theme from '../../theme';

// Interface para o formulário de consulta
interface ConsultaFormProps {
  open: boolean;
  onClose: () => void;
}

interface NovaConsulta {
  pacienteId: number;
  medicoId: number;
  data: string;
  hora: string;
  tipo: string;
  status?: string;
}

// Configuração do servidor mock com tipos corrigidos
const server = setupServer(
  // Mock para autenticação
  http.post('http://localhost:3000/api/auth/login', () => {
    return HttpResponse.json({
      token: 'fake-token-12345',
      user: {
        id: 1,
        nome: 'Dr. Teste',
        email: 'teste@hospital.com',
        tipo: 'MEDICO'
      }
    });
  }),
  
  // Mock para listagem de pacientes
  http.get('http://localhost:3000/api/pacientes', () => {
    return HttpResponse.json([
      {
        id: 1,
        nome: 'João Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1980-05-15',
        email: 'joao@email.com',
        telefone: '(11) 98765-4321'
      }
    ]);
  }),
  
  // Mock para listagem de profissionais
  http.get('http://localhost:3000/api/profissionais', () => {
    return HttpResponse.json([
      {
        id: 1,
        nome: 'Dr. Paulo Cardoso',
        especialidade: 'Cardiologia',
        crm: '12345-SP'
      },
      {
        id: 2,
        nome: 'Dra. Ana Pediatra',
        especialidade: 'Pediatria',
        crm: '54321-SP'
      }
    ]);
  }),
  
  // Mock para criação de consulta com tipagem correta
  http.post<any, NovaConsulta>('http://localhost:3000/api/consultas', async ({ request }) => {
    const consultaData = await request.json() as NovaConsulta;
    return HttpResponse.json({
      id: 123,
      status: 'AGENDADA',
      pacienteId: consultaData.pacienteId,
      medicoId: consultaData.medicoId,
      data: consultaData.data,
      hora: consultaData.hora,
      tipo: consultaData.tipo
    });
  }),
  
  // Mock para listagem de consultas
  http.get('http://localhost:3000/api/consultas', () => {
    return HttpResponse.json([
      {
        id: 123,
        data: '2025-05-10T14:30:00',
        tipo: 'PRESENCIAL',
        status: 'AGENDADA',
        paciente: {
          id: 1,
          nome: 'João Silva'
        },
        profissional: {
          id: 1,
          nome: 'Dr. Paulo Cardoso',
          especialidade: 'Cardiologia'
        }
      }
    ]);
  }),
  
  // Mock para cancelamento de consulta
  http.patch('http://localhost:3000/api/consultas/123/cancelar', () => {
    return HttpResponse.json({
      id: 123,
      status: 'CANCELADA'
    });
  })
);

// Inicializa e encerra o servidor de mock para os testes
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Wrapper para os componentes
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          {children}
        </LocalizationProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

describe('Fluxo completo de Agendamento de Consulta', () => {
  test('Deve fazer login, criar uma consulta e depois cancelá-la', async () => {
    // Renderiza o aplicativo com o router configurado
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AllProviders>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/consultas/nova" element={<ConsultaForm open={true} onClose={() => {}} />} />
            <Route path="/*" element={<div>Not Found</div>} />
          </Routes>
        </AllProviders>
      </MemoryRouter>
    );
    
    // 1. Fazer login
    const emailInput = screen.getByLabelText(/e-mail/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    
    await userEvent.type(emailInput, 'teste@hospital.com');
    await userEvent.type(senhaInput, 'senha123');
    await userEvent.click(loginButton);
    
    // Esperar redirecionamento para a tela de consultas
    await waitFor(() => {
      expect(screen.getByText(/consultas agendadas/i)).toBeInTheDocument();
    });
    
    // 2. Ir para tela de nova consulta
    const novaConsultaButton = screen.getByRole('button', { name: /nova consulta/i });
    await userEvent.click(novaConsultaButton);
    
    // Esperar carregamento do formulário de consulta
    await waitFor(() => {
      expect(screen.getByText(/agendar nova consulta/i)).toBeInTheDocument();
    });
    
    // 3. Preencher o formulário de consulta
    // Selecionar paciente
    const pacienteSelect = screen.getByLabelText(/selecione o paciente/i);
    await userEvent.click(pacienteSelect);
    const pacienteOption = await screen.findByRole('option', { name: /joão silva/i });
    await userEvent.click(pacienteOption);
    
    // Selecionar profissional
    const profissionalSelect = screen.getByLabelText(/selecione o profissional/i);
    await userEvent.click(profissionalSelect);
    const profissionalOption = await screen.findByRole('option', { name: /dr\. paulo cardoso/i });
    await userEvent.click(profissionalOption);
    
    // Selecionar tipo de consulta
    const tipoSelect = screen.getByLabelText(/tipo de consulta/i);
    await userEvent.click(tipoSelect);
    const tipoOption = await screen.findByRole('option', { name: /presencial/i });
    await userEvent.click(tipoOption);
    
    // Selecionar data e hora (simulado)
    const dataField = screen.getByLabelText(/data da consulta/i);
    fireEvent.change(dataField, { target: { value: '10/05/2025' } });
    
    const horaField = screen.getByLabelText(/horário/i);
    fireEvent.change(horaField, { target: { value: '14:30' } });
    
    // Adicionar observações
    const observacoesField = screen.getByLabelText(/observações/i);
    await userEvent.type(observacoesField, 'Paciente com histórico de hipertensão');
    
    // 4. Enviar o formulário
    const salvarButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(salvarButton);
    
    // 5. Verificar se voltou para a listagem com a nova consulta
    await waitFor(() => {
      expect(screen.getByText(/consultas agendadas/i)).toBeInTheDocument();
      expect(screen.getByText(/joão silva/i)).toBeInTheDocument();
      expect(screen.getByText(/dr\. paulo cardoso/i)).toBeInTheDocument();
    });
    
    // 6. Cancelar a consulta
    const consultaRow = screen.getByTestId('consulta-row');
    const cancelarButton = within(consultaRow).getByRole('button', { name: /cancelar/i });
    
    await userEvent.click(cancelarButton);
    
    // Confirmar cancelamento
    const confirmarButton = screen.getByRole('button', { name: /confirmar/i });
    await userEvent.click(confirmarButton);
    
    // Verificar se a consulta foi cancelada
    await waitFor(() => {
      expect(screen.getByText(/cancelada/i)).toBeInTheDocument();
    });
  });
});