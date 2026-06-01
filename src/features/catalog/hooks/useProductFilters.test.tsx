import { useEffect, type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useProductFilters } from './useProductFilters';
import type { Product } from '../../../shared/interfaces/product.interface';

// Mockeamos SOLO los servicios de datos
vi.mock('../../../shared/services/productService', () => ({
  fetchProducts: vi.fn(),
  fetchCategories: vi.fn(),
}));

import { fetchProducts, fetchCategories } from '../../../shared/services/productService';

/**
 * Componente puente que expone el estado del hook para aserciones.
 * MemoryRouter provee el contexto de useSearchParams de forma real.
 */
function TestHarness({
  onState,
  children,
}: {
  onState: (state: ReturnType<typeof useProductFilters>) => void;
  children?: ReactNode;
}) {
  const state = useProductFilters();
  useEffect(() => {
    onState(state);
  }, [onState, state]);
  return <>{children}</>;
}

describe('useProductFilters', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Teclado Mecánico',
      price: 89.99,
      category: 'Accesorios',
      image: '',
      description: 'Teclado RGB',
      brand: 'Logitech',
    },
    {
      id: 2,
      name: 'Laptop Gamer',
      price: 1500,
      category: 'Electrónica',
      image: '',
      description: 'Laptop potente',
      brand: 'ASUS',
    },
    {
      id: 3,
      name: 'Mouse Inalámbrico',
      price: 49.99,
      category: 'Accesorios',
      image: '',
      description: 'Mouse ergonómico',
    },
    {
      id: 4,
      name: 'Audífonos Bluetooth',
      price: 79.99,
      category: 'Electrónica',
      image: '',
      description: 'Cancelación de ruido',
    },
  ] as Product[];

  const mockApiCategories = ['Electrónica', 'Accesorios'];

  // Colector de estado mutable para aserciones
  let lastState: ReturnType<typeof useProductFilters> | null = null;
  const captureState = vi.fn((s: ReturnType<typeof useProductFilters>) => {
    lastState = s;
  });

  function renderWithRouter(initialParams = '') {
    lastState = null;
    captureState.mockClear();

    const entry = initialParams ? `/catalogo${initialParams}` : '/catalogo';

    render(
      <MemoryRouter initialEntries={[entry]}>
        <TestHarness onState={captureState} />
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    vi.mocked(fetchProducts).mockResolvedValue(mockProducts);
    vi.mocked(fetchCategories).mockResolvedValue(mockApiCategories);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should start with loading state and no products', () => {
    renderWithRouter();
    expect(lastState!.loading).toBe(true);
    expect(lastState!.filteredProducts).toEqual([]);
    expect(lastState!.error).toBeNull();
  });

  it('should load products and categories on mount', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    expect(fetchProducts).toHaveBeenCalledTimes(1);
    expect(fetchCategories).toHaveBeenCalledTimes(1);
    expect(lastState!.categories).toEqual(['Todas', 'Electrónica', 'Accesorios']);
    expect(lastState!.filteredProducts).toHaveLength(4);
    expect(lastState!.error).toBeNull();
  });

  it('should filter products by category on mount when URL has categoria param', async () => {
    renderWithRouter('?categoria=electronica');

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    expect(lastState!.selectedCategory).toBe('Electrónica');
    expect(lastState!.filteredProducts).toHaveLength(2);
    expect(lastState!.filteredProducts.every((p) => p.category === 'Electrónica')).toBe(true);
  });

  it('should filter products by search query matching name', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    act(() => {
      lastState!.setSearchQuery('teclado');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should filter products by search query matching description', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    act(() => {
      lastState!.setSearchQuery('ergonómico');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Mouse Inalámbrico');
  });

  it('should filter products by search query matching brand', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    act(() => {
      lastState!.setSearchQuery('logitech');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should combine category filter and search query', async () => {
    renderWithRouter('?categoria=electronica');

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    act(() => {
      lastState!.setSearchQuery('laptop');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Laptop Gamer');
  });

  it('should return empty array when no products match the filter', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    act(() => {
      lastState!.setSearchQuery('xyzproductoimaginario');
    });

    expect(lastState!.filteredProducts).toEqual([]);
  });

  it('should set error state when fetch fails', async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error('Network Error'));

    renderWithRouter();

    await waitFor(() => {
      expect(lastState!.loading).toBe(false);
    });

    expect(lastState!.error).toBe('Network Error');
    expect(lastState!.filteredProducts).toEqual([]);
  });
});
