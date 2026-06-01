/**
 * Search filter hook: client-side text filtering on a product list.
 * Single responsibility: filter products by search query (name, description, brand).
 */
import { useState, useMemo } from 'react';
import type { Product } from '../../../shared/interfaces/product.interface';

export function useSearchFilter(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo<Product[]>(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)),
    );
  }, [products, searchQuery]);

  return { searchQuery, setSearchQuery, filteredProducts } as const;
}
