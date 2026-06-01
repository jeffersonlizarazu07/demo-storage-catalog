import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mockeamos las páginas lazy-loaded para que sean síncronas en tests
// Usamos require para traer Link de react-router-dom dentro del factory
vi.mock('../features/home/Home', () => {
  const { Link } = require('react-router-dom');
  return {
    Home: () => (
      <div data-testid="page-home">
        Página de Inicio
        <Link to="/catalogo">Explorar catálogo</Link>
        <Link to="/contacto">Contáctanos</Link>
      </div>
    ),
  };
});
vi.mock('../features/catalog/Catalog', () => ({
  Catalog: () => <div data-testid="page-catalog">Página de Catálogo</div>,
}));
vi.mock('../features/product/ProductDetail', () => ({
  ProductDetail: () => <div data-testid="page-product">Página de Producto</div>,
}));
vi.mock('../features/contact/Contact', () => ({
  Contact: () => <div data-testid="page-contact">Página de Contacto</div>,
}));

vi.mock('../shared/hooks/useDarkMode', () => ({
  useDarkMode: () => ({ isDark: false, toggle: vi.fn() }),
}));

import { routes } from './index';

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return { router, ...render(<RouterProvider router={router} />) };
}

/** Obtiene el elemento de navegación principal (Navbar) */
function getNav() {
  return within(screen.getByRole('navigation'));
}

describe('Navigation interactions', () => {
  /* ── Nav link clicks ── */

  it('should navigate from Home to Catalog via nav link', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(getNav().getByRole('link', { name: /catálogo/i }));

    expect(await screen.findByTestId('page-catalog')).toBeInTheDocument();
    expect(screen.queryByTestId('page-home')).not.toBeInTheDocument();
  });

  it('should navigate from Home to Contacto via nav link', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(getNav().getByRole('link', { name: /contacto/i }));

    expect(await screen.findByTestId('page-contact')).toBeInTheDocument();
    expect(screen.queryByTestId('page-home')).not.toBeInTheDocument();
  });

  it('should navigate back to Home when clicking the brand logo', async () => {
    const user = userEvent.setup();
    renderAt('/catalogo');

    // Estamos en catálogo
    expect(screen.getByTestId('page-catalog')).toBeInTheDocument();

    // Click en brand
    await user.click(getNav().getByRole('link', { name: /tech\s*store/i }));

    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
    expect(screen.queryByTestId('page-catalog')).not.toBeInTheDocument();
  });

  /* ── Home CTAs ── */

  it('should navigate to Catalog when clicking CTA "Explorar Catálogo"', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: /explorar catálogo/i }));

    expect(await screen.findByTestId('page-catalog')).toBeInTheDocument();
  });

  it('should navigate to Contacto when clicking CTA "Contáctanos"', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: /contáctanos/i }));

    expect(await screen.findByTestId('page-contact')).toBeInTheDocument();
  });

  /* ── Direct URL navigation ── */

  it('should render Catalog page when navigating directly to /catalogo', () => {
    renderAt('/catalogo');
    expect(screen.getByTestId('page-catalog')).toBeInTheDocument();
  });

  it('should render ProductDetail page when navigating directly to /producto/42', async () => {
    renderAt('/producto/42');
    expect(await screen.findByTestId('page-product')).toBeInTheDocument();
  });

  it('should render Contact page when navigating directly to /contacto', () => {
    renderAt('/contacto');
    expect(screen.getByTestId('page-contact')).toBeInTheDocument();
  });
});
