import { http, HttpResponse } from 'msw';

interface LoginRequest {
  email: string;
  senha: string;
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, senha } = await request.json() as LoginRequest;
    
    if (email === 'teste@vidaplus.com' && senha === '123456') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        usuario: {
          id: 1,
          nome: 'Administrador',
          email: 'teste@vidaplus.com',
          tipo: 'admin',
          status: 'ativo'
        }
      });
    }
    
    return new HttpResponse(null, { status: 401 });
  }),
  
  // Mocks para a API de telemedicina
  http.post('/api/telemedicina/sessao/:consultaId/iniciar', () => {
    return HttpResponse.json({
      sessionId: 'mock-session-123',
      token: 'mock-video-token',
      roomName: 'consulta-virtual-1',
      participantes: [
        { id: 1, nome: 'Dr. Paulo Santos', tipo: 'medico' },
        { id: 2, nome: 'João Silva', tipo: 'paciente' }
      ]
    });
  }),
  
  http.post('/api/telemedicina/sessao/:sessionId/encerrar', () => {
    return HttpResponse.json({
      success: true,
      message: 'Sessão encerrada com sucesso'
    });
  }),
  
  http.get('/api/telemedicina/sessao/:sessionId/token', () => {
    return HttpResponse.json({
      token: 'novo-token-video-123',
      expiresIn: 3600
    });
  }),
  
  http.patch('/api/telemedicina/sessao/:sessionId/gravacao', () => {
    return HttpResponse.json({
      recording: true,
      startTime: new Date().toISOString()
    });
  }),
  
  // Mocks para consultas
  http.get('/api/consultas', () => {
    return HttpResponse.json([
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
      }
    ]);
  })
];
