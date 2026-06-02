/**
 * Search filter hook: client-side text filtering on a product list.
 * Single responsibility: filter products by search query (name, description, brand).
 *
 * Uses case-insensitive substring matching — every character typed narrows
 * the results. The search is inclusive (partial match) so typing "c" shows
 * any product with "c" in its name, description, or brand.
 *
 * User input is regex-escaped to prevent injection or syntax errors
 * from special characters like ".", "$", or "*".
 */
import { useState, useMemo } from 'react';
import type { Product } from '../../../shared/interfaces/product.interface';

/**
 * Escape special regex characters so user input is treated as literal text.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build a case-insensitive regex for substring matching.
 * Returns `null` when the query is empty — the caller skips filtering.
 */
function buildSearchRegex(query: string): RegExp | null {
  const trimmed = query.trim();
  if (!trimmed) return null;
  return new RegExp(escapeRegex(trimmed), 'i');
}

export function useSearchFilter(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo<Product[]>(() => {
    const regex = buildSearchRegex(searchQuery);
    if (!regex) return products;

    return products.filter(
      (p) => regex.test(p.name) || regex.test(p.description) || (p.brand && regex.test(p.brand)),
    );
  }, [products, searchQuery]);

  return { searchQuery, setSearchQuery, filteredProducts } as const;
}
