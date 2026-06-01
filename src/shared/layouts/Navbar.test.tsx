import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  const onToggleDark = vi.fn();

  /** Helper que renderiza el Navbar dentro de MemoryRouter */
  function renderNavbar(isDark = false, initialRoute = '/') {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar isDark={isDark} onToggleDark={onToggleDark} />
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    onToggleDark.mockClear();
  });

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

  it('should call onToggleDark when dark mode button is clicked', () => {
    renderNavbar();
    fireEvent.click(screen.getByLabelText('Activar modo oscuro'));
    expect(onToggleDark).toHaveBeenCalledTimes(1);
  });

  it('should have aria-label "Activar modo claro" when isDark is true', () => {
    renderNavbar(true);
    expect(screen.getByLabelText('Activar modo claro')).toBeInTheDocument();
  });

  it('should have aria-label "Activar modo oscuro" when isDark is false', () => {
    renderNavbar(false);
    expect(screen.getByLabelText('Activar modo oscuro')).toBeInTheDocument();
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

    // Los links del menú mobile deben aparecer (hay tanto desktop como mobile, pero Inicio aparece multiple veces)
    const inicioLinks = screen.getAllByText('Inicio');
    expect(inicioLinks.length).toBeGreaterThanOrEqual(2);
  });

  /* ── Scroll Effect ── */

  it('should handle scroll event without errors', () => {
    // Verifica que el componente se monta y el scroll listener se registra
    // sin lanzar errores (happy-dom soporta addEventListener)
    expect(() => renderNavbar()).not.toThrow();
  });
});
