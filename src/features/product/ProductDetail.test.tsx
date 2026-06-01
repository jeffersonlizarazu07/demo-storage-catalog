import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductDetail } from './ProductDetail';
import type { Product } from '../../shared/interfaces/product.interface';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockProduct: Product = {
  id: 1,
  name: 'Laptop Gamer Pro',
  price: 35000,
  category: 'Laptops',
  image: '/images/laptop-pro.jpg',
  description: 'La laptop más potente para gaming y desarrollo',
  brand: 'TechBrand',
  specs: {
    Procesador: 'Intel i9',
    RAM: '32GB',
    Almacenamiento: '1TB SSD',
  },
};

const mockRelatedProducts: Product[] = [
  {
    id: 2,
    name: 'Laptop Ultrabook',
    price: 22000,
    category: 'Laptops',
    image: '/images/ultrabook.jpg',
    description: 'Laptop ligera para trabajo y estudio',
    brand: 'TechBrand',
  },
  {
    id: 3,
    name: 'Laptop Económica',
    price: 12000,
    category: 'Laptops',
    image: '/images/economica.jpg',
    description: 'Laptop accesible para tareas cotidianas',
    brand: 'BudgetTech',
  },
];

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mockeamos useInView para control animaciones
vi.mock('../../shared/hooks/useInView', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

// Mockeamos useProduct para controlar loading/error/success
const mockUseProduct = vi.fn();
vi.mock('./hooks/useProduct', () => ({
  useProduct: () => mockUseProduct(),
}));

describe('ProductDetail page', () => {
  beforeEach(() => {
    mockUseProduct.mockReset();
  });

  function renderDetail(path = '/producto/1') {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  /* ── Loading state ── */

  describe('loading state', () => {
    beforeEach(() => {
      mockUseProduct.mockReturnValue({
        product: null,
        relatedProducts: [],
        loading: true,
        error: null,
      });
    });

    it('should show skeleton while loading', () => {
      renderDetail();
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(1);
    });

    it('should NOT show product content while loading', () => {
      renderDetail();
      expect(screen.queryByText('Laptop Gamer Pro')).not.toBeInTheDocument();
    });
  });

  /* ── Error state ── */

  describe('error state', () => {
    beforeEach(() => {
      mockUseProduct.mockReturnValue({
        product: null,
        relatedProducts: [],
        loading: false,
        error: 'Producto no disponible',
      });
    });

    it('should show error heading', () => {
      renderDetail();
      expect(
        screen.getByRole('heading', { name: /error al cargar el producto/i }),
      ).toBeInTheDocument();
    });

    it('should show the error message', () => {
      renderDetail();
      expect(screen.getByText('Producto no disponible')).toBeInTheDocument();
    });

    it('should show a link back to catalog', () => {
      renderDetail();
      const backLink = screen.getByRole('link', { name: /volver al catálogo/i });
      expect(backLink).toHaveAttribute('href', '/catalogo');
    });
  });

  /* ── Not found state ── */

  describe('not found state (product is null, no error)', () => {
    beforeEach(() => {
      mockUseProduct.mockReturnValue({
        product: null,
        relatedProducts: [],
        loading: false,
        error: null,
      });
    });

    it('should show "producto no encontrado" message', () => {
      renderDetail('/producto/999');
      expect(screen.getByRole('heading', { name: /producto no encontrado/i })).toBeInTheDocument();
    });

    it('should show explanation text', () => {
      renderDetail('/producto/999');
      expect(screen.getByText(/no existe o ha sido eliminado/i)).toBeInTheDocument();
    });

    it('should show a link back to catalog', () => {
      renderDetail('/producto/999');
      const backLink = screen.getByRole('link', { name: /volver al catálogo/i });
      expect(backLink).toHaveAttribute('href', '/catalogo');
    });
  });

  /* ── Success state ── */

  describe('success state', () => {
    beforeEach(() => {
      mockUseProduct.mockReturnValue({
        product: mockProduct,
        relatedProducts: mockRelatedProducts,
        loading: false,
        error: null,
      });
    });

    it('should render product name as heading', () => {
      renderDetail();
      expect(screen.getByRole('heading', { name: /laptop gamer pro/i })).toBeInTheDocument();
    });

    it('should render product brand', () => {
      renderDetail();
      expect(screen.getByText(/marca: techbrand/i)).toBeInTheDocument();
    });

    it('should render product price', () => {
      renderDetail();
      expect(screen.getByText(/\$35/i)).toBeInTheDocument();
    });

    it('should render product description', () => {
      renderDetail();
      expect(screen.getByText(/la laptop más potente para gaming/i)).toBeInTheDocument();
    });

    it('should render product specs', () => {
      renderDetail();
      expect(screen.getByText('Intel i9')).toBeInTheDocument();
      expect(screen.getByText('32GB')).toBeInTheDocument();
      expect(screen.getByText('1TB SSD')).toBeInTheDocument();
    });

    it('should render WhatsApp button', () => {
      renderDetail();
      expect(screen.getByRole('link', { name: /consultar por whatsapp/i })).toBeInTheDocument();
    });

    it('should render back link to catalog', () => {
      renderDetail();
      const backLink = screen.getByRole('link', { name: /volver al catálogo/i });
      expect(backLink).toHaveAttribute('href', '/catalogo');
    });

    it('should render product image with alt text', () => {
      renderDetail();
      // Hay 3 imágenes: 1 en ProductGallery + 2 en RelatedProducts
      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', 'Laptop Gamer Pro');
    });

    it('should render related products heading', () => {
      renderDetail();
      expect(screen.getByRole('heading', { name: /productos relacionados/i })).toBeInTheDocument();
    });

    it('should render related product names', () => {
      renderDetail();
      expect(screen.getByText('Laptop Ultrabook')).toBeInTheDocument();
      expect(screen.getByText('Laptop Económica')).toBeInTheDocument();
    });
  });
});
