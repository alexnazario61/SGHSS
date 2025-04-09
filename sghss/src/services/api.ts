import axios, { AxiosError } from 'axios';
import { Paciente, Consulta, Profissional, Medicamento, Prontuario, ApiError } from '../types';

// Estado global para controle de loading
export const loadingState = {
  isLoading: false,
  setLoading: (state: boolean) => {
    loadingState.isLoading = state;
  }
};

const api = axios.create({
  // Corrigindo o acesso às variáveis de ambiente para o formato do Vite
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000 // Timeout de 10 segundos
});

// Interceptor para tratar tokens de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  loadingState.setLoading(true); // Ativa loading state em cada requisição
  return config;
});

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    loadingState.setLoading(false); // Desativa loading ao receber resposta
    return response;
  },
  (error: AxiosError<ApiError>) => {
    loadingState.setLoading(false); // Desativa loading em caso de erro
    
    // Tratamento personalizado de erros
    if (error.response) {
      // Erro de resposta do servidor (4xx, 5xx)
      const statusCode = error.response.status;
      
      if (statusCode === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
      
      if (statusCode === 403) {
        // Acesso não autorizado
        console.error('Acesso não autorizado ao recurso');
      }
      
      // Personalizar mensagem de erro com base no status
      const errorMessage = error.response.data?.message || 
                          `Erro ${statusCode}: Falha na operação`;
      
      // Você pode implementar um sistema de notificação aqui
      console.error(errorMessage);
    } else if (error.request) {
      // Requisição feita mas sem resposta (problemas de rede)
      console.error('Erro de conexão: Verifique sua conexão com a internet');
    } else {
      // Erro ao configurar a requisição
      console.error('Erro:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Função helper para tratamento de erros nas services
const handleApiError = async <T>(promise: Promise<T>): Promise<[T | null, Error | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error('Ocorreu um erro desconhecido')];
  }
};

export const authService = {
  login: async (email: string, senha: string) => {
    const [data, error] = await handleApiError(api.post('/auth/login', { email, senha }));
    if (error) throw error;
    
    if (data) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
    return null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Opcional: notificar o servidor sobre o logout
    return api.post('/auth/logout').catch(() => {
      // Silenciar erros no logout
    });
  },
  checkAuth: async () => {
    return handleApiError(api.get('/auth/verify'));
  }
};

export const pacienteService = {
  listar: async (params?: any) => {
    const [response, error] = await handleApiError(api.get('/pacientes', { params }));
    if (error) throw error;
    return response?.data || [];
  },
  obterPorId: async (id: number) => {
    const [response, error] = await handleApiError(api.get(`/pacientes/${id}`));
    if (error) throw error;
    return response?.data;
  },
  criar: async (paciente: Omit<Paciente, 'id'>) => {
    const [response, error] = await handleApiError(api.post('/pacientes', paciente));
    if (error) throw error;
    return response?.data;
  },
  atualizar: async (id: number, paciente: Partial<Paciente>) => {
    const [response, error] = await handleApiError(api.put(`/pacientes/${id}`, paciente));
    if (error) throw error;
    return response?.data;
  },
  excluir: async (id: number) => {
    const [_, error] = await handleApiError(api.delete(`/pacientes/${id}`));
    if (error) throw error;
    return true;
  }
};

export const consultaService = {
  listar: async (filtros?: { dataInicio?: string, dataFim?: string, status?: string, pacienteId?: number, profissionalId?: number }) => {
    const [response, error] = await handleApiError(api.get('/consultas', { params: filtros }));
    if (error) throw error;
    return response?.data || [];
  },
  obterPorId: async (id: number) => {
    const [response, error] = await handleApiError(api.get(`/consultas/${id}`));
    if (error) throw error;
    return response?.data;
  },
  criar: async (consulta: Omit<Consulta, 'id'>) => {
    const [response, error] = await handleApiError(api.post('/consultas', consulta));
    if (error) throw error;
    return response?.data;
  },
  atualizar: async (id: number, consulta: Partial<Consulta>) => {
    const [response, error] = await handleApiError(api.put(`/consultas/${id}`, consulta));
    if (error) throw error;
    return response?.data;
  },
  cancelar: async (id: number, motivo?: string) => {
    const [_, error] = await handleApiError(api.patch(`/consultas/${id}/cancelar`, { motivo }));
    if (error) throw error;
    return true;
  },
  concluir: async (id: number, observacoes?: string) => {
    const [response, error] = await handleApiError(
      api.patch(`/consultas/${id}/concluir`, { observacoes })
    );
    if (error) throw error;
    return response?.data;
  }
};

// Novos serviços para implementar funcionalidades adicionais

export const telemedicinaSevice = {
  iniciarSessao: async (consultaId: number) => {
    const [response, error] = await handleApiError(api.post(`/telemedicina/sessao/${consultaId}/iniciar`));
    if (error) throw error;
    return response?.data;
  },
  encerrarSessao: async (sessaoId: string) => {
    const [_, error] = await handleApiError(api.post(`/telemedicina/sessao/${sessaoId}/encerrar`));
    if (error) throw error;
    return true;
  },
  gerarToken: async (sessaoId: string) => {
    const [response, error] = await handleApiError(api.get(`/telemedicina/sessao/${sessaoId}/token`));
    if (error) throw error;
    return response?.data;
  },
  gravarSessao: async (sessaoId: string, gravarEnabled: boolean) => {
    const [response, error] = await handleApiError(
      api.patch(`/telemedicina/sessao/${sessaoId}/gravacao`, { gravarEnabled })
    );
    if (error) throw error;
    return response?.data;
  }
};

export const profissionalService = {
  listar: async (especialidade?: string) => {
    const [response, error] = await handleApiError(
      api.get('/profissionais', { params: { especialidade } })
    );
    if (error) throw error;
    return response?.data || [];
  },
  obterPorId: async (id: number) => {
    const [response, error] = await handleApiError(api.get(`/profissionais/${id}`));
    if (error) throw error;
    return response?.data;
  },
  consultarAgenda: async (profissionalId: number, data: string) => {
    const [response, error] = await handleApiError(
      api.get(`/profissionais/${profissionalId}/agenda`, { params: { data } })
    );
    if (error) throw error;
    return response?.data || [];
  }
};

export const prontuarioService = {
  obterPorPacienteId: async (pacienteId: number) => {
    const [response, error] = await handleApiError(api.get(`/pacientes/${pacienteId}/prontuario`));
    if (error) throw error;
    return response?.data;
  },
  adicionarAnotacao: async (pacienteId: number, anotacao: { 
    tipo: string, 
    descricao: string, 
    data: string,
    profissionalId: number
  }) => {
    const [response, error] = await handleApiError(
      api.post(`/pacientes/${pacienteId}/prontuario/anotacoes`, anotacao)
    );
    if (error) throw error;
    return response?.data;
  },
  adicionarExame: async (pacienteId: number, exame: {
    tipo: string,
    resultado: string,
    data: string,
    arquivoUrl?: string,
    profissionalId: number
  }) => {
    const [response, error] = await handleApiError(
      api.post(`/pacientes/${pacienteId}/prontuario/exames`, exame)
    );
    if (error) throw error;
    return response?.data;
  }
};

export const dashboardService = {
  obterEstatisticasGerais: async () => {
    const [response, error] = await handleApiError(api.get('/dashboard/estatisticas'));
    if (error) throw error;
    return response?.data;
  },
  obterConsultasPorPeriodo: async (dataInicio: string, dataFim: string) => {
    const [response, error] = await handleApiError(
      api.get('/dashboard/consultas-por-periodo', { 
        params: { dataInicio, dataFim } 
      })
    );
    if (error) throw error;
    return response?.data;
  },
  obterIndicadoresPrincipais: async () => {
    const [response, error] = await handleApiError(api.get('/dashboard/indicadores'));
    if (error) throw error;
    return response?.data;
  }
};

export default api;
