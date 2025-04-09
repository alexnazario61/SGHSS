export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'medico' | 'enfermeiro' | 'atendente';
}

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco?: string;
}

export interface Consulta {
  id: number;
  pacienteId: number;
  profissionalId: number;
  data: string;
  hora: string;
  tipo: 'presencial' | 'telemedicina';
  status: 'agendada' | 'confirmada' | 'cancelada' | 'concluida';
}

export interface Profissional {
  id: number;
  nome: string;
  crm?: string;
  coren?: string;
  especialidade: string;
  tipo: 'medico' | 'enfermeiro';
}

export interface Medicamento {
  id: number;
  nome: string;
  principioAtivo: string;
  dosagem: string;
}

export interface Prontuario {
  id: number;
  pacienteId: number;
  historicoMedico: string;
  alergias: string[];
  medicamentos: Array<{
    medicamentoId: number;
    posologia: string;
  }>;
  exames: Array<{
    data: string;
    tipo: string;
    resultado: string;
    arquivoUrl?: string;
  }>;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
