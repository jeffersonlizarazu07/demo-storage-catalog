import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';

describe('Footer', () => {
  function renderFooter() {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
  }

  it('should render brand name with accent', () => {
    renderFooter();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Store')).toBeInTheDocument();
  });

  it('should render catalog and contact links', () => {
    renderFooter();

    const catalogoLink = screen.getByRole('link', { name: 'Catálogo' });
    expect(catalogoLink).toHaveAttribute('href', '/catalogo');

    const contactoLink = screen.getByRole('link', { name: 'Contacto' });
    expect(contactoLink).toHaveAttribute('href', '/contacto');
  });

  it('should render copyright with current year', () => {
    renderFooter();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} TechStore. Todos los derechos reservados.`),
    ).toBeInTheDocument();
  });

  it('should link brand to home page', () => {
    renderFooter();

    const brandLinks = screen.getAllByRole('link', { name: /tech/i });
    // The brand link (first one with TechStore text)
    const brandLink = brandLinks.find((l) => l.getAttribute('href') === '/');
    expect(brandLink).toBeInTheDocument();
  });
});
