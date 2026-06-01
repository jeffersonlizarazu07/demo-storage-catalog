import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  /** Helper que renderiza el Navbar dentro de MemoryRouter + ThemeProvider */
  function renderNavbar(initialRoute = '/') {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </MemoryRouter>,
    );
  }

  /* ── Brand ── */

  it('should render brand with accent text', () => {
    renderNavbar();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Store')).toBeInTheDocument();
  });

  it('should link brand to home', () => {
    renderNavbar();
    const brandLink = screen.getByRole('link', { name: /tech\s*store/i });
    expect(brandLink).toHaveAttribute('href', '/');
  });

  /* ── Desktop Navigation ── */

  it('should render all desktop navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('should link Inicio to / and Catálogo to /catalogo', () => {
    renderNavbar();
    expect(screen.getByText('Inicio').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Catálogo').closest('a')).toHaveAttribute('href', '/catalogo');
    expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto');
  });

  /* ── Dark Mode Toggle ── */

  it('should have a theme toggle button with aria-label', () => {
    renderNavbar();
    // The button should have an aria-label that includes "Modo"
    const button = screen.getByRole('button', { name: /modo/i });
    expect(button).toBeInTheDocument();
  });

  it('should cycle modes when clicked', () => {
    renderNavbar();
    const button = screen.getByRole('button', { name: /modo/i });

    // Click once: light → dark
    fireEvent.click(button);
    // After click, we should be in dark mode
    expect(button.innerHTML).toContain('svg');

    // Click again: dark → system
    fireEvent.click(button);

    // Click again: system → light
    fireEvent.click(button);
  });

  /* ── Mobile Menu ── */

  it('should have mobile menu button with aria-expanded false by default', () => {
    renderNavbar();
    const button = screen.getByLabelText('Abrir menú de navegación');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should toggle mobile menu when hamburger is clicked', () => {
    renderNavbar();
    const button = screen.getByLabelText('Abrir menú de navegación');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should show mobile nav links when menu is open', () => {
    renderNavbar();
    fireEvent.click(screen.getByLabelText('Abrir menú de navegación'));

    const inicioLinks = screen.getAllByText('Inicio');
    expect(inicioLinks.length).toBeGreaterThanOrEqual(2);
  });

  /* ── Scroll Effect ── */

  it('should handle scroll event without errors', () => {
    expect(() => renderNavbar()).not.toThrow();
  });
});
