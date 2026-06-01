import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeaturedProducts } from './FeaturedProducts';
import type { Product } from '../../../shared/interfaces/product.interface';

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
  function renderSection(products: Product[], loading = false) {
    return render(
      <MemoryRouter>
        <FeaturedProducts products={products} loading={loading} />
      </MemoryRouter>,
    );
  }

  describe('loading state', () => {
    it('should render the heading during loading', () => {
      renderSection([], true);
      expect(screen.getByText('Productos destacados')).toBeInTheDocument();
    });

    it('should render skeleton placeholders while loading', () => {
      renderSection([], true);
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('loaded state', () => {
    it('should render up to 4 featured products after loading', () => {
      renderSection(MOCK_PRODUCTS);

      expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
      expect(screen.getByText('Audífonos Bluetooth')).toBeInTheDocument();
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument();
    });

    it('should render only the products passed as props', () => {
      renderSection(MOCK_PRODUCTS.slice(0, 4));

      expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
      expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
      expect(screen.getByText('Audífonos Bluetooth')).toBeInTheDocument();
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument();
      expect(screen.queryByText('Webcam HD')).not.toBeInTheDocument();
    });

    it('should not have skeleton placeholders after loading', () => {
      renderSection(MOCK_PRODUCTS);
      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });

    it('should render "Ver todos" link to /catalogo', () => {
      renderSection(MOCK_PRODUCTS);

      const verTodos = screen.getByRole('link', { name: 'Ver todos' });
      expect(verTodos).toHaveAttribute('href', '/catalogo');
    });

    it('should render "Ver todos los productos" link (mobile) to /catalogo', () => {
      renderSection(MOCK_PRODUCTS);

      const mobileLink = screen.getByRole('link', {
        name: /ver todos los productos/i,
      });
      expect(mobileLink).toHaveAttribute('href', '/catalogo');
    });
  });

  describe('empty state (error)', () => {
    it('should show heading but no products when empty array is passed', () => {
      renderSection([]);
      expect(screen.getByText('Productos destacados')).toBeInTheDocument();
      expect(screen.queryByText('Teclado Mecánico')).not.toBeInTheDocument();
    });

    it('should not have skeletons when not loading even with empty products', () => {
      renderSection([]);
      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });
  });
});
