import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Paciente, Consulta, Usuario } from '../types';

interface AppContextData {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  pacientes: Paciente[];
  setPacientes: (pacientes: Paciente[]) => void;
  consultas: Consulta[];
  setConsultas: (consultas: Consulta[]) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Recuperar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Função para logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUsuario(null);
    window.location.href = '/login';
  };

  return (
    <AppContext.Provider 
      value={{ 
        usuario, 
        setUsuario, 
        pacientes, 
        setPacientes, 
        consultas, 
        setConsultas,
        logout 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
