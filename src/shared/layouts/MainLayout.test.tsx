import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '../context/ThemeContext';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  function renderLayout() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<div data-testid="outlet-content">Contenido de prueba</div>} />
            </Route>
          </Routes>
        </ThemeProvider>
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

  it('should render Navbar with theme toggle button', () => {
    renderLayout();
    expect(screen.getByRole('button', { name: /modo/i })).toBeInTheDocument();
  });

  it('should render skip-to-content link with correct href', () => {
    renderLayout();
    const skipLink = screen.getByText('Saltar al contenido principal');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should render main element with id main-content', () => {
    renderLayout();
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
  });
});
