import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '../interfaces/product.interface';

describe('ProductCard', () => {
  const MOCK_PHONE = '573001234567';

  beforeEach(() => {
    // Seteamos la variable de entorno por defecto para el helper de WhatsApp
    vi.stubEnv('VITE_DEFAULT_PHONE', MOCK_PHONE);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const mockProduct: Product = {
    id: 42,
    name: 'Teclado Mecánico RGB',
    price: 89.99,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    description: 'Teclado mecánico para gaming con switches personalizables y luces RGB.',
  };

  it('should render product image, category, title, and formatted price correctly', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    // 1. Imagen
    const image = screen.getByRole('img', { name: mockProduct.name }) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockProduct.image);

    // 2. Badge de Categoría
    const badge = screen.getByText(mockProduct.category);
    expect(badge).toBeInTheDocument();

    // 3. Títulos / Enlaces de detalle (Explicación abajo)
    // En el DOM accesible, tanto el enlace que envuelve la imagen como el título de texto
    // tienen como "nombre accesible" el nombre del producto. Esto es excelente para la accesibilidad,
    // y en el test asertamos que AMBOS existan y apunten al lugar correcto.
    const detailLinks = screen.getAllByRole('link', { name: mockProduct.name });
    expect(detailLinks).toHaveLength(2);
    detailLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', `/producto/${mockProduct.id}`);
    });

    // 4. Precio con formato
    const price = screen.getByText('$89.99');
    expect(price).toBeInTheDocument();
  });

  it('should fallback to placeholder image if product image is empty or missing', () => {
    const productWithoutImage: Product = {
      ...mockProduct,
      image: '',
    };

    render(
      <MemoryRouter>
        <ProductCard product={productWithoutImage} />
      </MemoryRouter>,
    );

    const image = screen.getByRole('img', { name: productWithoutImage.name }) as HTMLImageElement;
    expect(image).toBeInTheDocument();

    // Verificamos que contenga el host de placeholder
    expect(image.src).toContain('placehold.co');
    expect(image.src).toContain('text=Producto');
  });

  it('should have a working "Ver más" link pointing to product detail page', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    const detailsLink = screen.getByRole('link', { name: /ver más/i });
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink).toHaveAttribute('href', `/producto/${mockProduct.id}`);
  });

  it('should have a working WhatsApp button with specific product query parameters', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>,
    );

    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute('target', '_blank');
    expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Parseamos la URL para verificar semánticamente sus componentes
    const url = new URL(whatsappLink.getAttribute('href') || '');
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe(`/${MOCK_PHONE}`);
    expect(url.searchParams.get('text')).toBe(`Hola, me interesa el producto: ${mockProduct.name}`);
  });
});
