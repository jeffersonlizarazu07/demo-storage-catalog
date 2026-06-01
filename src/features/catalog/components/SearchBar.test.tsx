import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    totalCount: 20,
    filteredCount: 20,
  };

  it('should render the search input with placeholder text', () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByPlaceholderText(/buscar productos/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should display the current value in the input', () => {
    render(<SearchBar {...defaultProps} value="teclado" />);

    const input = screen.getByPlaceholderText(/buscar productos/i);
    expect(input).toHaveValue('teclado');
  });

  it('should call onChange with the accumulated value when the user types', async () => {
    /**
     * Creamos un minicomponente envolvente para simular un ciclo de
     * vida completo del input controlado (value cambia tras cada keystroke).
     *
     * Sin esto, React restaura el valor inicial en cada renderizado y
     * el onChange solo recibe el carácter suelto, no la cadena acumulada.
     */
    function SearchBarWrapper() {
      const [value, setValue] = useState('');
      return <SearchBar value={value} onChange={setValue} totalCount={20} filteredCount={20} />;
    }

    render(<SearchBarWrapper />);
    const input = screen.getByPlaceholderText(/buscar productos/i);

    await userEvent.type(input, 'mouse');

    // Ahora el estado se actualiza en cada keystroke y el onChange
    // recibe correctamente el valor acumulado.
    expect(input).toHaveValue('mouse');
  });

  it('should show the filtered count badge when filteredCount differs from totalCount', () => {
    render(<SearchBar {...defaultProps} filteredCount={8} />);

    const badge = screen.getByText(/8 de 20/i);
    expect(badge).toBeInTheDocument();
  });

  it('should hide the filtered count badge when filteredCount equals totalCount', () => {
    render(<SearchBar {...defaultProps} />);

    // filteredCount(20) === totalCount(20), no hay badge
    expect(screen.queryByText(/\d+ de \d+/i)).not.toBeInTheDocument();
  });
});
