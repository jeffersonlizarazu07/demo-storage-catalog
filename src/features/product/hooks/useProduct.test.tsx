import { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useProduct } from './useProduct';
import type { Product } from '../../../shared/interfaces/product.interface';

// Mockeamos el servicio de datos
vi.mock('../../../shared/services/productService', () => ({
  fetchProduct: vi.fn(),
  fetchProducts: vi.fn(),
}));

import { fetchProduct, fetchProducts } from '../../../shared/services/productService';

/* ── Mock data ──────────────────────────────────────── */

const laptop: Product = {
  id: 1,
  name: 'Laptop Gamer',
  price: 1500,
  category: 'Electrónica',
  image: 'https://example.com/laptop.jpg',
  description: 'Laptop gaming de alta gama',
  brand: 'ASUS',
};

const mouse: Product = {
  id: 2,
  name: 'Mouse Inalámbrico',
  price: 49.99,
  category: 'Electrónica',
  image: 'https://example.com/mouse.jpg',
  description: 'Mouse ergonómico RGB',
};

const teclado: Product = {
  id: 3,
  name: 'Teclado Mecánico',
  price: 89.99,
  category: 'Accesorios',
  image: 'https://example.com/teclado.jpg',
  description: 'Teclado mecánico RGB',
  brand: 'Logitech',
};

/* ── Test helper ────────────────────────────────────── */

/**
 * Componente puente que expone el estado del hook.
 * Se renderiza dentro de un Route con /producto/:id para que useParams
 * pueda leer el id desde la URL.
 */
function TestHarness({ onState }: { onState: (state: ReturnType<typeof useProduct>) => void }) {
  const state = useProduct();
  useEffect(() => {
    onState(state);
  }, [onState, state]);
  return null;
}

function renderAtRoute(productId: string) {
  const state: { current: ReturnType<typeof useProduct> | null } = { current: null };
  const capture = vi.fn((s: ReturnType<typeof useProduct>) => {
    state.current = s;
  });

  render(
    <MemoryRouter initialEntries={[`/producto/${productId}`]}>
      <Routes>
        <Route path="/producto/:id" element={<TestHarness onState={capture} />} />
      </Routes>
    </MemoryRouter>,
  );

  return state;
}

/* ── Tests ──────────────────────────────────────────── */

describe('useProduct', () => {
  beforeEach(() => {
    vi.mocked(fetchProduct).mockResolvedValue(laptop);
    vi.mocked(fetchProducts).mockResolvedValue([laptop, mouse, teclado]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should start with loading state and no product', () => {
    const state = renderAtRoute('1');

    expect(state.current!.loading).toBe(true);
    expect(state.current!.product).toBeNull();
    expect(state.current!.relatedProducts).toEqual([]);
    expect(state.current!.error).toBeNull();
  });

  it('should load product and related products on mount', async () => {
    const state = renderAtRoute('1');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    expect(fetchProduct).toHaveBeenCalledWith(1);
    expect(fetchProducts).toHaveBeenCalledTimes(1);

    expect(state.current!.product).toEqual(laptop);
    expect(state.current!.error).toBeNull();
  });

  it('should load related products from the same category (max 4)', async () => {
    const state = renderAtRoute('1');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    // laptop is 'Electrónica', mouse is also 'Electrónica' → related
    expect(state.current!.relatedProducts).toHaveLength(1);
    expect(state.current!.relatedProducts[0].id).toBe(2);
  });

  it('should exclude the current product from related list', async () => {
    const state = renderAtRoute('1');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    const relatedIds = state.current!.relatedProducts.map((p) => p.id);
    expect(relatedIds).not.toContain(1);
  });

  it('should handle non-numeric id (NaN)', async () => {
    const state = renderAtRoute('abc');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    expect(state.current!.product).toBeNull();
    expect(state.current!.relatedProducts).toEqual([]);
    expect(state.current!.error).toBeNull();

    // No debió llamar a la API con NaN
    expect(fetchProduct).not.toHaveBeenCalled();
    expect(fetchProducts).not.toHaveBeenCalled();
  });

  it('should handle missing product (null from API)', async () => {
    vi.mocked(fetchProduct).mockResolvedValue(null);

    const state = renderAtRoute('999');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    expect(state.current!.product).toBeNull();
    expect(state.current!.relatedProducts).toEqual([]);
    expect(state.current!.error).toBeNull();
  });

  it('should set error state when fetch fails', async () => {
    vi.mocked(fetchProduct).mockRejectedValue(new Error('Network Error'));

    const state = renderAtRoute('1');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    expect(state.current!.product).toBeNull();
    expect(state.current!.error).toBe('Network Error');
  });

  it('should call fetchProduct with the numeric id from route params', async () => {
    const state = renderAtRoute('42');

    await waitFor(() => {
      expect(state.current!.loading).toBe(false);
    });

    expect(fetchProduct).toHaveBeenCalledWith(42);
  });
});
