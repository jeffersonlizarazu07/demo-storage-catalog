import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchProducts,
  fetchProduct,
  fetchCategories,
  fetchProductsByCategory,
} from './productService';

/* ── Helpers ─────────────────────────────────────────── */

const fakestoreProduct = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  title: 'Fjallraven - Foldsack No. 1 Backpack',
  price: 109.95,
  description: 'Your perfect pack for everyday use.',
  category: "men's clothing",
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: { rate: 3.9, count: 120 },
  ...overrides,
});

/** Crea un mock de Response con el status y body dados. */
function mockResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response;
}

/* ── Tests ───────────────────────────────────────────── */

describe('productService', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse([]));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /* ── fetchProducts ── */

  describe('fetchProducts', () => {
    it('should fetch all products and map them to Product type', async () => {
      const apiProduct = fakestoreProduct();
      vi.mocked(fetch).mockResolvedValue(mockResponse([apiProduct]));

      const products = await fetchProducts();

      expect(products).toHaveLength(1);
      expect(products[0]).toEqual({
        id: 1,
        name: 'Fjallraven - Foldsack No. 1 Backpack',
        price: 109.95,
        category: 'Ropa Hombre',
        image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
        description: 'Your perfect pack for everyday use.',
      });
    });

    it('should map electronics category to Electrónica', async () => {
      vi.mocked(fetch).mockResolvedValue(
        mockResponse([fakestoreProduct({ category: 'electronics' })]),
      );

      const products = await fetchProducts();

      expect(products[0].category).toBe('Electrónica');
    });

    it('should map jewelery category to Joyería', async () => {
      vi.mocked(fetch).mockResolvedValue(
        mockResponse([fakestoreProduct({ category: 'jewelery' })]),
      );

      const products = await fetchProducts();

      expect(products[0].category).toBe('Joyería');
    });

    it('should pass through unknown categories untranslated', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse([fakestoreProduct({ category: 'unknown' })]));

      const products = await fetchProducts();

      expect(products[0].category).toBe('unknown');
    });

    it('should throw when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(null, 500));

      await expect(fetchProducts()).rejects.toThrow('Error al obtener productos (500)');
    });

    it('should call the correct API endpoint', async () => {
      await fetchProducts();

      expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    });
  });

  /* ── fetchProduct ── */

  describe('fetchProduct', () => {
    it('should fetch a single product by id', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(fakestoreProduct()));

      const product = await fetchProduct(1);

      expect(product).not.toBeNull();
      expect(product!.id).toBe(1);
      expect(product!.name).toBe('Fjallraven - Foldsack No. 1 Backpack');
    });

    it('should return null on 404', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(null, 404));

      const product = await fetchProduct(999);

      expect(product).toBeNull();
    });

    it('should throw on server error', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(null, 500));

      await expect(fetchProduct(1)).rejects.toThrow('Error al obtener producto #1 (500)');
    });

    it('should call the correct endpoint', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(fakestoreProduct()));

      await fetchProduct(42);

      expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/42');
    });
  });

  /* ── fetchCategories ── */

  describe('fetchCategories', () => {
    it('should fetch categories and map them to Spanish', async () => {
      const apiCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
      vi.mocked(fetch).mockResolvedValue(mockResponse(apiCategories));

      // Nota: sort() ordena alfabéticamente
      const categories = await fetchCategories();

      expect(categories).toEqual(['Electrónica', 'Joyería', 'Ropa Hombre', 'Ropa Mujer']);
    });

    it('should throw when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(null, 500));

      await expect(fetchCategories()).rejects.toThrow('Error al obtener categorías (500)');
    });

    it('should call the correct endpoint', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse([]));

      await fetchCategories();

      expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/categories');
    });
  });

  /* ── fetchProductsByCategory ── */

  describe('fetchProductsByCategory', () => {
    it('should reverse-map Spanish category and fetch', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse([fakestoreProduct()]));

      const products = await fetchProductsByCategory('Ropa Hombre');

      expect(fetch).toHaveBeenCalledWith(
        "https://fakestoreapi.com/products/category/men's%20clothing",
      );
      expect(products).toHaveLength(1);
    });

    it('should pass through unknown category names', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse([]));

      await fetchProductsByCategory('UnknownCategory');

      expect(fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/category/UnknownCategory',
      );
    });

    it('should throw on error', async () => {
      vi.mocked(fetch).mockResolvedValue(mockResponse(null, 500));

      await expect(fetchProductsByCategory('Electrónica')).rejects.toThrow(
        'Error al filtrar por categoría (500)',
      );
    });
  });
});
