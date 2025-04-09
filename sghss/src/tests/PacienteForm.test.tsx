import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PacienteForm from '../components/PacienteForm';

describe('PacienteForm', () => {
  it('should validate LGPD requirements', async () => {
    const onClose = vi.fn();
    render(<PacienteForm open={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText(/aceitar os termos de privacidade/i)).toBeInTheDocument();
      expect(screen.getByText(/selecione pelo menos um tipo de dado sensível/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission with valid data', async () => {
    const onClose = vi.fn();
    render(<PacienteForm open={true} onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' }
    });

    fireEvent.click(screen.getByLabelText(/li e aceito a política/i));
    fireEvent.click(screen.getByLabelText(/histórico médico/i));

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
