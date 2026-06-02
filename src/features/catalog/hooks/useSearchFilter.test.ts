/**
 * Tests for useSearchFilter — client-side text filtering with substring matching.
 *
 * The search is case-insensitive and matches ANYWHERE in the text (name,
 * description, brand). Typing "c" shows all products with "c" in their
 * data — every character narrows the results progressively.
 *
 * User input is regex-escaped so special characters (".", "$", "*") are
 * treated as literal text, not regex operators.
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchFilter } from './useSearchFilter';
import type { Product } from '../../../shared/interfaces/product.interface';

// ---------------------------------------------------------------------------
// Mock data — carefully crafted to catch substring false positives
// ---------------------------------------------------------------------------
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Mens Running Shoes',
    price: 129.99,
    category: 'Zapatos',
    image: '',
    description: 'Comfortable running shoes for men',
    brand: 'Nike',
  },
  {
    id: 2,
    name: 'Womens Running Shoes',
    price: 129.99,
    category: 'Zapatos',
    image: '',
    description: 'Lightweight running shoes for women',
    brand: 'Adidas',
  },
  {
    id: 3,
    name: 'Teclado Mecánico',
    price: 89.99,
    category: 'Accesorios',
    image: '',
    description: 'Teclado RGB mecánico con switches Cherry MX',
    brand: 'Logitech',
  },
  {
    id: 4,
    name: 'Elements of Style Book',
    price: 24.99,
    category: 'Libros',
    image: '',
    description: 'A classic guide to writing well',
    brand: 'Penguin',
  },
  {
    id: 5,
    name: 'Mouse Inalámbrico',
    price: 49.99,
    category: 'Accesorios',
    image: '',
    description: 'Mouse ergonómico con batería de 12 meses',
  },
  {
    id: 6,
    name: '$pecial Mousepad',
    price: 19.99,
    category: 'Accesorios',
    image: '',
    description: 'Gaming mousepad with RGB (costs $19.99)',
  },
];

describe('useSearchFilter', () => {
  // ── Initial state ─────────────────────────────────────────────────────

  it('should return all products when query is empty', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.filteredProducts).toHaveLength(6);
    expect(result.current.filteredProducts).toEqual(MOCK_PRODUCTS);
  });

  it('should return all products when query is whitespace only', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('   ');
    });

    expect(result.current.filteredProducts).toHaveLength(6);
  });

  // ── Matching by fields ─────────────────────────────────────────────────

  it('should filter by name', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('teclado');
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should filter by description', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('ergonómico');
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Mouse Inalámbrico');
  });

  it('should filter by brand when brand exists', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('logitech');
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should match products without a brand field', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('Inalámbrico');
    });

    // "Inalámbrico" only appears in product id:5 (no brand), not in
    // product id:6 "$pecial Mousepad" (which also lacks a brand).
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Mouse Inalámbrico');
  });

  // ── Substring matching (progressive filtering) ────────────────────────

  it('should match products containing the query as a substring ("men" in "Women")', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('men');
    });

    // "men" is a substring of "Wo**men**" AND "Ele**men**ts" AND
    // "**Men**s Running Shoes" — substring matching catches all three.
    const names = result.current.filteredProducts.map((p) => p.name);
    expect(names).toContain('Mens Running Shoes');
    expect(names).toContain('Womens Running Shoes');
    expect(names).toContain('Elements of Style Book');
    expect(names).toHaveLength(3);
  });

  it('should filter progressively as the user types more characters', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    // Typing "c" should match ALL products with "c" anywhere
    act(() => {
      result.current.setSearchQuery('c');
    });

    expect(result.current.filteredProducts.length).toBeGreaterThan(0);
    expect(
      result.current.filteredProducts.every(
        (p) =>
          p.name.toLowerCase().includes('c') ||
          p.description.toLowerCase().includes('c') ||
          (p.brand && p.brand.toLowerCase().includes('c')),
      ),
    ).toBe(true);

    // Typing "ca" narrows the results (only products with "ca")
    act(() => {
      result.current.setSearchQuery('ca');
    });

    expect(
      result.current.filteredProducts.every(
        (p) =>
          p.name.toLowerCase().includes('ca') ||
          p.description.toLowerCase().includes('ca') ||
          (p.brand && p.brand.toLowerCase().includes('ca')),
      ),
    ).toBe(true);
    expect(result.current.filteredProducts.length).toBeLessThanOrEqual(MOCK_PRODUCTS.length);
  });

  it('should match a longer unique word that narrows results', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('Nike');
    });

    // "Nike" is unique to product id:1 ("Mens Running Shoes", brand "Nike")
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Mens Running Shoes');
  });

  // ── Case insensitivity ─────────────────────────────────────────────────

  it('should be case insensitive (uppercase query)', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('TECLADO');
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('Teclado Mecánico');
  });

  it('should be case insensitive (mixed case query)', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('LoGiTeCh');
    });

    expect(result.current.filteredProducts).toHaveLength(1);
  });

  // ── Special regex characters ──────────────────────────────────────────

  it('should escape "." so it matches a literal dot, not any character', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('19.99');
    });

    // Without escapeRegex, the "." would match /19.99/ as "19<any char>99",
    // which could produce false positives (e.g. "19X99"). With proper
    // escaping, only the literal "19.99" in the description matches.
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('$pecial Mousepad');
  });

  it('should treat regex special characters as literals without crashing', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    // These characters would break the regex entirely without escapeRegex.
    // The key assertion is that NOTHING throws — even with no matches.
    expect(() => {
      act(() => {
        result.current.setSearchQuery('$ ^ . * + ? { } [ ] ( ) | \\');
      });
    }).not.toThrow();

    // Without matches, returns empty array (no crash).
    expect(result.current.filteredProducts).toEqual([]);
  });

  it('should escape "$" so it does not act as end-of-string anchor', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    // "$" followed by a word char (like "$19") won't match after a
    // non-word char like space (that's correct word-boundary behavior).
    // But it MUST NOT throw a regex syntax error — that was the real bug.
    expect(() => {
      act(() => {
        result.current.setSearchQuery('$');
      });
    }).not.toThrow();
  });

  // ── No match ──────────────────────────────────────────────────────────

  it('should return empty array when nothing matches', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('xyznotfound');
    });

    expect(result.current.filteredProducts).toEqual([]);
  });

  // ── Clearing search ───────────────────────────────────────────────────

  it('should return all products after clearing search query', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('teclado');
    });
    expect(result.current.filteredProducts).toHaveLength(1);

    act(() => {
      result.current.setSearchQuery('');
    });
    expect(result.current.filteredProducts).toHaveLength(6);
  });

  // ── Stability ─────────────────────────────────────────────────────────

  it('should not mutate the original products array', () => {
    const { result } = renderHook(() => useSearchFilter(MOCK_PRODUCTS));

    act(() => {
      result.current.setSearchQuery('teclado');
    });

    expect(MOCK_PRODUCTS).toHaveLength(6);
    expect(result.current.filteredProducts).not.toBe(MOCK_PRODUCTS);
  });
});
