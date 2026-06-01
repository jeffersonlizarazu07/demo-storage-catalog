import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductGrid } from './ProductGrid';
import type { Product } from '../../../shared/interfaces/product.interface';

describe('ProductGrid', () => {
  const MOCK_PHONE = '573001234567';

  beforeEach(() => {
    vi.stubEnv('VITE_DEFAULT_PHONE', MOCK_PHONE);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Teclado Mecánico',
      price: 89.99,
      category: 'Accesorios',
      image: 'https://example.com/teclado.jpg',
      description: 'Un teclado mecánico.',
    },
    {
      id: 2,
      name: 'Mouse Inalámbrico',
      price: 49.99,
      category: 'Accesorios',
      image: 'https://example.com/mouse.jpg',
      description: 'Un mouse inalámbrico.',
    },
  ];

  it('should render "Sin resultados" message with search term when products are empty and searchQuery is set', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={[]} searchQuery="teclado" />
      </MemoryRouter>,
    );

    // Título del empty state
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    // Mensaje que cita el término buscado
    expect(screen.getByText(/no encontramos productos para/i)).toBeInTheDocument();
    expect(screen.getByText(/"teclado"/i)).toBeInTheDocument();
  });

  it('should render "No hay productos" message when products are empty and no search query', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={[]} searchQuery="" />
      </MemoryRouter>,
    );

    expect(screen.getByText('No hay productos')).toBeInTheDocument();
    expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument();
  });

  it('should render a grid of ProductCards when products are provided', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={mockProducts} searchQuery="" />
      </MemoryRouter>,
    );

    // Verificamos que se rendericen todos los productos
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(screen.getByText('Mouse Inalámbrico')).toBeInTheDocument();

    // Verificamos que NO se muestre el mensaje de vacío
    expect(screen.queryByText('Sin resultados')).not.toBeInTheDocument();
    expect(screen.queryByText('No hay productos')).not.toBeInTheDocument();
  });

  it('should render the correct number of product cards', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={mockProducts} searchQuery="" />
      </MemoryRouter>,
    );

    const productCards = screen.getAllByRole('article');
    expect(productCards).toHaveLength(2);
  });

  it('should handle null products gracefully without crashing', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={null as unknown as Product[]} searchQuery="" />
      </MemoryRouter>,
    );

    expect(screen.getByText('No hay productos')).toBeInTheDocument();
  });

  it('should handle undefined products gracefully without crashing', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={undefined as unknown as Product[]} searchQuery="" />
      </MemoryRouter>,
    );

    expect(screen.getByText('No hay productos')).toBeInTheDocument();
  });
});
