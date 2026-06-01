import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

// Mockeamos los hooks de Home para no depender de fetch
const mockUseFeaturedProducts = vi.fn();
const mockUseHomeCategories = vi.fn();

vi.mock('./hooks/useFeaturedProducts', () => ({
  useFeaturedProducts: () => mockUseFeaturedProducts(),
}));

vi.mock('./hooks/useHomeCategories', () => ({
  useHomeCategories: () => mockUseHomeCategories(),
}));

import type { Product } from '../../shared/interfaces/product.interface';

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

const LOADED_FEATURED = { products: MOCK_PRODUCTS, loading: false };
const LOADING_FEATURED = { products: [], loading: true };
const LOADED_CATEGORIES = {
  categories: ['Electrónica', 'Joyería', 'Ropa Hombre', 'Ropa Mujer'],
  loading: false,
  error: null,
  onRetry: vi.fn(),
};
const LOADING_CATEGORIES = {
  categories: [],
  loading: true,
  error: null,
  onRetry: vi.fn(),
};
const ERROR_CATEGORIES = {
  categories: [],
  loading: false,
  error: 'No pudimos cargar las categorías. Intenta de nuevo.',
  onRetry: vi.fn(),
};

describe('Home page', () => {
  beforeEach(() => {
    mockUseFeaturedProducts.mockReturnValue(LOADED_FEATURED);
    mockUseHomeCategories.mockReturnValue(LOADED_CATEGORIES);
  });

  afterEach(() => {
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
      mockUseFeaturedProducts.mockReturnValue(LOADING_FEATURED);
      renderHome();

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });

    it('should render FeaturedProducts products after loading completes', () => {
      renderHome();

      expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
      expect(screen.getByText('Audífonos Bluetooth')).toBeInTheDocument();
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument();
    });

    it('should not show skeletons after FeaturedProducts loads', () => {
      renderHome();
      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });

    it('should handle FeaturedProducts empty state (fetch error)', () => {
      mockUseFeaturedProducts.mockReturnValue({ products: [], loading: false });
      renderHome();

      // El heading sigue presente
      expect(screen.getByRole('heading', { name: /destacados/i })).toBeInTheDocument();
      // No debe haber productos
      expect(screen.queryByText('Teclado Mecánico')).not.toBeInTheDocument();
      // No debe haber skeletons
      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });

    it('should render "Ver todos" desktop link to /catalogo after loading', () => {
      renderHome();

      const verTodos = screen.getByRole('link', { name: 'Ver todos' });
      expect(verTodos).toHaveAttribute('href', '/catalogo');
    });

    it('should render "Ver todos los productos" mobile link to /catalogo after loading', () => {
      renderHome();

      const mobileLink = screen.getByRole('link', {
        name: /ver todos los productos/i,
      });
      expect(mobileLink).toHaveAttribute('href', '/catalogo');
    });
  });

  describe('CategoriesSection integration', () => {
    it('should render category names when loaded', () => {
      renderHome();
      // Joyería solo aparece en CategoriesSection (no en FeaturedProducts)
      expect(screen.getByText('Joyería')).toBeInTheDocument();
      // "Ropa Hombre" también es exclusivo de categorías
      expect(screen.getByText('Ropa Hombre')).toBeInTheDocument();
    });

    it('should show error message when categories fail to load', () => {
      mockUseHomeCategories.mockReturnValue(ERROR_CATEGORIES);
      renderHome();

      expect(screen.getByText(/no pudimos cargar las categorías/i)).toBeInTheDocument();
    });

    it('should show skeleton while categories are loading', () => {
      mockUseHomeCategories.mockReturnValue(LOADING_CATEGORIES);
      renderHome();

      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });
  });
});
