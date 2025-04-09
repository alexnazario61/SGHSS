import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import Pacientes from '../pages/Pacientes';

describe('Pacientes Page', () => {
  it('should render pacientes list', () => {
    render(
      <AppProvider>
        <Pacientes />
      </AppProvider>
    );

    expect(screen.getByText(/gerenciamento de pacientes/i)).toBeInTheDocument();
    expect(screen.getByText(/novo paciente/i)).toBeInTheDocument();
  });

  it('should open form modal on button click', () => {
    render(
      <AppProvider>
        <Pacientes />
      </AppProvider>
    );

    fireEvent.click(screen.getByText(/novo paciente/i));
    expect(screen.getByText(/cadastro de paciente/i)).toBeInTheDocument();
  });
});
