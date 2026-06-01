import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeaturedProducts } from './FeaturedProducts';
import type { Product } from '../../../shared/interfaces/product.interface';

// Mockeamos el servicio para no depender de fetch
vi.mock('../../../shared/services/productService', () => ({
  fetchProducts: vi.fn(),
}));

import { fetchProducts } from '../../../shared/services/productService';

/**
 * Mock de IntersectionObserver
 */
function createMockIntersectionObserver() {
  let callback: IntersectionObserverCallback = () => {};

  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIO {
    constructor(cb: IntersectionObserverCallback) {
      callback = cb;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  return {
    MockIO,
    triggerInView(inView: boolean) {
      callback(
        [{ isIntersecting: inView } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    },
    observe,
  };
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Teclado Mecánico',
    price: 89.99,
    category: 'Electrónica',
    image: 'https://example.com/1.jpg',
    description: 'Teclado RGB',
  },
  {
    id: 2,
    name: 'Mouse Gamer',
    price: 59.99,
    category: 'Electrónica',
    image: 'https://example.com/2.jpg',
    description: 'Mouse ergonómico',
  },
  {
    id: 3,
    name: 'Audífonos Bluetooth',
    price: 129.99,
    category: 'Electrónica',
    image: 'https://example.com/3.jpg',
    description: 'Audífonos inalámbricos',
  },
  {
    id: 4,
    name: 'Monitor 27"',
    price: 349.99,
    category: 'Electrónica',
    image: 'https://example.com/4.jpg',
    description: 'Monitor 4K',
  },
  {
    id: 5,
    name: 'Webcam HD',
    price: 79.99,
    category: 'Electrónica',
    image: 'https://example.com/5.jpg',
    description: 'Cámara web 1080p',
  },
];

describe('FeaturedProducts', () => {
  let mockIO: ReturnType<typeof createMockIntersectionObserver>;

  beforeEach(() => {
    mockIO = createMockIntersectionObserver();
    vi.stubGlobal('IntersectionObserver', mockIO.MockIO);
    // fetchProducts devuelve todos los productos; FeaturedProducts hace slice(0,4)
    vi.mocked(fetchProducts).mockResolvedValue(MOCK_PRODUCTS);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  function renderSection() {
    return render(
      <MemoryRouter>
        <FeaturedProducts />
      </MemoryRouter>,
    );
  }

  describe('loading state', () => {
    it('should render the heading during loading', () => {
      renderSection();
      expect(screen.getByText('Productos destacados')).toBeInTheDocument();
    });

    it('should render skeleton placeholders while loading', () => {
      renderSection();
      // 4 skeleton cards
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('loaded state', () => {
    it('should render up to 4 featured products after loading', async () => {
      renderSection();

      expect(await screen.findByText('Teclado Mecánico')).toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
      expect(screen.getByText('Audífonos Bluetooth')).toBeInTheDocument();
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument();
    });

    it('should NOT render the 5th product (only 4 are featured)', async () => {
      renderSection();

      await screen.findByText('Teclado Mecánico');

      expect(screen.queryByText('Webcam HD')).not.toBeInTheDocument();
    });

    it('should not have skeleton placeholders after loading', async () => {
      renderSection();

      await screen.findByText('Teclado Mecánico');

      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });

    it('should render "Ver todos" link to /catalogo', async () => {
      renderSection();

      const verTodos = await screen.findByRole('link', { name: 'Ver todos' });
      expect(verTodos).toHaveAttribute('href', '/catalogo');
    });

    it('should render "Ver todos los productos" link (mobile) to /catalogo', async () => {
      renderSection();

      const mobileLink = await screen.findByRole('link', {
        name: /ver todos los productos/i,
      });
      expect(mobileLink).toHaveAttribute('href', '/catalogo');
    });
  });

  describe('error handling', () => {
    it('should handle fetch error gracefully (empty featured)', async () => {
      vi.mocked(fetchProducts).mockRejectedValue(new Error('Network error'));

      renderSection();

      // FeaturedProducts falla silenciosamente - sin productos, sin error visible
      await vi.waitFor(() => {
        expect(fetchProducts).toHaveBeenCalledTimes(1);
      });

      // El heading sigue ahí
      expect(screen.getByText('Productos destacados')).toBeInTheDocument();
      // No debe haber skeleton
      await vi.waitFor(() => {
        expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
      });
    });
  });
});
