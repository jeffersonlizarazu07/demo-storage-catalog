import { useEffect, type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useProductFilters } from './useProductFilters';
import type { Product } from '../../../shared/interfaces/product.interface';

// Mockeamos SOLO el hook de fetching (useProducts).
// useCategoryFilter y useSearchFilter se prueban de forma real
// porque son transformaciones síncronas sin efectos secundarios.
const mockUseProducts = vi.fn();

vi.mock('./useProducts', () => ({
  useProducts: () => mockUseProducts(),
}));

// ---------------------------------------------------------------------------
// TestHarness — componente puente que expone el estado del hook para aserciones
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MOCK_PRODUCTS: Product[] = [
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

/** Estado predecible que mockUseProducts devuelve cuando los datos ya llegaron. */
const LOADED_STATE = {
  loading: false,
  products: MOCK_PRODUCTS,
  categories: ['Todas', 'Electrónica', 'Accesorios'],
  error: null,
} as const;

/** Estado predecible para el momento de carga. */
const LOADING_STATE = {
  loading: true,
  products: [],
  categories: ['Todas'],
  error: null,
} as const;

/** Estado para simular un error en la API. */
function errorState(msg: string) {
  return { loading: false, products: [], categories: ['Todas'], error: msg } as const;
}

describe('useProductFilters', () => {
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
    mockUseProducts.mockReturnValue(LOADED_STATE);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ───────────────────────────────────────────────────────

  it('should start with loading state and no products', () => {
    mockUseProducts.mockReturnValue(LOADING_STATE);
    renderWithRouter();

    expect(lastState!.loading).toBe(true);
    expect(lastState!.filteredProducts).toEqual([]);
    expect(lastState!.error).toBeNull();
  });

  // ── Data loaded ─────────────────────────────────────────────────────────

  it('should expose products, categories and computed fields after load', () => {
    renderWithRouter();

    expect(lastState!.loading).toBe(false);
    expect(lastState!.totalCount).toBe(4);
    expect(lastState!.categories).toEqual(['Todas', 'Electrónica', 'Accesorios']);
    expect(lastState!.filteredProducts).toHaveLength(4);
    expect(lastState!.error).toBeNull();
  });

  // ── Category filter (URL-driven) ────────────────────────────────────────

  it('should filter products by category on mount when URL has categoria param', () => {
    renderWithRouter('?categoria=electronica');

    expect(lastState!.selectedCategory).toBe('Electrónica');
    expect(lastState!.filteredProducts).toHaveLength(2);
    expect(lastState!.filteredProducts.every((p) => p.category === 'Electrónica')).toBe(true);
  });

  it('should show all products when categoria param matches none', () => {
    renderWithRouter('?categoria=inexistente');

    expect(lastState!.selectedCategory).toBe('Todas');
    expect(lastState!.filteredProducts).toHaveLength(4);
  });

  // ── Search filter (text-driven) ─────────────────────────────────────────

  it('should filter products by search query matching name', () => {
    renderWithRouter();

    act(() => {
      lastState!.setSearchQuery('teclado');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should filter products by search query matching description', () => {
    renderWithRouter();

    act(() => {
      lastState!.setSearchQuery('ergonómico');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Mouse Inalámbrico');
  });

  it('should filter products by search query matching brand', () => {
    renderWithRouter();

    act(() => {
      lastState!.setSearchQuery('logitech');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should combine category filter and search query', () => {
    renderWithRouter('?categoria=electronica');

    act(() => {
      lastState!.setSearchQuery('laptop');
    });

    expect(lastState!.filteredProducts).toHaveLength(1);
    expect(lastState!.filteredProducts[0].name).toBe('Laptop Gamer');
  });

  it('should return empty array when no products match the filter', () => {
    renderWithRouter();

    act(() => {
      lastState!.setSearchQuery('xyzproductoimaginario');
    });

    expect(lastState!.filteredProducts).toEqual([]);
  });

  // ── Error state ─────────────────────────────────────────────────────────

  it('should propagate error from useProducts', () => {
    mockUseProducts.mockReturnValue(errorState('Network Error'));
    renderWithRouter();

    expect(lastState!.loading).toBe(false);
    expect(lastState!.error).toBe('Network Error');
    expect(lastState!.filteredProducts).toEqual([]);
  });
});
