import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

// Mockeamos el servicio para controlar FeaturedProducts desde Home
vi.mock('../../shared/services/productService', () => ({
  fetchProducts: vi.fn(),
}));

import { fetchProducts } from '../../shared/services/productService';
import type { Product } from '../../shared/interfaces/product.interface';

/**
 * Mock de IntersectionObserver para que useInView funcione en test.
 * Al no disparar intersección, los elementos renderizan con opacity-0
 * pero siguen en el DOM y son accesibles.
 */
function createMockIntersectionObserver() {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIO {
    constructor() {
      /* no-op */
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  return { MockIO, observe };
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Teclado Mecánico',
    price: 89.99,
    category: 'Electrónica',
    image: '',
    description: 'Teclado RGB',
  },
  {
    id: 2,
    name: 'Mouse Gamer',
    price: 59.99,
    category: 'Electrónica',
    image: '',
    description: 'Mouse ergonómico',
  },
  {
    id: 3,
    name: 'Audífonos Bluetooth',
    price: 129.99,
    category: 'Electrónica',
    image: '',
    description: 'Audífonos',
  },
  {
    id: 4,
    name: 'Monitor 27"',
    price: 349.99,
    category: 'Electrónica',
    image: '',
    description: 'Monitor 4K',
  },
];

describe('Home page', () => {
  let mockIO: ReturnType<typeof createMockIntersectionObserver>;

  beforeEach(() => {
    mockIO = createMockIntersectionObserver();
    vi.stubGlobal('IntersectionObserver', mockIO.MockIO);
    vi.mocked(fetchProducts).mockResolvedValue(MOCK_PRODUCTS);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  function renderHome() {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
  }

  it('should render HeroSection with main heading', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should render CategoriesSection title', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /categorías/i })).toBeInTheDocument();
  });

  it('should render FeaturedProducts title', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /destacados/i })).toBeInTheDocument();
  });

  it('should render CTA links to catalog and contact', () => {
    renderHome();
    expect(screen.getByRole('link', { name: /explorar catálogo/i })).toHaveAttribute(
      'href',
      '/catalogo',
    );
    expect(screen.getByRole('link', { name: /contáctanos/i })).toHaveAttribute('href', '/contacto');
  });

  it('should render category navigation links', () => {
    renderHome();
    const categoryLinks = screen.getAllByRole('link');
    const catalogLinks = categoryLinks.filter((link) =>
      link.getAttribute('href')?.startsWith('/catalogo'),
    );
    expect(catalogLinks.length).toBeGreaterThanOrEqual(1);
  });

  describe('FeaturedProducts integration', () => {
    it('should show skeleton placeholders while FeaturedProducts is loading', () => {
      // No resolvemos fetchProducts aún — se queda en pending
      vi.mocked(fetchProducts).mockImplementationOnce(() => new Promise(() => {}));

      renderHome();

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });

    it('should render FeaturedProducts products after loading completes', async () => {
      renderHome();

      expect(await screen.findByText('Teclado Mecánico')).toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
      expect(screen.getByText('Audífonos Bluetooth')).toBeInTheDocument();
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument();
    });

    it('should not show skeletons after FeaturedProducts loads', async () => {
      renderHome();

      await screen.findByText('Teclado Mecánico');

      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });

    it('should handle FeaturedProducts fetch error gracefully', async () => {
      vi.mocked(fetchProducts).mockRejectedValue(new Error('Network error'));

      renderHome();

      // Esperar a que React procese el error (catch → finally → setLoading(false))
      await vi.waitFor(() => {
        expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
      });

      // El heading sigue presente
      expect(screen.getByRole('heading', { name: /destacados/i })).toBeInTheDocument();
      // No debe haber productos
      expect(screen.queryByText('Teclado Mecánico')).not.toBeInTheDocument();
    });

    it('should render "Ver todos" desktop link to /catalogo after loading', async () => {
      renderHome();

      const verTodos = await screen.findByRole('link', { name: 'Ver todos' });
      expect(verTodos).toHaveAttribute('href', '/catalogo');
    });

    it('should render "Ver todos los productos" mobile link to /catalogo after loading', async () => {
      renderHome();

      const mobileLink = await screen.findByRole('link', {
        name: /ver todos los productos/i,
      });
      expect(mobileLink).toHaveAttribute('href', '/catalogo');
    });
  });
});
