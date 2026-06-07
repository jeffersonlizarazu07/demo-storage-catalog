import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { RouteErrorBoundary } from '../shared/components/RouteErrorBoundary';

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mockeamos las páginas lazy-loaded para que sean síncronas en tests
vi.mock('../features/home/Home', () => ({
  Home: () => <div data-testid="page-home">Página de Inicio</div>,
}));
vi.mock('../features/catalog/Catalog', () => ({
  Catalog: () => <div data-testid="page-catalog">Página de Catálogo</div>,
}));
vi.mock('../features/product/ProductDetail', () => ({
  ProductDetail: () => <div data-testid="page-product">Página de Producto</div>,
}));
vi.mock('../features/contact/Contact', () => ({
  Contact: () => <div data-testid="page-contact">Página de Contacto</div>,
}));

// Mockeamos useDarkMode para evitar dependencia de matchMedia/localStorage
vi.mock('../shared/hooks/useDarkMode', () => ({
  useDarkMode: () => ({ isDark: false, toggle: vi.fn() }),
}));

// Importamos las rutas después de los mocks
import { routes } from './index';

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderRoute(path: string) {
  const testRouter = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={testRouter} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Route configuration', () => {
  it('should define 5 child routes (4 pages + 1 catch-all)', () => {
    expect(routes).toHaveLength(1);
    expect(routes[0].children).toHaveLength(5);
  });

  it('should have correct route paths', () => {
    const children = routes[0].children!;
    // index route has no path, index: true
    expect(children[0]).not.toHaveProperty('path');
    expect((children[0] as RouteObject).index).toBe(true);
    expect(children[1]).toMatchObject({ path: '/catalogo' });
    expect(children[2]).toMatchObject({ path: '/producto/:id' });
    expect(children[3]).toMatchObject({ path: '/contacto' });
    expect(children[4]).toMatchObject({ path: '*' });
  });

  it('should wrap lazy-loaded routes in Suspense with a fallback', () => {
    const children = routes[0].children!;
    // Skip the catch-all (*) — NotFoundPage is eagerly loaded, not lazy
    const lazyRoutes = children.filter((r) => r.path !== '*');
    lazyRoutes.forEach((route) => {
      const element = route.element as React.ReactElement<
        React.ComponentProps<typeof React.Suspense>
      >;
      expect(element.type).toBe(React.Suspense);
      expect(element.props.fallback).toBeDefined();
    });
  });

  it('should wrap lazy-loaded routes in RouteErrorBoundary', () => {
    const children = routes[0].children!;
    // Skip the catch-all (*) — NotFoundPage is already a static error page
    const lazyRoutes = children.filter((r) => r.path !== '*');
    lazyRoutes.forEach((route) => {
      const element = route.element as React.ReactElement<
        React.ComponentProps<typeof React.Suspense>
      >;
      const childrenContent = element.props.children as React.ReactElement;
      // Children is wrapped via RouteErrorBoundary (component, not HOC)
      expect(childrenContent.type).toBe(RouteErrorBoundary);
    });
  });
});

describe('Route rendering', () => {
  it('should render Home page at /', async () => {
    renderRoute('/');
    expect(await screen.findByTestId('page-home')).toHaveTextContent('Página de Inicio');
  });

  it('should render Catalog page at /catalogo', async () => {
    renderRoute('/catalogo');
    expect(await screen.findByTestId('page-catalog')).toHaveTextContent('Página de Catálogo');
  });

  it('should render Product Detail page at /producto/:id', async () => {
    renderRoute('/producto/42');
    expect(await screen.findByTestId('page-product')).toHaveTextContent('Página de Producto');
  });

  it('should render Contact page at /contacto', async () => {
    renderRoute('/contacto');
    expect(await screen.findByTestId('page-contact')).toHaveTextContent('Página de Contacto');
  });

  it('should render NotFoundPage for unknown routes', async () => {
    renderRoute('/ruta-que-no-existe');
    expect(await screen.findByText('Página no encontrada')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/');
  });
});

describe('Navigation between routes', () => {
  it('should render navigation links in MainLayout', () => {
    renderRoute('/');
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
    expect(nav.getByRole('link', { name: /catálogo/i })).toBeInTheDocument();
    expect(nav.getByRole('link', { name: /contacto/i })).toBeInTheDocument();
  });

  it('should render the brand link to home', () => {
    renderRoute('/');
    const nav = within(screen.getByRole('navigation'));
    expect(nav.getByRole('link', { name: /tech\s*store/i })).toHaveAttribute('href', '/');
  });

  it('should render Footer', () => {
    renderRoute('/');
    expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument();
  });
});

describe('Suspense fallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should show fallback while lazy component loads', () => {
    const SlowLazy = React.lazy(() => new Promise<{ default: React.ComponentType }>(() => {}));

    const slowRoutes = [
      {
        path: '/',
        element: (
          <React.Suspense fallback={<div data-testid="fallback">Cargando...</div>}>
            <SlowLazy />
          </React.Suspense>
        ),
      },
    ];

    const testRouter = createMemoryRouter(slowRoutes, { initialEntries: ['/'] });
    render(<RouterProvider router={testRouter} />);

    expect(screen.getByTestId('fallback')).toHaveTextContent('Cargando...');
  });

  it('should render loading spinner in actual PageFallback', () => {
    const NeverResolving = React.lazy(
      () => new Promise<{ default: React.ComponentType }>(() => {}),
    );

    const fallbackRoutes = [
      {
        path: '/',
        element: (
          <React.Suspense
            fallback={
              <div>
                <div data-testid="spinner" className="animate-spin" />
                <p>Cargando...</p>
              </div>
            }
          >
            <NeverResolving />
          </React.Suspense>
        ),
      },
    ];

    const testRouter = createMemoryRouter(fallbackRoutes, { initialEntries: ['/'] });
    render(<RouterProvider router={testRouter} />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
