import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './MainLayout';

// Mockeamos useDarkMode para no depender de matchMedia/localStorage
vi.mock('../hooks/useDarkMode', () => ({
  useDarkMode: () => ({ isDark: false, toggle: vi.fn() }),
}));

describe('MainLayout', () => {
  function renderLayout() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<div data-testid="outlet-content">Contenido de prueba</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  }

  it('should render Navbar with brand', () => {
    renderLayout();
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getByText('Tech')).toBeInTheDocument();
    expect(nav.getByText('Store')).toBeInTheDocument();
  });

  it('should render Navbar navigation links', () => {
    renderLayout();
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getByText('Inicio')).toBeInTheDocument();
    expect(nav.getByText('Catálogo')).toBeInTheDocument();
    expect(nav.getByText('Contacto')).toBeInTheDocument();
  });

  it('should render Footer with copyright', () => {
    renderLayout();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} TechStore. Todos los derechos reservados.`),
    ).toBeInTheDocument();
  });

  it('should render Outlet content', () => {
    renderLayout();
    expect(screen.getByTestId('outlet-content')).toHaveTextContent('Contenido de prueba');
  });

  it('should render Navbar with dark mode button', () => {
    renderLayout();
    expect(screen.getByLabelText('Activar modo oscuro')).toBeInTheDocument();
  });
});
