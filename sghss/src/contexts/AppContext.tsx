import { createContext, useContext, useState, ReactNode } from 'react';
import { Paciente, Consulta, Usuario } from '../types';

interface AppContextData {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  pacientes: Paciente[];
  setPacientes: (pacientes: Paciente[]) => void;
  consultas: Consulta[];
  setConsultas: (consultas: Consulta[]) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  return (
    <AppContext.Provider 
      value={{ 
        usuario, 
        setUsuario, 
        pacientes, 
        setPacientes, 
        consultas, 
        setConsultas 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
